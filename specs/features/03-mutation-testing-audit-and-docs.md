# Specification: Mutation Testing, Audit Logging, API Documentation, and Project Readme

## 1. Overview
This specification elevates the Open-Forms project to an enterprise and academic standard. It introduces Stryker Mutator with a strict mutation score threshold to guarantee test suite reliability, implements file-based audit logging for LGPD (General Data Protection Law) compliance, exposes the backend architecture via Swagger (OpenAPI), stubs future E2EE and OAuth integrations with dense architectural comments, and overhauls the root documentation.

## 2. Impacted Files
- `back/package.json` & `front/package.json` (Add Stryker dependencies and mutation scripts).
- `back/stryker.conf.mjs` & `front/stryker.conf.mjs` (NEW: Stryker configuration files).
- `back/test/**/*.spec.ts` & `front/src/**/*.test.tsx` (Update/Create tests to meet mutation threshold).
- `back/src/main.ts` (Configure Swagger module).
- `back/src/common/interceptors/audit-logger.interceptor.ts` (NEW: Interceptor for logging).
- `.gitignore` (Add `/logs` directory).
- `/README.md` (Total overhaul with PT-BR and Universal English).
- `front/src/features/forms/components/FormResults.tsx` & `back/src/auth/auth.service.ts` (Add architectural TO-DO comments for E2EE and OAuth).

## 3. Acceptance Criteria (BDD)

### Scenario 1: Rigorous Mutation Testing Integration (Stryker)
- **Given** the need to ensure absolute test reliability for academic and enterprise validation;
- **When** running the command `npm run test:mutate` in either the frontend or backend directories;
- **Then** Stryker Mutator must execute, mutating the TypeScript code and running the existing test suites.
- **And** the Stryker configuration MUST enforce a strict minimum mutation score threshold of **85%**.
- **And** if the current test suite fails to meet this threshold, the agent MUST write, improve, or expand the necessary unit/integration tests to reach the 85% mark before completing the task.
- **And** the build/pipeline process MUST fail if the score falls below this threshold.

### Scenario 2: Audit Logging for LGPD Compliance
- **Given** the legal requirement (LGPD) to audit data manipulation;
- **When** any authenticated user performs a mutation action (POST, PATCH, DELETE) on the API;
- **Then** the backend must intercept the request and write an audit entry to a local file (e.g., `logs/audit.log`).
- **And** the log entry MUST contain: Timestamp, User ID (from JWT), HTTP Method, Endpoint, and the targeted Entity ID.
- **And** the `/logs` directory MUST be strictly ignored by git (`.gitignore`) to prevent data leaks.

### Scenario 3: OpenAPI / Swagger Documentation
- **Given** the need for API transparency and abstraction;
- **When** the NestJS backend is running in development mode;
- **Then** accessing `/api/docs` must render the Swagger UI.
- **And** all controllers and DTOs must be decorated with `@ApiTags()`, `@ApiOperation()`, and `@ApiProperty()` to provide a clear, typed contract of the API endpoints.

### Scenario 4: Architectural TO-DOs (E2EE and OAuth)
- **Given** the future roadmap for End-to-End Encryption (E2EE) and SSO/OAuth;
- **When** inspecting the authentication and form viewing modules;
- **Then** the agent must leave robust, TSDoc-formatted `TODO` comments.
- **And** the E2EE comment must explain the architectural logic: how public keys will be distributed, how offline-first compatibility will be maintained, and how LGPD is enforced by ensuring only authenticated admins can decrypt the payload on the frontend.
- **And** the OAuth comment must outline the Strategy Pattern implementation for Google SSO and LDAP.

### Scenario 5: Root README.md Overhaul
- **Given** the project is an academic thesis output from Univesp;
- **When** viewing the root `README.md`;
- **Then** the document MUST have two main sections: first in Brazilian Portuguese (PT-BR), followed by Universal English (EN).
- **And** it must explicitly state that this is an academic project from Univesp.
- **And** it must explicitly include a disclaimer that the project was developed **with the support of Artificial Intelligence**.
- **And** it must contain clear, step-by-step instructions on how to spin up the project in both Development (using `docker-compose.dev.yml`) and Production (using `docker-compose.prod.yml`) environments.

## 4. Edge Cases
- **Logging I/O Blocking:** The audit logger must write to the file system asynchronously (e.g., using streams or a dedicated logging library like Winston) so it does not block the main Node.js event loop during high traffic.
- **Stryker Timeouts & Resource Management:** Mutation testing is heavily CPU-intensive. The agent must configure Stryker concurrency appropriately in `stryker.conf.mjs` to prevent memory crashes inside the Docker containers or local LXC environment.

## 5. Autonomous Verification Strategy
- The agent must successfully start the backend and verify that the `/api/docs` endpoint returns the Swagger UI.
- The agent must trigger a mock POST request and verify that a new line is correctly appended to `logs/audit.log`.
- The agent must run `npm run test:mutate` in both directories to ensure Stryker is properly initialized, and crucially, that the resulting score is **>= 85%**.