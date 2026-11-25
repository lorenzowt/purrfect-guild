# Purrfect Guild — Frontend Architecture

**Version:** 1.0  
**Project:** Purrfect Guild  
**Frontend:** React + TypeScript + Vite  
**Backend:** PHP / Laravel REST API  
**API Contract:** `openapi.yaml`

## 1. Architecture Overview

Purrfect Guild is a responsive single-page application (SPA) that consumes an existing Laravel REST API.

The frontend is responsible for rendering the interface, managing player interactions, displaying gameplay information, and communicating with the backend.

Laravel remains responsible for authentication, authorization, data persistence, validation, and gameplay calculations.

### Architecture Principles

- Organize code by feature.
    
- Keep components small, reusable, and focused.
    
- Separate presentation from API communication.
    
- Use the existing OpenAPI specification as the technical contract.
    
- Avoid duplicating backend business logic.
    
- Prefer existing API endpoints over unnecessary backend modifications.
    
- Prioritize readable, maintainable code over unnecessary abstractions.
    

## 2. Technology Stack

|Technology|Responsibility|
|---|---|
|React|Component-based UI|
|TypeScript|Static typing|
|Vite|Development server and production builds|
|React Router|Client-side routing|
|Axios|HTTP requests|
|TanStack Query|Server-state management|
|openapi-typescript|TypeScript types generated from OpenAPI|
|Tailwind CSS|Responsive styling|
|CSS|Custom pixel-art styles and effects|
|Motion for React|Gameplay animations|
|Vitest|Testing framework|
|React Testing Library|Component and interaction testing|
|MSW|Mock API responses for tests|
|Playwright|End-to-end browser testing|

Additional dependencies should only be introduced when they provide a clear benefit.

## 3. Repository Structure

The frontend and backend use separate Git repositories.

### Backend Repository — `guild-api`

Contains the existing Laravel API, including authentication, database models, validation, authorization, and gameplay logic.

### Frontend Repository — `purrfect-guild`

Contains the React application, visual assets, tests, and project documentation.

Both applications can be developed and deployed independently.

During local development, Laravel serves the API at `http://127.0.0.1:8000/api`, while Vite runs the frontend development server.

The API base URL must be configurable through environment variables.

Cross-origin communication will be handled through appropriate development proxy or CORS configuration.

## 4. Project Organization

The frontend follows a feature-based architecture.

```
purrfect-guild/
├── docs/
│   ├── PROJECT_BRIEF.md
│   ├── DESIGN_SYSTEM.md
│   ├── USER_FLOWS.md
│   ├── ARCHITECTURE.md
│   └── AI_DEVELOPMENT_LOG.md
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── router/
│   │   ├── providers/
│   │   └── App.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── onboarding/
│   │   ├── guild/
│   │   ├── heroes/
│   │   ├── quests/
│   │   ├── missions/
│   │   ├── profile/
│   │   └── admin/
│   │
│   ├── components/
│   │   ├── ui/
│   │   └── layout/
│   │
│   ├── lib/
│   │   └── api/
│   │
│   ├── hooks/
│   ├── assets/
│   │   ├── portraits/
│   │   ├── environments/
│   │   └── sounds/
│   │
│   ├── styles/
│   └── types/
│
├── tests/
├── openapi.yaml
└── README.md
```

### Organization Rules

**Feature directories** contain components, pages, hooks, API functions, and utilities specific to that feature.

**Shared components** contain reusable UI elements, such as buttons, dialogs, cards, form controls, and layout elements.

**The API library** contains shared Axios configuration, authentication headers, and common error handling.

**Generated types** are maintained separately from handwritten application code.

Avoid moving feature-specific logic into global directories without a clear reason.

## 5. Routing and Navigation

React Router manages navigation without requiring full page reloads.

### Route Categories

**Public routes**

- `/`
    
- `/register`
    
- `/login`
    

**Authenticated routes**

- `/guild`
    
- `/heroes`
    
- `/quests`
    
- `/missions`
    
- `/profile`
    

Additional routes support hero details, quest details, party formation, and mission details.

**Administrator routes**

- `/admin`
    
- `/admin/users`
    
- `/admin/quests`
    
- `/admin/heroes`
    
- `/admin/missions`
    

### Route Protection

Reusable route guards handle:

- Public-only pages.
    
- Authenticated pages.
    
