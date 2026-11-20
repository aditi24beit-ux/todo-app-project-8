from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import Optional

from app.database.session import get_db
from app.models.user import User
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/tasks", tags=["Tasks"])

# @router.get("/", response_model=list[TaskResponse])
# def get_task(
#     db : Session = Depends(get_db),
#     current_user : User = Depends (get_current_user)):
#     tasks = db.query(Task).filter(
#         Task.user_id == current_user.id
#     ).all()
#     return tasks



@router.get("/", response_model=list[TaskResponse])
def get_tasks(
    status_filter: Optional[str] = None,
    q: Optional[str] = None,
    sort: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Task).filter(
        Task.user_id == current_user.id
    )

    # Filter by task status
    if status_filter:
        query = query.filter(Task.status == status_filter)

    # Search tasks by title
    if q:
        query = query.filter(Task.title.ilike(f"%{q}%"))

    # Sort tasks
    if sort == "created_at":
        query = query.order_by(Task.created_at.desc())

    elif sort == "due_date":
        query = query.order_by(Task.due_date.asc())

    return query.all()



@router.post("/",
             response_model= TaskResponse,
            status_code=status.HTTP_201_CREATED)
def create_task(
    task_data : TaskCreate,
    db : Session = Depends(get_db),
    current_user : User = Depends(get_current_user)
):
    new_task=Task(
        user_id = current_user.id,
        title = task_data.title,
        description = task_data.description,
        priority = task_data.priority,
        due_date = task_data.due_date
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


@router.patch("/{task_id}", response_model= TaskResponse)
def update_task(
    task_id : int,
    task_data: TaskUpdate,
    db : Session = Depends(get_db),
    current_user : User = Depends (get_current_user)
):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id,   
    ).first()

    if Task is None:
        raise HTTPException(
            status_code= status.HTTP_404_NOT_FOUND,
            detail="Task not found"
            )

    update_data = task_data.model_dump(exclude_unset=True)

    for key, values in update_data.items():
        setattr(task, key, values)

    db.commit()
    db.refresh(task)

    return task



@router.delete("/{task_id}")
def delete_task(
    task_id : int,
    db : Session = Depends(get_db),
    current_user : User = Depends (get_current_user)
):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id
    ).first()


    if Task is None:
        raise HTTPException (status_code= status.HTTP_404_NOT_FOUND,
                             detail="Task not found"
                             )

    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted successfully"
    }

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id : int,
    db : Session = Depends (get_db),
    current_user: User = Depends (get_current_user)
):

    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id
    ).first()

    if task is None:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail="Task not found"
                            )
    return task