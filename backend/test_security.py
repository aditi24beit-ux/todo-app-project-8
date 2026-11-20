
from app.utils.security import hash_password, verify_password

# Original password
password = "mypassword123"

# Generate password hash
hashed_password = hash_password(password)

print("Original Password:", password)
print("Hashed Password:", hashed_password)

# Verify correct password
print("Correct Password:", verify_password(password, hashed_password))

# Verify incorrect password
print("Wrong Password:", verify_password("wrongpassword", hashed_password))
