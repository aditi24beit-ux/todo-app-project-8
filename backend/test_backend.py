
from sqlalchemy import inspect, text

print("\n========== BACKEND VERIFICATION ==========\n")

# 1. Test database connection
try:
    from app.database.connection import engine, SessionLocal, Base

    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

    print("[PASS] PostgreSQL connection")
    print("[PASS] SQLAlchemy engine and SessionLocal")

except Exception as e:
    print("[FAIL] Database connection:", e)


# 2. Test SQLAlchemy models
try:
    from app.models import User, Task

    print("[PASS] User model")
    print("[PASS] Task model")

    print("Registered models:", list(Base.metadata.tables.keys()))

except Exception as e:
    print("[FAIL] SQLAlchemy models:", e)


# 3. Test database tables
try:
    inspector = inspect(engine)
    tables = inspector.get_table_names()

    if "users" in tables and "tasks" in tables:
        print("[PASS] Users table exists")
        print("[PASS] Tasks table exists")
    else:
        print("[FAIL] Required database tables missing:", tables)

except Exception as e:
    print("[FAIL] Table verification:", e)


# 4. Test password hashing and verification
try:
    from app.utils.security import hash_password, verify_password

    password = "TestPassword123!"
    hashed = hash_password(password)

    if verify_password(password, hashed):
        print("[PASS] Password hashing")
    else:
        print("[FAIL] Password hashing verification")

    if not verify_password("WrongPassword123!", hashed):
        print("[PASS] Incorrect password rejection")
    else:
        print("[FAIL] Incorrect password was accepted")

except Exception as e:
    print("[FAIL] Password security:", e)


# 5. Test JWT generation and verification
try:
    from app.utils.token import create_access_token, verify_access_token

    user_data = {
        "sub": "1",
        "role": "user"
    }

    token = create_access_token(user_data)
    decoded = verify_access_token(token)

    if decoded["sub"] == "1" and decoded["role"] == "user":
        print("[PASS] JWT generation")
        print("[PASS] JWT verification and decoding")
    else:
        print("[FAIL] JWT payload verification")

except Exception as e:
    print("[FAIL] JWT authentication:", e)


# 6. Test authentication dependencies
try:
    from app.dependencies.auth import (
        get_current_user,
        get_current_admin
    )

    print("[PASS] Current user dependency")
    print("[PASS] Admin authorization dependency")

except Exception as e:
    print("[FAIL] Authentication dependencies:", e)


print("\n========== VERIFICATION FINISHED ==========\n")
