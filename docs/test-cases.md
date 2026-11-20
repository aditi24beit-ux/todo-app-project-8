# Test Cases - To-Do App (GRP8)

Tester: Adhikesh P Kannan | Branch: feature/testing-docs | Stack: React + TypeScript, FastAPI, PostgreSQL | Roles: User and Admin

How to use: follow Steps, write what really happened in Actual Result, set Status to Pass, Fail or Blocked.
If a test fails, log it in [bug-report.md](bug-report.md). Update field names and status codes once the real app is ready.

| Test ID | Feature | Test Case | Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| TC-001 | Login | Valid login | Open Login page; enter correct email and password; click Login | User logs in and lands on Dashboard |  | Not Run |
| TC-002 | Login | Wrong password | Enter registered email with wrong password; click Login | Error message shown; user stays on Login |  | Not Run |
| TC-003 | Login | Unregistered email | Enter an email that is not registered; click Login | Error message shown; no login |  | Not Run |
| TC-004 | Login | Empty fields | Leave both fields empty; click Login | Validation message for required fields |  | Not Run |
| TC-005 | Login | Only email filled | Fill email, leave password empty; click Login | Validation message for password |  | Not Run |
| TC-006 | Login | Only password filled | Fill password, leave email empty; click Login | Validation message for email |  | Not Run |
| TC-007 | Login | Invalid email format | Enter abc (no @) as email; click Login | Validation message for email format |  | Not Run |
| TC-008 | Login | Password is masked | Type in the password field | Characters are hidden |  | Not Run |
| TC-009 | Login | Logout | Click Logout on Dashboard | User returns to Login; Back button does not reopen Dashboard |  | Not Run |
| TC-010 | Login | SQL injection text | Enter ' OR 1=1 -- as email; click Login | Login rejected; app does not crash |  | Not Run |
| TC-011 | Dashboard | Dashboard loads | Login and open Dashboard | Task summary shows without errors |  | Not Run |
| TC-012 | Dashboard | Counts are correct | Add 3 tasks, complete 1; view Dashboard | Total, pending and completed counts match the tasks |  | Not Run |
| TC-013 | Dashboard | Empty state | Login with a user who has no tasks | Friendly empty message; no crash |  | Not Run |
| TC-014 | Dashboard | Navigation | Click links or buttons to Add Task and Task List | Each opens the correct screen |  | Not Run |
| TC-015 | Add Task | Add with title only | Open Add Task; enter title; click Save | Task saved and visible in Task List |  | Not Run |
| TC-016 | Add Task | Add with all fields | Fill title, description, priority, due date; Save | All details saved and shown correctly |  | Not Run |
| TC-017 | Add Task | Empty title | Leave title empty; click Save | Validation error; task not saved |  | Not Run |
| TC-018 | Add Task | Very long title | Enter 300+ characters in title; Save | Handled gracefully (limit or wrap); no crash |  | Not Run |
| TC-019 | Add Task | Special characters | Use emoji, quotes and <script> in title; Save | Saved and shown as plain text; no script runs |  | Not Run |
| TC-020 | Add Task | Past due date | Choose a past date; Save | Warning or accepted, as per requirement |  | Not Run |
| TC-021 | Add Task | Duplicate title | Add two tasks with the same title | Both saved, or duplicate warning, as per requirement |  | Not Run |
| TC-022 | Add Task | Cancel or back | Fill the form; click Cancel or Back | Nothing saved; returns to previous screen |  | Not Run |
| TC-023 | View/Filter Tasks | List shows all tasks | Add several tasks; open Task List | All tasks displayed in the agreed order |  | Not Run |
| TC-024 | View/Filter Tasks | Empty list | Open Task List with no tasks | Empty-state message shown |  | Not Run |
| TC-025 | View/Filter Tasks | Task details shown | Check each row | Title, status and due date visible |  | Not Run |
| TC-026 | View/Filter Tasks | Filter by Pending | Select Pending filter | Only pending tasks shown |  | Not Run |
| TC-027 | View/Filter Tasks | Filter by Completed | Select Completed filter | Only completed tasks shown |  | Not Run |
| TC-028 | View/Filter Tasks | Filter by Priority (if available) | Select a priority filter | Only tasks of that priority shown |  | Not Run |
| TC-029 | View/Filter Tasks | Data persists after refresh | Reload the page | Tasks are still there (saved in database) |  | Not Run |
| TC-030 | View/Filter Tasks | Many tasks (50+) | Add 50+ tasks; scroll the list | Scrolls smoothly; nothing cut off |  | Not Run |
| TC-031 | Edit Task | Edit title | Open a task; change title; Save | New title shows in list and after reload |  | Not Run |
| TC-032 | Edit Task | Edit with empty title | Clear title; Save | Validation error; old value kept |  | Not Run |
| TC-033 | Edit Task | Mark complete | Mark a task as done | Status becomes Completed; Dashboard counts update |  | Not Run |
| TC-034 | Edit Task | Mark pending again | Un-mark a completed task | Status returns to Pending |  | Not Run |
| TC-035 | Edit Task | Cancel edit | Change a field; click Cancel | No changes saved |  | Not Run |
| TC-036 | Delete Task | Delete a task | Click Delete on a task; confirm | Task removed from list and database |  | Not Run |
| TC-037 | Delete Task | Cancel delete | Click Delete; choose No or Cancel | Task remains |  | Not Run |
| TC-038 | Delete Task | Delete last task | Delete the only remaining task | Empty-state shown; no crash |  | Not Run |
| TC-039 | Delete Task | Deleted stays deleted | Delete a task; reload the page | Task does not come back |  | Not Run |
| TC-040 | API (FastAPI) | POST /api/tasks valid | Open http://localhost:8000/docs; POST with title and other valid fields | Success response (usually 201); task is returned with an id |  | Not Run |
| TC-041 | API (FastAPI) | POST /api/tasks missing title | POST with no title | Error response (usually 422 or 400); nothing saved |  | Not Run |
| TC-042 | API (FastAPI) | GET /api/tasks | Call GET /api/tasks | 200 with a list of tasks |  | Not Run |
| TC-043 | API (FastAPI) | GET task with invalid id | Call GET /api/tasks/99999 | 404 not found with clear message |  | Not Run |
| TC-044 | API (FastAPI) | PUT /api/tasks/{id} valid | Update an existing task | 200 with updated task |  | Not Run |
| TC-045 | API (FastAPI) | PUT with invalid id | Update task id 99999 | 404 not found |  | Not Run |
| TC-046 | API (FastAPI) | DELETE /api/tasks/{id} valid | Delete an existing task | Success response; task gone from GET |  | Not Run |
| TC-047 | API (FastAPI) | DELETE with invalid id | Delete task id 99999 | 404 not found |  | Not Run |
| TC-048 | Database (PostgreSQL) | Task saved in table | Add a task in the app; open pgAdmin and view the tasks table | New row exists with correct title, status and user_id |  | Not Run |
| TC-049 | Database (PostgreSQL) | Update reflects in table | Edit a task in the app; check the row in pgAdmin | Row shows the updated values |  | Not Run |
| TC-050 | Database (PostgreSQL) | Delete removes row | Delete a task in the app; check pgAdmin | Row is removed |  | Not Run |
| TC-051 | Database (PostgreSQL) | Password not stored as plain text | Check the users table in pgAdmin | Only password_hash is stored, not the real password |  | Not Run |
| TC-052 | Registration | Valid registration | Open Registration page; fill name, email, password; click Register | Account created; user can login afterwards |  | Not Run |
| TC-053 | Registration | Empty fields | Leave all fields empty; click Register | Validation messages for required fields |  | Not Run |
| TC-054 | Registration | Invalid email format | Enter abc (no @) as email; click Register | Validation message for email format |  | Not Run |
| TC-055 | Registration | Short or weak password | Enter a 1-2 character password; click Register | Validation message; account not created |  | Not Run |
| TC-056 | Registration | Duplicate email | Register again with an already used email | Error message that email exists; no duplicate account |  | Not Run |
| TC-057 | Registration | Password and confirm mismatch (if available) | Enter different values in password and confirm password | Validation message; account not created |  | Not Run |
| TC-058 | Registration | New user gets User role | Register a new account; login | User lands on User Dashboard, not Admin Dashboard |  | Not Run |
| TC-059 | Roles and Access | User login opens User Dashboard | Login with a normal user account | User Dashboard opens with personal task options |  | Not Run |
| TC-060 | Roles and Access | Admin login opens Admin Dashboard | Login with the admin account | Admin Dashboard opens with admin options |  | Not Run |
| TC-061 | Roles and Access | User cannot open Admin Dashboard by URL | Login as user; type the Admin Dashboard URL in the browser | Access denied or redirected; admin data not shown |  | Not Run |
| TC-062 | Roles and Access | Admin Dashboard hidden from user | Login as user; look at menus and buttons | No Admin options visible to the user |  | Not Run |
| TC-063 | Roles and Access | Logged-out user cannot open dashboards | Logout; open User and Admin Dashboard URLs | Redirected to Login |  | Not Run |
| TC-064 | Roles and Access | Session expiry or logout | Logout, then press browser Back button | Dashboard does not open without login |  | Not Run |
| TC-065 | User Dashboard | Mark as Completed | Click Mark as Completed on a task | Status becomes Completed; shown under Completed filter |  | Not Run |
| TC-066 | User Dashboard | Pending filter | Click Pending filter | Only pending tasks of this user shown |  | Not Run |
| TC-067 | User Dashboard | Completed filter | Click Completed filter | Only completed tasks of this user shown |  | Not Run |
| TC-068 | User Dashboard | Shows only own tasks | Login as User A and User B one after another | Each user sees only their own tasks |  | Not Run |
| TC-069 | Admin Dashboard | View all registered users | Login as admin; open users list | All registered users shown with name, email and role |  | Not Run |
| TC-070 | Admin Dashboard | View all tasks | Login as admin; open all tasks list | Tasks of all users shown with owner name |  | Not Run |
| TC-071 | Admin Dashboard | Manage users | Use manage options (edit, disable or delete) on a test user | Change is applied and shown in the list and database |  | Not Run |
| TC-072 | Admin Dashboard | Deleting a user and their tasks | Delete a user who has tasks | Tasks handled as designed (deleted or blocked), no errors |  | Not Run |
| TC-073 | Admin Dashboard | Task statistics are correct | Compare statistics with actual tasks (total, completed, pending) | Numbers match the real data |  | Not Run |
| TC-074 | Admin Dashboard | Statistics update | Add or complete a task as a user; refresh admin statistics | Statistics change accordingly |  | Not Run |
| TC-075 | Admin Dashboard | Empty state | Open admin lists when no tasks exist | Friendly empty message; no crash |  | Not Run |
| TC-076 | API (FastAPI) | Login API valid | POST login with correct email and password at /docs | Success response with a token |  | Not Run |
| TC-077 | API (FastAPI) | Login API wrong password | POST login with wrong password | 401 or error message; no token |  | Not Run |
| TC-078 | API (FastAPI) | Admin API with user token | Call an admin-only API using a normal user token | 403 forbidden |  | Not Run |
| TC-079 | API (FastAPI) | Admin API without token | Call an admin-only API with no token | 401 unauthorized |  | Not Run |
| TC-080 | API (FastAPI) | User gets only own tasks | Call GET tasks with User A token | Only User A tasks returned |  | Not Run |
| | TC-081 | Database (PostgreSQL) | Role stored for each user | Open users table in pgAdmin | Each user has a role (user or admin) | users.role is NOT NULL and allows only user or admin; test user shows role = user | Pass |
TC-082 | Database (PostgreSQL) | New user default role | Register a new user; check users table | Role is user by default |  | Not Run |
| TC-083 | Database (PostgreSQL) | Task linked to correct user | Add a task as User A; check tasks table | user_id matches User A id |  | Not Run |
| TC-084 | Security / General | Open page without login | Open Dashboard URL while logged out | Redirected to Login |  | Not Run |
| TC-085 | Security / General | Mobile layout | Open the app in a phone-size window | Layout fits; buttons usable |  | Not Run |
| TC-086 | Security / General | Backend stopped | Stop the backend server; try any action | Clear error message; no blank screen |  | Not Run |
| TC-087 | Database (PostgreSQL) | Valid user insert with defaults | Run INSERT INTO users with valid name, email, password_hash, role; then SELECT * FROM users | Row created; is_active is true; created_at filled automatically | Row created with id 1, is_active true, created_at filled | Pass |
| TC-088 | Database (PostgreSQL) | Duplicate email rejected | Insert a second user with the same email | Error: unique constraint violated | ERROR: duplicate key value violates unique constraint users_email_key | Pass |
| TC-089 | Database (PostgreSQL) | Invalid role rejected | Insert a user with role superadmin | Error: check constraint violated | ERROR: new row for relation users violates check constraint users_role_check | Pass |
| TC-090 | Database (PostgreSQL) | Task defaults | Insert a task with only user_id and title; SELECT * FROM tasks | status is pending and priority is medium | status pending, priority medium, description and due_date null | Pass |
| TC-091 | Database (PostgreSQL) | Deleting a user deletes their tasks | DELETE the user from users; SELECT * FROM tasks | Tasks of that user are removed (CASCADE) | tasks table was empty after the delete | Pass |
| TC-092 | Database (PostgreSQL) | Task with non-existing user_id rejected | INSERT INTO tasks (user_id, title) VALUES (9999, 'Test task') | Error: foreign key violated | ERROR: insert or update on table tasks violates foreign key constraint fk_tasks_user | Pass |
| TC-093 | Database (PostgreSQL) | Task without title rejected | INSERT INTO tasks (user_id) VALUES (9999) | Error: null value in column title | ERROR: null value in column title of relation tasks violates not-null constraint | Pass |
| TC-094 | Database (PostgreSQL) | Invalid task status rejected | INSERT a task with status done | Error: check constraint violated | ERROR: new row for relation tasks violates check constraint tasks_status_check | Pass |
| TC-095 | Database (PostgreSQL) | User without name rejected | INSERT INTO users without the name column | Error: null value in column name | ERROR: null value in column name of relation users violates not-null constraint | Pass |

Status values: Not Run, Pass, Fail, Blocked