- Administrator-only pages.
    

Unauthenticated users attempting to access protected pages are redirected to login.

Authenticated users visiting login or registration pages are normally redirected to the Guild Hall.

Administrator routes require the `admin` role.

The application must verify authentication before displaying protected content.

**Frontend route guards are not a security boundary. Laravel remains responsible for enforcing permissions.**

## 6. API Communication

Axios is used for HTTP communication with Laravel.

### Shared API Client

A centralized Axios instance handles:

- Configurable API base URL.
    
- JSON request and response handling.
    
- Bearer token authorization headers.
    
- Common error handling.
    
- Request and response interceptors when appropriate.
    

Feature-specific API functions encapsulate requests.

Examples:

```
getHeroes()
createHero(data)
healHero(id)
getQuests()
createMission(data)
completeMission(id)
```

React components must not contain raw Axios requests.

### OpenAPI Types

TypeScript API types will be generated from `openapi.yaml` using `openapi-typescript`.

These types represent documented request and response structures.

Generated files should not be modified manually. When the API contract changes, regenerate the types.

### API Rules

- Never invent endpoints or undocumented response fields.
    
- Respect HTTP methods and validation requirements.
    
- Handle documented errors.
    
- Distinguish paginated responses from individual resources.
    
- Keep gameplay calculations in Laravel.
    

API integration must be tested against actual backend responses, not just mocks.

## 7. Authentication and Security

The backend uses Laravel Passport bearer tokens.

### Authentication Flow

1. Player submits credentials through `POST /login`.
    
2. Laravel returns an access token.
    
3. React keeps the token in memory.
    
4. Axios attaches the token to authenticated API requests.
    
5. React retrieves the player profile using `GET /users/me`.
    
6. The authenticated user's role determines accessible routes and interface elements.
    

Registration uses `POST /register` and does not automatically authenticate the player.

### Token Storage

**Initial decision: In-memory bearer token storage.**

The access token is maintained through React's authentication context.

It is not persisted in `localStorage`, `sessionStorage`, or readable cookies.

Consequently, refreshing the page ends the frontend session and requires the player to log in again.

This limitation is accepted for the initial version.

### Authentication State

React Context manages:

- Authentication status.
- Login and logout operations.

- Login and logout operations.

- Post-login routing intent.

The bearer token itself is held in module memory by the shared Axios client, not in Context or browser storage. Context exposes authenticated role/state to routes and layouts after `GET /users/me` confirms the session.
    

TanStack Query manages the authenticated user profile.

### Session Handling

- A `401` clears authentication state and redirects to login.
    
- A `403` displays an access-denied state without logging out.
    
- Logout calls `POST /logout` to revoke the current token and clears local authentication state.
    
- Clear user-specific cached data when logging out or switching accounts.
    
- Never store passwords.
    
- Use HTTPS in production.
    

Persistent authentication may be reconsidered in a future version, preferably through a properly designed HttpOnly cookie-based solution.

## 8. State Management

The application uses React's built-in state management alongside TanStack Query.

### Local UI State — `useState`

Used for simple interactions such as:

- Selected heroes.
    
- Open dialogs.
    
- Active tabs.
    
- Form presentation.
    
- Animation states.
    

### Complex Local State — `useReducer`

Available when an interaction contains several related state transitions, such as a future more complex party builder or onboarding sequence. The current implementation primarily uses `useState`, Context, and TanStack Query rather than introducing reducers unnecessarily.

### Shared State — React Context

Used for information required across unrelated components, primarily authentication and application-wide preferences.

Avoid creating global context for information that can remain local.

### Server State — TanStack Query

Used for data retrieved from Laravel:

- User profiles.
    
- Heroes.
    
- Quests.
    
- Missions.
    
- Administrator resources.
    

TanStack Query handles caching, loading states, mutations, refetching, and invalidation.

### Data Synchronization

After operations that change backend data, affected queries must be invalidated or updated.

For example, completing a mission should refresh mission information and participating heroes' levels and statuses.

The backend response remains the source of truth.

## 9. Component Architecture

Components should follow the single-responsibility principle.

### Presentation Components

Responsible for displaying information and receiving interaction callbacks.

Examples:

- `HeroCard`
    
- `QuestCard`
    
- `MissionCard`
    
- `PartySlot`
    
- `StatusBadge`
    

