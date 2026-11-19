# AI Development Log — Purrfect Guild

## Interaction 01 — Project Planning and Requirements

**Phase:** Planning  
**AI Model:** OpenAI GPT-6  
**Purpose:** Define the project, select technologies, and establish an AI-assisted development approach.

### 1. Initial Prompt

I provided the AI with my Laravel API's OpenAPI documentation and the assignment requirements. I explained my idea for a responsive, fantasy-themed RPG featuring adventurer kittens and asked for recommendations on technologies, documentation, and development practices.

### 2. AI Recommendations

The AI suggested:

- **React + TypeScript + Vite** for frontend development.
    
- A lightweight **Spec-Driven Development (SDD)** approach.
    
- Separating requirements into Project Brief, Design System, User Flows, and Architecture documents.
    
- Maintaining an AI Development Log to track significant interactions and decisions.
    

### 3. My Decisions

I decided to:

- Use React, TypeScript, and Vite with my existing Laravel REST API.
    
- Design Purrfect Guild as a cozy resource management RPG for casual gamers.
    
- Aim for full API integration, with engaging visuals, interactive gameplay, and humorous cat-related writing.
    
- Follow a light spec-driven approach before generating application code.
    

### 4. Additional Interaction — Understanding Vite

I asked the AI to explain why I should use Vite with React.

I learned that **React handles the user interface, while Vite provides the development server, Hot Module Replacement (HMR), and production builds**. Understanding this distinction helped me confirm my technology choices.

### 5. Outcome and Reflection

With AI assistance, I created the initial `PROJECT_BRIEF.md`, defining the project's concept, target audience, features, scope, and success criteria.

This planning phase showed me that AI can be valuable before writing code. I learned how structured specifications can guide development and how important it is to question AI recommendations rather than simply accept them.

**No application code was generated during this phase.**

## Interaction 02 — Visual Identity and Design System

**Phase:** UI/UX Planning  
**AI Model:** OpenAI GPT-6  
**Purpose:** Establish a consistent visual identity and user experience before generating frontend code.

### 1. Initial Prompt

I asked the AI to help define the visual direction of Purrfect Guild, focusing on creating a cozy, playful RPG with feline adventurers that works on both desktop and mobile.

### 2. AI Recommendations

The AI presented visual references and different approaches for the game's art style, color palette, typography, character design, interface, animations, and navigation.

It also suggested documenting these decisions in a `DESIGN_SYSTEM.md` file to maintain consistency across AI-generated components.

### 3. My Decisions

After reviewing the alternatives, I selected:

- **Art style:** Detailed fantasy pixel art, with expressive feline characters and multiple portrait variants per class.
    
- **Colors:** Warm pastel palette combining cream, caramel, dusty pink, lavender, and mint.
    
- **Typography:** Press Start 2P for headings and Nunito for readable interface text.
    
- **Interface:** Cozy modern RPG design with rounded panels and subtle pixel-art details.
    
- **Navigation:** Illustrated Guild Hall with persistent navigation adapted to desktop and mobile.
    
- **Interactions:** Subtle hover effects, with playful animations for missions, healing, and leveling up.
    
- **Audio:** Optional retro sound effects without background music.
    

I also provided a character illustration reference and requested adjustments to match the chosen color palette.

### 4. Outcome and Reflection

With AI assistance, I created `DESIGN_SYSTEM.md`, establishing visual guidelines for future frontend development.

This process helped me understand how defining a design system before generating components can improve consistency. Comparing visual alternatives also allowed me to make informed creative decisions rather than accepting the AI's initial suggestions.

I learned that **AI can support the creative decision-making process while the developer retains control over the final design**.

**No application code was generated during this phase.**

## Interaction 03 — User Flow Planning

**Phase:** UX Planning  
**AI Model:** OpenAI GPT-6  
**Purpose:** Define how players navigate and interact with the application while respecting the existing Laravel API.

### 1. Initial Prompt

I asked the AI to help translate the game's features and API endpoints into clear user journeys, covering authentication, onboarding, hero management, quests, missions, and administration.

### 2. AI Recommendations

The AI proposed several interface approaches for each feature, using visual references to compare alternatives. It recommended combining immersive RPG elements with practical navigation and reusing existing API endpoints wherever possible.

### 3. My Decisions

After reviewing the alternatives, I selected:

- **Authentication:** Illustrated welcome screen with registration and login.
    
