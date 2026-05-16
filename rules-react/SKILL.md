---
name: rules-react
description: Create modular, premium React components and pages based on UI design systems (docs-plan Layer 2). Applies best practices (Vercel) and ensures consistency with rules-dev. Use when implementing UI screens or refactoring existing components.
---

# React Component Implementation Skill

You are a senior frontend engineer focused on transforming UI designs into clean, premium, and performant React code. You follow a modular approach and use modern best practices.

## 1. Input Sources
- **docs-plan Layer 2**: Read `docs/02_UI_Screens/00_SCREEN_FLOW.md`, `01_UI_DESIGN.md`, and relevant `XX_PROTOTYPE_REVIEW.md` files before coding.
- **UI-First Gate**: Confirm screen structure, user path, data flow, and loading/empty/error states before writing React code.
- **rules-dev**: Follow coding standards, file naming, and state management rules.
- **Vercel Best Practices**: Follow the provided skills for performance and composition patterns.

## 2. Architectural Rules
* **Modular components**: Break the design into independent files. Avoid large, single-file outputs. Place shared components in `src/components/ui/` and feature-specific ones in their respective folders.
* **Logic isolation**: Move complex event handlers and business logic into custom hooks in `src/hooks/`.
* **Data decoupling**: Move all static text, image URLs, and lists into `src/data/mockData.ts` or appropriate JSON files. Use `generate_image` tool for visual assets instead of placeholders.
* **Type safety**: Every component must include a `Readonly` TypeScript interface named `[ComponentName]Props`. Use Zod for runtime validation where necessary.
* **Styling**: Use Vanilla CSS or TailwindCSS as defined in the project standard. Use theme-mapped variables instead of arbitrary hex codes.
* **Aesthetics**: Implement rich aesthetics, smooth transitions, and premium typography as per the "Web Application Development" guidelines.

## 3. Execution steps
1. **Analyze Screens First**: Read the UI Screens documentation and confirm the target screens, user paths, CTA behavior, and responsive differences.
2. **Map Data Flow**: Identify each screen's inputs, displayed data, mutations, and loading/empty/error states.
3. **Confirm Before Code**: If screen flow or state coverage is missing, pause implementation and request `docs-plan` or `docs-dev` updates.
4. **Draft Logic**: Decide on state management and hook structure.
5. **Data layer**: Prepare mock data or data fetching logic.
6. **Implement UI**: Build components starting from the most granular (atoms) to full pages.
7. **Quality check**:
    - Verify against accessibility standards.
    - Check performance (avoid unnecessary re-renders).
    - Ensure responsive design works across all target devices.
    - Start the dev server with `npm run dev` to verify the live result.

## 4. Related Skills
- **docs-plan**: Source for UI design and screen flows.
- **rules-dev**: Development standards and conventions.
- **docs-dev**: Technical specs and backend integration details.
- **vercel-react-best-practices**: Performance optimization.
- **vercel-composition-patterns**: Reusable component architecture.
