# To-Do App – Backend

A RESTful backend for the Group 8 To-Do Application, built using **FastAPI, Python, PostgreSQL, and SQLAlchemy**.

The backend provides user authentication, task management, role-based authorization, and administrative functionality. It exposes REST APIs that can be integrated with the React frontend.

---

## 1. Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming language |
| FastAPI | REST API development |
| PostgreSQL | Relational database |
| SQLAlchemy | Database ORM |
| Pydantic | Request validation and response schemas |
| PyJWT | JWT authentication |
| pwdlib | Password hashing using Argon2 |
| Uvicorn | ASGI server |

---

## 2. Backend Folder Structure

```text
backend/
│
├── app/
│   ├── __init__.py
│   ├── main.py
│   │
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── tasks.py
│   │   └── admin.py
│   │
│   ├── controllers/
│   │   └── __init__.py
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── task.py
│   │
│   ├── database/
│   │   ├── __init__.py
│   │   ├── connection.py
│   │   └── session.py
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── task.py
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── security.py
│   │   └── token.py
│   │
│   └── dependencies/
│       ├── __init__.py
│       └── auth.py
│
├── venv/
├── requirements.txt
├── .env
└── README.md
```

**Note:** `venv/` and `.env` are local environment files. They should not be committed to GitHub.

### Folder and File Responsibilities

#### `app/`
The main application package. It contains the backend application and all its modules.

- **`main.py`** – Initializes the FastAPI application and registers API routers.

#### `app/routes/`
Contains API endpoint definitions.

- **`auth.py`** – Handles user registration, login, and current-user details.
- **`tasks.py`** – Handles task creation, retrieval, updating, deletion, filtering, searching, and sorting.
- **`admin.py`** – Handles administrative operations such as user management, task overview, and dashboard statistics.

#### `app/controllers/`
Reserved for controller-level business logic. Currently contains `__init__.py`.

#### `app/schemas/`
Contains Pydantic schemas for request validation and response formatting.

- **`user.py`** – User-related request and response schemas.
- **`task.py`** – Task creation, update, and response schemas.

#### `app/database/`
Handles database connectivity and session management.

- **`connection.py`** – Database connection configuration.
- **`session.py`** – Database session creation and management.

#### `app/models/`
Contains SQLAlchemy database models.

- **`user.py`** – Defines the User database model.
- **`task.py`** – Defines the Task database model and its relationship with users.

#### `app/utils/`
Contains reusable utility functions.

- **`security.py`** – Handles password hashing and password verification.
- **`token.py`** – Handles JWT token creation and related token operations.

#### `app/dependencies/`
Contains reusable FastAPI dependencies.

- **`auth.py`** – Validates JWT tokens, retrieves the current user, and checks administrator permissions.

#### `__init__.py` files
These files identify Python package directories and support importing modules from those directories.

---

## 3. Database Structure

The backend uses PostgreSQL as its relational database.

**Database name:** `todo_app_db`

### Users Table

| Column | Description |
|---|---|
| id | Unique user ID |
| name | User's full name |
| email | User's email address |
| password_hash | Hashed password |
| role | User role (`user` or `admin`) |
| is_active | Account activation status |
| created_at | Account creation timestamp |
| updated_at | Last update timestamp |

### Tasks Table

| Column | Description |
|---|---|
| id | Unique task ID |
| user_id | ID of the task owner |
| title | Task title |
| description | Task description |
| status | Task status (`pending` or `completed`) |
| priority | Task priority (`low`, `medium`, or `high`) |
| due_date | Task due date |
| created_at | Task creation timestamp |
| updated_at | Last update timestamp |

### Database Relationship

- One user can create multiple tasks.
- Each task belongs to one user.
- `user_id` is a foreign key referencing `users.id`.
- Deleting a user cascades deletion to their associated tasks.
- An index is maintained on `tasks.user_id`.

---

## 4. Prerequisites

Before setting up the backend, install the following:

1. Python 3.10 or a compatible version supported by the project dependencies.
2. PostgreSQL 17.
3. Visual Studio Code (recommended).
4. Git.
5. Postman or a browser for API testing (optional).

Verify your installations:

```powershell
python --version
pip --version
git --version
```

---

## 5. Clone the Repository

Clone the project repository:

```powershell
git clone https://github.com/aditi24beit-ux/todo-app-project-8.git
```

Navigate to the project directory:

```powershell
cd todo-app-project-8
```

Navigate to the backend directory:

```powershell
cd backend
```

---

## 6. Create and Activate a Virtual Environment

A virtual environment keeps backend dependencies separate from other Python projects.

Create the environment:

```powershell
python -m venv venv
```

Activate it in Windows PowerShell:

```powershell
.\venv\Scripts\Activate
```

After activation, the terminal should display `(venv)`.

---

## 7. Install Dependencies

Install the required Python packages:

```powershell
pip install -r requirements.txt
```

This installs the dependencies required by the backend.

---

## 8. PostgreSQL Database Configuration

Make sure PostgreSQL is running on your local machine.

### Step 1: Open PostgreSQL

Open pgAdmin or the PostgreSQL command-line tool.