- **Onboarding:** A retired tavern keeper introduces new players to the guild.
    
- **Guild Hall:** Interactive tavern with overview panels and navigation shortcuts.
    
- **Heroes:** Collectible character cards with detailed management panels.
    
- **Quests:** Illustrated bulletin board with parchment-style quest cards.
    
- **Missions:** Interactive party builder and Mission Journal with animated results.
    
- **Administration:** A separate Guild Master's Office for administrators.
    

I also refined the onboarding flow: the tutorial should appear only after registration and the first successful login, include a skip option, and remain replayable later.

### 4. Outcome and Reflection

With AI assistance, I created `USER_FLOWS.md`, documenting the main player interactions, navigation, API requirements, and important application states.

This process helped me understand how frontend design must account for backend capabilities. I learned that most of the desired interactions could be implemented using my existing API without creating additional endpoints.

I also realized that **AI suggestions are starting points, not final requirements**. By questioning and adjusting the proposed onboarding flow, I found a simpler solution that better suited the project.

**No application code was generated during this phase.**

## Interaction 04 — Frontend Architecture

**Phase:** Technical Planning  
**AI Model:** OpenAI GPT-6  
**Purpose:** Define the frontend architecture, select development tools, and establish coding and testing practices.

### 1. Initial Prompt

I asked the AI to help plan the technical architecture of Purrfect Guild, focusing on code organization, API integration, authentication, state management, styling, and testing.

My goal was to create a maintainable React application that connects to my existing Laravel API without unnecessary backend changes.

### 2. AI Recommendations

The AI presented different architectural approaches, explaining their advantages and disadvantages. It recommended:

- Separate repositories for the frontend and backend.
    
- React Router for navigation and protected routes.
    
- Axios, TanStack Query, and OpenAPI-generated TypeScript types for API integration.
    
- React Context and built-in hooks for state management.
    
- Feature-based code organization with reusable components.
    
- Tailwind CSS and Motion for styling and animations.
    
- Vitest, React Testing Library, MSW, and Playwright for testing.
    

### 3. My Decisions

After comparing the alternatives, I accepted the recommended architecture.

For authentication, I chose **in-memory Passport token storage**, understanding that users will need to log in again after refreshing the page. This avoids storing authentication tokens in browser storage.

I also decided to use **pragmatic TDD**, prioritizing tests for important gameplay interactions while using visual inspection for decorative elements.

### 4. Outcome and Reflection

With AI assistance, I created `ARCHITECTURE.md`, establishing the project's technical structure, development conventions, security considerations, and testing strategy.

This process helped me better understand the responsibilities of different frontend tools, particularly the distinction between API communication, server-state management, and local React state.

I also learned that architectural decisions involve tradeoffs between simplicity, maintainability, security, and user experience.

**No application code was generated during this phase.**

## Interaction 05 — Project Foundation and Design System Implementation

**Phase:** Development — Phases 1 and 2  
**AI Model:** OpenAI Codex  
**Purpose:** Initialize the React application and implement the visual foundations of Purrfect Guild using AI-generated code.

### 1. Initial Prompts

I provided Codex with the project specifications, OpenAPI documentation, and `AGENTS.md`, establishing the technologies, architecture, and development guidelines.

I then requested two implementation phases:

- **Phase 1:** Initialize React, TypeScript, and Vite, configure the required dependencies, establish the feature-based project structure, and prepare the testing environment.
- **Phase 2:** Implement the warm pastel design system, reusable UI components, responsive styling, typography, and a visual component showcase.

### 2. AI-Generated Implementation

Codex was instructed to implement the project foundation and design system according to the previously established specifications.

The requested implementation included:

- React project configuration and development tooling.
- Feature-based directory organization.
- API client foundations and OpenAPI type generation.
- Tailwind CSS design tokens and typography.
- Reusable buttons, cards, badges, dialogs, and form components.
- A responsive UI showcase.
- Initial automated tests.

### 3. My Involvement

I divided the implementation into separate phases rather than requesting the entire application at once.

This allowed me to review the project structure and visual foundations independently before introducing gameplay or API integration.

I also maintained separate Git branches and used the existing project documentation to guide the generated code.

### 4. Outcome and Reflection

The first two development phases established the technical and visual foundations for Purrfect Guild.

This process helped me understand the value of giving AI a clear architecture and design system before generating code. Breaking the project into smaller tasks also made the generated changes easier to review and evaluate.

