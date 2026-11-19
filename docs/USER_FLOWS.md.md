# Purrfect Guild — User Flows

**Version:** 1.0  
**Project:** Purrfect Guild  
**Frontend:** React + TypeScript + Vite  
**Backend Contract:** `openapi.yaml`

## 1. Overview

Purrfect Guild is a cozy resource management RPG where players manage feline adventurers, assemble parties, and complete quests.

The application combines an illustrated, interactive tavern with accessible navigation and modern UI components.

This document defines the main user journeys, expected interactions, navigation, and API requirements.

### General Principles

- Keep navigation intuitive on desktop and mobile.
    
- Make gameplay interactions playful without unnecessary complexity.
    
- Provide clear feedback for every important action.
    
- Use existing Laravel endpoints whenever possible.
    
- Keep gameplay calculations and authorization in the backend.
    
- Introduce backend changes only when genuinely necessary.
    

## 2. Application Navigation

### Public Pages

- **Welcome:** Illustrated introduction with registration and login options.
    
- **Register:** Create a player account.
    
- **Login:** Authenticate an existing player.
    

### Authenticated Player Pages

- **Guild Hall:** Main hub and overview.
    
- **Adventurers' Corner:** Hero management.
    
- **Quest Board:** Available adventures.
    
- **Party Builder:** Assemble a party for a quest.
    
- **Mission Journal:** Active and historical missions.
    
- **My Profile:** Account settings and preferences.
    

### Administrator Pages

- **Guild Master's Office:** Administrator hub.
    
- **User Management:** Manage registered players.
    
- **Quest Management:** Create and manage quests.
    
- **Guild Oversight:** View heroes and missions across users.
    

Players use persistent navigation, with a sidebar or menu on desktop and bottom navigation on mobile.

## 3. Authentication Flow

**API:** `POST /register`, `POST /login`, `POST /logout`, `GET /users/me`

1. Visitors arrive at an illustrated welcome screen.
    
2. They choose **Start Adventure** or **Log In**.
    
3. Registration collects name, email, password, and password confirmation.
    
4. After successful registration, the player is directed to login.
    
5. Once authenticated, the frontend retrieves the player's profile and role.
    
6. Newly registered players are welcomed by the retired tavern keeper and offered the introductory tutorial.
    
7. Returning players who log in normally enter the Guild Hall directly.
    

### Important States

- Invalid credentials display a friendly error.
    
- Validation errors appear beside the relevant fields.
    
- Unauthenticated users cannot access protected pages.
    
- Logout ends the authenticated session and returns the player to the welcome screen.
    
- Registration does not automatically authenticate the user.
    
- The frontend must preserve the new-registration onboarding intent until the first successful login.
    

## 4. First-Time Onboarding

**Character:** The Retired Tavern Keeper

A friendly elderly feline tavern owner is retiring and passing his establishment to the player.

He introduces the guild through short, humorous dialogue and cat-related puns.

### Onboarding Sequence

1. The newly registered player enters the tavern.
    
2. The retired owner welcomes them and explains the inheritance.
    
3. He introduces the Adventurers' Corner.
    
4. The player is encouraged to create their first kitten hero.
    
5. The tavern keeper explains quests and party formation.
    
6. The player is introduced to the Mission Journal.
    
7. The tutorial ends, allowing free exploration.
    

### Tutorial Behavior

- The tutorial starts automatically only after a newly registered player successfully logs in.
    
- Players can skip the tutorial at any time.
    
- Skipping takes the player directly to the Guild Hall.
    
- Regular logins never trigger the tutorial automatically.
    
- Players can replay the tutorial through Settings or by interacting with the tavern keeper.
    
- No backend endpoint is required.
    
- Persistent tutorial-completion tracking is not necessary for the initial version.
    

The tutorial must not prevent players from accessing regular gameplay.

## 5. Guild Hall

**API:** `GET /users/me`, `GET /heroes`, `GET /quests`, `GET /missions`

The Guild Hall is the application's central hub.

It combines an illustrated pixel-art tavern with compact information panels.

