# REST API Reference — Daily_Track

This document describes all REST API endpoints for **Daily_Track** (Phase 2: Data & Backend). It serves as the official integration contract for Phase 3 UI development.

---

## 1. Protocol & Response Conventions

- **Base URL**: `/api`
- **Content Type**: `application/json`
- **Authentication**: Signed HTTP-only session cookies (`daily_track_session`, 7-day TTL).
- **Multi-Tenancy**: All queries and mutations are automatically scoped to the authenticated user ID.

### Success Envelope

All successful requests return HTTP 200 (or 201 for resource creation) with:

```json
{
  "ok": true,
  "data": { ... }
}
```

### Error Envelope

All error responses return standard HTTP error status codes (400, 401, 404, 409, 422, 429, 500) with:

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable error description",
    "details": { ... }
  }
}
```

---

## 2. Authentication Endpoints

### 2.1 Register New Account

- **Method**: `POST`
- **Path**: `/api/auth/signup`
- **Auth**: None (Public)
- **Rate Limit**: 5 attempts per minute per IP
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "name": "Alex Vance",
    "password": "Password123!",
    "timezone": "Asia/Kolkata"
  }
  ```
- **Response (201 Created)**: Sets session cookie and returns user:
  ```json
  {
    "ok": true,
    "data": {
      "id": "cmvn...cuid",
      "email": "user@example.com",
      "name": "Alex Vance",
      "timezone": "Asia/Kolkata",
      "theme": "system",
      "weekStartsOn": 1,
      "avatarColor": null,
      "createdAt": "2026-10-25T08:00:00.000Z",
      "updatedAt": "2026-10-25T08:00:00.000Z"
    }
  }
  ```
- **Error Codes**: `EMAIL_EXISTS` (409), `VALIDATION_ERROR` (422), `RATE_LIMIT_EXCEEDED` (429).

---

### 2.2 Sign In

- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Auth**: None (Public)
- **Rate Limit**: 5 attempts per minute per IP
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Response (200 OK)**: Sets session cookie and returns user:
  ```json
  {
    "ok": true,
    "data": {
      "id": "cmvn...cuid",
      "email": "user@example.com",
      "name": "Alex Vance",
      "timezone": "Asia/Kolkata",
      "theme": "system",
      "weekStartsOn": 1,
      "avatarColor": null,
      "createdAt": "2026-10-25T08:00:00.000Z",
      "updatedAt": "2026-10-25T08:00:00.000Z"
    }
  }
  ```
- **Error Codes**: `INVALID_CREDENTIALS` (401), `VALIDATION_ERROR` (422), `RATE_LIMIT_EXCEEDED` (429).

---

### 2.3 Sign Out

- **Method**: `POST`
- **Path**: `/api/auth/logout`
- **Auth**: Required
- **Response (200 OK)**: Clears session cookie:
  ```json
  {
    "ok": true,
    "data": {
      "message": "Logged out successfully"
    }
  }
  ```

---

### 2.4 Current User Session

- **Method**: `GET`
- **Path**: `/api/auth/me`
- **Auth**: Required
- **Response (200 OK)**:
  ```json
  {
    "ok": true,
    "data": {
      "id": "cmvn...cuid",
      "email": "user@example.com",
      "name": "Alex Vance",
      "timezone": "Asia/Kolkata",
      "theme": "system",
      "weekStartsOn": 1,
      "avatarColor": null,
      "createdAt": "2026-10-25T08:00:00.000Z",
      "updatedAt": "2026-10-25T08:00:00.000Z"
    }
  }
  ```
- **Error Codes**: `UNAUTHORIZED` (401).

---

## 3. Habits Endpoints

### 3.1 List Habits

- **Method**: `GET`
- **Path**: `/api/habits`
- **Auth**: Required
- **Query Parameters**:
  - `archived` _(optional)_: `true` or `false`
  - `category` _(optional)_: string filter
- **Response (200 OK)**:
  ```json
  {
    "ok": true,
    "data": [
      {
        "id": "cmv123",
        "userId": "user123",
        "title": "Morning Meditation",
        "description": "15 min breathing",
        "category": "mindfulness",
        "icon": "sun",
        "color": "amber",
        "frequencyType": "daily",
        "frequencyDays": null,
        "targetPerDay": 1,
        "unit": "session",
        "reminderTime": "07:00",
        "currentStreak": 0,
        "longestStreak": 0,
        "isArchived": false,
        "sortOrder": 0,
        "createdAt": "2026-10-25T08:00:00.000Z",
        "updatedAt": "2026-10-25T08:00:00.000Z"
      }
    ]
  }
  ```