### Step 2: Create the Database

Execute:

```sql
CREATE DATABASE todo_app_db;
```

### Step 3: Configure Database Credentials

You will need:

- Database name
- PostgreSQL username
- PostgreSQL password
- Host
- Port

The default local PostgreSQL host and port are usually:

```text
Host: localhost
Port: 5432
```

Use the credentials configured on your own PostgreSQL installation.

---

## 9. Configure Environment Variables

The backend uses a `.env` file to store local configuration and sensitive information.

Create a file named `.env` inside the `backend/` directory.

Example:

```env
DATABASE_URL=postgresql+psycopg://postgres:YOUR_DB_PASSWORD@localhost:5432/todo_app_db

SECRET_KEY=YOUR_GENERATED_SECRET_KEY

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Replace `YOUR_DB_PASSWORD` with your local PostgreSQL password.

### Generate a Secure Secret Key Locally

Every developer must generate their own secret key. Do not copy another developer's secret key.

**Step 1: Activate the virtual environment**

```powershell
.\venv\Scripts\Activate
```

**Step 2: Generate a secure random key**

Run:

```powershell
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Step 3: Copy the generated output**

The command will generate a unique random key.

**Step 4: Add it to your `.env` file**

```env
SECRET_KEY=PASTE_YOUR_GENERATED_SECRET_KEY_HERE
```

Keep the other environment variables in the same file.

### Important Security Guidelines

- Never share your secret key publicly.
- Never upload your `.env` file to GitHub.
- Never commit real database passwords or JWT secrets.
- Generate a separate key for each local environment.
- Changing the secret key invalidates previously issued JWT tokens.

**Important:** The environment variable names in `.env` must match the names read by the backend configuration. If your local code uses different names, follow the names defined in your implementation.

---

## 10. Run the Backend Server

Make sure you are inside the `backend/` directory and the virtual environment is activated.

Start the FastAPI server:

```powershell
uvicorn app.main:app --reload
```

If the server starts successfully, it will be available at:

```text
http://127.0.0.1:8000
```

### Access API Documentation

FastAPI automatically generates interactive API documentation.

**Swagger UI:**

http://127.0.0.1:8000/docs

**ReDoc:**

http://127.0.0.1:8000/redoc

Use Swagger UI to test the backend endpoints without needing the frontend.

---

## 11. Authentication and Authorization

The backend uses JWT (JSON Web Token) authentication.

### Registration

**Endpoint:**

```http
POST /auth/register
```

Registers a new user.

The password is hashed before being stored in the database.

Newly registered users receive the regular `user` role.

### Login

**Endpoint:**

```http
POST /auth/login
```

Authenticates a user and returns an access token.

The login endpoint uses OAuth2 form data. In Swagger UI, enter the user's email in the `username` field and their password in the `password` field.

### Get Current User

**Endpoint:**

```http
GET /auth/me
```

Returns the authenticated user's information.

This endpoint requires a valid JWT token.

### Authentication Flow

1. User registers an account.
2. Password is securely hashed and stored.
3. User logs in using their credentials.
4. Backend verifies the password.
5. Backend generates a JWT access token.
6. Frontend stores the token securely and sends it with protected API requests.
7. Backend validates the token before allowing access.

### User Roles

The application supports two roles:

- `user` – Can manage their own tasks.
- `admin` – Can access administrative APIs and manage users and tasks.

---

## 12. Task Management APIs

All task endpoints require authentication.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/tasks/` | Create a task |
| GET | `/tasks/` | Retrieve the current user's tasks |
| GET | `/tasks/{task_id}` | Retrieve a specific task |
| PATCH | `/tasks/{task_id}` | Update a task |
| DELETE | `/tasks/{task_id}` | Delete a task |

### Additional Task Features

The task listing endpoint supports:

- Status filtering using `status_filter`.
- Title searching using `q`.
- Sorting using `sort`.

Available sorting options:

```text
created_at
due_date
```

Users can only access and modify tasks belonging to their own account. Attempting to access another user's task returns a `404 Task not found` response.

---

## 13. Admin APIs

Administrative endpoints require a valid JWT token belonging to an administrator.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/` | Admin API health check |
| GET | `/admin/users` | Retrieve all users |
| GET | `/admin/users/{user_id}` | Retrieve a specific user |
| PATCH | `/admin/users/{user_id}/status` | Update user activation status |
| DELETE | `/admin/users/{user_id}` | Delete a user |
| GET | `/admin/tasks` | Retrieve all tasks |
| GET | `/admin/stats` | Retrieve dashboard statistics |

### Admin Security

- Regular users cannot access admin endpoints.
- Only users with the `admin` role can access administrative functionality.
- Administrators cannot deactivate or delete their own account through the protected account-management endpoints.

---

## 14. Frontend Integration

The backend is designed to communicate with the React frontend through REST APIs.

### Backend Base URL

When running locally:

```text
http://127.0.0.1:8000
```

### Step 1: Configure the Frontend API URL

In the React frontend, create or update the environment configuration:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Restart the frontend development server after changing environment variables.

### Step 2: Configure Axios

Install Axios if it is not already installed:

