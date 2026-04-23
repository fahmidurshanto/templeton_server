# API Routes Overview

**Base URL:** `http://localhost:4000/api/v1`  
**Authentication:** HTTP‑only cookies (`accessToken`, `refreshToken`). Include credentials (`credentials: 'include'` or `withCredentials: true`).

---

## 👤 Users (Authentication & Profile)
Routes for general user authentication, session management, and personal data.

| Route                          | Method | Authentication | Request Body / Params                                                                                             |
|--------------------------------|--------|----------------|-------------------------------------------------------------------------------------------------------------------|
| `/auth/login`                   | POST   | Public         | `{ "email": "user@example.com", "password": "yourpassword" }`                                                      |
| `/auth/logout`                  | GET    | User            | None                                                                                                              |
| `/auth/me`                      | GET    | User            | None                                                                                                              |
| `/investment/create`            | POST   | User            | `{ "name": "Investment Name", "year": 2027, "amount": 200, "user": "userId" }`                                    |
| `/investment/validity`          | POST   | User            | `{ "valid": false, "investmentId": "id" }`                                                                        |
| `/investment/get`                | GET    | User            | **Body:** `{ "userId": "id" }`<br>**Query:** `?year=2027`                                                       |
| `/investment/get/:investmentId` | GET    | User            | **URL param:** `investmentId`                                                                                     |

---

## 📄 Documents
Routes related to document handling and viewing.

| Route                          | Method | Authentication | Request Body / Params                                                                                             |
|--------------------------------|--------|----------------|-------------------------------------------------------------------------------------------------------------------|
| `/document/upload`              | POST   | User           | **Multipart:** `{ "file": (File), "userId": "id" }`                                                               |
| `/document/view/:id`            | GET    | User           | **URL param:** `id`                                                                                               |

---

## 🔐 Admin (Management)
Restrictive routes for user management and administrative actions.

| Route                          | Method | Authentication | Request Body / Params                                                                                             |
|--------------------------------|--------|----------------|-------------------------------------------------------------------------------------------------------------------|
| `/auth/user/register`           | POST   | Admin          | `{ firstName, lastName, Phone, gender, email, nric, address, nationality, password }`                             |
| `/auth/admin/changepassword`    | POST   | Admin          | `{ "oldPassword": "...", "newPassword": "..." }`                                                                  |
| `/auth/user/changepassword`     | POST   | Admin          | `{ "userId": "id", "newPassword": "..." }`                                                                        |
| `/document/user/:userId`        | GET    | Admin          | **URL param:** `userId` (Get all documents for a specific user)                                                   |
| `/document/delete/:id`          | DELETE | Admin          | **URL param:** `id`                                                                                               |

---

**Note:** All protected routes require the client to send cookies. The backend automatically refreshes the access token when expired.