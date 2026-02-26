# Shared Board App

![CI](https://github.com/alextheoctopus/reactWebSite/actions/workflows/ci.yml/badge.svg)

Stack:
- frontend: React + JS
- backend: Java (Spring Boot)
- database: PostgreSQL

## Containerized Run (recommended)

1. Create local env file:
```bash
cp .env.example .env
```
2. Start all services:
```bash
docker compose up --build -d
```
3. Open app:
- frontend: `http://localhost:${CLIENT_PUBLISHED_PORT:-3000}`
- backend: `http://localhost:${SERVER_PUBLISHED_PORT:-8080}`
- postgres: `localhost:5432`

Stop all services:
```bash
docker compose down
```

Stop and remove database data:
```bash
docker compose down -v
```

If host ports are busy, override them in `.env`:
- `SERVER_PUBLISHED_PORT=18080`
- `CLIENT_PUBLISHED_PORT=13000`

## Docker Services

- `postgres`: PostgreSQL 16 with persistent volume `postgres_data`
- `server`: Spring Boot backend (`server/Dockerfile`)
- `client`: React static build served by Nginx (`client/Dockerfile`)

Nginx proxies `/api/*` to backend container (`http://server:8080`), so the frontend can use relative API URLs.

## Local Run (without Docker)

### Backend (`server`)

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

### Frontend (`client`)

```bash
cd client
npm install
npm start
```

If running locally without Nginx proxy, set in `client/.env`:
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

## Smoke-check Scenario

1. Start containers with `docker compose up --build -d`.
2. Register a new user in UI.
3. Verify redirect to `/board`.
4. Refresh the page and verify user session is restored.
5. Update board text and click `Save`.
6. Verify updated text and `Last author`.
7. Logout and verify redirect to `/login`.
