# Stage API Documentation 

This document provides API details for Frontend Developers configuring the Stage modules. 

> Note: All routes discussed below are relative to their defined base path (likely `/api/v1/stage` or similar depending on the main router setup).

---

## **1. Global Stage Routes**
These routes manage the general list of stages in the system.

### Create Global Stage
- **Route:** `POST /add`
- **Access Level:** **Admin** (`isAdmin`)
- **Payload:**
```json
{
  "name": "Stage Name"
}
```

### Get All Global Stages
- **Route:** `GET /getall`
- **Access Level:** **Admin** (`isAdmin`)
- **Payload:** None (Response will be an array of strings)

### Edit Global Stage
- **Route:** `PUT /edit`
- **Access Level:** **Admin** (`isAdmin`)
- **Payload:**
```json
{
  "oldName": "Old Stage Name",
  "newName": "New Stage Name"
}
```

### Delete Global Stage
- **Route:** `DELETE /delete`
- **Access Level:** **Admin** (`isAdmin`)
- **Payload:**
```json
{
  "name": "Stage Name"
}
```

---

## **2. User-Specific Stage Routes**
These routes manage the lifecycle of stages assigned directly to individual users.

### Get User's Stages
- **Route:** `GET /user/:userId`
- **Access Level:** **User or Admin** (`isAuthenticated`)
- **Payload:** None. Response includes the user's `stage` array.

### Add User Stage
- **Route:** `POST /user/:userId`
- **Access Level:** **Admin** (`isAdmin`)
- **Short Payload (Minimum Required):**
```json
{
  "stage": "Interview"
}
```
- **Full Payload:**
```json
{
  "stage": "Technical Interview",
  "sequence": 1,
  "description": "First round technical interview covering Node.js and React",
  "remark": "Candidate performed well on backend concepts",
  "remarkLabel": "Tech Round 1",
  "status": "upcoming", 
  "time": "2024-05-20T14:30:00.000Z"
}
```
*(Valid statuses: `upcoming`, `processed`, `active`)*

### Edit User Stage
- **Route:** `PUT /user/:userId?stage=<stageId>`
- **Access Level:** **Admin** (`isAdmin`)
- **Note:** The ID of the stage you are editing MUST be passed as a query string parameter (`?stage=...`).
- **Short Payload (e.g., just updating status):**
```json
{
  "status": "active"
}
```
- **Full Payload (Update anything):**
```json
{
  "stage": "Second Round Interview",
  "description": "Met with the senior engineering team",
  "remark": "Strong performance on system design",
  "remarkLabel": "Tech Round 2",
  "status": "processed",
  "time": "2024-05-25T09:00:00.000Z"
}
```

### Delete User Stage
- **Route:** `DELETE /user/:userId?stage=<stageId>`
- **Access Level:** **Admin** (`isAdmin`)
- **Note:** The ID of the stage you are deleting MUST be passed as a query string parameter (`?stage=...`).
- **Payload:** None

---

## **3. QR Code Management**

### Generate QR Code
- **Route:** `POST /generateqrcode/:userId`
- **Access Level:** **Admin** (`isAdmin`)
- **Payload:** None. 

### Verify QR Code
- **Route:** `GET /verify?id=<userId>`
- **Access Level:** **User** (`isAuthenticated`)
- **Description:** Scanned by the authenticated User. Verifies the ID in the URL matches the logged-in user and enables their `stageVisibility`.
- **Payload:** None. Pass `id` inside query string parameter.

