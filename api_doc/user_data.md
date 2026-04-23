# User Financial & Data API

This document details all APIs used to fetch non-auth related user data such as investment reports, financial summaries, entities, and services.

## Base URL
All API calls are prefixed with your backend's base URL, e.g., ``/api/v1``

---

## 1. Get Financial Summary
**Endpoint:** `GET /user/financial-summary/:userId`
**Description:** Fetches the top-level financial summary (Net Worth, Monthly Return, Cash Balance, etc.) for a user.
**Headers:** Requires Authentication Token/Cookie
**URL Parameters:** `userId` - The MongoDB ObjectId of the user.
**Expected Response:** JSON with `success` and `summary` data.

## 2. Get Entities
**Endpoint:** `GET /user/entities/:userId`
**Description:** Returns the business properties, trusts, companies, etc., associated with the user.
**Headers:** Requires Authentication Token/Cookie
**URL Parameters:** `userId` - The MongoDB ObjectId of the user.

## 3. Get Services/Status
**Endpoint:** `GET /user/services/:userId`
**Description:** Returns status of services linked to a user account, mapping out current relationships or operational statuses.
**Headers:** Requires Authentication Token/Cookie
**URL Parameters:** `userId` - The MongoDB ObjectId of the user.

## 4. Get Investment Reports
**Endpoint:** `GET /user/investment-reports/:userId`
**Description:** Returns an array of investment performance data by month, e.g., Jan, Feb, Mar, along with return percentages.
**Headers:** Requires Authentication Token/Cookie
**URL Parameters:** `userId` - The MongoDB ObjectId of the user.
**Expected Response:** JSON with `success` and `reports` (array).

## 5. Update/Create Investment Reports (Admin)
**Endpoint:** `POST /user/investment-reports/:userId`
**Description:** Updates a specific month's investment report data for the user.
**Headers:** Requires Authentication Token/Cookie (Admin Role)
**URL Parameters:** `userId` - The MongoDB ObjectId of the user.
**Request Body:**
```json
{
  "month": "Jan",
  "monthlyReturn": 1.2
}
```
