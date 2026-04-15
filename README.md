# Book My Ticket - Backend (Auth + Protected Booking)

Extended starter code with:
- User register/login (JWT auth)
- Protected seat booking (/seats/:id) for logged-in users only
- Prevents duplicate bookings per user
- User-seat association via user_id
- Mock 20 seats (extend for movies)

## Quick Start
1. `cp .env.example .env` (set JWT_SECRET, match docker DB creds)
2. `npm install`
3. `docker-compose up -d`
4. `node migration.js`
5. `node index.mjs`

## Test Flow
```bash
# 1. Register
curl -X POST http://localhost:8080/auth/register -H "Content-Type: application/json" -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}'

# 2. Login (copy TOKEN)
curl -X POST http://localhost:8080/auth/login -H "Content-Type: application/json" -d '{\"email\":\"test@example.com\",\"password\":\"password123\"}'

# 3. List seats
curl http://localhost:8080/seats

# 4. Book seat (use TOKEN)
curl -X PUT http://localhost:8080/seats/1 -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 5. Try duplicate → 400 error
curl -X PUT http://localhost:8080/seats/1 -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Architecture
- Express ESM
- pg Pool (modular)
- Joi validation + DTOs
- Auth middleware (JWT verify)
- Transactional booking (FOR UPDATE)

Repo ready for GitHub push/PR.