---

### 3.2 Create Habit

- **Method**: `POST`
- **Path**: `/api/habits`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "title": "Drink 3L Water",
    "description": "Daily hydration",
    "category": "health",
    "icon": "water",
    "color": "blue",
    "frequencyType": "daily",
    "targetPerDay": 3,
    "unit": "liters",
    "reminderTime": "09:00"
  }
  ```
- **Response (201 Created)**: Returns created Habit object.

---

### 3.3 Get Single Habit

- **Method**: `GET`
- **Path**: `/api/habits/:id`
- **Auth**: Required
- **Response (200 OK)**: Returns Habit object or 404.

---

### 3.4 Update Habit

- **Method**: `PATCH`
- **Path**: `/api/habits/:id`
- **Auth**: Required
- **Request Body**: Any subset of habit fields (`title`, `category`, `targetPerDay`, etc.).
- **Response (200 OK)**: Returns updated Habit object.

---

### 3.5 Delete Habit

- **Method**: `DELETE`
- **Path**: `/api/habits/:id`
- **Auth**: Required
- **Response (200 OK)**:
  ```json
  {
    "ok": true,
    "data": {
      "message": "Habit deleted successfully"
    }
  }
  ```

---

### 3.6 Archive / Unarchive Habit

- **Method**: `POST`
- **Path**: `/api/habits/:id/archive`
- **Auth**: Required
- **Request Body** _(optional)_: `{"archive": true}` or `{"archive": false}`.
- **Response (200 OK)**: Returns updated Habit object with `isArchived` set.

---

### 3.7 Reorder Habits

- **Method**: `POST`
- **Path**: `/api/habits/reorder`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "habitIds": ["id1", "id2", "id3"]
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "ok": true,
    "data": {
      "message": "Habits reordered successfully"
    }
  }
  ```

---

## 4. Habit Logs & Today View

### 4.1 Today View (Dashboard Overview)

- **Method**: `GET`
- **Path**: `/api/today`
- **Auth**: Required
- **Response (200 OK)**: Returns habits due today with log status and daily journal:
  ```json
  {
    "ok": true,
    "data": {
      "date": "2026-10-25",
      "timezone": "Asia/Kolkata",
      "habits": [
        {
          "habit": { "id": "h1", "title": "Meditation", "targetPerDay": 1, ... },
          "log": { "id": "log1", "value": 1, "note": "Peaceful" },
          "isCompleted": true
        }
      ],
      "dailyEntry": {
        "id": "e1",
        "date": "2026-10-25",
        "mood": 4,
        "energy": 5,
        "focus": 4,
        "reflection": "Great morning",
        "wins": "Finished task"
      },
      "summary": {
        "totalDue": 6,
        "completedCount": 5,
        "completionRate": 83
      }
    }
  }
  ```

---

### 4.2 Query Habit Logs by Date Range

- **Method**: `GET`
- **Path**: `/api/habit-logs?from=YYYY-MM-DD&to=YYYY-MM-DD&habitId=`
- **Auth**: Required
- **Response (200 OK)**: Array of `HabitLog` items.

---

### 4.3 Upsert Habit Log for Date

- **Method**: `PUT`
- **Path**: `/api/habits/:id/logs/:date`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "value": 1,
    "note": "Optional reflection"
  }
  ```
- **Response (200 OK)**: Returns upserted `HabitLog` record.

---

### 4.4 Delete Habit Log for Date

- **Method**: `DELETE`
- **Path**: `/api/habits/:id/logs/:date`
- **Auth**: Required
- **Response (200 OK)**: Returns `{ "ok": true, "data": { "message": "Habit log deleted successfully" } }`.

---

## 5. Daily Entries (Journal)

### 5.1 Query Daily Entries Range

- **Method**: `GET`
- **Path**: `/api/daily-entries?from=YYYY-MM-DD&to=YYYY-MM-DD`
- **Auth**: Required
- **Response (200 OK)**: Array of `DailyEntry` records sorted newest first.

---

### 5.2 Upsert Daily Entry for Date

- **Method**: `PUT`
- **Path**: `/api/daily-entries/:date`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "mood": 4,
    "energy": 5,
    "focus": 4,
    "reflection": "Deep work session went very smoothly.",
    "wins": "Finished Phase 2 data architecture."
  }
  ```
