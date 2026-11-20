
from app.database.connection import Base
from app.models import User, Task

print("Registered database tables:")

for table_name in Base.metadata.tables:
    print(table_name)
