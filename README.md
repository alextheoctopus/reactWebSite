# Shared Board App

Stack:
- frontend: React + JS
- backend: Java (Spring Boot)
- database: PostgreSQL

## Run Postgres

```bash
docker compose up -d postgres
```

## Run backend (`server`)

Requirements:
- Java 21+
- Maven 3.9+

Environment variables (example in `server/.env.example`):
- `DB_URL`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`
- `SERVER_PORT`

Run:

```bash
cd server
mvn spring-boot:run
```

Backend endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/board`
- `PUT /api/board`

## Run frontend (`client`)

```bash
cd client
npm install
npm start
```

Default API URL is in `client/.env`:
- `REACT_APP_API_URL=http://localhost:8080`

## Tests

Backend (unit + integration with Testcontainers):

```bash
cd server
mvn clean test
```

Frontend:

```bash
cd client
npm test -- --watchAll=false
```

## Smoke-check scenario

1. Start Postgres, backend, and frontend.
2. Open app and register a new user.
3. Verify successful redirect to `/board`.
4. Refresh page and verify user session is restored.
5. Update board text and click `Save`.
6. Verify updated text and `Last author` are shown.
7. Logout and verify protected route redirects to login.
