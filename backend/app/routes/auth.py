from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserLogin, TokenResponse
from app.utils.security import hash_password, verify_password
from app.utils.token import create_access_token
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/")
def auth_home():
    return{"Message" : "Authentication API is Working"}


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    # Check if email already exists
    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = hash_password(user_data.password)

    # Create new user
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
        role="user"
    )

    # Save user to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user



@router.post("/login", response_model=TokenResponse)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Find user by email (OAuth2 sends it as username)
    user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    # Check if user exists
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Check whether account is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )

    # Generate JWT token
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }



@router.get("/me", response_model=UserResponse)
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user
