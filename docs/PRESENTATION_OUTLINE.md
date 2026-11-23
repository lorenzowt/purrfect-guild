# Purrfect Guild — Final Presentation Outline

Use this outline to explain the project to a course instructor. It is a speaking plan, not a generated slide deck.

## 1. Project concept

- **Talking points:** Cozy pixel-art resource-management RPG; players manage feline adventurers, not a generic CRUD dashboard; Laravel remains the gameplay authority.
- **Show:** Welcome screen, Guild Hall, and a hero portrait.

## 2. Original requirements and planning

- **Talking points:** Started from an existing Laravel REST API and `openapi.yaml`; wrote Project Brief, Design System, User Flows, and Architecture before implementation; worked in independently reviewable phases.
- **Show:** `docs/PROJECT_BRIEF.md.md`, `docs/DESIGN_SYSTEM.md.md`, and `openapi.yaml`.

## 3. React and TypeScript architecture

- **Talking points:** Feature-based folders; shared UI components; router layouts/guards; TypeScript types generated from OpenAPI rather than handwritten duplicate models.
- **Show:** `src/` tree, `src/app/router/AppRouter.tsx`, `src/features/heroes/heroesApi.ts`, and `src/types/api.generated.ts`.

## 4. Laravel API integration

- **Talking points:** Axios client has configurable URL and in-memory bearer token; TanStack Query owns server-state caching; Laravel validates, authorizes, paginates, and calculates outcomes.
- **Show:** `src/lib/api/client.ts`, `src/features/missions/missionsApi.ts`, and `openapi.yaml` mission paths.

## 5. Gameplay demonstration

- **Talking points:** Recruit hero → inspect quest → select 1–4 available heroes → create mission → open journal → complete/cancel based on Laravel response.
- **Show:** Hero Roster, Quest Board, Party Builder, Mission Journal, and outcome UI.

## 6. Guild Master's Office

- **Talking points:** Administrator is a separate experience, not a player with extra menu items; admin route/layout detail pages remain administrative; Laravel still authorizes operations.
- **Show:** Admin login redirect, Office overview, user/quest/hero/mission listing, hero detail action dialog.

## 7. How AI was used

- **Talking points:** AI worked from constrained specifications and contract; features were requested in phases; generated code was reviewed, tested, and corrected instead of accepted blindly.
- **Show:** `docs/AI_DEVELOPMENT_LOG.md.md` and a representative commit/PR diff.

## 8. Developer interventions and corrections

- **Talking points:** Hero modal closed after success; quest difficulty alignment corrected; mission status/navigation refined; server-side newest-first ordering adopted; `hero_class` used for portraits rather than exposed everywhere; admin separated from player routes; Mission Journal layout measured before refinement.
- **Show:** Relevant AI log sections and before/after screenshots or commits.

## 9. Automated and manual testing

- **Talking points:** Vitest + RTL for behavior; MSW for controlled HTTP; Playwright for browser journeys; mocked tests are not live Laravel proof.
- **Show:** `tests/`, `tests/mocks/`, `e2e/application-flow.spec.ts`, package scripts, and terminal output from checks.

## 10. Challenges and lessons learned

- **Talking points:** API contract changes should be corrected at the right layer; frontend authorization is UX, not security; visual layout requires inspecting computed dimensions; test infrastructure itself needs verification.
- **Show:** Mission Journal case study and test-runner configuration.

## 11. Final outcome and future improvements

- **Talking points:** Full player/admin workflows, responsive UI, typed API boundary, tests, documentation. Be honest about token refresh limitation, mocked browser workflows, bundle warning, and missing screenshots/sound assets.
- **Show:** README limitations section and final project overview.