### Interactive Areas

|Location|Action|
|---|---|
|Adventurers' Corner|Open hero management|
|Quest Board|Browse quests|
|Mission Desk|Open Mission Journal|
|Tavern Keeper|Replay tutorial|
|Guild Overview|View guild information|

The overview may display the player's hero count, available heroes, assigned missions, and shortcuts to important actions.

These values should come from existing API data. Where paginated data is involved, use appropriate pagination metadata or complete results rather than assuming the first page contains everything.

## 6. Hero Management

**API:** `GET /heroes`, `GET /heroes/{hero}`, `POST /heroes`, `PATCH /heroes/{hero}`, `DELETE /heroes/{hero}`, `POST /heroes/{hero}/heal`

### Hero Roster

Players enter the Adventurers' Corner and see a responsive grid of collectible kitten cards.

Each card displays:

- Pixel-art portrait.
    
- Name.
    
- Class.
    
- Level.
    
- Current status.
    

Selecting a card opens a detailed RPG-style character panel.

### Recruit a Hero

1. Select **Recruit Adventurer**.
    
2. Enter the hero's name.
    
3. Choose Warrior, Mage, Rogue, or Cleric.
    
4. Submit the form.
    
5. Show the newly created hero and a playful recruitment animation.
    

### Manage a Hero

The detail panel provides contextual actions:

- Rename or change class.
    
- Heal an injured hero.
    
- Deactivate a hero after confirmation.
    

Only applicable actions should be available.

### Additional Rules

- Portraits are assigned consistently using the hero's ID and class.
    
- Hero lists support pagination.
    
- Optional class and status filtering may initially operate on loaded data.
    
- Deactivated heroes are excluded from the normal active roster.
    
- The interface must handle empty rosters and validation errors.
    

## 7. Quest Board

**API:** `GET /quests`, `GET /quests/{quest}`

Players browse quests displayed as parchment-style notices on an illustrated wooden board.

Each quest displays:

- Title.
    
- Boss.
    
- Difficulty.
    
- Short description.
    

### Quest Selection

1. Select a quest notice.
    
2. Open its detailed panel.
    
3. Read the description and difficulty.
    
4. Select **Assemble Your Party**.
    
5. Continue to the Party Builder.
    

On mobile, the Quest Board becomes a scrollable card layout.

Only active quests are presented for regular players.

## 8. Party Formation

**API:** `GET /heroes`, `GET /quests/{quest}`, `POST /missions`

The Party Builder is one of the game's central interactive experiences.

### Flow

1. Display the selected quest.
    
2. Retrieve the player's available heroes.
    
3. Display four empty party slots.
    
4. Players select kittens to fill the slots.
    
5. Selected kittens animate into their positions.
    
6. Show a party summary.
    
7. Select **Send on Adventure!** to create the mission.
    

### Party Summary

Display:

- Selected heroes and their classes.
    
- Individual and combined hero levels.
    
- Class diversity.
    
- Quest difficulty.
    

This information helps players make decisions, but the frontend must not invent a success probability or calculate the mission outcome.

### Rules

- Minimum one hero, maximum four.
    
- Heroes must be available.
    
- Duplicate selections are prohibited.
    
- The selected quest must be active.
    
- Players can remove or replace heroes before confirming.
    

After successful creation, participating heroes become unavailable for other missions until the mission is resolved or canceled.

If the backend rejects the selection, display the validation errors and allow the player to adjust their party.

## 9. Mission Journal

**API:** `GET /missions`, `GET /missions/{mission}`, `POST /missions/{mission}/complete`, `POST /missions/{mission}/cancel`

Players can view assigned missions and their adventure history.

### Mission Cards

Each mission displays:

- Quest title.
    
- Participating heroes.
    
- Status.
    
- Available actions.
    

Players can open a mission to see additional details.

### Complete a Mission

1. Select an assigned mission.
    
2. Choose **Complete Adventure**.
    
3. Submit the completion request to Laravel.
    
4. Play a short, skippable encounter animation.
    
5. Reveal the actual mission outcome.
    
