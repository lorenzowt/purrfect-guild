# Purrfect Guild — Design System

**Version:** 1.0  
**Project:** Purrfect Guild  
**Design Direction:** Cozy Modern Pixel RPG  
**Frontend:** React + TypeScript + Vite

## 1. Design Philosophy

Purrfect Guild is a cozy fantasy RPG featuring feline adventurers. Its interface combines detailed pixel-art illustrations with the accessibility and usability of modern web applications.

The visual experience should feel playful, warm, charming, and relaxing.

**Core principle: Calm while browsing, playful while interacting, celebratory when progressing.**

The application should feel like a small fantasy game rather than a traditional management dashboard.

### Design Principles

- Prioritize character personality and charming illustrations.
    
- Maintain a consistent warm pastel aesthetic.
    
- Combine retro RPG elements with modern, intuitive interfaces.
    
- Keep gameplay simple and accessible.
    
- Use animations to reinforce meaningful actions.
    
- Ensure a comfortable experience on desktop and mobile.
    

## 2. Art Direction

### Visual Style

The game uses detailed 2D pixel art inspired by classic fantasy RPGs, with warmer and softer colors.

Illustrations should feature:

- Expressive feline characters.
    
- Recognizable fantasy equipment and outfits.
    
- Cozy environments, such as taverns, guild halls, and villages.
    
- Warm lighting and playful decorative details.
    
- Consistent pixel density and crisp rendering.
    

Avoid dark fantasy aesthetics, overly saturated colors, and blurry pixel-art scaling.

### Character Portraits

Heroes are represented by detailed pixel-art portraits showing their head and upper torso.

Each portrait should have:

- Expressive facial features.
    
- Distinctive fur patterns and colors.
    
- Class-specific fantasy equipment.
    
- Similar framing and proportions.
    
- Subtle backgrounds using the project's color palette.
    

The four character classes must be visually recognizable:

|Class|Visual Identity|
|---|---|
|Warrior|Armor, helmets, shields, swords|
|Mage|Wizard hats, magical accessories, lavender accents|
|Rogue|Hoods, daggers, stealth-inspired clothing|
|Cleric|Healing symbols, robes, mint and cream accents|

### Portrait Variants

Each class will initially have approximately 3–5 portrait variants.

Portraits are stored as static frontend assets and assigned deterministically using the hero's unique ID.

This ensures consistent appearances across sessions without modifying the existing Laravel API.

Players cannot customize their portraits in the initial version.

### Image Guidelines

- Use square portraits with consistent dimensions.
    
- Prefer transparent backgrounds when appropriate.
    
- Preserve sharp pixel edges using pixel-art-friendly rendering.
    
- Maintain consistent scale and framing across assets.
    
- Avoid mixing unrelated illustration styles.
    

## 3. Color Palette

The color palette combines warm cozy tones with soft pastel fantasy colors.

### Primary Colors

|Color|Hex|Usage|
|---|---|---|
|Vanilla Cream|`#FFF1DC`|Main backgrounds|
|Soft Caramel|`#E8B88A`|Panels, borders, decorative elements|
|Dusty Pink|`#E9A9B5`|Primary buttons and interactive accents|
|Soft Lavender|`#C8B4E8`|Magic, highlights, secondary accents|
|Mint Sage|`#B8DCC8`|Healing, success, positive feedback|
|Cocoa Plum|`#5B4650`|Text, outlines, darker contrast elements|

### Color Usage

- Prefer cream and warm neutrals for large surfaces.
    
- Use dusty pink for prominent interactive elements.
    
- Use lavender for magical elements and secondary highlights.
    
- Use mint sage for healing and positive outcomes.
    
- Use cocoa plum for text and important outlines.
    
- Use warmer, muted variations for shadows and borders.
    

Text and interactive controls must maintain accessible contrast. Darker shades may be introduced where necessary.

Avoid large areas of highly saturated colors.

## 4. Typography

The typography combines retro pixel-art headings with modern, readable body text.

### Heading Font — Press Start 2P

Use for:

- Main page titles.
    
- Important RPG headings.
    
- Special labels.
    
- Mission outcome announcements.
    

Use sparingly, especially on mobile, because pixel fonts require more space.

### Body Font — Nunito

Use for:

- Descriptions.
    
- Navigation.
    
- Buttons.
    
- Forms.
    
- Character statistics.
    
- Dialogue and informational text.
    

Nunito should remain the primary font for most interface elements.

### Typography Guidelines

- Establish a clear heading hierarchy.
    
- Maintain readable font sizes on mobile.
    
- Avoid long paragraphs using pixel fonts.
    
- Use appropriate line spacing.
    
- Avoid excessive uppercase text outside decorative RPG headings.
    

## 5. Interface Components

The interface follows a Cozy Modern Pixel RPG style.

### Panels and Cards

- Warm cream surfaces.
    
- Softly rounded corners.
    
- Caramel-colored borders.
    
- Gentle shadows.
    
- Occasional pixel-art decorations.
    

Panels should remain readable and uncluttered.

### Buttons

- Rounded shapes with subtle pixel-inspired details.
    
- Dusty pink or caramel for primary actions.
    
- Lavender for selected or magical actions.
    
- Mint sage for healing and positive actions.
    
- Clearly distinguish destructive actions.
    

Buttons must provide visual feedback when hovered, focused, pressed, or disabled.