**The main takeaway was that well-defined specifications and incremental development make AI-generated code more manageable and consistent.**

## Interaction 06 — Routing and Authentication

**Phase:** Development — Phase 3  
**AI Model:** OpenAI Codex  
**Purpose:** Implement application routing, authentication, authorization, and the first integration layer with the Laravel API.

### 1. Initial Prompts

I asked Codex to implement Phase 3 in two independent Git branches:

- **Phase 3A:** Configure React Router, shared layouts, and public, authenticated, and administrator route guards.
- **Phase 3B:** Implement registration, login, logout, user profile retrieval, and Laravel Passport token handling.

I instructed Codex to follow the existing architecture and OpenAPI specifications, write tests, and avoid implementing unrelated gameplay features.

### 2. AI-Generated Implementation

Codex implemented:

- Route guards and role-based navigation.
- Authentication screens using the established design system.
- Typed API services based on OpenAPI schemas.
- In-memory Passport bearer token management.
- Axios interceptors for authorization and session errors.
- React Context for authentication state and TanStack Query for user data.
- Registration-to-onboarding navigation.
- Automated authentication tests using Vitest, React Testing Library, and MSW.

### 3. My Decisions and Review

I separated routing and authentication into different branches so each feature could be reviewed and integrated independently.

I maintained the decision to store tokens only in memory, accepting that refreshing the browser requires another login.

I also specified that onboarding should trigger only after registration and successful login, while ordinary logins should enter the Guild Hall directly.

### 4. Verification and Limitations

Codex reported:

- **19 passing tests.**
- Successful TypeScript checks and production build.
- No browser console errors during login screen inspection.

Additional verification: I manually tested the frontend against the running Laravel API. Registration, Passport login, authenticated profile retrieval, role-based navigation, and logout worked successfully. This confirmed that the frontend and backend could communicate correctly beyond the mocked automated tests.

### 5. Outcome and Reflection

This phase helped me understand how React Router, Context, Axios, and TanStack Query work together to manage authentication and protected navigation.

I also learned the importance of separating frontend authorization checks from backend security enforcement.

A key takeaway was that **passing automated tests with mocked responses does not guarantee successful integration with a real backend**. Live API verification remains an essential next step.

## Interaction 07 — Guild Hall and Player Onboarding

**Phase:** Development — Phase 4  
**AI Model:** OpenAI Codex  
**Purpose:** Implement the interactive Guild Hall and the introductory onboarding experience.

### 1. Initial Prompts

I divided Phase 4 into two independent development branches:

- **Phase 4A — Guild Hall:** Create the main tavern interface, interactive navigation, guild overview, and responsive layouts.
- **Phase 4B — Onboarding:** Implement the retired tavern keeper, introductory dialogue, tutorial navigation, and replay functionality.

I instructed Codex to follow the existing design system, architecture, and user flows while reusing previously developed components.

### 2. AI-Generated Implementation

Codex implemented the Guild Hall as the application's central hub, with interactive navigation and guild information.

It also implemented the onboarding experience, introducing players to the game's mechanics through the retired tavern keeper.

Both features were developed separately to maintain the established Gitflow workflow.

### 3. My Decisions and Evaluation

After reviewing the implementation, I confirmed that the features were functional and that the overall result was satisfactory.

However, I identified some visual and interaction details that do not completely match my original vision.

Rather than immediately requesting changes, I decided to continue implementing the remaining features and revisit these differences during a dedicated refinement phase.

This decision allows me to evaluate the application as a complete experience before making broader design changes.

### 4. Outcome and Reflection

Phase 4 established the main game environment and the player's introduction to Purrfect Guild.

The experience demonstrated that AI can translate detailed specifications into functional interfaces, but the generated result does not always fully reflect the intended design.

I learned that evaluating AI-generated code involves more than checking whether it works. It also requires considering usability, visual consistency, and alignment with the original project goals.

**My main takeaway was that separating functional implementation from final visual refinement can make AI-assisted development more efficient, while preserving control over the final product.**

The identified improvements will be revisited after the remaining gameplay features have been implemented.

## Interaction 08 — Hero Roster and Management

**Phase:** Development — Phase 5  
**AI Model:** OpenAI Codex  
**Purpose:** Implement hero management and improve the user experience through critical evaluation of AI-generated code.

### 1. Initial Prompts

I divided Phase 5 into two independent branches:

