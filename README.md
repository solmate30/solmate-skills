# solmate-skills

Curated skills for Solmate projects. Easily share and install AI tool skills across your team.

## Installation

You don't need to install this package globally. Simply use `npx`:

```bash
# List available skills
npx solmate-skills list

# Install all available skills (use @latest to bypass npx cache)
npx solmate-skills@latest install all

# Install a specific skill
npx solmate-skills install rules-docs
```

When you run the `install` command, the script copies the skill folder to `.agent/skills/<skill-name>` in your current project.

---

## Quick Start

설치 후 상황에 맞는 스킬을 하나 실행하는 것으로 시작합니다.

| 상황 | 시작 명령 | 설명 |
|:---|:---|:---|
| 신규 프로젝트 — 아무것도 없을 때 | `/rules-product` | 현재 단계를 자동 진단하고 Phase 1부터 순서대로 안내 |
| 기획은 있고 코드를 작성하려 할 때 | `/rules-dev` | 커밋 형식, 환경변수, TypeScript 기준 등 컨벤션 먼저 정립 |
| 기능 하나를 구현하려 할 때 | `/rules-workflow` | 계획 수립부터 PR까지 18단계 워크플로우로 진행 |
| PR 전 최종 점검 | `/verify-implementation` | 모든 `verify-*` 스킬을 순차 실행하여 통합 보고 |

**가장 권장하는 시작 한 줄:**

```
/rules-product
```

`rules-product`는 프로젝트 상태를 스스로 진단해 현재 어느 단계인지 파악하고, 해당 단계의 올바른 스킬로 위임하는 오케스트레이터입니다. 새 프로젝트든 재개 중인 프로젝트든 동일하게 사용할 수 있습니다.

---

## Available Skills

Skills are organized into five categories.

### Governance

| Skill | Description |
|:---|:---|
| `role-team-lead` | Team lead protocols: branch protection, PR review, DB migration, deployment. |
| `role-team-member` | Team member protocols: branching, Conventional Commits (Korean), PR creation. |

### Rules

| Skill | Description |
|:---|:---|
| `rules-docs` | Master documentation rules and 365 Principle governance. |
| `rules-dev` | Enforce development setup, coding conventions, and quality rules. |
| `rules-react` | Create modular, premium React components and pages. |
| `rules-workflow` | Full 18-step implementation and execution lifecycle. |
| `rules-product` | Orchestrate the full product development pipeline. |
| `manage-collaboration` | Enforce AI-Human collaboration standards. |
| `manage-decisions` | Question-driven decision making for tech, DB, API, UX, and architecture choices. |
| `manage-skills` | Detect and fix drift between verify skills and changed code. |

### Documentation

| Skill | Description |
|:---|:---|
| `docs-plan` | Create and manage **planning documents** (Layer 1-2: vision, UI screens). |
| `docs-dev` | Create and manage **development documents** (Layer 3-5: specs, logic, QA). |
| `docs-pitch` | Create pitch decks for investors, hackathons, and demo days. |
| `docs-business` | Generate professional business plans for funding or partnerships. |
| `verify-docs` | Audit documentation structure and metadata standards. |

### Special Tools

| Skill | Description |
|:---|:---|
| `tools-shadcn` | Expert guidance for shadcn/ui components. |
| `tools-obsidian` | Sync documentation with an Obsidian vault. |

### External Extensions

| Skill | Description |
|:---|:---|
| `ext-awesome-design` | Premium design system and markdown templates. |
| `ext-k-skill` | Collection of specialized Korean tools and services. |

### Quality & Automation

| Skill | Description |
|:---|:---|
| `verify-implementation` | Dynamically discover and run all `verify-*` skills. |
| `verify-drizzle-schema` | Verify Drizzle ORM schema matches architecture specs. |
| `verify-security` | Check for security vulnerabilities based on OWASP Top 10. |
| `verify-performance` | Lighthouse & Core Web Vitals check. |
| `verify-code` | Comprehensive pre-PR code quality review. |

