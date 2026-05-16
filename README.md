# solmate-skills

Curated skills for Solmate projects. Easily share and install AI tool skills across your team.

## What's New in 2.0.6

`solmate-skills@2.0.6` keeps **Backlog Context Lock** as the current documentation guardrail, adds **UI-First Gate** expectations, formalizes SVG diagram outputs, and fixes package hygiene so installable skill scripts are included in the npm tarball.

Key changes:

- Every backlog task must link to related Concept, UI, Technical Spec, and QA documents.
- UI, user paths, data flow, loading states, empty states, and error states must be confirmed before coding.
- User journey SVG files belong in `docs/02_UI_Screens/assets/`.
- Data flow SVG files belong in `docs/03_Technical_Specs/assets/`.
- `/rules-workflow` now treats linked backlog documents as implementation inputs before coding starts.
- `/verify-docs` fails backlog items that omit required related-document fields.
- Local Codex settings under `.codex/` are excluded from the npm package, while skill-owned shell scripts remain publishable.

## Installation

You don't need to install this package globally. Simply use `npx`:

```bash
# List available skills
npx solmate-skills list

# Install all available skills (use @latest to bypass npx cache)
npx solmate-skills@latest install all

# Install proactive hook suggestions for Claude Code projects
npx solmate-skills@latest install hooks

# Install a specific skill
npx solmate-skills install rules-docs
```

When you run the `install` command, the script copies the skill folder to `.agent/skills/<skill-name>` in your current project.

`install all` installs only skill folders that contain `SKILL.md`. Use `install hooks` separately when you want prompt/file-change suggestions that nudge the agent toward `/rules-product`, `/rules-workflow`, and the relevant `verify-*` skills.

---

## Quick Start

설치 후 상황에 맞는 스킬을 하나 실행하는 것으로 시작합니다.

| 상황 | 시작 명령 | 설명 |
|:---|:---|:---|
| 신규 프로젝트 — 아무것도 없을 때 | `/rules-product` | 현재 단계를 자동 진단하고 Phase 1부터 순서대로 안내 |
| 기획은 있고 코드를 작성하려 할 때 | `/rules-dev` | 커밋 형식, 환경변수, TypeScript 기준 등 컨벤션 먼저 정립 |
| 기능 하나를 구현하려 할 때 | `/rules-product` → `/rules-workflow` | 현재 Phase를 먼저 진단한 뒤 계획 수립부터 PR까지 진행 |
| PR 전 최종 점검 | `/verify-implementation` | 모든 `verify-*` 스킬을 순차 실행하여 통합 보고 |

**가장 권장하는 시작 한 줄:**

```
/rules-product
```

`rules-product`는 프로젝트 상태를 스스로 진단해 현재 어느 단계인지 파악하고, 해당 단계의 올바른 스킬로 위임하는 오케스트레이터입니다. 새 프로젝트든 재개 중인 프로젝트든 동일하게 사용할 수 있습니다.

`rules-product` and `rules-workflow` should show a short Flow Status Block at the start of work, before implementation, before verification, and at handoff:

```text
[Flow]
현재: Phase 2 — UI 설계
Gate: UI-First Gate 진행 중
완료: Phase 1 — Concept
다음: Pre-Code Technical Brief
필요 확인: 화면별 오류 상태
권장 스킬: /docs-plan
```

### Using Skills in an Existing Project

이미 진행 중인 프로젝트에도 최신 `solmate-skills`를 다시 설치해서 사용할 수 있습니다. 사용 방식은 신규 프로젝트와 같지만, 시작점은 항상 현재 프로젝트 상태를 먼저 진단하는 것입니다.

**Update or reinstall skills from the project root:**

```bash
npx solmate-skills@latest install all
npx solmate-skills@latest install hooks
```

**Recommended first prompt:**

```text
/rules-product를 사용해서 이 프로젝트의 현재 진행 상태를 진단하고, 다음 작업을 Flow Status Block 기준으로 안내해줘.
```

**When starting implementation work:**

