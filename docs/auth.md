# Authentication — Admin & User

## Overview
This document describes the current authentication endpoints, expected request/response shapes, and security notes for both admin and user flows.

> Important: The codebase currently enforces that the client supplies a bcrypt hash for passwords (string starting with `$2`). This design makes the submitted hash the effective credential — review the Security Recommendations section before adopting this in production.

---

## Admin endpoints

### Register admin
- Method: POST
- Path: `/api/auth/admin/register`
- Auth: Requires a valid `superAdmin` token in `Authorization: Bearer <token>` (route protected)
- Body (JSON):
  - `name` (string)
  - `email` (string)
  - `phone` (string, optional)
  - `password` (string) — must be a bcrypt hash (must start with `$2`)
  - `role` (string) — e.g., `admin`, `superAdmin`

Example request body:

```json
{
  "name": "Alice Admin",
  "email": "alice@example.com",
  "phone": "+1234567890",
  "password": "$2a$10$...bcrypt-hash...",
  "role": "admin"
}
```

Success response: 201
```json
{ "message": "Admin registered successfully" }
```

Errors you'll see:
- 400: Missing/invalid fields (e.g., password not a bcrypt hash)
- 400: Email already exists
- 401/403: Missing or insufficient privileges (if not called by a `superAdmin`)

---

### Admin login
- Method: POST
- Path: `/api/auth/admin/login`
- Body (JSON): `{ "email": "...", "password": "<bcrypt-hash>" }`
- Behavior: Both the provided password and the stored password must be bcrypt hashes. Legacy accounts stored with plaintext are rejected and must be migrated/reset.

Success response (200):
```json
{
  "message": "Login successful",
  "token": "<jwt>",
  "admin": { "id": "...", "name": "Alice Admin", "email": "alice@example.com", "role": "admin" }
}
```

Common errors:
- 400: `email and bcrypt-hashed password are required`
- 400: `Admin Not Found`
- 400: `Account uses legacy plaintext password; please re-register or contact support`
- 400: `Invalid credentials`

---

### Helper (development only)
- POST `/api/auth/hash-password` accepts `{ "password": "plaintext" }` and returns `{ "hash": "<bcrypt-hash>" }`.
- WARNING: This endpoint should be disabled or protected in production. It exists only to help clients generate bcrypt hashes during development.

---

## User endpoints

### Signup (create user)
- Method: POST
- Path: `/api/users` (public signup)
- Body (JSON): `{ "name": "...", "email": "...", "password": "<bcrypt-hash>" }`
- Behavior: The endpoint expects the password to already be a bcrypt hash. If an account exists with a bcrypt password, signup returns 409. Accounts that have a legacy plaintext password are rejected and require migration.

Success response (201):
```json
{
  "message": "Signup successful",
  "token": "<jwt>",
  "user": { "id": "...", "name": "...", "email": "...", "role": "user" }
}
```

Errors:
- 400: `name, email and bcrypt-hashed password are required`
- 409: `Email already registered`
- 400: `Existing account uses legacy plaintext password; please re-register or contact support`

---

### Signin (user login)
- Method: POST
- Path: `/api/auth/user/signin`
- Body (JSON): `{ "email": "...", "password": "<bcrypt-hash>" }`
- Behavior: Both provided and stored passwords must be bcrypt hashes. The backend compares the submitted hash to the stored hash by equality.

Success response (200):
```json
{
  "message": "Login successful",
  "token": "<jwt>",
  "user": { "id": "...", "name": "...", "email": "...", "role": "user" }
}
```

Errors:
- 400: `email and bcrypt-hashed password are required`
- 400: `User not found`
- 400: `Account uses legacy plaintext password; please re-register or contact support`
- 400: `Invalid credentials`

---

## Security notes & recommendations

1. TLS is mandatory: Always run the API behind HTTPS (TLS) to protect credentials in transit.

2. Client-side bcrypt caveat: If the client sends a bcrypt hash as the password, that hash acts as the effective password. Anyone who captures the hash (e.g., by replaying it) can authenticate. Client-side hashing without a proper challenge/response protocol (SRP/OPAQUE) is not a substitute for server-side authentication.

3. Recommended approach (safer):
   - Accept plaintext passwords over HTTPS from clients.
   - Perform slow, adaptive hashing (bcrypt/argon2) on the server and store only the server-side hash.
   - Add rate-limiting, account lockouts, and optional MFA.

4. Migration for legacy plaintext passwords:
   - Option A: Provide a secure one-time migration endpoint (admin-only) that accepts plaintext once and stores the hashed value (must be protected and audited).
   - Option B: Force password-reset emails to users so they can set new passwords (recommended for user accounts).

5. Production hygiene:
   - Remove or protect the public `/api/auth/hash-password` helper before production.
   - Rotate any admin credentials and ensure `superAdmin` bootstrap is controlled.

---

## Frontend examples

If you keep the current API (client sends bcrypt hash): the frontend must produce a bcrypt hash before calling signup/login. You can do this in Node.js or in the browser using a bcrypt implementation, but performance and UX may suffer.

Example (Node.js dev helper):

```js
// Example: obtain bcrypt hash before calling API (dev only)
import bcrypt from 'bcryptjs';
const hash = await bcrypt.hash('MyPlainPassword1!', 10);
await fetch('/api/auth/user/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: hash })
});
```

Recommended frontend approach (preferred): send plaintext password over HTTPS and let server hash it.

---

## Admin migration checklist (suggested)
- Identify accounts with non-bcrypt stored passwords: `db.admins.find({ password: { $not: /^\$2/ } })`.
- Decide on migration strategy: password resets vs. controlled one-time migration.
- Protect any migration endpoints behind `superAdmin` and audit usage.

---

## File links
- Admin controllers: see `src/controllers/adminAuth.controller.ts`
- User controllers: see `src/controllers/userAuth.controller.ts`


