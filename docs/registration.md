# Registration Routes Documentation

## Overview

The registration API allows users to register for events, view their registrations, and cancel registrations. The API supports filtering, sorting, and pagination for listing user registrations.

## Routes

### 1. Register for an Event

**Endpoint:** `POST /api/registrations`

**Description:** Allows a user to register for a specific event.

**Request Body:**
```json
{
  "userId": "string",
  "eventId": "string"
}
```

**Response:**
- Success (201): Returns the created registration object
- Error (400): Missing userId or eventId
- Error (404): User or event not found
- Error (409): User already registered for this event

**Example:**
```bash
curl -X POST http://localhost:3000/api/registrations -H "Content-Type: application/json" -d '{"userId": "60c72b2f9b1d8e001f8e4cde", "eventId": "60c72b2f9b1d8e001f8e4cdf"}'
```

### 2. Get User Registrations (with Filtering, Sorting & Pagination)

**Endpoint:** `GET /api/registrations/user/:id`

**Description:** Retrieves all registrations for a specific user with support for filtering, sorting, and pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `sort` (optional): Field to sort by (default: 'createdAt')
- `order` (optional): Sort order ('asc' or 'desc', default: 'asc')
- `status` (optional): Filter by status field

**Response:**
```json
{
  "data": [
    // Array of registration objects
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Examples:**
```bash
# Basic pagination
curl "http://localhost:3000/api/registrations/user/60c72b2f9b1d8e001f8e4cde?page=1&limit=10"

# With sorting
curl "http://localhost:3000/api/registrations/user/60c72b2f9b1d8e001f8e4cde?sort=createdAt&order=desc"

# With filtering
curl "http://localhost:3000/api/registrations/user/60c72b2f9b1d8e001f8e4cde?status=confirmed"

# Combined parameters
curl "http://localhost:3000/api/registrations/user/60c72b2f9b1d8e001f8e4cde?page=2&limit=5&sort=createdAt&order=desc&status=confirmed"
```

### 3. Get Registration by ID

**Endpoint:** `GET /api/registrations/:id`

**Description:** Retrieves a specific registration by its ID.

**Response:**
- Success (200): Returns the registration object
- Error (400): Invalid registration ID
- Error (404): Registration not found

**Example:**
```bash
curl "http://localhost:3000/api/registrations/60c72b2f9b1d8e001f8e4cdf"
```

### 4. Cancel Registration

**Endpoint:** `DELETE /api/registrations/:id`

**Description:** Cancels/removes a specific registration.

**Response:**
- Success (200): Returns success message
- Error (400): Invalid registration ID
- Error (404): Registration not found

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/registrations/60c72b2f9b1d8e001f8e4cdf
```

## Data Models

### Registration Model
```typescript
{
  _id: ObjectId,
  user: ObjectId, // Reference to User model
  event: ObjectId, // Reference to Event model
  status: String, // e.g., 'pending', 'confirmed', 'cancelled'
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

All endpoints return appropriate HTTP status codes and error messages:

- 400: Bad Request (invalid input)
- 404: Not Found (resource not found)
- 409: Conflict (e.g., duplicate registration)
- 500: Internal Server Error

## Security Considerations

- All endpoints should be protected with authentication middleware
- Users should only be able to view/cancel their own registrations
- Admin users may need access to all registrations
