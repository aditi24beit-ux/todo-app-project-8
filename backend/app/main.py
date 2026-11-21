from fastapi import FastAPI
from app.routes import auth, tasks, admin

app = FastAPI()

app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(admin.router)

@app.get("/")
def index():
    return("This is a todo-app")