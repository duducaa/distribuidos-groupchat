import sqlite3

db_path = "./db/database.sqlite"

with sqlite3.connect(db_path) as conn:
    cursor = conn.cursor()

    with open("./db/DDL.sql", "r") as f:
        sql = f.read()

    cursor.executescript(sql)

    conn.commit()