- **Phase 5A — Hero Roster:** Implement hero cards, character portraits, individual details, and API integration.
- **Phase 5B — Hero Management:** Implement recruitment, editing, healing, and hero removal through the Laravel API.

I instructed Codex to follow the existing architecture, design system, and OpenAPI specifications.

### 2. AI-Generated Implementation

Codex implemented the hero management functionality, including a recruitment modal.

However, after successfully creating a hero, the modal remained open, allowing users to submit the form repeatedly.

Although the feature was functional, this behavior did not provide the user experience I intended.

### 3. My Intervention and Corrections

After testing the recruitment flow, I identified the problem and instructed Codex:

> After creating a hero, the modal needs to close. Show a success message that fades out instead of leaving the modal open.

Codex modified the recruitment dialog, hero roster page, and CSS to implement the requested behavior.

After successful recruitment:

- The modal closes automatically.
- A success notification appears on the roster.
- The notification fades out and disappears after four seconds.
- The user can no longer accidentally resubmit the same form.

Codex also updated the corresponding automated test.

### 4. Verification

After the correction, Codex reported:

- **43 passing automated tests.**
- Successful TypeScript checks.
- Successful production build.

### 5. Outcome and Reflection

This interaction demonstrated the importance of reviewing AI-generated functionality from the user's perspective.

The initial implementation technically allowed successful hero creation, but its interaction design was incomplete.

By identifying the issue and providing specific feedback, I was able to guide Codex toward a more intuitive result without rewriting the feature myself.

I also implemented the Modal and Form interaction guidelines DESIGN_SYSTEM.md and AGENTS.md, in order to avoid similar mistakes in the future.

**My main takeaway was that functional correctness and good user experience are not the same thing.** AI-generated code still requires human evaluation to ensure that interactions behave as intended.

This also reinforced my decision to develop the application incrementally, correcting important usability problems while postponing nonessential visual refinements until the complete game is implemented.

## Interaction 09 — Quest Board and Party Builder

**Phase:** Development — Phase 6  
**AI Model:** OpenAI Codex  
**Purpose:** Implement quest exploration, party selection, and mission creation through the Laravel API.

### 1. Initial Prompts

I divided Phase 6 into two independent branches:

- **Phase 6A — Quest Board:** Implement a quest listing, quest details, difficulty indicators, and navigation to the Party Builder.
- **Phase 6B — Party Builder:** Allow players to select 1–4 available heroes and create missions through the Laravel API.

I instructed Codex to follow the existing design system, architecture, and OpenAPI specifications, keeping gameplay calculations exclusively in the backend.

### 2. AI-Generated Implementation

Codex implemented the Quest Board and Party Builder, allowing players to browse quests, inspect their difficulty, assemble adventuring parties, and submit missions.

The implementation followed the established application structure and integrated the new features into the existing navigation.

### 3. My Intervention and Corrections

After reviewing the implementation, I was satisfied with the functionality and overall appearance.

However, I noticed a minor visual inconsistency in the quest difficulty card: the text was not centered as intended.

I instructed Codex to adjust the card's alignment so the difficulty text appeared centered.

Unlike previous phases, no significant functional corrections were necessary.

### 4. Outcome and Reflection

Phase 6 completed another important part of the gameplay loop, connecting quest selection, hero management, and mission creation.

This interaction demonstrated how the specifications established earlier in development helped Codex generate features that closely matched my expectations, requiring only a small visual adjustment.

It also reinforced the importance of reviewing both functionality and presentation, even when the implementation works correctly.

**My main takeaway was that consistent project documentation and reusable components reduce the need for repeated corrections, allowing AI-assisted development to become more efficient as the project progresses.**

I will continue postponing broader visual refinements until the remaining gameplay features are implemented, while correcting smaller inconsistencies when necessary.

## Interaction 11 — API Synchronization and Mission Data Refinement

**Phase:** Development — Phase 7 Finalization  
**AI Model:** OpenAI Codex  
**Purpose:** Improve mission ordering, expand API response data, and synchronize the frontend with backend changes.

### 1. Initial Problem and Decisions

After implementing Phase 7, I identified two limitations in the Laravel API:

- Missions were not guaranteed to appear newest-first across paginated results because sorting was performed in React after pagination.
- Mission responses did not include the heroes' classes, which would be useful for assigning consistent character portraits throughout the application.

I decided to correct these issues directly in the Laravel backend rather than introducing additional frontend workarounds.

### 2. Backend Changes

I modified the Laravel API to:

