# Documents API

This document covers all document-related APIs integrated into the Hutchinson frontend.

## Base URL
All API calls are prefixed with your backend's base URL, e.g., ``/api/v1``

---

## 1. Upload Document
**Endpoint:** `POST /document/upload`
**Description:** Uploads a non-binary or binary file for a specified user.
**Headers:** `Content-Type: multipart/form-data`
**Request Body (FormData):**
- `file`: The actual file object.
- `userId`: The ID of the owner of this document.
**Expected Response:** JSON with `success` flag and `document` object containing `_id`, `name`, `createdAt`, `hasUserSeen`, etc.

## 2. Delete Document
**Endpoint:** `DELETE /document/delete/:docId`
**Description:** Permanently deletes a specific document by its ID. Typically reserved for Admin users.
**Headers:** Requires Authentication Token/Cookie
**URL Parameters:** `docId` - The MongoDB ObjectId of the document.
**Request Body:** *None*

## 3. View Document
**Endpoint:** `GET /document/view/:docId`
**Description:** Fetches the document content as a binary stream (Blob) so it can be viewed safely in the browser.
**Headers:** Requires Authentication Token/Cookie
**URL Parameters:** `docId` - The MongoDB ObjectId of the document.
**Expected Response:** A valid binary Blob response. (Status 200). Returns 403 or error json if access is denied.

## 4. Get User Documents
**Endpoint:** `GET /document/user/:userId`
**Description:** Returns a list of all documents belonging to a particular user.
**Headers:** Requires Authentication Token/Cookie
**URL Parameters:** `userId` - The MongoDB ObjectId of the target user.
**Expected Response:** JSON containing a `documents` array with objects including keys like `_id`, `name`, `createdAt`, `size`, `hasUserSeen`, etc.
