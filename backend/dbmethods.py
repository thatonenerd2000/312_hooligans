import psycopg2


class dbmethods:
    def __init__(self):
        # Comment the lines below if not using docker eg dev environment
        self.connection = psycopg2.connect(
            database="cse312_project", user="root", password="", host="localhost", port="5432")

        # Comment the line below if using docker eg prod environment
        # self.connection = psycopg2.connect(
        #     database="cse312_project", user="root", password="password", host="postgres", port="5432")

        self.cur = self.connection.cursor()

    def create_user(self, name, email, username, hashedPass):
        self.cur.execute(
            '''CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), username VARCHAR(255), password VARCHAR(255))''')
        self.cur.execute(
            "INSERT INTO users (name, email, username, password) VALUES (%s, %s, %s, %s)", (name, email, username, hashedPass))
        self.connection.commit()

    def verifyLogin(self, username):
        self.cur.execute(
            '''SELECT * FROM users WHERE username = %s''', (username,))
        user = self.cur.fetchall()
        return user

    def add_listing(self, name, username, item_name, item_type, description, price, location, image, soldStatus):
        self.cur.execute(
            '''CREATE TABLE IF NOT EXISTS listings (id SERIAL PRIMARY KEY, username VARCHAR(255), name VARCHAR(255), item_name VARCHAR(255), item_type VARCHAR(255), description VARCHAR(255), price VARCHAR(255), location VARCHAR(255), image VARCHAR, soldStatus VARCHAR(255))''')
        self.cur.execute(
            "INSERT INTO listings (username, name, item_name, item_type, description, price, location, image, soldStatus) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", (username, name, item_name, item_type, description, price, location, image, soldStatus))
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

    # Call this method every time you call any db methods
    def closeConnection(self):
        self.connection.close()
