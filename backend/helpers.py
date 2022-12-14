import random
import string
def escape_sql(sql_string):
    sql_string = sql_string.replace("'", "''")
    sql_string = sql_string.replace(";", " ")
    sql_string = sql_string.replace("-", "_")
    sql_string = sql_string.replace("\\", "/")
    return sql_string

def escape_html(text):
    text = text.replace('&', '&amp;')
    text = text.replace('<', '&lt;')
    text = text.replace('>', '&gt;')
    text = text.replace('"', '&quot;')
    text = text.replace("'", '&#39;')
    return text

def generate_token():
    token = ''.join(random.choices(string.ascii_letters + string.digits, k=200))
    return token