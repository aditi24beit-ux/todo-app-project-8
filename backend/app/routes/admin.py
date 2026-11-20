from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.dependencies.auth import get_current_admin
from app.schemas.user import UserResponse, UserStatusUpdate
from app.schemas.task import TaskResponse
from app.models.task import Task


router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/")
def get_task():
    return{"Message" : "Admin API is Working"}


@router.get("/users", response_model=list[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_admin : User = Depends(get_current_admin)
):
    users = db.query(User).all()
    return users


@router.get("/users/{user_id}", response_model= UserResponse)
def get_user_by_ids(
    user_id : int,
    db : Session = Depends(get_db),
    current_admin : User = Depends (get_current_admin)
):
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user

@router.patch("/users/{user_id}/status", response_model=UserResponse)
def update_user_status(
    user_id : int,
    status_data : UserStatusUpdate,
    db : Session = Depends(get_db),
    current_admin : User = Depends(get_current_admin)
):
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code= status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if user.id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin cannot deactivate their own account"
        )

    user.is_active = status_data.is_active

    db.commit()
    db.refresh(user)

    return user

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if user.id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin cannot delete their own account"
        )

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully"
    }


@router.get("/tasks", response_model=list[TaskResponse])
def get_all_tasks(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    tasks = db.query(Task).all()
    return tasks


@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    total_users = db.query(User).count()

    total_tasks = db.query(Task).count()

    pending_tasks = db.query(Task).filter(
        Task.status == "pending"
    ).count()

    completed_tasks = db.query(Task).filter(
        Task.status == "completed"
    ).count()

    return {
        "total_users": total_users,
        "total_tasks": total_tasks,
        "pending_tasks": pending_tasks,
        "completed_tasks": completed_tasks
    }