from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import helpers
import bcrypt
from dbmethods import dbmethods
import helpers
import json
import datetime


origins = [
    # NEED TO MODIFY THIS **SECURITY ISSUE**
    "*"
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    # NEED TO MODIFY THIS **SECURITY ISSUE**
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.post("/createUser")
def createUser(userInformation: dict):
    name = userInformation["name"]
    email = userInformation["email"]
    plainTextPassword = userInformation["password"]
    username = email[:email.index("@")]
    # Hash the password
    salt = bcrypt.gensalt()
    utf = plainTextPassword.encode('utf-8')
    hashedPassword = bcrypt.hashpw(utf, salt)

    db = dbmethods()
    db.create_user(name, email, username, hashedPassword.decode(), "NULL")
    db.closeConnection()
    return {"message": "User created successfully"}


@app.post("/verifyUser")
def verifyUser(userInformation: dict):
    email = userInformation['email']
    plainTextPassword = userInformation['password']
    db = dbmethods()
    user = db.verifyLogin(email)
    hashedPassword = user[0][4]
    db.closeConnection()
    check = bcrypt.checkpw(plainTextPassword.encode(
        'utf-8'), hashedPassword.encode('utf-8'))
    if check:
        return {"message": "User verified successfully", "name": user[0][1], "username": user[0][3], "email": user[0][2]}
    else:
        return {"message": "User verification failed"}


@app.get("/getListings/{username}")
def getListings(username: str):
    db = dbmethods()
    listings = db.get_listings(username)
    db.closeConnection()
    return listings


@app.get("/getAllListings")
def getAllListings():
    db = dbmethods()
    listings = db.get_all_listings()
    db.closeConnection()
    sortedListings = {}
    for i in listings:
        if i[4] in sortedListings:
            temp = sortedListings[i[4]]
            temp += [i]
            sortedListings[i[4]] = temp
        else:
            sortedListings[i[4]] = [i]
    return listings


@app.post("/addListing")
def addListing(listingInformation: dict):
    name = listingInformation["name"]
    username = listingInformation["username"]
    item_name = listingInformation["itemName"]
    item_type = listingInformation["itemType"]
    description = listingInformation["description"]
    price = listingInformation["price"]
    location = listingInformation["location"]
    image = listingInformation["image"]
    db = dbmethods()
    db.add_listing(name, username, item_name, item_type,
                   description, price, location, image, "false", "NULL")
    db.closeConnection()
    return {"message": "Listing added successfully"}


@app.post("/addToCart")
def addToCart(cartInformation: dict):
    buyer = cartInformation["buyerUsername"]
    itemId = cartInformation["itemId"]
    db = dbmethods()
    db.add_to_cart(buyer, itemId)
    db.closeConnection()
    return {"message": buyer + " bought a thing!"}


@app.get("/getCart/{username}")
def getUserCart(username: str):
    db = dbmethods()
    cart = db.get_user_cart(username)
    db.closeConnection()
    return cart


@app.post("/checkoutCart")
def checkoutCart(username: dict):
    username = username["username"]
    db = dbmethods()
    cart = db.checkout_entire_cart(username)
    db.closeConnection()


@app.post("/buyNow")
def buyNow(checkoutInformation: dict):
    username = checkoutInformation['buyerUsername']
    itemId = checkoutInformation['itemId']
    db = dbmethods()
    db.checkout_singlex_item(username, itemId)
    db.closeConnection()


@app.post("/removeOne")
def removeOne(checkoutInformation: dict):
    username = checkoutInformation['buyerUsername']
    itemId = checkoutInformation['itemId']
    db = dbmethods()
    db.remove_item_from_cart(username, itemId)
    db.closeConnection()


@app.get("/getListing/{itemId}")
def getListing(itemId: str):
    if itemId != "undefined":
        db = dbmethods()
        item = db.get_item_from_id(itemId)
        db.closeConnection()
        return item


@app.post("/createAuction/{itemId}")
def createAuction(itemId: str, auctionInformation: dict):
    itemId = itemId
    highestBid = auctionInformation["highestBid"]
    highestBidder = auctionInformation["highestBidder"]
    startTime = datetime.datetime.now()
    auctionEndTime = startTime + datetime.timedelta(hours=2)
    db = dbmethods()
    db.addAuction(itemId, highestBid, highestBidder, auctionEndTime)
    db.closeConnection()


@app.post("/getAuctionItem/{itemId}")
def getAuctionItem(itemId: str):
    db = dbmethods()
    item = db.get_item_from_id(itemId)
    auction = db.getAuction()
    expiryTime = ''
    for every in auction:
        if every[1] == itemId:
            expiryTime = every[4]
    db.closeConnection()
    return {"item": item, "expiryTime": expiryTime}


@app.get("/getAuction")
def getAuction():
    db = dbmethods()
    auction = db.getAuction()
    items = []
    for every in auction:
        itemId = every[1]
        items += [db.get_item_from_id(itemId)]
    db.closeConnection()
    return items


@app.post("/takeOffAuction/{itemId}")
def endAuction(itemId: str, auctionInformation: dict):
    db = dbmethods()
    db.endAuction(itemId)
    db.closeConnection()


# Websockets
# From Fastapi documentation
# https://fastapi.tiangolo.com/zh/advanced/websockets/


class ConnectionManager:
    def __init__(self):
        self.active_connections = {}

    async def connect(self, websocket: WebSocket, auctionPage: str):
        await websocket.accept()
        if auctionPage in self.active_connections:
            self.active_connections[auctionPage] += [websocket]
        else:
            self.active_connections[auctionPage] = [websocket]

    def disconnect(self, websocket: WebSocket):
        for auctionPage in self.active_connections:
            if websocket in self.active_connections[auctionPage]:
                self.active_connections[auctionPage].remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str, auctionPage: str):
        # for connection in self.active_connections:
        #     await connection.send_json(message)
        for connection in self.active_connections[auctionPage]:
            await connection.send_json(message)


manager = ConnectionManager()


@app.websocket("/ws/auction/{auctionID}")
async def websocket_endpoint(websocket: WebSocket, auctionID: str):
    await manager.connect(websocket, auctionID)
    try:
        while True:
            data = await websocket.receive_text()
            data = json.loads(data)
            await manager.broadcast(data, auctionID)

    except WebSocketDisconnect:
        manager.disconnect(websocket)


# async def websocket_endpoint(websocket: WebSocket):
#     await manager.connect(websocket)
#     try:
#         while True:
#             data = await websocket.receive_text()
#             data = json.loads(data)
#             await manager.broadcast(data)
#     except WebSocketDisconnect:
#         manager.disconnect(websocket)
