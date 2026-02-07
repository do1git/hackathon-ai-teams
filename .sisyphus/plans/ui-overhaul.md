# UI Overhaul: Chronicles of Dimensions

## TL;DR
> **Goal**: Transform the generic UI into an immersive, dynamic experience where the visual theme adapts to the selected RPG world.
> **Key Feature**: Dynamic Background & Theme Switching based on active world.
> **New Title**: "Chronicles of Dimensions: Infinite Tales"

## 1. Dynamic Theme System
- **State Management**: Lift theme state to `layout.tsx` or use a Context Provider (`ThemeProvider`).
- **Theme Config**:
  - `moorim`: Ink wash painting style, amber/black colors, serif font.
  - `galactic`: Space/Stars background, neon blue/cyan, monospace font.
  - `arcane`: Magical aura/particles, purple/gold, fantasy font.
  - `fantasy`: Parchment texture, earth tones/crimson, classic serif.
- **Transitions**: Smooth CSS transitions between themes (background-image, primary colors).

## 2. UI Components Redesign
- **Landing Page**:
  - Hero Section: Grand title "Chronicles of Dimensions" with cinematic entrance animation.
  - World Cards: 3D tilt effect or expanding cards that preview the theme on hover.
- **Chat Interface**:
  - Message Bubbles: Styled according to the active world (e.g., tech borders for SF, scroll borders for fantasy).
  - Input Area: Themed placeholder and send button.
- **Animations**:
  - Text typing effect for GM responses.
  - Particle effects for special events (boss appearance).

## 3. Implementation Steps
1.  **Assets**: Define CSS gradients/patterns for backgrounds (no external images to avoid broken links, use CSS generative art or reliable CDNs if allowed). *Decision: Use high-quality CSS gradients and patterns.*
2.  **Global CSS**: Define CSS variables for each theme scope (`[data-theme='moorim']`).
3.  **Page Refactor**: Update `app/page.tsx` to handle theme switching logic.
4.  **Layout Update**: Update `app/layout.tsx` to apply the theme to the `<body>`.

## 4. Constraints
- No new heavy npm packages (framer-motion is okay if lightweight, but prefer pure CSS).
- Keep responsive design (mobile friendly).
- Do not break existing chat functionality.

## 5. Execution Plan
- [x] Step 1: Define CSS variables for 4 themes in `app/globals.css`.
- [x] Step 2: Create `ThemeContext` or simple state in `page.tsx` to manage active world.
- [x] Step 3: Redesign `app/page.tsx` with new Title and World Cards.
- [x] Step 4: Apply dynamic styling to Chat Interface.
- [x] Step 5: Test all 4 themes and transitions.
- [x] Step 6: Push to main.
