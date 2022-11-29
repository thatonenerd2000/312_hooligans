import psycopg2

#TODO
#Adds quantity of item to the shopping cart
def update_cart(cursor, item, quantity, username):
    cursor.execute("""
    INSERT INTO cart(Username, Item, Quantity)
    VALUES(%s, %s, %i)
    """, (username, item, quantity))

    cursor.execute("""
    SELECT Item, Quantity FROM cart WHERE Username = %s
    """, (username))
    updated_cart = cursor.fetchall()

#TODO
#Removes quantity of item from the shopping cart
def remove_from_cart(cursor, item, quantity, sort):
    pass

#TODO
#Purchases all items in the shopping cart
def checkout(cursor):
    pass

#TODO
#Loads a users cart from the database
def load_cart(cursor, username):
    pass

#TODO
#Saves a users cart to the database
def save_cart(cursor, username):
    pass


#TODO
#update foreign key relationships once other tables are done
def create_cart_table(cursor):
    cursor.execute("""CREATE TABLE cart (
        Username varchar(255),
        Item varchar(255),
        Quantity int CONSTRAINT quantity_greater_than_one CHECK (Quantity > 0),
        PRIMARY KEY (Username),
        FOREIGN KEY (Username) REFERENCES Users(Username)
        );
        """)