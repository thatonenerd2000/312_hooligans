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

    def create_user(self, name, email, hashedPass):
        self.cur.execute(
            '''CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255))''')
        self.cur.execute(
            "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)", (name, email, hashedPass))
        self.connection.commit()

    def verifyLogin(self, email):
        self.cur.execute(
            '''SELECT * FROM users WHERE email = %s''', (email,))
        user = self.cur.fetchall()
        return user

    # Call this method every time you call any db methods
    def closeConnection(self):
        self.connection.close()
