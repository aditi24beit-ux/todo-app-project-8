
from app.utils.token import create_access_token, verify_access_token

# Sample user information
user_data = {
    "sub": "1",
    "role": "user"
}

# Generate JWT token
token = create_access_token(user_data)

print("Generated JWT Token:")
print(token)

# Verify JWT token
decoded_data = verify_access_token(token)

print("\nDecoded Token Data:")
print(decoded_data)

# Check user information
print("\nUser ID:", decoded_data["sub"])
print("User Role:", decoded_data["role"])
