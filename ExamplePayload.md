**Base URL:** `http://localhost:4000/api/v1`

# 👤 Users (Authentication & Profile)

### Login
**Route:** `/auth/login`  
**Method** `POST`
**Body** `{  "email":"user@example.com",  "password": "yourpassword" }`  
**Response** 
```json
{
  "success": true,
  "user": {
    "id": "69b2fe0f9f780f4730036dc5",
    "firstName": "Palak",
    "lastName": "Basak",
    "email": "palak1@gmail.com",
    "role": "admin"
  }
}
```

### Get My Profile
**Route:** `/auth/me`  
**Method** `GET`  
**Response** 
```json
{
  "success": true,
  "user": {
    "id": "...",
    "firstName": "...",
    "lastName": "...",
    "email": "...",
    "role": "..."
  }
}
```

### Logout
**Route:** `/auth/logout`
**Method** `GET`
**Response** 
```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

### Create Investment
**Route:** `/investment/create`
**Method** `POST`
**Body** `{ "name": "test2 Investment", "year": 2027, "amount": 200, "user": "userId" }`  
**Response**
```json
{
  "success": true,
  "message": "Investment Created",
  "investment": { ... }
}
```

---

# 📄 Documents

### Upload Document
**Route:** `/document/upload`
**Method** `POST`
**Body** (form-data) `{ "file": (File), "userId": "userId" }`
**Response** 
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "document": {
    "name": "...",
    "path": "...",
    "user": "...",
    "_id": "..."
  }
}
```

### View Document
**Route:** `/document/view/:id`
**Method** `GET`
**Response (Success)** -> Binary stream
**Response (Error)** 
```json
{
  "success": false,
  "message": "Access Denied / Not Found"
}
```

---

# 🔐 Admin (Management)

### Register New User
**Route:** `/auth/user/register`
**Method** `POST`
**Body** `{ "firstName": "John", "lastName": "Doe", ... }`
**Response** 
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

### Change Admin Password
**Route:** `/admin/changepassword`
**Method** `POST`
**Body** `{ "oldPassword": "...", "newPassword": "..." }`  
**Response** 
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Change User Password by Admin
**Route:** `/auth/user/changepassword`
**Method** `POST`
**Body** `{ "userId": "...", "newPassword": "..." }`  
**Response** 
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Get All Documents of a User
**Route:** `/document/user/:userId`
**Method** `GET`
**Response** 
```json
{
  "success": true,
  "count": 2,
  "documents": [
    {
      "_id": "...",
      "name": "...",
      "path": "...",
      "user": "...",
      "createdAt": "..."
    }
  ]
}
```

### Delete Document
**Route:** `/document/delete/:id`
**Method** `DELETE`
**Response** 
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

# Schedule

### Create Schedule
**Route:** `/schedule/create`
**Method** `POST`
**Body** `{  "title": "Doctor Appointment",  "time": "2026-03-19T08:00:00.000Z",  "type": "Personal",  "description": "Routine health checkup",  "userId":"69ba883af44b7a454764f68f"}` 
**Response** 
```json
{
  "success": true,
  "message": "Schedule created successfully",
  "data": {
    "title": "Doctor Appointment",
    "time": "2026-03-19T08:00:00.000Z",
    "type": "Personal",
    "description": "Routine health checkup",
    "user": "69ba883af44b7a454764f68f",
    "_id": "69bad1c66a32fe4a5af446c1",
    "createdAt": "2026-03-18T16:24:38.777Z",
    "updatedAt": "2026-03-18T16:24:38.777Z",
    "__v": 0
  }
}
```