- **Response (200 OK)**: Returns upserted `DailyEntry` record.

---

### 5.3 Delete Daily Entry for Date

- **Method**: `DELETE`
- **Path**: `/api/daily-entries/:date`
- **Auth**: Required
- **Response (200 OK)**: Returns `{ "ok": true, "data": { "message": "Daily entry deleted successfully" } }`.

---

## 6. Goals & Milestones

### 6.1 List Goals

- **Method**: `GET`
- **Path**: `/api/goals`
- **Auth**: Required
- **Query Parameters**: `status` _(optional: `active`, `completed`, `paused`, `abandoned`)_
- **Response (200 OK)**: Returns array of goals including `milestones` and linked `goalHabits`.

---

### 6.2 Create Goal

- **Method**: `POST`
- **Path**: `/api/goals`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "title": "Read 12 Books",
    "description": "Continuous learning",
    "category": "learning",
    "status": "active",
    "targetValue": 12,
    "currentValue": 0,
    "unit": "books",
    "startDate": "2026-01-01T00:00:00Z",
    "targetDate": "2026-12-31T23:59:59Z"
  }
  ```
- **Response (201 Created)**: Returns created `Goal` object.

---

### 6.3 Update Goal

- **Method**: `PATCH`
- **Path**: `/api/goals/:id`
- **Auth**: Required
- **Request Body**: Any goal fields to update.
- **Response (200 OK)**: Returns updated Goal object.

---

### 6.4 Delete Goal

- **Method**: `DELETE`
- **Path**: `/api/goals/:id`
- **Auth**: Required
- **Response (200 OK)**: Returns `{ "ok": true, "data": { "message": "Goal deleted successfully" } }`.

---

### 6.5 Add Milestone to Goal

- **Method**: `POST`
- **Path**: `/api/goals/:id/milestones`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "title": "Complete Chapter 1",
    "isDone": false
  }
  ```
- **Response (201 Created)**: Returns created Milestone object.

---

### 6.6 Update Milestone

- **Method**: `PATCH`
- **Path**: `/api/goals/:id/milestones/:milestoneId`
- **Auth**: Required
- **Request Body**: `{"title": "...", "isDone": true}`
- **Response (200 OK)**: Returns updated Milestone object (auto-updates `doneAt`).

---

### 6.7 Delete Milestone

- **Method**: `DELETE`
- **Path**: `/api/goals/:id/milestones/:milestoneId`
- **Auth**: Required
- **Response (200 OK)**: Returns `{ "ok": true, "data": { "message": "Milestone deleted successfully" } }`.

---

### 6.8 Link Habits to Goal (Replace Set)

- **Method**: `PUT`
- **Path**: `/api/goals/:id/habits`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "habitIds": ["habitId1", "habitId2"]
  }
  ```
- **Response (200 OK)**: Returns `{ "ok": true, "data": { "message": "Linked habits updated successfully" } }`.

---

## 7. Profile & Account Settings

### 7.1 Get Profile

- **Method**: `GET`
- **Path**: `/api/profile`
- **Auth**: Required
- **Response (200 OK)**: Returns user profile object without password hash.

---

### 7.2 Update Profile

- **Method**: `PATCH`
- **Path**: `/api/profile`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "name": "Alex Vance",
    "timezone": "Asia/Kolkata",
    "theme": "dark",
    "weekStartsOn": 1,
    "avatarColor": "indigo"
  }
  ```
- **Response (200 OK)**: Returns updated user profile.

---

### 7.3 Change Password

- **Method**: `POST`
- **Path**: `/api/profile/password`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "currentPassword": "CurrentPassword123!",
    "newPassword": "NewStrongPassword456!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "ok": true,
    "data": {
      "message": "Password updated successfully"
    }
  }
  ```
- **Error Codes**: `INVALID_PASSWORD` (400), `VALIDATION_ERROR` (422).

---

## 8. Stats Summary Stub

### 8.1 Get Basic Counts Summary

- **Method**: `GET`
- **Path**: `/api/stats/summary`
- **Auth**: Required
- **Response (200 OK)**:
  ```json
  {
    "ok": true,
    "data": {
      "totalHabits": 7,
      "completedToday": 5,
      "activeGoals": 1
    }
  }
  ```
- **Note**: Complex streak calculations, consistency metrics, and heatmaps are scheduled for Phase 5.
