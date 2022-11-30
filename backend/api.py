from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import bcrypt
from dbmethods import dbmethods


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

    # Hash the password
    salt = bcrypt.gensalt()
    utf = plainTextPassword.encode('utf-8')
    hashedPassword = bcrypt.hashpw(utf, salt)

    db = dbmethods()
    db.create_user(name, email, hashedPassword.decode())
    db.closeConnection()
    return {"message": "User created successfully"}


@app.post("/verifyUser")
def verifyUser(userInformation: dict):
    email = userInformation['email']
    plainTextPassword = userInformation['password']

    db = dbmethods()
    user = db.verifyLogin(email)
    hashedPassword = user[0][3]
    db.closeConnection()

    check = bcrypt.checkpw(plainTextPassword.encode(
        'utf-8'), hashedPassword.encode('utf-8'))
    if check:
        return {"message": "User verified successfully", "name": user[0][1], "email": user[0][2]}
    else:
        return {"message": "User verification failed"}