---

## Usage Guide

### Documentation System

The documentation system follows the **365 Principle** (3 Investor Lenses, 6 Rubrics, 5 Documentation Layers) and is split across two skills based on the type of document.

**Which skill to use:**

```
Product vision, Lean Canvas, UI design  →  docs-plan
DB schema, API specs, roadmap, QA       →  docs-dev
Unsure which layer?                     →  rules-docs
```

**5-Layer structure:**

```
docs/
├── 01_Concept_Design/   ← docs-plan
├── 02_UI_Screens/       ← docs-plan
├── 03_Technical_Specs/  ← docs-dev
├── 04_Logic_Progress/   ← docs-dev
└── 05_QA_Validation/    ← docs-dev
```

**Typical workflow:**

```
1. /docs-plan    → Write VISION_CORE.md, LEAN_CANVAS.md, PRODUCT_SPECS.md
2. /docs-plan    → Write SCREEN_FLOW.md, UI_DESIGN.md
3. /docs-dev     → Write DEVELOPMENT_PRINCIPLES.md, DB_SCHEMA.md, API_SPECS.md
4. /docs-dev     → Write ROADMAP.md, BACKLOG.md
5. /verify-docs  → Audit all docs for structure and metadata compliance
```

---

### Pitch Deck

Create a pitch deck from existing `docs-plan` documents.

**Prerequisites:** `docs-plan` Layer 1 documents (VISION_CORE, LEAN_CANVAS, PRODUCT_SPECS) should exist first.

**Output modes:**

| Mode | When to use | Output |
|:---|:---|:---|
| Markdown | Content-first, will export to Notion/Slides | `docs/01_Concept_Design/XX_PITCH_DECK.md` |
| Reveal.js HTML | Present directly in browser, deploy to GitHub Pages | `pitch/index.html` |

**Typical workflow:**

```
1. /docs-plan    → Ensure VISION_CORE, LEAN_CANVAS, PRODUCT_SPECS exist
2. /docs-pitch   → Select output mode → Answer Phase 0-2 questions → Generate deck
```

---

### Development Workflow

**Typical workflow:**

```
1. /rules-dev                → Review conventions before writing code
2. /rules-product            → Orchestrate the development pipeline
3. /verify-implementation    → Run all verify-* skills before PR
4. /manage-collaboration     → Check branch naming, PR format, and workflow status
```

---

### Governance

**Role-based skills** define protocols for team lead and team member roles:

```
/role-team-lead    → Branch protection, PR review, DB migration, deployment
/role-team-member  → Branching, commits (Conventional Commits in Korean), PR creation
```

---

### Proactive Skill Suggestions (Hooks)

Install hook scripts so Claude **automatically suggests** the right skill as you work — without needing to invoke them manually.

**Two layers work together:**

| Layer | Mechanism | Trigger |
|:---|:---|:---|
| Method 1 | AGENTS.md rules | Claude judges context and suggests skills by reasoning |
| Method 2 | Hook scripts | Keyword/file-pattern matching fires on every prompt or file edit |

**Install hooks into your project:**

```bash
# 1. Install the hooks skill first (if not already installed)
npx solmate-skills install hooks

# 2. Run the installer from your project root
bash .agent/skills/hooks/install.sh
```

This copies two scripts to `.claude/hooks/` and merges the hook config into `.claude/settings.json`:

| Script | Event | What it detects |
|:---|:---|:---|
| `solmate-suggest.sh` | UserPromptSubmit | Keywords: 결정/설계, 보안, 성능, PR, 코드리뷰, 문서, 기능구현, 피치덱, 새 프로젝트 |
| `solmate-watch.sh` | PreToolUse | File patterns: `schema.ts`, `.env*`, `SKILL.md`, `page.tsx`, `api/route.ts`, `auth.ts`, `AGENTS.md` |

**To review or disable hooks:** open `/hooks` in Claude Code.

**To uninstall:** remove `.claude/hooks/` and the `hooks` section from `.claude/settings.json`.
