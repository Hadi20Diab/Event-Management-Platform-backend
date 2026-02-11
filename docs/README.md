# Event Management Platform API Documentation

Welcome to the Event Management Platform API documentation. This documentation provides detailed information about all available API endpoints for managing events, users, registrations, and administrative functions.

## Documentation Structure

- [Registration Routes](./registration.md) - Documentation for user registration endpoints
- [Event Routes](./event.md) - Documentation for event management endpoints
- [User Routes](./user.md) - Documentation for user management endpoints
- [Admin Routes](./admin.md) - Documentation for administrative functions

## Getting Started

### Base URL
```
http://localhost:3000/api
```

### Common Response Formats

#### Success Response
```json
{
  "data": { /* response data */ },
  "message": "Success message"
}
```

#### Error Response
```json
{
  "message": "Error description"
}
```

### Authentication
Most endpoints require authentication. Include an authorization header with your requests:
```
Authorization: Bearer <your_token>
```

## General Guidelines

- All dates are in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
- IDs are MongoDB ObjectIds
- Use appropriate HTTP methods (GET, POST, PUT, DELETE)
- Follow RESTful conventions
