# Auth & User Management API

This document covers all authentication and core user profile management APIs currently integrated into the Hutchinson frontend.

## Base URL
All API calls are prefixed with your backend's base URL, e.g., ``/api/v1``

---

## 1. Login
**Endpoint:** `POST /auth/login`
**Description:** Authenticates a user and establishes a session.
**Headers:** `Content-Type: application/json`
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```
**Expected Response:** Needs to return a success flag, user object, and token mechanism (cookie or token payload).

## 2. Register New User
**Endpoint:** `POST /auth/user/register`
**Description:** Admin creation or direct registration of a new user.
**Headers:** `Content-Type: application/json`
**Request Body:** (Variable based on `userData`, standard fields include)
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "user"
}
```

## 3. Get Current User (Me)
**Endpoint:** `GET /auth/me`
**Description:** Fetches the profile of the currently logged-in user based on session token.
**Headers:** Requires Authentication Token/Cookie
**Request Body:** *None*

## 4. Logout
**Endpoint:** `GET /auth/logout`
**Description:** Terminates the current user session and clears cookies/tokens.
**Headers:** Requires Authentication Token/Cookie
**Request Body:** *None*

## 5. Get All Users (Admin)
**Endpoint:** `GET /auth/users`
**Description:** Fetches the full directory of users for the Admin dashboard.
**Headers:** Requires Authentication Token/Cookie (Admin Role)
**Request Body:** *None*

## 6. Update User (Admin/Self)
**Endpoint:** `PATCH /auth/user/:id`
**Description:** Updates specific user details (e.g., gender, NRIC, address, nationality).
**Headers:** Requires Authentication Token/Cookie
**URL Parameters:** `id` - The Mongo ObjectId of the user
**Request Body:**
```json
{
  "gender": "male",
  "nric": "S1234567A",
  "address": "123 Street Name",
  "nationality": "Singaporean"
}
```

## 7. Delete User (Admin)
**Endpoint:** `DELETE /auth/user/:id`
**Description:** Completely removes a user profile from the database.
**Headers:** Requires Authentication Token/Cookie (Admin Role)
**URL Parameters:** `id` - The Mongo ObjectId of the user
**Request Body:** *None*

## 8. Reset/Update Password
Depending on Context `endpoint` usage: `POST /auth/user/reset-password` or `POST /auth/user/recover`
**Description:** Verifies current password and updates to a new one.
**Request Body:**
```json
{
  "currentPassword": "...",
  "newPassword": "..."
}
```
