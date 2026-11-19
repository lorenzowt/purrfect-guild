# Purrfect Guild — Agent Instructions

## Project Context

Purrfect Guild is a cozy, pixel-art resource management RPG where players manage feline adventurers and send them on quests.

The frontend is a React + TypeScript SPA built with Vite. It consumes an existing Laravel REST API maintained in a separate repository.

This project is part of an AI-assisted development exercise. Code clarity, maintainability, testing, and developer understanding are essential.

## Required Documentation

Before implementing a feature, read the relevant sections of:

- `docs/PROJECT_BRIEF.md` — Project goals and scope.
- `docs/DESIGN_SYSTEM.md` — Visual identity and UI conventions.
- `docs/USER_FLOWS.md` — Navigation and gameplay interactions.
- `docs/ARCHITECTURE.md` — Technical architecture and coding conventions.
- `openapi.yaml` — Authoritative API contract.

Follow these specifications. If requirements conflict or information is missing, explain the issue instead of inventing functionality.

## Technology Stack

- React + TypeScript + Vite
- React Router with route guards
- Axios + TanStack Query
- TypeScript types generated from OpenAPI
- React Context, useState, and useReducer
- Tailwind CSS + custom CSS
- Motion for React
- Vitest + React Testing Library + MSW
- Playwright for critical end-to-end tests

Do not introduce additional libraries without explaining why they are necessary.

## Architecture Rules

- Follow feature-based architecture.
- Keep feature-specific components, hooks, and API functions together.
- Place reusable UI components in `src/components/ui/`.
- Keep API communication outside presentation components.
- Use generated OpenAPI types instead of duplicating API models.
- Keep components small, readable, and focused.
- Do not duplicate gameplay calculations performed by Laravel.
- Prefer simple solutions over unnecessary abstractions.

## API and Authentication

- Use only documented API endpoints and response structures.
- Do not create mock backend functionality as a replacement for the real API.
- Use Axios for HTTP requests and TanStack Query for server state.
- Store Passport bearer tokens in memory only.
- Do not persist authentication tokens in browser storage.
- Clear authentication state and user-specific query caches appropriately.
- Respect user and administrator permissions.
- Do not modify the Laravel backend without discussing the requirement first.

MSW mocks are permitted for automated testing.

## UI and Design

Follow `DESIGN_SYSTEM.md`.

- Cozy Modern Pixel RPG aesthetic.
- Warm pastel colors.
- Pixel-art character illustrations.
- Responsive desktop and mobile interfaces.
- Subtle hover effects.
- Playful animations for important gameplay actions.
- Accessible navigation and reduced-motion support.
- Follow the modal and form interaction guidelines in `docs/DESIGN_SYSTEM.md`. Successful submissions should close their modal and show temporary feedback unless the documented workflow explicitly requires otherwise.
- When API responses gain new fields, do not automatically expose them in the UI. Use new data only for its intended purpose and preserve existing presentation requirements unless explicitly instructed otherwise.

Reuse design tokens and existing components instead of introducing inconsistent styling.

## Development Workflow

- Work on one complete feature at a time.
- Follow Gitflow: `main`, `develop`, and `feature/*` branches.
- Each feature branch should represent one complete user-facing feature.
- Use Conventional Commits.
- Write tests before implementing important functionality whenever practical.
- Do not modify unrelated features without justification.
- Do not automatically create, merge, or push commits or pull requests without being asked.

## Testing and Quality

- Use Vitest and React Testing Library for component behavior.
- Use MSW for controlled API responses.
- Use Playwright for critical user journeys.
- Verify integration against the real Laravel API when available.
- Run relevant tests and build checks after changes.
- Report any failures or unverified behavior.

## Collaboration and Learning

The developer is learning React and TypeScript.

For each implementation task:

1. Briefly explain the proposed approach.
2. Implement only the requested scope.
3. Explain important architectural decisions and unfamiliar concepts.
4. Summarize the files created or modified.
5. Report tests and verification results.
6. Highlight potential improvements or tradeoffs.

Do not implement the entire application unless explicitly requested.

The developer will review changes before proceeding to the next feature.