### Feature Components

Responsible for coordinating interactions within a specific feature.

Examples:

- `HeroRoster`
    
- `HeroCreationForm`
    
- `PartyBuilder`
    
- `MissionResult`
    

### Custom Hooks

Encapsulate reusable behavior and TanStack Query operations.

Examples:

- `useHeroes`
    
- `useCreateHero`
    
- `useHealHero`
    
- `useMissions`
    
- `useCompleteMission`
    

### Component Rules

- Use TypeScript for props and data structures.
    
- Keep API communication outside presentation components.
    
- Prefer composition over duplication.
    
- Reuse shared UI components.
    
- Avoid enormous components containing unrelated responsibilities.
    
- Avoid abstractions that add complexity without clear value.
    

## 10. Styling and Design System

The application uses Tailwind CSS as its primary styling solution.

The established visual identity is defined in `DESIGN_SYSTEM.md`.

### Tailwind CSS

Used for:

- Responsive layouts.
    
- Spacing and sizing.
    
- Typography.
    
- Colors.
    
- Buttons and cards.
    
- General component styling.
    

Theme tokens should represent the established warm pastel palette.

### Custom CSS

Used for elements that require specialized styling, including:

- Pixel-art borders.
    
- Pixel rendering.
    
- Decorative visual effects.
    
- Font definitions.
    
- Special RPG-inspired interface elements.
    

Custom styles should remain organized and reusable.

### Responsive Design

The application supports mobile and desktop layouts.

- Desktop uses persistent navigation.
    
- Mobile uses compact bottom navigation.
    
- Cards and content adapt to available screen width.
    
- Important interactions remain accessible on touch devices.
    

Responsive layouts should avoid horizontal overflow and unnecessarily small interaction targets.

## 11. Animations

Animations use a combination of CSS transitions and Motion for React.

### CSS Transitions

Used for:

- Hover feedback.
    
- Button interactions.
    
- Card highlights.
    
- Simple visual state changes.
    

### Motion for React

Used for meaningful gameplay interactions:

- Party formation.
    
- Hero selection feedback.
    
- Mission results.
    
- Level-up celebrations.
    
- Healing effects.
    
- Dialogue transitions.
    

### Animation Rules

- Browsing should remain calm.
    
- Significant actions can trigger playful animations.
    
- Animations must not replace actual API state updates.
    
- Mission outcomes must be revealed using the backend response.
    
- Respect reduced-motion preferences.
    
- Keep important animations short and skippable.
    
- Preserve crisp pixel-art rendering.
    

## 12. Audio and Local Preferences

Optional retro sound effects enhance gameplay interactions.

No background music is included.

Audio is disabled by default and can be enabled through Settings.

Sound preferences can be stored in browser storage because they contain no authentication credentials.

### Onboarding

The introductory tutorial is triggered after successful registration followed by login.

A temporary frontend flag identifies this transition.

Normal logins do not automatically trigger onboarding.

The tutorial is skippable and replayable.

No persistent tutorial-completion endpoint is required.

## 13. Error Handling

The frontend must provide clear feedback for expected API responses.

|Status|Behavior|
|---|---|
|200 / 201|Display success and update relevant data|
|401|Clear authentication and redirect to login|
|403|Display access denied|
|404|Display resource not found|
|409|Explain the conflicting resource state|
|422|Display validation errors|
|500+|Display a general server error|
|Network failure|Provide retry feedback|

### General Guidelines

- Show loading states during requests.
    
- Prevent duplicate submissions.
    
- Provide useful empty states.
    
- Preserve user input when validation fails.
    
- Do not claim an action succeeded before receiving confirmation.
    
- Refresh affected data after successful mutations.
    

Error messages should follow the game's friendly tone without obscuring important technical information.

## 14. Testing Strategy

The project follows a balanced testing strategy with pragmatic Test-Driven Development.

### Unit and Component Testing

**Tools:** Vitest + React Testing Library.

Test:

- Component rendering.
    
- User interactions.
    
- Form behavior.
    
- Conditional controls.
    
- Party selection rules.
    
- Authentication-dependent interface states.
    

### API Mocking

**Tool:** Mock Service Worker (MSW).

Mock documented API responses to test:

- Successful requests.
    
- Validation failures.
    
- Unauthorized requests.
    
- Forbidden actions.
    