```text
/rules-workflow를 사용해서 현재 기능 작업을 진행해줘. 먼저 Flow Status Block으로 현재 위치를 알려주고, UI-First 흐름에 맞춰 진행해줘.
```

**When verifying finished work:**

```text
/verify-implementation으로 현재 변경사항을 전체 검증해줘. Flow Status Block을 포함해서 보고해줘.
```

진행 중인 프로젝트에서는 Phase 1부터 강제로 다시 시작하지 않습니다. `/rules-product`가 기존 문서, 코드, 백로그, 변경사항을 보고 현재 위치를 진단한 뒤, 이어서 진행할 Phase와 필요한 Gate를 제안해야 합니다.

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
| `verify-ui` | Verify implemented UI against screen docs and user flows. |
| `verify-skills` | Verify skill package metadata, CLI output, and release readiness. |

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
3. UI-First Gate → Confirm screens, user paths, data flow, and UI states before coding
4. Pre-Code Technical Brief → Confirm data sources, API shape, state strategy, and acceptance criteria
5. /docs-dev     → Write DEVELOPMENT_PRINCIPLES.md, DB_SCHEMA.md, API_SPECS.md
6. /docs-dev     → Write ROADMAP.md, BACKLOG.md with mandatory related document links
7. /rules-workflow → Implement each backlog item only after reading linked docs and passing UI-First Gate
8. /verify-implementation  → Audit docs, UI, code, security, performance, DB, and skill package changes
```

Backlog items are intentionally document-linked. Each task in `docs/04_Logic_Progress/00_BACKLOG.md` must include related Concept, UI, Technical Spec, and QA documents, plus implementation preconditions, acceptance criteria, and a document sync check. If a related document does not exist, the item must say `N/A - 사유`; implementation should pause when the missing document is required for a safe decision.

### Backlog Context Lock

Backlog Context Lock makes `docs/04_Logic_Progress/00_BACKLOG.md` act as a bridge between planning documents and implementation. A backlog item is not considered ready for coding until it names the documents that define why the task exists, how the UI should behave, what technical constraints apply, and how the work will be verified.

### UI-First Gate

UI-First Gate prevents implementation from starting before the team has reviewed the actual screens and the user's path through them. Before coding, confirm the core screen structure, user entry and exit paths, CTAs, screen-by-screen data flow, loading states, empty states, and error states. If these are missing, update `docs/02_UI_Screens/` or the backlog first.

Required fields for every backlog item:

- `Related Concept Docs`
- `Related UI Docs`
- `Related Technical Docs`
- `Related QA Docs`
- `Implementation Preconditions`
- `Acceptance Criteria`
- `Document Sync Check`

If a related document does not exist, write `N/A - 사유`. Do not leave the field blank. If the missing document is required to make a safe implementation decision, pause implementation and write or update the document first.

**Backlog item template:**

```markdown
### [ ] TASK-000: Implement feature name

- Status: ToDo
- Related Concept Docs:
  - [Product Specs](../01_Concept_Design/03_PRODUCT_SPECS.md) - feature purpose and user value
- Related UI Docs:
  - [Screen Flow](../02_UI_Screens/00_SCREEN_FLOW.md) - target screen and interaction flow
- Related Technical Docs:
  - [API Specs](../03_Technical_Specs/02_API_SPECS.md) - endpoint and data contract
- Related QA Docs:
  - [QA Checklist](../05_QA_Validation/02_QA_CHECKLIST.md) - acceptance and release criteria
- Implementation Preconditions:
  - [ ] Read all related documents before coding
  - [ ] Confirm screen/UI before coding
  - [ ] Confirm user path and screen-by-screen data flow
  - [ ] Confirm loading, empty, and error states
  - [ ] Confirm implementation scope does not conflict with documented intent
- Acceptance Criteria:
  - [ ] Feature follows the confirmed screen structure and user path
  - [ ] Feature behavior matches linked Concept/UI/Technical docs
  - [ ] QA criteria are testable and satisfied
- Document Sync Check:
  - [ ] No mismatch between implementation and linked documents
  - [ ] Update related documents if implementation changes the agreed behavior
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
