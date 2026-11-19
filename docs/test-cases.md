# Test Cases - To-Do App (GRP8)

Tester: Adhikesh P Kannan | Branch: feature/testing-docs | Stack: React + TypeScript, FastAPI, PostgreSQL

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
| TC-052 | Security / General | Users see only own tasks | Login as User A then User B | Each user sees only their own tasks |  | Not Run |
| TC-053 | Security / General | Open page without login | Open Dashboard URL while logged out | Redirected to Login |  | Not Run |
| TC-054 | Security / General | Mobile layout | Open the app in a phone-size window | Layout fits; buttons usable |  | Not Run |
| TC-055 | Security / General | Backend stopped | Stop the backend server; try any action | Clear error message; no blank screen |  | Not Run |

Status values: Not Run, Pass, Fail, Blocked
