## TODO_NEXT_3 — Consolidate API base URL for AI pages

- [x] Create `apps/web/src/lib/api.ts` helper: `getApiBaseUrl()`
- [x] Update AI pages to use helper instead of hardcoded localhost / window var
  - [x] `/ai/workout-generator`
  - [x] `/ai/wellness-companion`
  - [x] `/ai/wellness-assessment`

- [x] Run frontend typecheck/build and backend build (commands executed)
- [x] Smoke test endpoints manually (health + 3 POST endpoints)
  - Verified with `npm run smoke:test:api`
  - The runner auto-detects the local API base URL and confirms `/health`, `/ai/wellness-assessment`, `/ai/workout-generator`, and `/ai/wellness-companion/chat`


