from xmlrpc.server import SimpleXMLRPCServer, SimpleXMLRPCRequestHandler
from socketserver import ThreadingMixIn
from datetime import datetime

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

def execute_sql(sql, args, command):
    db_path = "./db/database.sqlite"

    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()

        cursor.execute(sql, args)
        data = cursor.fetchall()

        if command in ["insert", "delete"]:
            conn.commit()
            return cursor.lastrowid
        
        return data

class Server:
    def register(self, username):
        data = execute_sql(f"SELECT id, username FROM USERS WHERE username = ?;", (username,), "select")
        new = len(data) == 0
        if new:
            id = execute_sql(f"INSERT INTO USERS (username) VALUES (?);", (username,), "insert")
        else:
            id, username = data[0]
        return {"username": username, "id": id}

    def sendMessage(self, text, user_id):
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return execute_sql(f"""
        INSERT INTO MESSAGES (date_time, content, user_id) VALUES (?, ?, ?);""",
        (now, text, user_id,), "insert")

    def update(self):
        data = execute_sql(f"SELECT * FROM MESSAGES", (), "select")
        print(data)
        return data

server = ThreadedServer(("localhost", 8000), requestHandler=CORSRequestHandler)
server.register_instance(Server())
print("Server is running...")
server.serve_forever()