### Hero Cards

Hero cards should display:

- Character portrait.
    
- Hero name.
    
- Class.
    
- Level.
    
- Current status.
    

Cards should visually communicate whether a hero is available, assigned to a mission, or injured.

### Quest Cards

Quest cards should emphasize:

- Quest title.
    
- Description.
    
- Boss.
    
- Difficulty.
    
- Main action.
    

### Mission Interfaces

Mission screens should clearly display:

- Selected quest.
    
- Party composition.
    
- Mission status.
    
- Available actions.
    
- Mission outcome.
    

The interface should make assembling and managing parties feel playful and intuitive.

### Decorative Elements

Use small pixel-art elements such as:

- Paw prints.
    
- Stars and sparkles.
    
- Hearts.
    
- Swords and shields.
    
- Magical particles.
    
- Fantasy-themed icons.
    

Decorations should enhance the interface without distracting from important information.

### Modal and Form Interaction Guidelines

- After a successful form submission, close the modal automatically.
- Display a brief success notification outside the modal, so the user receives confirmation without interrupting their workflow.
- Success notifications should fade out and disappear automatically after approximately 4 seconds.
- Prevent duplicate submissions while a request is being processed.
- If validation or server errors occur, keep the modal open and display the relevant errors so the user can correct them.
- Do not close modals before the backend confirms that the operation succeeded.
- Confirmation dialogs for destructive actions should close after successful completion.
- Apply these rules consistently to hero management, quests, missions, and other relevant interactions.
- Exceptions are allowed when a workflow explicitly requires the modal to remain open, such as a multi-step form.

## 6. Responsive Design and Navigation

The application uses a hybrid navigation approach.

### Guild Hall

An illustrated pixel-art Guild Hall serves as the application's main home screen.

Players can interact with locations or interface elements to access important areas of the game.

### Desktop

- Persistent sidebar or navigation menu.
    
- Spacious layouts.
    
- Responsive hero and quest card grids.
    
- Illustrated environments where appropriate.
    

### Mobile

- Compact bottom navigation with icons and labels.
    
- Touch-friendly buttons and interactive elements.
    
- Single-column or compact card layouts where appropriate.
    
- Content adapted to smaller screens without horizontal scrolling.
    

### Accessibility

- All important areas must remain accessible through standard navigation.
    
- Illustrated interactive locations must have accessible labels.
    
- Provide keyboard navigation and visible focus indicators.
    
- Do not communicate status using color alone.
    
- Maintain readable text and sufficient contrast.
    
- Respect reduced-motion preferences.
    

## 7. Animations and Interactivity

Animations should be subtle during normal navigation and more expressive during significant gameplay events.

### Standard Interactions

|Interaction|Animation|
|---|---|
|Card hover|Gentle lift and soft shadow|
|Button hover|Subtle scale or color transition|
|Hero selection|Small bounce and highlighted border|
|Party formation|Portrait slides or bounces into a slot|
|Mission creation|Short confirmation effect|
|Healing|Soft magical particles and hearts|

### Mission Outcomes

Mission completion is a key moment in the player experience.

**Victory:**

- Celebratory sparkles or confetti.
    
- Playful kitten reactions.
    
- Animated level increases.
    
- Positive visual feedback.
    

**Defeat:**

- Disappointed kitten expressions.
    
- Humorous visual elements, such as a tiny raincloud.
    
- Clear feedback about level loss and injuries.
    

### Leveling Up

Level increases should feel rewarding through short celebratory animations, floating stars, or animated numbers.

### Animation Guidelines

- Keep standard animations short and responsive.
    
- Avoid excessive movement during browsing.
    
- Use more expressive effects for significant actions.
    
- Never block essential navigation with lengthy animations.
    
- Provide reduced-motion alternatives.
    
- Ensure the interface remains understandable without animation.
    

## 8. Sound Design

The application will use optional retro-inspired sound effects without background music.

### Sound Effects

Potential sound effects include:

- Button clicks.
    
- Hero selection.
    
- Party formation.
    
- Mission creation.
    
- Victory and defeat.
    
- Leveling up.
    
- Healing.
    

Sounds should be gentle, playful, and inspired by retro RPGs.

### Audio Guidelines

- Sound effects are optional and disabled by default.
    
- Players can enable or mute sounds through a visible setting.
    
- No background music is included.
    
- Avoid loud or repetitive effects.
    
- Respect browser restrictions on audio playback.
    
- Gameplay must remain fully understandable without sound.
    

## 9. Consistency Guidelines for AI-Generated UI

All AI-generated components must follow this design system.

The AI should:

1. Reuse existing components and design tokens.
    
2. Follow the established warm pastel palette.
    
3. Maintain consistent typography and spacing.
    
4. Preserve the Cozy Modern Pixel RPG aesthetic.
    
5. Build responsive interfaces for desktop and mobile.
    
6. Use the defined character portrait system.
    
7. Apply animations only where appropriate.
    
8. Respect accessibility requirements.
    
9. Avoid introducing new visual styles without justification.
    

The AI must not independently replace established colors, typography, or design patterns.

## 10. Design System Evolution

This document establishes the initial visual direction.

Specific spacing scales, component dimensions, responsive breakpoints, animation durations, and implementation details will be refined during development.

Any significant changes should be documented and applied consistently across the application.