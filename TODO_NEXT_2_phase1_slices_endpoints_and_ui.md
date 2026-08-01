## TODO_NEXT_2 — Phase 1 slice skeleton plumbing (API endpoints + Web UI)

### Steps
1. Backend: add API endpoint stubs
   - [x] `POST /ai/wellness-assessment`
   - [x] `POST /ai/workout-generator`
   - [x] `POST /ai/wellness-companion/chat`
2. Backend: wire controllers into Nest `AppModule`.
   - [x] `AiController` registered in `apps/api/src/app.module.ts`
3. Shared: add request/response TypeScript contracts in `packages/shared/src/index.ts`.
   - [x] Contracts exist for all 3 endpoints
4. Frontend: add minimal UI pages that call the endpoints
   - [x] wellness assessment
   - [x] workout generator
   - [x] wellness companion chat
5. Validation: run both apps and smoke test endpoints (health + 3 POST endpoints).
   - [x] Smoke test with dev servers + curl


### Additional follow-up
6. Frontend navigation
   - [x] Home page links to all 3 AI experiences

