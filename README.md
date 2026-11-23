# Purrfect Guild

Purrfect Guild is a cozy pixel-art guild-management RPG frontend. Players recruit feline adventurers, choose quests, assemble parties, and review Laravel-confirmed mission outcomes. The application is a React + TypeScript single-page application that consumes a separate Laravel REST API.

## Project goals

- Build a responsive, accessible frontend around an existing Laravel API and OpenAPI contract.
- Keep gameplay calculations, validation, persistence, and authorization in Laravel.
- Demonstrate a feature-based React architecture with typed API boundaries and tested user flows.
- Document an AI-assisted development process in which generated work was reviewed and refined by the developer.

## Features

### Player experience

- Registration, login, logout, and an in-memory Laravel Passport session.
- A Guild Hall with accessible tavern shortcuts and API-backed overview panels.
- First-login onboarding with the retired tavern keeper, plus replay from the profile.
- Collectible Hero Roster, deterministic local portraits, hero details, recruitment, editing, healing, and deactivation where Laravel permits them.
- Quest Board, quest inspection, Party Builder, and documented 1–4 hero mission creation.
- Mission Journal with server-side newest-first pagination, mission details, completion/cancellation, and backend-confirmed outcomes.
- Profile editing and frontend-only sound/reduced-motion preferences.

### Guild Master's Office

Administrators have an exclusive administrative experience: after login they enter the Guild Master's Office rather than player gameplay screens. The office provides documented, Laravel-authorized management views for users, quests, heroes, and missions. Player and administrator navigation/layouts remain separate; frontend checks guide navigation while Laravel enforces every protected operation.

## Technology

| Tool | Responsibility |
| --- | --- |
| React 19 + TypeScript | Component UI and static checks |
| Vite | Development server and production build |
| React Router | Client-side routes, nested layouts, and route guards |
| Axios | Shared HTTP client and bearer-token request handling |
| TanStack Query | Server-state cache, loading/error state, mutations, and invalidation |
| OpenAPI TypeScript | Generated API types from `openapi.yaml` |
| Tailwind CSS + CSS | Tokens, utilities, responsive layouts, and pixel-art styling |
| Motion | Subtle UI and outcome animation |
| Vitest + RTL + MSW | Component/integration tests with controlled HTTP responses |
| Playwright | Critical browser workflow tests |

## Architecture

The source is organized by feature. Pages, request functions, hooks, and feature-specific presentation stay together under `src/features/`; reusable visual primitives live in `src/components/ui/`; global composition is under `src/app/`; the Axios client is under `src/lib/api/`; generated contract types are under `src/types/`.

```text
src/
├── app/                 # app providers, router, layouts, guards
├── components/ui/       # Button, Dialog, FormControls, feedback primitives
├── features/            # auth, guild, heroes, quests, missions, profile, onboarding, admin
├── lib/api/             # shared Axios client
├── assets/portraits/    # class-organized local pixel portraits
├── styles/              # Tailwind theme tokens and custom CSS
└── types/               # OpenAPI-generated types
```

See [Architecture](docs/ARCHITECTURE.md.md), [User Flows](docs/USER_FLOWS.md.md), and the [API contract](openapi.yaml) for details.

## Laravel API and authentication

The frontend expects the Laravel API base URL in `VITE_API_BASE_URL`. Its default development value is `http://127.0.0.1:8000/api`.

After `POST /login`, the Passport access token remains in module memory only. The shared Axios client attaches it as `Authorization: Bearer …`; the app then requests `GET /users/me` to obtain the authenticated role. A browser refresh requires login again by design. A 401 clears the frontend session; a 403 preserves the session and surfaces access denial.

`openapi.yaml` is the API source of truth. Generate types after an API-contract change:

```bash
npm run generate:api
```

## Installation

### Prerequisites

- Node.js compatible with the checked-in dependency lockfile.
- npm.
- A separately running Laravel API when performing live integration checks.

### Setup

```bash
git clone https://github.com/lorenzowt/purrfect-guild.git
cd purrfect-guild
npm install
cp .env.example .env
```

Set the API URL in `.env` when it differs from the default:

```dotenv
# Do not include a trailing slash.
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Start the development server:

```bash
npm run dev
```

Create and preview a production build:

```bash
npm run build
npm run preview
```

## Testing and quality checks

```bash
npm test -- --run
npm run typecheck
npm run build
npm run test:e2e
```

Vitest/React Testing Library/MSW tests use controlled API responses. Playwright tests run browser workflows against intercepted HTTP responses, so they do not modify a live Laravel development database. Live Laravel verification remains a separate manual step and requires a reachable API plus suitable test accounts/data.

## Screenshots

Screenshots are intentionally not embedded yet; none are fabricated in this repository. Capture and add these before final GitHub presentation:

1. Guild Hall on desktop, showing interactive locations and overview.
2. Hero Roster with local portraits and recruitment feedback.
3. Quest Board and Party Builder.
4. Mission Journal and a mission-outcome screen.
5. Mobile bottom navigation at a narrow viewport.
6. Guild Master's Office overview and an administrative listing/detail page.

Store only screenshots you own and update this section with their repository paths and alt text.

## Known limitations and future improvements

- Passport tokens are intentionally memory-only, so refresh ends the frontend session.
- Automated browser tests use controlled API responses; final live Laravel verification depends on local backend availability.
- The production build currently reports a bundle-size warning; route-level code splitting is a possible future optimization after measurement.
- Optional sound preferences exist, but no local sound-effect assets are integrated.
- Further accessibility auditing, richer animations, and future backend-supported gameplay systems remain possible improvements.

## AI-assisted development

AI was used to propose and implement scoped phases based on written specifications and `openapi.yaml`. The developer retained review responsibility, split work into feature branches, requested tests, and corrected generated output when it conflicted with intended behavior or presentation. Examples include closing the hero recruitment modal after success, centering quest difficulty, keeping new API fields out of unnecessary UI, refining Mission Journal behavior/layout, and separating the administrator experience from player gameplay.

The complete record and reflections are in [AI Development Log](docs/AI_DEVELOPMENT_LOG.md.md). For a course presentation, see [Presentation Outline](docs/PRESENTATION_OUTLINE.md).

## License

This project currently uses the `ISC` license declared in `package.json`.
