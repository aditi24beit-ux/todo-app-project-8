
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database.connection import Base, engine
from app.models import User, Task
from app.routes import auth, tasks, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables if they do not exist
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(admin.router)


@app.get("/")
def index():
    return {"message": "This is a todo-app"}
