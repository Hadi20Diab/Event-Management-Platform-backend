# Admin Routes Documentation

## Overview

The Admin API allows admin users to manage other admin accounts. It supports creating, retrieving, updating, and deleting admins. All endpoints are **protected** and require a valid JWT token.

---

## Routes

### 1. Create a New Admin

**Endpoint:** `POST /api/admins`  

**Description:** Create a new admin account. Only accessible to admin users with proper authorization.  

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "role": "admin" // or "superAdmin"
}

