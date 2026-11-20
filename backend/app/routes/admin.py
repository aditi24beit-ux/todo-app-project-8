from fastapi import APIRouter

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/")
def get_task():
    return{"Message" : "Admin API is Working"}