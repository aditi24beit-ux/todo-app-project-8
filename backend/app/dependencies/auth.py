from fastapi import HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.utils.token import verify_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
        token : str = Depends(oauth2_scheme),
        db : Session = Depends(get_db)
):
    try:
        payload = verify_access_token(token)
        user_id=payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code= status.HTTP_401_UNAUTHORIZED,
                detail='Invalid authentication credentials'
            )

    except Exception:
        raise HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or Expired token",
            headers={"WWW-Authenicate" :"Bearer"}
        )

    user = db.query(User).filter(User.id == int(user_id)).first()

    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )

    return user



def get_current_admin(
        current_user : User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Admin access required")

    return current_user