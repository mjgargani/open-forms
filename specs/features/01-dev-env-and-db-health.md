# Specification: Environment, Database Health, and Production Readiness

## 1. Overview
Elevate the Open-Forms infrastructure from MVP to a production-ready and academically rigorous state. This includes locking runtime versions, separating development and production environments (Environment Variables, Docker Orchestration, and Prisma Seeds), mitigating dependency vulnerabilities, and implementing robust, cyber-secure database health checks and E2E tests.

## 2. Impacted Files
- `/.env.example` (Update with pedagogical comments and include all keys, e.g., `JWT_SECRET`)
- `/docker-compose.dev.yml` (Add healthchecks, lock Node to v24.14.1)
- `/docker-compose.prod.yml` (NEW: Production orchestration)
- `/back/Dockerfile` & `/front/Dockerfile` (NEW: Multistage builds for production)
- `/back/package.json` & `/front/package.json` (Lock engines, update scripts, fix vulnerabilities)
- `/back/prisma/seed.dev.ts` & `/back/prisma/seed.prod.ts` (Split seed logic)
- `/back/src/health/*` (NEW: Health check module)
- `/back/test/cybersecurity.e2e-spec.ts` (NEW: E2E security tests)

## 3. Acceptance Criteria (BDD)

### Scenario 1: Environment Orchestration and Version Locking
- **Given** the requirement for absolute consistency across environments;
- **When** starting the containers via Docker Compose;
- **Then** the Node.js version must be strictly locked to `24.14.1` in `package.json` engines and Docker base images (`node:24.14.1-alpine`).
- **And** `docker-compose.dev.yml` must use Docker native `healthcheck` for PostgreSQL, ensuring the NestJS backend only boots when the database is ready.
- **And** a new `docker-compose.prod.yml` alongside multistage Dockerfiles must be created to serve only built/compiled assets (no source code mapping).
- **And** the project must support `.env.dev` and `.env.prod`, reflecting this explicitly in a heavily commented `.env.example` containing `JWT_SECRET` and separated contexts.

### Scenario 2: Prisma Seed Segregation
- **Given** the database requires different initial states for testing and production;
- **When** running the Prisma seed commands;
- **Then** `npm run prisma:seed` must be configurable via scripts to run either `seed.dev.ts` or `seed.prod.ts`.
- **And** `seed.dev.ts` must populate complex relationships to test atomic Nested Writes and RBAC permissions.
- **And** `seed.prod.ts` must generate only the absolute minimum for a fresh installation: one default Admin user and one generic un-themed sample form.

### Scenario 3: Secure Health Checks and Cybersecurity E2E Tests
- **Given** the need for robust API health monitoring and strict security;
- **When** accessing the new `/health` endpoint;
- **Then** it must securely report the API status and PostgreSQL connection latency without exposing sensitive database topology or credentials.
- **And** a specific E2E test suite (`cybersecurity.e2e-spec.ts`) must be created to validate data sanitization.
- **And** this suite must attempt SQL injections and invalid UUID injections on endpoints (e.g., trying to fetch or create forms with manipulated IDs), ensuring the API throws `400 Bad Request` via `class-validator` before hitting the Prisma layer.

### Scenario 4: Dependency Vulnerability Mitigation
- **Given** the presence of high-severity vulnerabilities in the MVP dependencies;
- **When** examining `package.json` in both `/front` and `/back`;
- **Then** the agent must perform safe upgrades (`npm audit fix`) to mitigate high/critical vulnerabilities without breaking existing React 19 or NestJS 11 behaviors.

## 4. Edge Cases
- **Database Boot Timeout**: If PostgreSQL takes too long to initialize, the backend container must gracefully wait and retry instead of crashing in a loop.
- **Malformed Environment Variables**: The NestJS application must fail fast on boot if required keys like `JWT_SECRET` or `DATABASE_URL` are missing or improperly formatted, using something like `@nestjs/config` validation.

## 5. Autonomous Verification Strategy
- The agent must run `npm audit` in both directories to ensure vulnerabilities are minimized.
- The agent must execute the Prisma sequence (`prisma:migrate:dev`, `prisma:generate`, `prisma:seed` using the dev seed) to guarantee database integrity.
- The agent must run the E2E test suite ensuring all security and health tests pass.
- The agent must successfully run a build (`npm run build`) for both front and back to ensure production readiness.