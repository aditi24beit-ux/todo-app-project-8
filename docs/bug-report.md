# Bug Report - To-Do App (GRP8)

Tester: Adhikesh P Kannan

## Reported Bugs

## BUG-001

- Related test case: TC-105
- Title: POST /tasks/ returns 500 for invalid priority value
- Module: Backend / Tasks API
- Severity: Medium
- Status: Open
- Assigned to: Vishal
- Reported on: 21 Nov 2026
- Steps to reproduce:
  1. Login and click Authorize in Swagger
  2. POST /tasks/ with body {"title": "x", "priority": "urgent"}
  3. Click Execute
- Expected: 422 Validation Error (priority must be low, medium or high)
- Actual: 500 Internal Server Error
- Screenshot or link: screenshots/BUG-001-priority-500.png
- Suggested fix: use Literal["low", "medium", "high"] in the Pydantic schema

---

## BUG-002

- Related test case: TC-107
- Title: PATCH /tasks/{id} returns 500 for invalid status value
- Module: Backend / Tasks API
- Severity: Medium
- Status: Open
- Assigned to: Vishal
- Reported on: 21 Nov 2026
- Steps to reproduce:
  1. Login and click Authorize in Swagger
  2. PATCH /tasks/6 with body {"status": "done"}
  3. Click Execute
- Expected: 422 Validation Error (status must be pending or completed)
- Actual: 500 Internal Server Error
- Screenshot or link: screenshots/BUG-002-status-500.png
- Suggested fix: use Literal["pending", "completed"] in the update schema

Severity: Critical (app unusable), High (feature broken), Medium (works but wrong), Low (small or cosmetic)
Status: Open, In Progress, Fixed, Retest, Closed

---

## Bug Template

This block is a blank template, not a real bug. Copy it for each new bug and fill in the details.

```
## BUG-XXX

- Related test case:
- Title:
- Severity:
- Status: Open
- Assigned to:
- Reported on:
- Steps to reproduce:
  1.
  2.
  3.
- Expected:
- Actual:
- Screenshot or link: