# TODO_NEXT_1 — Scaffold MVP + Phase 1 slices

## Plan (approved by user: "all")
1. Create project structure:
   - `apps/web` (Next.js + Tailwind)
   - `apps/api` (NestJS)
   - `packages/shared` (shared types/constants)
   - `infra/db` (Postgres migration placeholders)
2. Add workspace tooling (monorepo with `pnpm`/`npm` workspaces) so `web` and `api` can run together.
3. Frontend (MVP foundation):
   - Base layout, routing, Tailwind config
   - Auth stub pages (login/register) + route guards placeholder
4. Backend (MVP foundation):
   - NestJS app bootstrap
   - Config module, health endpoint
   - Postgres connection module (Prisma) and initial schema/migrations scaffolding
   - Auth integration stub (Firebase/local stub)
5. Phase 1 feature slices (implement minimal vertical endpoints + UI hooks):
   - AI Wellness Assessment
   - AI Workout Generator
   - AI Wellness Companion chat
   - Live sessions / recorded sessions / subscriptions / payments / instructor registration stubs (placeholders)
6. Shared foundations stubs:
   - RBAC guard skeleton
   - Analytics event stub
   - Notifications hooks stub
7. Run & validate:
   - Provide commands to start web/api
   - Smoke-test endpoints with curl/HTTP client scripts (optional)

