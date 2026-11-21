
from sqlalchemy import inspect
from app.database.connection import engine

try:
    inspector = inspect(engine)

    tables = inspector.get_table_names()

    print("Tables found in PostgreSQL:")

    for table in tables:
        print("-", table)

    if "users" in tables and "tasks" in tables:
        print("\nBoth tables verified successfully!")
    else:
        print("\nRequired tables are missing!")

except Exception as e:
    print("Error:", e)
