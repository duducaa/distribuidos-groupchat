from xmlrpc.server import SimpleXMLRPCServer, SimpleXMLRPCRequestHandler
from socketserver import ThreadingMixIn
import sqlite3

class CORSRequestHandler(SimpleXMLRPCRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*') 
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

class ThreadedServer(SimpleXMLRPCServer, ThreadingMixIn):
    pass

def execute_sql(sql, command):
    db_path = "./db/database.sqlite"

    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()

        with open("./db/DDL.sql", "r") as f:
            sql = f.read()

        cursor.executescript(sql)
        data = cursor.fetchall()

        if command in ["insert", "delete"]:
            conn.commit()
            return data
        
        return None

class Server:
    def register(self, username):
        usernames = execute_sql("SELECT username FROM USERS;")
        print(usernames)
        new = True
        if username in usernames:
            new = False
        return {"username": username, "new": new}

    def sendMessage(self, text):
        return {
            "user": "usuario",
            "message": text
        }

server = ThreadedServer(("localhost", 8000), requestHandler=CORSRequestHandler)
server.register_instance(Server())
print("Server is running...")
server.serve_forever()