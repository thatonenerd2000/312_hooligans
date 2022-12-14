from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Cookie, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import bcrypt
from dbmethods import dbmethods
import helpers
import json
import hashlib
from typing import Union
import datetime


origins = ["*"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

global authToken
authToken = ""


@app.post("/createUser")
@app.middleware("http")
def createUser(userInformation: dict):
    name = userInformation["name"]
    email = userInformation["email"]
    plainTextPassword = userInformation["password"]
    username = email[:email.index("@")]
    # Hash the password
    salt = bcrypt.gensalt()
    utf = plainTextPassword.encode('utf-8')
    hashedPassword = bcrypt.hashpw(utf, salt)
    authToken = helpers.generate_token()
    db = dbmethods()
    db.create_user(helpers.escape_sql(name), helpers.escape_sql(email), helpers.escape_sql(username), helpers.escape_sql(hashedPassword.decode()),
                   hashlib.sha256(authToken.encode("utf-8")).hexdigest())
    db.closeConnection()
    content = {"message": "User created successfully"}
    response = JSONResponse(content=content)
    response.set_cookie(key="authToken", value=authToken,
                        httponly=True, max_age=3600)
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response


@app.post("/verifyUser")
@app.middleware("http")
def verifyUser(userInformation: dict):
    email = userInformation['email']
    plainTextPassword = userInformation['password']
    db = dbmethods()
    user = db.verifyLogin(helpers.escape_sql(email))
    hashedPassword = user[0][4]
    check = bcrypt.checkpw(plainTextPassword.encode(
        'utf-8'), hashedPassword.encode('utf-8'))
    if check:
        authToken = helpers.generate_token()
        db.update_authToken(helpers.escape_sql(user[0][3]), hashlib.sha256(
            authToken.encode("utf-8")).hexdigest())
        db.closeConnection()
        content = {"message": "User verified successfully",
                   "name": user[0][1], "username": user[0][3], "email": user[0][2]}
        response = JSONResponse(content=content)
        response.set_cookie(key="authToken", value=authToken,
                            httponly=True, max_age=3600)
        response.headers["Access-Control-Allow-Origin"] = "*"
        db.closeConnection()
        return response
    else:
        db.closeConnection()
        return {"message": "User verification failed"}


@app.get("/verifyAuth")
@app.middleware("http")
async def verifyAuth(authToken: Union[str, None] = Cookie(default=None)):
    if authToken != None:
        db = dbmethods()
        user = db.verifyAuth(hashlib.sha256(
            authToken.encode("utf-8")).hexdigest())
        db.closeConnection()
        # Create a response
        if len(user) == 1:
            return {"message": "User verified successfully", "name": user[0][1], "username": user[0][3], "email": user[0][2]}
        else:
            return {"message": "User verification failed"}
    else:
        return {"message": "User verification failed"}


@app.get("/getListings/{username}")
def getListings(username: str):
    db = dbmethods()
    listings = db.get_listings(helpers.escape_sql(username))
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
    db.add_listing(helpers.escape_sql(name), helpers.escape_sql(username), helpers.escape_sql(item_name), helpers.escape_sql(item_type),
                   helpers.escape_sql(description), helpers.escape_sql(price), helpers.escape_sql(location), image, "false", "NULL")
    db.closeConnection()
    return {"message": "Listing added successfully"}


@app.post("/addToCart")
def addToCart(cartInformation: dict):
    buyer = cartInformation["buyerUsername"]
    itemId = cartInformation["itemId"]
    db = dbmethods()
    db.add_to_cart(helpers.escape_sql(buyer), itemId)
    db.closeConnection()
    return {"message": buyer + " bought a thing!"}


@app.get("/getCart/{username}")
def getUserCart(username: str):
    db = dbmethods()
    cart = db.get_user_cart(helpers.escape_sql(username))
    db.closeConnection()
    return cart


@app.post("/checkoutCart")
def checkoutCart(username: dict):
    username = username["username"]
    db = dbmethods()
    cart = db.checkout_entire_cart(username)
    db.closeConnection()


@app.get("/getListingsBought/{username}")
def getListingsBought(username: str):
    db = dbmethods()
    listings = db.get_listings_bought(username)
    db.closeConnection()
    return listings


@app.post("/buyNow")
def buyNow(checkoutInformation: dict):
    username = checkoutInformation['buyerUsername']
    itemId = checkoutInformation['itemId']
    db = dbmethods()
    db.checkout_single_item(helpers.escape_sql(username), itemId)
    db.closeConnection()


@app.post("/removeOne")
def removeOne(checkoutInformation: dict):
    username = checkoutInformation['buyerUsername']
    itemId = checkoutInformation['itemId']
    db = dbmethods()
    db.remove_item_from_cart(helpers.escape_sql(username), itemId)
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
    auctionEndTime = startTime + datetime.timedelta(minutes=120)
    db = dbmethods()
    db.addAuction(itemId, highestBid, helpers.escape_sql(
        highestBidder), auctionEndTime)
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


@app.get("/getAuctionItem/{itemId}")
def getAuctionItem(itemId: str):
    db = dbmethods()
    item = db.getAuctionInfo(itemId)
    db.closeConnection()
    return item


@app.post("/updateAuction/{itemId}")
def updateAuction(itemId: str, auctionInformation: dict):
    db = dbmethods()
    itemPrevState = db.getAuctionInfo(itemId)
    previousHighestBid = itemPrevState[2]
    newHighestBid = auctionInformation["currentBid"]
    newHighestBidder = auctionInformation["currentBidder"]
    if newHighestBid > previousHighestBid:
        db.updateAuction(itemId, helpers.escape_sql(
            newHighestBid), helpers.escape_sql(newHighestBidder))
    db.closeConnection()


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
