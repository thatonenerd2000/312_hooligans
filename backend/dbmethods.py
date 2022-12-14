import psycopg2


class dbmethods:
    def __init__(self):
        # Comment the lines below if not using docker eg dev environment
        # self.connection = psycopg2.connect(
        #     database="cse312_project", user="root", password="", host="localhost", port="5432")

        # Comment the line below if using docker eg prod environment
        self.connection = psycopg2.connect(
            database="cse312_project", user="root", password="password", host="postgres", port="5432")

        self.cur = self.connection.cursor()

    def create_user(self, name, email, username, hashedPass, authToken):
        self.cur.execute(
            '''CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), username VARCHAR(255), password VARCHAR(255), authToken VARCHAR(255))''')
        self.cur.execute(
            "INSERT INTO users (name, email, username, password, authToken) VALUES (%s, %s, %s, %s, %s)", (name, email, username, hashedPass, authToken))
        self.connection.commit()

    def verifyLogin(self, username):
        self.cur.execute(
            '''SELECT * FROM users WHERE username = %s''', (username,))
        user = self.cur.fetchall()
        return user

    def verifyAuth(self, authToken):
        self.cur.execute(
            '''SELECT * FROM users WHERE authToken = %s''', (authToken,))
        user = self.cur.fetchall()
        return user

    def update_authToken(self, username, authToken):
        self.cur.execute(
            '''UPDATE users SET authToken = %s WHERE username = %s''', (authToken, username,))
        self.connection.commit()

    def add_listing(self, name, username, item_name, item_type, description, price, location, image, soldStatus, soldTo):
        self.cur.execute(
            '''CREATE TABLE IF NOT EXISTS listings (id SERIAL PRIMARY KEY, name VARCHAR(255), username VARCHAR(255), item_name VARCHAR(255), item_type VARCHAR(255), description VARCHAR(255), price VARCHAR(255), location VARCHAR(255), image VARCHAR, soldStatus VARCHAR(255), soldTo VARCHAR(255))''')
        self.cur.execute(
            "INSERT INTO listings (name, username, item_name, item_type, description, price, location, image, soldStatus, soldTo) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (name, username, item_name, item_type, description, price, location, image, soldStatus, soldTo))
        self.connection.commit()

    def get_listings(self, username):
        self.cur.execute(
            '''CREATE TABLE IF NOT EXISTS listings (id SERIAL PRIMARY KEY, username VARCHAR(255), name VARCHAR(255), item_name VARCHAR(255), item_type VARCHAR(255), description VARCHAR(255), price VARCHAR(255), location VARCHAR(255), image VARCHAR, soldStatus VARCHAR(255))''')
        self.cur.execute(
            '''SELECT * FROM listings WHERE username = %s''', (username,))
        listings = self.cur.fetchall()
        return listings

    def get_all_listings(self):
        self.cur.execute(
            '''CREATE TABLE IF NOT EXISTS listings (id SERIAL PRIMARY KEY, username VARCHAR(255), name VARCHAR(255), item_name VARCHAR(255), item_type VARCHAR(255), description VARCHAR(255), price VARCHAR(255), location VARCHAR(255), image VARCHAR, soldStatus VARCHAR(255))''')
        self.cur.execute(
            '''SELECT * FROM listings''')
        listings = self.cur.fetchall()
        return listings

    def add_to_cart(self, buyer, itemId):
        self.cur.execute(
            '''CREATE TABLE IF NOT EXISTS cart (id SERIAL PRIMARY KEY, username VARCHAR(255), item VARCHAR(255), bought VARCHAR(255))''')
        self.cur.execute(
            """SELECT * FROM cart WHERE username = %s and item = '%s'""", (
                buyer, itemId)
        )
        item = self.cur.fetchall()
        if len(item) == 0:
            self.cur.execute(
                "INSERT INTO cart (username, item, bought) VALUES (%s, %s, %s)", (buyer, itemId, False))
        self.connection.commit()

    def get_user_cart(self, username):
        self.cur.execute(
            '''CREATE TABLE IF NOT EXISTS cart (id SERIAL PRIMARY KEY, username VARCHAR(255), item VARCHAR(255), bought VARCHAR(255))''')
        self.cur.execute(
            '''SELECT * FROM cart WHERE username = %s''', (username,)
        )
        my_cart = self.cur.fetchall()
        return my_cart

    def checkout_entire_cart(self, username):
        self.cur.execute(
            '''CREATE TABLE IF NOT EXISTS cart (id SERIAL PRIMARY KEY, username VARCHAR(255), item VARCHAR(255), bought VARCHAR(255))''')
        self.cur.execute(
            """SELECT * FROM cart WHERE username = %s AND bought != 'True'""", (
                username,)
        )
        my_cart = self.cur.fetchall()
        # there's probably a better sql-er version of this
        for i in my_cart:
            self.cur.execute(
                """UPDATE listings SET soldStatus = True WHERE id = %s""", (
                    i[2],)
            )
            self.cur.execute(
                """UPDATE cart SET bought = True WHERE username = %s""", (
                    i[1],)
            )
            self.cur.execute(
                """UPDATE listings SET soldTo = %s WHERE id = %s""", (
                    i[1], i[2]
                )
            )
            self.cur.execute(
                """DELETE FROM cart WHERE item = %s""", (
                    i[2])
            )
        self.connection.commit()

    def checkout_single_item(self, username, item):
        item = str(item)
        self.cur.execute(
            '''CREATE TABLE IF NOT EXISTS cart (id SERIAL PRIMARY KEY, username VARCHAR(255), item VARCHAR(255), bought VARCHAR(255))''')
        self.cur.execute(
            """SELECT * FROM cart WHERE username = %s AND item = %s""", (
                username, item)
        )
        items = self.cur.fetchall()
        if len(items) == 0:
            self.cur.execute(
                """INSERT INTO cart (username, item, bought) VALUES (%s,%s,%s)""", (
                    username, item, False)
            )
        self.cur.execute(
            """UPDATE listings SET soldStatus = True WHERE id = %s""", (item))
        self.cur.execute(
            """UPDATE cart SET bought = True WHERE username = '%s' AND item = '%s'""" % (username, item))
        self.cur.execute(
            """UPDATE listings SET soldTo = %s WHERE id = %s""", (
                username, item)
        )
        self.cur.execute(
            """DELETE FROM cart WHERE item = %s AND username != %s""", (item, username))
        self.connection.commit()

    def remove_item_from_cart(self, username, item):
        self.cur.execute(
            '''CREATE TABLE IF NOT EXISTS cart (id SERIAL PRIMARY KEY, username VARCHAR(255), item VARCHAR(255), bought VARCHAR(255))''')
        self.cur.execute(
            """DELETE FROM cart WHERE item = '%s' AND username = %s""", (item, username))
        self.connection.commit()

    def get_item_from_id(self, item):
        self.cur.execute("""SELECT * FROM listings WHERE id = %s""", (item))
        the_item = self.cur.fetchone()
        return the_item

    def addAuction(self, itemID, highestBid, highestBidder, auctionEnd):
        self.cur.execute(
            '''CREATE TABLE IF NOT EXISTS auctions (id SERIAL PRIMARY KEY, itemID VARCHAR(255), highestBid VARCHAR(255), highestBidder VARCHAR(255), auctionEnd VARCHAR(255))''')
        self.cur.execute(
            """INSERT INTO auctions (itemID, highestBid, highestBidder, auctionEnd) VALUES (%s, %s, %s, %s)""", (
                itemID, highestBid, highestBidder, auctionEnd))
        self.connection.commit()

    def get_listings_bought(self, username):
        self.cur.execute(
            '''SELECT * FROM listings WHERE soldto = %s''', (username,))
        listings = self.cur.fetchall()
        return listings

    def getAuction(self):
        self.cur.execute(
            '''CREATE TABLE IF NOT EXISTS auctions (id SERIAL PRIMARY KEY, itemID VARCHAR(255), highestBid VARCHAR(255), highestBidder VARCHAR(255), auctionEnd VARCHAR(255))''')
        self.cur.execute(
            '''SELECT * FROM auctions''')
        auctions = self.cur.fetchall()
        return auctions

    def getAuctionInfo(self, itemID):
        self.cur.execute(
            '''CREATE TABLE IF NOT EXISTS auctions (id SERIAL PRIMARY KEY, itemID VARCHAR(255), highestBid VARCHAR(255), highestBidder VARCHAR(255), auctionEnd VARCHAR(255))''')
        self.cur.execute(
            '''SELECT * FROM auctions WHERE itemID = %s''', (itemID))
        auction = self.cur.fetchone()
        return auction

    def updateAuction(self, itemID, highestBid, highestBidder):
        self.cur.execute(
            '''CREATE TABLE IF NOT EXISTS auctions (id SERIAL PRIMARY KEY, itemID VARCHAR(255), highestBid VARCHAR(255), highestBidder VARCHAR(255), auctionEnd VARCHAR(255))''')
        self.cur.execute(
            """UPDATE auctions SET highestBid = %s, highestBidder = %s WHERE itemID = %s""", (
                highestBid, highestBidder, itemID))
        self.connection.commit()

    def endAuction(self, itemID):
        self.cur.execute(
            '''CREATE TABLE IF NOT EXISTS auctions (id SERIAL PRIMARY KEY, itemID VARCHAR(255), highestBid VARCHAR(255), highestBidder VARCHAR(255), auctionEnd VARCHAR(255))''')
        self.cur.execute(
            """DELETE FROM auctions WHERE itemID = %s""", (itemID))
        self.connection.commit()

    # Call this method every time you call any db methods

    def closeConnection(self):
        self.connection.close()