```bash
npm install axios
```

Create an API configuration file, for example `src/services/api.js`:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
```

This example automatically attaches the JWT token to API requests. Adapt the token storage and API configuration to your frontend's existing authentication implementation.

### Step 3: User Registration

Example:

```javascript
import api from "./api";

const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};
```

Example request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPassword123!"
}
```

### Step 4: User Login

The login endpoint expects form data rather than a JSON request body.

Example:

```javascript
import axios from "axios";

const loginUser = async (email, password) => {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  localStorage.setItem(
    "access_token",
    response.data.access_token
  );

  return response.data;
};
```

### Step 5: Fetch Tasks

```javascript
import api from "./api";

const getTasks = async () => {
  const response = await api.get("/tasks/");
  return response.data;
};
```

### Step 6: Create a Task

```javascript
const createTask = async (taskData) => {
  const response = await api.post("/tasks/", taskData);
  return response.data;
};
```

Example request:

```json
{
  "title": "Complete Backend Integration",
  "description": "Connect the React frontend with FastAPI",
  "priority": "high",
  "due_date": "2026-11-28"
}
```

### Step 7: Update a Task

```javascript
const updateTask = async (taskId, updatedData) => {
  const response = await api.patch(
    `/tasks/${taskId}`,
    updatedData
  );

  return response.data;
};
```

### Step 8: Delete a Task

```javascript
const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};
```

### Step 9: Configure CORS

The backend must allow requests from the frontend's development origin.

For example, if the React frontend runs at:

```text
http://localhost:5173
```

Configure FastAPI's CORS middleware in `main.py` to allow that origin.

Example:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Adjust the allowed origin to match the actual frontend URL. For production, configure only the trusted frontend domains.

---

## 15. Testing the Backend

The backend can be tested through Swagger UI.

Open:

```text
http://127.0.0.1:8000/docs
```

Recommended testing sequence:

1. Register a new user.
2. Log in with the registered credentials.
3. Copy the returned access token.
4. Click the **Authorize** button in Swagger UI.
5. Enter the token as required by the Swagger authentication dialog.
6. Test `GET /auth/me`.
7. Create a task using `POST /tasks/`.
8. Retrieve tasks using `GET /tasks/`.
9. Update a task using `PATCH /tasks/{task_id}`.
10. Delete a task using `DELETE /tasks/{task_id}`.

### Security Testing

Test that:

- An unauthenticated user cannot access protected endpoints.
- A normal user cannot access admin endpoints.
- A user cannot retrieve another user's tasks.
- A user cannot update another user's tasks.
- A user cannot delete another user's tasks.

---

## 16. Common Issues and Solutions

### Issue 1: Database Connection Error

**Possible reasons:**
- PostgreSQL is not running.
- Database does not exist.
- Incorrect database credentials.
- Incorrect database URL.

**Solution:** Verify PostgreSQL is running and check the `DATABASE_URL` in `.env`.

### Issue 2: Module Not Found

**Possible reason:** Virtual environment is not activated or dependencies are missing.

**Solution:**

```powershell
.\venv\Scripts\Activate
pip install -r requirements.txt
```

### Issue 3: Port Already in Use

**Possible reason:** Another application is using port `8000`.

**Solution:** Run the backend on another port:

```powershell
uvicorn app.main:app --reload --port 8001
```

Update the frontend API base URL accordingly.

### Issue 4: Unauthorized – 401

**Possible reasons:**
- JWT token is missing.
- JWT token is invalid or expired.
- Swagger is not authorized with the current token.

**Solution:** Log in again and authorize Swagger with the new token.

### Issue 5: Forbidden – 403

**Possible reason:** A regular user is attempting to access an administrator-only endpoint.

**Solution:** Use an account with the appropriate admin role.

### Issue 6: CORS Error

**Possible reason:** The frontend origin is not allowed by the backend.

**Solution:** Add the frontend development URL to the CORS allowed origins in `main.py`.

---

## 17. Git and Security Guidelines

Before pushing changes to GitHub, make sure sensitive files are excluded.

Recommended `.gitignore` entries:

```gitignore
.env
venv/
__pycache__/
*.py[cod]
.pytest_cache/
```

**Never commit:**

- `.env` files.
- Database passwords.
- JWT secret keys.
- Virtual environment folders.
- Personal access tokens.

Each developer should maintain their own local `.env` file.

---

## 18. Quick Start Commands

Use these commands whenever you want to start the backend locally.

```powershell
# Navigate to backend
cd backend

# Activate virtual environment
.\venv\Scripts\Activate

# Install dependencies (first-time setup)
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload
```

Open the API documentation:

http://127.0.0.1:8000/docs

---

## 19. Project Information

**Project:** Group 8 – To-Do Application  
**Component:** Backend Development  
**Framework:** FastAPI  
**Database:** PostgreSQL  
**API Architecture:** REST  
**Authentication:** JWT-based authentication  
**Authorization:** Role-based access control  

The backend provides the authentication, task management, database interaction, and administrative APIs required by the To-Do Application frontend.

---

**Developed as part of the Group 8 To-Do Application Project.**