6. Display updated hero levels and statuses.
    

The outcome is calculated by Laravel using quest difficulty, hero levels, and class diversity.

### Victory

- Show celebratory effects and happy kittens.
    
- Highlight level increases.
    
- Confirm that heroes have returned to available status.
    

### Defeat

- Show playful disappointed kitten reactions.
    
- Highlight level decreases.
    
- Explain that participating heroes are injured.
    

To display accurate level changes, the frontend may compare previously loaded hero data with refreshed results.

### Cancel a Mission

1. Select an assigned mission.
    
2. Choose **Cancel Mission**.
    
3. Confirm the action.
    
4. Update the journal.
    
5. Return participating heroes to available status.
    

### Rules

- Only assigned missions can be completed or canceled.
    
- Completed and canceled missions remain in the journal.
    
- The frontend never determines mission success or failure.
    
- No artificial countdown or real-time battle system is required.
    

## 10. Player Profile and Preferences

**API:** `GET /users/me`, `PATCH /users/me`, `POST /logout`

Players can access their profile through the navigation or settings menu.

### Account Management

- View profile information.
    
- Update name.
    
- Update email.
    
- Change password.
    
- Log out.
    

### Game Preferences

- Enable or mute retro sound effects.
    
- Replay the introductory tutorial.
    

Sound and tutorial preferences are stored locally in the initial version.

No background music is included.

## 11. Guild Master's Office

**Access:** Administrators only.

The Guild Master's Office is a special area of the tavern dedicated to administrative functionality.

Its interface maintains the fantasy theme but favors practical tables, forms, and management controls.

### User Management

**API:** `GET /users`, `GET /users/{user}`, `PATCH /users/{user}`, `DELETE /users/{user}`

Administrators can browse users, view profiles, update account information, and delete accounts with confirmation.

Role changes are not supported by the documented update endpoints.

### Quest Management

**API:** `POST /quests`, `PATCH /quests/{quest}`, `DELETE /quests/{quest}`

Administrators can create, update, and deactivate quests.

### Guild Oversight

**API:** `GET /heroes`, `GET /heroes/{hero}`, `GET /missions`, `GET /missions/{mission}`

Administrators can view heroes and missions belonging to different users and perform permitted hero management actions.

### Authorization

- Administrative navigation is shown only to administrators.
    
- Protected routes must verify the authenticated user's role.
    
- Laravel remains responsible for enforcing permissions.
    
- Unauthorized requests must display appropriate feedback.
    

## 12. Common Interface States

Every important screen should handle:

|State|Expected Behavior|
|---|---|
|Loading|Show themed loading indicator or skeleton|
|Empty|Display a friendly explanation and relevant action|
|Success|Show confirmation and refresh affected information|
|Validation error (422)|Display field-specific messages|
|Unauthenticated (401)|Clear invalid session and redirect to login|
|Forbidden (403)|Explain that the action is not permitted|
|Not found (404)|Display an appropriate fallback|
|Conflict (409)|Explain why the action cannot currently be completed|
|Network error|Offer a retry without falsely claiming success|

Buttons should be disabled while the corresponding request is being submitted to help prevent duplicate actions.

## 13. API Integration Principles

The existing Laravel API is the source of truth for:

- Authentication and authorization.
    
- Hero ownership and status.
    
- Quest availability.
    
- Mission creation.
    
- Mission outcomes.
    
- Hero progression.
    

The frontend is responsible for presentation, navigation, local interaction states, and user feedback.

**New backend endpoints should only be introduced when an important requirement cannot reasonably be supported by the existing API.**

Any such changes must be documented and reflected in `openapi.yaml`.

## 14. Related Documentation

- `PROJECT_BRIEF.md` — Goals, audience, and scope.
    
- `DESIGN_SYSTEM.md` — Visual identity and interface guidelines.
    
- `openapi.yaml` — API contracts and validation rules.
    
- `ARCHITECTURE.md` — Technical implementation decisions.
    
- `AI_DEVELOPMENT_LOG.md` — AI interactions and learning reflections.