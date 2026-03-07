# solmate-skills

Curated skills for Solmate projects. Easily share and install AI tool skills across your team.

## Installation

You don't need to install this package globally. Simply use `npx`:

```bash
# List available skills
npx solmate-skills list

# Install all available skills
npx solmate-skills install all

# Install a specific skill
npx solmate-skills install manage-docs
```

When you run the `install` command, the script copies the skill folder to `.agent/skills/<skill-name>` in your current project.

---

## Available Skills

Skills are organized into four categories.

### Documentation

| Skill | Description |
|:---|:---|
| `manage-docs` | Router for the documentation system. Delegates to `plan-docs` or `dev-docs` and defines shared formatting conventions. |
| `plan-docs` | Create and manage **planning documents** (Layer 1-2: product vision, lean canvas, UI screens). |
| `dev-docs` | Create and manage **development documents** (Layer 3-5: technical specs, logic, QA). |
| `pitch-deck` | Create pitch decks for investors, hackathons, and demo days. Supports Markdown, Reveal.js HTML, and Stitch output modes. |
| `verify-docs` | Audit documentation structure and metadata standards. |
| `obsidian-sync` | Sync the project `docs/` directory with an Obsidian vault via symbolic links. |

### Development Workflow

| Skill | Description |
|:---|:---|
| `dev-conventions` | Enforce development setup, coding conventions, and quality rules. Covers Next.js, React Router v7, and React (SPA/Vite). |
| `implementation-workflow` | 18-step implementation checklist from planning through PR. |
| `manage-collaboration` | Enforce AI-Human collaboration standards including branch strategy, PR review, and approval workflows. |
| `manage-skills` | Detect and fix drift between verify skills and changed code. |
| `verify-implementation` | Dynamically discover and run all `verify-*` skills, then generate a unified report. |
| `verify-drizzle-schema` | Verify Drizzle ORM schema matches architecture specs and project standards. |

### UI / Frontend

| Skill | Description |
|:---|:---|
| `shadcn-ui` | Expert guidance for integrating and customizing shadcn/ui components. |
| `react-components` | Convert Stitch designs into modular Vite/React components with AST-based validation. |

### Stitch / Design

| Skill | Description |
|:---|:---|
| `design-md` | Analyze a Stitch project and synthesize a semantic design system into `DESIGN.md`. |
| `enhance-prompt` | Transform vague UI ideas into polished, Stitch-optimized prompts. |
| `stitch-loop` | Iteratively build websites using Stitch with an autonomous baton-passing loop pattern. |
| `remotion` | Generate walkthrough videos from Stitch projects using Remotion. |

---

## Usage Guide

### Documentation System

The documentation system follows the **365 Principle** (3 Investor Lenses, 6 Rubrics, 5 Documentation Layers) and is split across two skills based on the type of document.

**Which skill to use:**

```
Product vision, Lean Canvas, UI design  →  plan-docs
DB schema, API specs, roadmap, QA       →  dev-docs
Unsure which layer?                     →  manage-docs (router)
```

**5-Layer structure:**

```
docs/
├── 01_Concept_Design/   ← plan-docs
├── 02_UI_Screens/       ← plan-docs
├── 03_Technical_Specs/  ← dev-docs
├── 04_Logic_Progress/   ← dev-docs
└── 05_QA_Validation/    ← dev-docs
```

**Typical workflow:**

```
1. /plan-docs    → Write VISION_CORE.md, LEAN_CANVAS.md, PRODUCT_SPECS.md
2. /plan-docs    → Write SCREEN_FLOW.md, UI_DESIGN.md
3. /dev-docs     → Write DEVELOPMENT_PRINCIPLES.md, DB_SCHEMA.md, API_SPECS.md
4. /dev-docs     → Write ROADMAP.md, BACKLOG.md
5. /verify-docs  → Audit all docs for structure and metadata compliance
```

---

### Pitch Deck

Create a pitch deck from existing `plan-docs` documents.

**Prerequisites:** `plan-docs` Layer 1 documents (VISION_CORE, LEAN_CANVAS, PRODUCT_SPECS) should exist first.

**Output modes:**

| Mode | When to use | Output |
|:---|:---|:---|
| Markdown | Content-first, will export to Notion/Slides | `docs/01_Concept_Design/XX_PITCH_DECK.md` |
| Reveal.js HTML | Present directly in browser, deploy to GitHub Pages | `pitch/index.html` |
| Stitch | Visual design quality matters | Stitch project slides |

**Typical workflow:**

```
1. /plan-docs    → Ensure VISION_CORE, LEAN_CANVAS, PRODUCT_SPECS exist
2. /pitch-deck   → Select output mode → Answer Phase 0-2 questions → Generate deck
```

---

### Stitch Build Pipeline

Build a complete website iteratively using Stitch.

**Typical workflow:**

```
1. /enhance-prompt  → Polish UI idea into a Stitch-optimized prompt
2. /stitch-loop     → Generate pages iteratively with the baton system
3. /design-md       → Extract design system from generated screens → DESIGN.md
4. /react-components → Convert Stitch HTML into modular React components
5. /remotion        → Generate a walkthrough video from the Stitch project
```

---

### Development Workflow

**Typical workflow:**

```
1. /dev-conventions          → Review conventions before writing code
2. /implementation-workflow  → Follow the 18-step checklist during implementation
3. /verify-implementation    → Run all verify-* skills before PR
4. /manage-collaboration     → Check branch naming, PR format, and approval status
```

---

### Governance

**Role-based skills** define protocols for team lead and team member roles:

```
/role-team-lead    → Branch protection, PR review, DB migration, deployment
/role-team-member  → Branching, commits (Conventional Commits in Korean), PR creation
```
