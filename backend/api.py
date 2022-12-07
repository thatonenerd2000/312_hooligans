from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import helpers
import bcrypt
from dbmethods import dbmethods
import helpers


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
    db.create_user(name, email, username, hashedPassword.decode())
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
    db.add_listing(username, name, item_name, item_type,
                   description, price, location, image, "NULL", "NULL")
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


@app.post("/checkoutCart/{username}")
def checkoutCart(username: str):
    db = dbmethods()
    cart = db.checkout_entire_cart(username)
    db.closeConnection()


@app.post("/buyOne/{username}")
def buyOne(checkoutInformation):
    username = checkoutInformation['buyerUsername']
    itemId = checkoutInformation['itemId']
    db = dbmethods()
    db.checkout_single_item(username, itemId)
    db.closeConnection()


@app.post("/removeOne/{username}")
def removeOne(checkoutInformation):
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
