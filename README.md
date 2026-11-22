# TaskFlow – To-Do Management Application

TaskFlow is a web-based To-Do Management Application that allows users to manage their personal tasks and provides administrators with tools to monitor users, tasks, and application activity.

The application uses a React and TypeScript frontend, a FastAPI backend, and a PostgreSQL database.

## Features

### User Features
- User registration and login.
- Secure authentication using JWT.
- Personal dashboard to view tasks.
- Create, view, update, and delete personal tasks.
- Mark tasks as pending or completed.
- Manage tasks based on their status.
- Set task priority and optional due dates.

### Admin Features
- Admin authentication and protected dashboard.
- View registered users.
- View all tasks and their owners.
- Manage user accounts and account status.
- View task statistics and application activity.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite 8 |
| Routing | React Router DOM 7 |
| API Communication | Axios |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| Authentication | JWT |
| Validation | Pydantic |

## Project Structure

```text
todo-app-project-8/
│
├── backend/                 # FastAPI backend
├── database/
│   └── schema.sql           # PostgreSQL database schema
├── docs/
│   ├── bug-report.md        # Bug tracking
│   └── test-cases.md        # Test cases and results
├── frontend/                # React + TypeScript frontend
├── ui_design_user_admin/    # User and Admin UI designs
├── .gitignore
└── README.md                # Main project documentation
```

## Database Design

The application uses PostgreSQL with two main tables.

### Users Table

Stores registered user and administrator information.

- `id` – Primary key
- `name` – User name
- `email` – Unique email address
- `password_hash` – Hashed password
- `role` – User role (`user` or `admin`)
- `is_active` – Account status
- `created_at` – Account creation timestamp
- `updated_at` – Last update timestamp

### Tasks Table

Stores tasks associated with individual users.

- `id` – Primary key
- `user_id` – Foreign key referencing the Users table
- `title` – Task title
- `description` – Task description
- `status` – Task status (`pending` or `completed`)
- `priority` – Task priority (`low`, `medium`, or `high`)
- `due_date` – Optional task deadline
- `created_at` – Task creation timestamp
- `updated_at` – Last update timestamp

### Relationship

One user can have multiple tasks. Each task belongs to one user.

The database schema includes primary keys, foreign keys, unique email constraints, validation checks, default values, and cascade deletion.

## Prerequisites

Install the following before running the application:

- Python
- Node.js and npm
- PostgreSQL
- Git

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/aditi24beit-ux/todo-app-project-8.git
cd todo-app-project-8
```

### 2. Set Up the PostgreSQL Database

1. Open PostgreSQL using pgAdmin or the PostgreSQL command line.
2. Create a database named `todo_app_db`.
3. Open the Query Tool for the newly created database.
4. Execute the SQL script located at:

```text
database/schema.sql
```

This creates the required Users and Tasks tables.

### 3. Set Up the Backend

Open a terminal in the project directory and run:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
.\venv\Scripts\Activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Configure the backend environment variables using the instructions in `backend/README.md`. Use your own local PostgreSQL credentials and the required application configuration.

Start the backend server:

```bash
uvicorn app.main:app --reload
```

The backend runs at:

`http://127.0.0.1:8000`

FastAPI Swagger documentation:

`http://127.0.0.1:8000/docs`

### 4. Set Up the Frontend

Open another terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

`http://localhost:5173`

The Vite development configuration proxies the `/auth`, `/tasks`, and `/admin` API routes to the backend running on port `8000`.

An optional frontend API base URL can be configured using `VITE_API_BASE_URL`, as described in `frontend/.env.example`.

## API Overview

The backend provides the following main API categories:

### Authentication APIs
- User registration
- User login
- Retrieve authenticated user details

### Task APIs
- Create tasks
- Retrieve tasks
- Retrieve an individual task
- Update tasks
- Delete tasks

### Admin APIs
- View users
- View individual user details
- Delete users
- Update user account status
- View all tasks
- View application statistics

Admin routes are protected through authentication and role-based authorization where applicable.

## Testing and Documentation

Testing is documented in the `docs/` directory.

- `docs/test-cases.md` contains database and backend API test cases and their results.
- `docs/bug-report.md` records identified issues and their status.

Backend API testing is performed using FastAPI Swagger UI.

Frontend testing and final integrated application verification are handled separately.

## Security

The application includes:

- Password hashing.
- JWT-based authentication.
- Role-based access control.
- Protected admin routes.
- User-specific task access.
- Database constraints and validation.

Public registration assigns the default `user` role. Admin role assignment is controlled separately and is not selected through public registration.

## Future Improvements

- Complete frontend and end-to-end testing.
- Further UI and usability improvements.
- Application deployment and hosting.
- Additional reporting and management features.

## Project Information

**Project Name:** TaskFlow – To-Do Management Application

**Repository:** [GitHub – todo-app-project-8](https://github.com/aditi24beit-ux/todo-app-project-8)

**Project Type:** Full-Stack Web Application

**Team:** Group 8