- Mission conflicts.
    
- Network failures.
    

Mocks must reflect the OpenAPI contract.

### End-to-End Testing

**Tool:** Playwright.

Prioritize critical user journeys:

1. Register and log in.
    
2. Create and manage a hero.
    
3. Browse quests and assemble a party.
    
4. Complete a mission and view its result.
    
5. Verify protected and administrator routes.
    

Where a running Laravel API is reachable, verify at least the main gameplay journey against it. When the execution environment cannot reach the developer’s local API, report that limitation separately from controlled mocked-test results.

### TDD Approach

For important business interactions:

1. Write a failing test.
    
2. Implement the minimum code required to pass.
    
3. Refactor while keeping tests passing.
    

Visual styling and decorative animations may rely more heavily on manual inspection and responsive testing.

### Testing Principles

- Test behavior rather than implementation details.
    
- Prioritize critical gameplay interactions.
    
- Verify accessibility and responsive behavior.
    
- Run relevant tests after modifying AI-generated code.
    
- Document significant testing discoveries.

### Current Test Layout

- `tests/` contains Vitest + React Testing Library tests with MSW request handlers under `tests/mocks/`.
- `e2e/application-flow.spec.ts` contains Playwright browser workflows with controlled HTTP responses.
- Vite configuration excludes `e2e/**` from the JSDOM Vitest runner; Playwright starts an isolated production preview rather than depending on a developer’s existing Vite server.
- Tests must distinguish controlled browser/API responses from manual verification against a reachable Laravel instance.
    

## 15. AI-Assisted Development Guidelines

AI-generated code must follow the project specifications.

### Required Context

Before implementing a feature, the AI should consult the relevant sections of:

- `PROJECT_BRIEF.md`
    
- `DESIGN_SYSTEM.md`
    
- `USER_FLOWS.md`
    
- `ARCHITECTURE.md`
    
- `openapi.yaml`
    

### Implementation Rules

1. Implement one feature at a time.
    
2. Follow the established feature-based directory structure.
    
3. Reuse existing UI components and design tokens.
    
4. Use documented API contracts and generated TypeScript types.
    
5. Keep authentication and authorization rules consistent.
    
6. Avoid introducing dependencies without justification.
    
7. Avoid modifying unrelated features unnecessarily.
    
8. Include appropriate tests for important functionality.
    
9. Explain significant implementation decisions.
    
10. Do not introduce backend changes without discussing the need.
    

### Developer Responsibilities

The developer must review generated code, understand its functionality, run tests, identify problems, and make necessary adjustments.

Significant AI interactions and modifications should be recorded in `AI_DEVELOPMENT_LOG.md`.

## 16. Future Improvements

Potential improvements include:

- Persistent authentication.
    
- Expanded automated test coverage.
    
- Advanced accessibility improvements.
    
- More elaborate animations and sound effects.
    
- Additional API-supported gameplay features.
    
- Gold, equipment, and inventory systems.
    

These features should not complicate the initial implementation unnecessarily.

## 17. Related Documentation

- `PROJECT_BRIEF.md` — Project requirements and objectives.
    
- `DESIGN_SYSTEM.md` — Visual and interaction guidelines.
    
- `USER_FLOWS.md` — Player journeys and application behavior.
    
- `openapi.yaml` — Existing Laravel API specification.
    
- `AI_DEVELOPMENT_LOG.md` — AI interactions and learning reflections.

## 18. Administrator Experience and Resource Management

Purrfect Guild has two separate application experiences:

**Player (`user`)**

- Accesses the regular Guild Hall and gameplay features.
- Manages personal resources according to Laravel authorization rules.

**Administrator (`admin`)**

- Is redirected to the Guild Master's Office after login.
- Cannot access regular player-facing routes.
- Uses dedicated administrative listing and detail routes.
- Does not access the regular Guild Hall or player-facing gameplay routes.
- Can inspect and perform all documented administrative operations on resources belonging to any user, subject to Laravel authorization.
- Has access to administrative management controls for users, quests, heroes, and missions where supported by the API.

Administrative and player interfaces may reuse components, forms, and mutation hooks, but must maintain separate routing, layouts, and navigation.

Frontend route guards control the user experience. Laravel remains responsible for enforcing authorization on every API operation.

The frontend must not invent permissions or endpoints that are absent from the API contract.
