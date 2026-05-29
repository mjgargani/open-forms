# Specification: Authentication, RBAC, and Advanced Form Builder UX

## 1. Overview
Re-implement and reinforce the authentication layer (JWT) with strict Role-Based Access Control (RBAC), ensuring data isolation between teachers. Additionally, this specification fixes key user experience (UX) gaps in the Form Builder and Business Intelligence (BI) dashboard, such as atomic question reordering, explicit form publishing lifecycles, public route protection, and cache synchronization.

## 2. Impacted Files
- `/back/prisma/schema.prisma` (Restore User model, link Form to User, add 'order' to Question)
- `/back/src/auth/*` & `/back/src/users/*` (Re-implement secure JWT Auth and User Management)
- `/back/src/forms/*` (Enforce multi-tenancy check: non-admins can only see/mutate their own forms)
- `/front/src/features/form-builder/*` (Implement Question reordering logic and Publish Toggle)
- `/front/src/features/forms/components/FormResults.tsx` (Relocate QR Code and fix cache refresh)
- `/front/src/routes/*` (Re-introduce authentication route guards and protect public execution view)

## 3. Acceptance Criteria (BDD)

### Scenario 1: RBAC and Form Isolation (Multi-Tenancy)
- **Given** an authenticated user with `ROLE = USER` (Teacher);
- **When** they access the application dashboard or try to hit the backend endpoints;
- **Then** they MUST NOT have access to user management features or routes (e.g., `/admin` or `/users` endpoints must throw a `403 Forbidden`).
- **And** they MUST only be allowed to list, view, update, or delete Forms where `userId` matches their own token sub identifier.
- **And** an user with `ROLE = ADMIN` must bypass this check, maintaining global view and administration rights over all users and forms.

### Scenario 2: Atomic Question Reordering
- **Given** a form with multiple questions in the Form Builder edit view;
- **When** the teacher drags the question block using the grip handle (`lucide-grip-vertical`);
- **Then** the frontend must immediately update the local state sequence using TanStack Query optimistic UI guidelines.
- **And** when saving the changes, the payload must send the entire array of questions reflecting the updated `order` field integer (on the `Question` model).
- **And** the backend must handle this array inside the atomic Prisma update transaction (*Nested Writes*), re-writing the order of questions in a single operation.

### Scenario 3: Form Publishing Lifecycle & Public Protection
- **Given** a new form created in the system;
- **Then** its default state for `published` must be `false`.
- **And** a publishing toggle button (labeled "Publicar" / "Despublicar") accompanied by an visual eye icon must be rendered inside the Form Builder's title card component.
- **When** a user attempts to access the public exam executor route (`/view/$formId`) for a form with `published: false`;
- **Then** both the frontend router (TanStack Router) and the backend API must block execution, returning a `404 Not Found` error.

### Scenario 4: Public Share Hub (QR Code Utilities)
- **Given** the requirement to distribute forms in a physical classroom;
- **When** the teacher opens the "Visualização" (Preview) tab inside the Form Maestro component;
- **Then** the QR Code component (powered by `qrcode.react`) must be rendered inside a dedicated "Public Share Hub" card rather than the analytics/responses tab.
- **And** the hub must provide three active buttons:
  - **Compartilhar (Share)**: Triggers the native browser Web Share API to copy the public URL (`/view/$formId`).
  - **Imprimir (Print)**: Launches the browser print window optimized via CSS to print only the QR Code and the Form Title on a clean sheet.
  - **Salvar QRCode (Save QR Code)**: Downloads the QR Code directly as a clean `.png` file.

### Scenario 5: BI Dashboard Sync & Cache Invalidation
- **Given** a teacher viewing the "Respostas" analytics tab for a specific form;
- **When** a student submits a new exam response via the `ExamExecutor`;
- **Then** the database submission count must increment.
- **And** the frontend must ensure that any mutation or action invalidates the specific query cache keys (`['forms', formId]`, `['forms', formId, 'stats']`), causing the charts (`recharts`) and totals to re-fetch and render the real-time values instantly.

## 4. Edge Cases
- **Form Disabling While Student is Submitting**: If a form is unpublished while a student is actively filling it out offline, the backend must reject the submission when synchronization is attempted, returning an explicit validation message instead of generic crashes.
- **Overlapping Orders**: If two questions end up with the same `order` integer due to client-side synchronization delays, the system should resolve the sorting gracefully fallbacking to `createdAt` secondary ordering.

## 5. Autonomous Verification Strategy
- The agent must create unit/integration tests verifying that an user with `ROLE = USER` receives a `403` when calling user administration endpoints.
- The agent must implement a specific test to assert that pulling a form via `/view/$formId` when `published = false` results in a `404`.
- The agent must verify that cache invalidation triggers correctly upon simulated database insertions, making sure the statistics update accordingly.