- Sort missions by creation date in descending order before pagination.
- Include `hero_class` alongside the existing hero information in mission responses.

These changes improved data consistency and provided the frontend with the information needed for future portrait integration.

### 3. AI-Assisted Frontend Updates

I instructed Codex to synchronize the frontend with the updated API.

The requested changes included:

- Updating `openapi.yaml` to reflect the expanded mission response.
- Regenerating the TypeScript types.
- Removing unnecessary client-side mission sorting.
- Reviewing mission-related components to use the updated response structure.

### 4. My Intervention and Corrections

During the implementation, I encountered an issue with how Codex interpreted the additional API field.

Because `hero_class` was now available in mission responses, Codex attempted to display it in more places throughout the interface.

However, **adding information to an API response does not necessarily mean that information should be visible to the player**.

I clarified that the hero class was primarily needed for internal frontend logic, particularly future portrait selection, and should only be displayed where it was already appropriate according to the design.

This required explicitly separating the data available to the application from the information presented in the user interface.

### 5. Outcome and Reflection

The frontend was updated to reflect the improved API contract, and mission ordering could now be handled correctly by Laravel rather than separately on each frontend page.

This interaction highlighted an important limitation of AI-assisted development: AI may interpret newly available data as an opportunity to expand the interface, even when that was not requested.

I learned that backend data structures and frontend presentation have different responsibilities. An API should provide the information needed by the application, while the interface should selectively display what is relevant to the user.

**My main takeaway was that providing more data should not automatically result in showing more data.** Clear instructions and critical review are necessary to prevent AI-generated changes from introducing unnecessary interface elements or deviating from the intended design.

This also reinforced the value of making architectural corrections in the appropriate layer rather than relying on frontend workarounds.

## Interaction 12 — Hero Portraits and Mission Journal Redesign

**Phase:** Development — Visual Integration and Refinement  
**AI Model:** OpenAI Codex  
**Purpose:** Integrate custom hero portraits and improve the Mission Journal's visual identity and consistency with the rest of Purrfect Guild.

### 1. Initial Prompts

After completing the core gameplay features, I decided to integrate the hero portraits I had prepared.

I instructed Codex to use these assets consistently throughout the application, assigning portraits to heroes based on their ID and class.

During my review, I also noticed that the Mission Journal looked relatively plain compared to the highly stylized Quest Board.

I asked Codex to redesign the Mission Journal using the visual guidelines and references established in the project's documentation.

### 2. AI-Generated Implementation

Codex integrated the hero portraits into the relevant application interfaces, allowing adventurers to maintain a consistent visual identity.

It also generated a redesigned Mission Journal that better reflected the cozy fantasy aesthetic, introducing a more distinctive appearance and improving its visual consistency with the Quest Board.

### 3. My Intervention and Corrections

The first redesign of the Mission Journal was already a significant improvement, but I felt it still lacked some of the personality that I wanted for Purrfect Guild.

I asked Codex to incorporate more cat-related visual details and decorative elements to reinforce the game's theme.

Through further adjustments, the Mission Journal became more closely aligned with my original vision.

I continued reviewing the results and providing feedback until I was satisfied with the final design.

### 4. Outcome and Reflection

This interaction demonstrated how AI can assist not only with implementing functionality but also with exploring and refining visual design.

The initial redesign provided a useful foundation, but achieving the desired result required additional feedback and creative direction.

I also observed that the project documentation was valuable as a reference for redesigning an existing feature without starting from scratch.

**My main takeaway was that AI-generated designs should be treated as iterations rather than final results.** By comparing different parts of the application, identifying visual inconsistencies, and providing increasingly specific feedback, I was able to guide the AI toward a more cohesive and personalized game experience.

This experience reinforced my role in evaluating the generated work and making the final creative decisions, rather than simply accepting the first implementation.

## Interaction 13 — Player Profile and Guild Master's Office

**Phase:** Development — Phase 8  
**AI Model:** OpenAI Codex  
**Purpose:** Implement player profiles and administrator management, refining the administrative experience through iterative feedback.

### 1. Initial Prompts

I divided Phase 8 into two independent branches:

- **Phase 8A — Player Profile:** Implement player information, preferences, and tutorial replay.
- **Phase 8B — Guild Master's Office:** Create an administrator interface for managing users, quests, heroes, and missions through the existing Laravel API.

I instructed Codex to follow the established architecture, design system, and API documentation.

