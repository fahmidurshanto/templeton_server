# Schedule & Calendar API

This document lists all schedule/appointment API endpoints integrated into the Hutchinson frontend.

## Base URL
All API calls are prefixed with your backend's base URL, e.g., ``/api/v1``

---

## 1. Create Schedule
**Endpoint:** `POST /schedule/create`
**Description:** Creates a new calendar entry (Meeting or Task) for a specific user.
**Headers:** Requires Authentication Token/Cookie (Admin Role usually)
**Request Body:**
```json
{
  "title": "Executive Meeting",
  "time": "2026-03-20T10:00:00.000Z",
  "type": "Meeting",
  "description": "Brief description...",
  "userId": "64..."
}
```
**Expected Response:** JSON indicating `success: true`.

## 2. Get All Schedules (Admin)
**Endpoint:** `GET /schedule/admin/all`
**Description:** Fetches all scheduled events across the entire application for the Admin calendar.
**Headers:** Requires Authentication Token/Cookie (Admin Role)
**Request Body:** *None*

## 3. Get Current User's Schedules
**Endpoint:** `GET /schedule/my`
**Description:** Fetches scheduled events specifically for the currently logged-in user.
**Headers:** Requires Authentication Token/Cookie
**Request Body:** *None*

## 4. Get Specific User's Schedules (Admin)
**Endpoint:** `GET /schedule/user/:userId`
**Description:** Fetches schedules associated with a single user. Useful for viewing a targeted user's timeline.
**Headers:** Requires Authentication Token/Cookie (Admin Role)
**URL Parameters:** `userId` - The MongoDB ObjectId of the targeted user.

## 5. Delete Schedule
**Endpoint:** `DELETE /schedule/:id`
**Description:** Removes a schedule from the calendar.
**Headers:** Requires Authentication Token/Cookie (Admin Role)
**URL Parameters:** `id` - The ID of the schedule entry.
**Request Body:** *None*
