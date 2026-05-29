# GLOBAL ENGINEERING GUIDELINES & AGENT CONSTITUTION (AGENTS.md)

**TARGET AUDIENCE:** Autonomous Coding Agents (e.g., Google Jules, Devin) and Human Engineers.
**DIRECTIVE:** You MUST read, understand, and strictly adhere to this document BEFORE executing any local specification (`/specs/**/*.md`). These are the inviolable laws of the Open-Forms repository.

## 1. Project Vision and Domain
Open-Forms is an **offline-first** web platform for educational assessments in rural areas with zero or intermittent internet connectivity. The system guarantees school technological sovereignty, running on local hardware (Proxmox/LXC), completely independent of proprietary cloud services (combating *Vendor Lock-in*).

## 2. Core Technology Stack & Runtimes
- **Frontend:** React.js 19 (Vite), TailwindCSS v4, TanStack Query v5 (offline persistence via `idb-keyval`), TanStack Router, `react-hook-form`.
- **Backend:** NestJS v11, PostgreSQL v16, Prisma ORM v7.
- **Language:** TypeScript (Strict Mode: ON).

## 3. Inviolable Architectural Paradigms
- **Offline-First & Optimistic UI:** The application MUST NEVER block navigation waiting for a network response. However, it must eagerly consume the API whenever the local network infrastructure is reachable.
  - **Client-Side ID Generation:** The frontend is the single source of truth for IDs (using `uuidv4`). NEVER wait for the database to generate an ID.
  - **ID Sanitization:** The backend MUST strictly validate and sanitize all client-generated IDs (e.g., via `@IsUUID('4')` in DTOs) to prevent injection attacks.
  - **Mutation Queues:** Use `onMutate` for instant cache updates and queue requests in the background for eventual synchronization.
- **Feature-Sliced Design (FSD):** Frontend code MUST be strictly isolated by domain boundaries (e.g., `/src/features/form-builder`, `/src/features/exam-executor`).
- **Domain-Driven Design (DDD) & Nested Writes:** Child entities (Questions, Options, Answers) DO NOT have independent controllers. Saving an exam or submission MUST be **Atomic**. Process the entire tree via Prisma *Nested Writes* (upsert/delete/create) in a single transaction.
- **Anti-Cheat (Design by Subtraction):** The backend MUST NEVER expose the correct answer (`correct: true` or similar flags) in the payload consumed by the student (`ExamExecutor`). The frontend UI must infer the input types dynamically.

## 4. Engineering Culture & Code Quality
- **KISS & DRY:** Avoid premature abstractions or logic duplication. Favor pure utility functions and "Smart/Dumb" component segregation.
- **Clean Code:** Functions must have a single responsibility, semantic naming (verbs for functions, nouns for interfaces), and a strict limit of 30-40 lines per function.
- **Universal English & Serious Tone:** ALL comments, documentation, and console logs (`console.log`, `warn`, `error`) MUST be written in English. Maintain a highly professional tone. **PROHIBITED:** The use of emojis in source code, logs, or comments.
- **Didactic TSDoc:** As this project is the basis for a Scientific Paper/Monograph, ALL complex functions, custom hooks, and backend services MUST be documented using the TSDoc standard. Explain the *WHY* (business rule/architectural decision), not just the *WHAT*.

## 5. Quality Assurance & Testing Pyramid
- **Backend:** Unit tests (Jest) for Services and E2E tests for main Controllers. Focus heavily on testing the atomic behavior of Prisma transactions and Cybersecurity edge cases (e.g., malformed UUIDs, injection attempts).
- **Database Seeding (`seed.ts`):** The Prisma seed is an active testing mechanism. Whenever the `schema.prisma` is updated, the seed scripts MUST be updated and executed to validate database communication and structural integrity.
- **Frontend:** Component testing via Vitest + Testing Library.

## 6. Strict Prohibitions (Guardrails)
- **[PROHIBITED]** The use of the `any` keyword in TypeScript. Use `unknown` with type narrowing as a last resort, or strictly type via interfaces/types.
- **[PROHIBITED]** Adding new dependencies to `package.json` (front or back) unless EXPLICITLY authorized in the local specification (`/specs`).
- **[PROHIBITED]** Modifying this file (`AGENTS.md`) or infrastructural `.env` variables without an explicit command in the local spec.

## 7. Autonomous Execution Workflow
When assigned a local specification:
1. Parse this `AGENTS.md` and the provided `/specs/...`.
2. Formulate your execution plan.
3. Write the code complying with the Acceptance Criteria (BDD).
4. Run the mandatory test suites (including Prisma migrations/seeds if applicable).
5. Only open a Pull Request when all tests and build steps pass locally.