### 2. AI-Generated Implementation

Codex implemented the Player Profile and the Guild Master's Office, including administrative resource listings, detail views, and management functionality.

The initial administrator interface reused much of the regular player's visual design and navigation structure.

Although functional, I felt that it needed a clearer identity and better separation from the gameplay experience.

### 3. My Interventions and Corrections

After reviewing the implementation, I requested several changes.

**Administrative visual identity**

I asked Codex to give the entire Guild Master's Office a more desaturated, gray-toned appearance rather than only changing the sidebar.

After reviewing the result, I requested further adjustments to reduce excessive red accents, replace platform-dependent emojis with consistent icons, and center the administrative tables.

**Navigation and user roles**

Initially, administrators could access both regular gameplay and administrative functionality.

After evaluating this behavior, I decided that administrators should have a completely separate experience.

I instructed Codex to redirect administrators directly to the Guild Master's Office after login and prevent them from accessing player-facing pages.

I also identified that opening resource details from the administrative interface unexpectedly navigated to regular player pages. I requested dedicated administrative navigation that preserved the Guild Master's Office layout and allowed administrators to return to the appropriate resource listing.

**Complete resource management**

I noticed that administrative detail pages allowed inspection of resources but did not expose all available management actions.

I instructed Codex to provide the applicable backend-authorized operations, including editing, healing, and deleting heroes belonging to other users.

I emphasized reusing existing components and respecting Laravel's authorization rules rather than duplicating functionality or inventing endpoints.

### 4. Outcome and Reflection

Phase 8 completed the remaining major application features and established two distinct experiences: one for players and another for administrators.

This phase required more substantial revisions than some earlier stages because my understanding of the ideal administrator experience evolved as I interacted with the generated application.

The initial implementation helped me identify architectural and usability decisions that were difficult to evaluate through written specifications alone.

I learned that developing with AI is an iterative process in which reviewing functional prototypes can reveal the need to reconsider earlier design decisions.

**My main takeaway was that human oversight is essential not only for identifying bugs or visual inconsistencies, but also for making higher-level architectural and user experience decisions.**

By questioning the initial implementation and refining my requirements, I was able to guide Codex toward a more coherent administrative experience that better matched the needs of Purrfect Guild.

## Interaction 14 — Integration Testing and Quality Assurance

**Phase:** Development — Phase 9A  
**AI Model:** OpenAI Codex  
**Purpose:** Verify the complete application workflow, improve automated testing, and identify integration issues before final visual refinement.

### 1. Initial Prompt

I asked Codex to review the complete application and verify that the independently developed features worked together.

The requested testing included the full player gameplay loop, administrator navigation, authentication, API integration, and error handling.

I also instructed Codex to distinguish between mocked automated tests and verification against the real Laravel backend.

### 2. AI-Generated Implementation

Codex implemented Playwright browser integration tests covering:

- Player registration, login, and onboarding.
- Hero recruitment, quest selection, and mission creation.
- Mission completion and hero level updates.
- Mission Journal navigation and logout.
- Administrator login, navigation, and route protection.

The tests use intercepted API responses to avoid modifying real development data.

### 3. Problems Identified and Corrections

During the testing process, Codex identified two configuration issues:

- Vitest was attempting to execute Playwright test files, causing test failures.
- Playwright reused the existing Vite development server, making automated tests dependent on the local environment.

Codex corrected these issues by separating the test runners and configuring an isolated production preview for browser testing.

### 4. Verification and Limitations

After the changes, Codex reported:

- **97 passing Vitest tests.**
- **2 passing Playwright browser tests.**
- Successful TypeScript checks.
- Successful production build.

Codex could not connect to the locally running Laravel API from its execution environment.

Therefore, the browser tests verified frontend workflows using controlled responses, but full live backend integration and administrator mutations still require manual verification.

A production bundle-size warning also remains, although no major optimization was introduced during this phase.

### 5. Outcome and Reflection

Phase 9A improved the reliability of the project's testing environment and provided automated coverage for the main application workflows.

This phase helped me understand the difference between component tests, browser integration tests, and tests against a real backend.

I also observed that testing infrastructure can contain its own problems, independently of the application code.

**My main takeaway was that successful automated tests provide valuable confidence, but their limitations must be understood.** Mocked browser tests can confirm frontend behavior without guaranteeing that every interaction will work against the real Laravel API.

This reinforced the importance of combining automated testing with manual verification before considering the application complete.