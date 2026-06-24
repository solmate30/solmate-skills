# solmate-skills

Reusable AI-agent skills for disciplined product work.

`solmate-skills` packages the Solmate workflow as installable skills: plan the product, create browser-viewable UI previews, lock backlog tasks to their source documents, plan components and libraries before coding, implement with YAGNI/KISS/DRY approval gates, and verify the result before release.

Use it when you want an AI coding agent to follow a shared workflow instead of improvising project structure, documentation, implementation order, and QA.

## Install

You do not need a global install. Run it with `npx` from the root of the project where you want the skills installed:

```bash
# List available skills
npx solmate-skills@latest list

# Install every skill
npx solmate-skills@latest install all

# Install one skill
npx solmate-skills@latest install rules-product

# Install proactive hook suggestions for Claude Code projects
npx solmate-skills@latest install hooks
```

The installer copies each selected skill folder into `.agent/skills/<skill-name>` in your current project.

## What You Get

- **Product workflow orchestration**: `/rules-product` diagnoses the current phase and routes the agent to the right next skill.
- **UI-first planning**: `/docs-plan` creates concept and screen documents before implementation starts.
- **HTML UI Preview Gate**: major screens and flows must have browser-viewable HTML previews under `docs/02_UI_Screens/previews/`.
- **Backlog Context Lock**: every backlog item must link the Concept, UI, HTML Preview, Technical Spec, and QA documents needed for implementation.
- **Component & Library Planning Gate**: React work must name the shadcn/ui components, custom components, reused components, libraries to add, libraries to avoid, and preset action before coding.
- **YAGNI/KISS/DRY Gate**: `rules-dev` is the canonical source for avoiding future-only features, preferring the simplest existing/native path, and removing only true duplicate knowledge.
- **Implementation workflow**: `/rules-workflow` keeps coding work tied to approved documents, preconditions, and acceptance criteria.
- **Release verification**: `/verify-implementation` runs the verification family for docs, UI, code, security, performance, DB schema, and skill package readiness.

## What's New in 2.0.11

`solmate-skills@2.0.11` adds a Component & Library Planning Gate so React implementation starts from approved UI context and an explicit component/library plan.

- `/rules-product` and `/rules-workflow` now connect concept docs, HTML UI preview, component planning, and implementation in a clearer sequence.
- `/rules-react` requires agents to name shadcn/ui components, custom components, reused components, libraries to add, libraries to avoid, and preset action before coding.
- `/tools-shadcn` documents the default new-project preset command and existing-project apply command.
- `/verify-docs` and `/verify-implementation` now check that UI docs, backlog references, and implementation plans preserve the UI-first flow.
- `README.md` and `AGENTS.md` surface the planning gate as part of the recommended Solmate workflow.

## What's New in 2.0.10

`solmate-skills@2.0.10` fixes Claude Code hook false positives so read-only tool use no longer triggers edit-oriented skill suggestions.

- `install hooks` now registers the PreToolUse file watcher only for `Write|Edit`.
- `hooks/watch-files.sh` exits early for `Read`, `Bash`, and other non-edit tools, even when an older broad matcher is still installed.
- File-pattern suggestions now use `tool_input.file_path` only, avoiding false matches from shell command text such as `find . -name SKILL.md`.
- Existing projects can apply the fix by rerunning `npx solmate-skills@latest install hooks`.

## What's New in 2.0.9

`solmate-skills@2.0.9` adds a YAGNI/KISS/DRY Gate across development, workflow, and verification skills so agents avoid overengineering before and after implementation.

Recent workflow guardrails:

- Every backlog task must link to related Concept, UI, HTML Preview, Technical Spec, and QA documents.
- UI planning must include HTML preview files under `docs/02_UI_Screens/previews/` and link them from the related UI documents.
- Implementation must use `rules-dev` as the canonical Minimal Implementation Gate before adding new code.
- Prototype, spike, and exploration work applies the Gate as an advisory check, while safety exceptions still apply.
- `verify-code` now reports future-only abstractions, unnecessary providers/factories/interfaces, avoidable dependencies, and premature DRY abstractions.
- UI, user paths, data flow, loading states, empty states, and error states must be confirmed before coding.
- User journey SVG files belong in `docs/02_UI_Screens/assets/`.
- Data flow SVG files belong in `docs/03_Technical_Specs/assets/`.
- `/rules-workflow` treats linked backlog documents as implementation inputs before coding starts.
- `/verify-docs` fails backlog items that omit required related-document fields.

## Install Details

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
| `verify-ui` | Verify implemented UI against screen docs, HTML previews, and user flows. |
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
2. /docs-plan    → Write SCREEN_FLOW.md, UI_DESIGN.md, and HTML UI previews
3. HTML UI Preview Gate → Show browser-viewable HTML screens and capture user feedback
4. UI-First Gate → Confirm screens, user paths, data flow, and UI states before coding
5. Pre-Code Technical Brief → Confirm data sources, API shape, state strategy, and acceptance criteria
6. Component & Library Planning Gate → Confirm shadcn components, custom components, reused components, and libraries
7. /docs-dev     → Write DEVELOPMENT_PRINCIPLES.md, DB_SCHEMA.md, API_SPECS.md
8. /docs-dev     → Write ROADMAP.md, BACKLOG.md with mandatory related document links
9. /rules-workflow → Implement each backlog item only after reading linked docs and passing UI-First and Component & Library gates
10. /verify-implementation  → Audit docs, UI, code, security, performance, DB, and skill package changes
```

Backlog items are intentionally document-linked. Each task in `docs/04_Logic_Progress/00_BACKLOG.md` must include related Concept, UI, Technical Spec, and QA documents, plus implementation preconditions, acceptance criteria, and a document sync check. If a related document does not exist, the item must say `N/A - 사유`; implementation should pause when the missing document is required for a safe decision.

### Backlog Context Lock

Backlog Context Lock makes `docs/04_Logic_Progress/00_BACKLOG.md` act as a bridge between planning documents and implementation. A backlog item is not considered ready for coding until it names the documents that define why the task exists, how the UI should behave, what technical constraints apply, and how the work will be verified.

### UI-First Gate

UI-First Gate prevents implementation from starting before the team has reviewed the actual screens and the user's path through them. Before coding, confirm the core screen structure, user entry and exit paths, CTAs, screen-by-screen data flow, loading states, empty states, and error states. If these are missing, update `docs/02_UI_Screens/`, its HTML previews, or the backlog first.

### HTML UI Preview Gate

UI planning documents are not complete with Markdown alone. For every major screen or user flow, create a browser-viewable HTML preview and store it under:

```text
docs/02_UI_Screens/previews/
```

Recommended naming:

```text
docs/02_UI_Screens/previews/01_main_flow_preview.html
docs/02_UI_Screens/previews/02_dashboard_preview.html
```

Each related UI document must link to the HTML file with a relative path. The preview must be shown to the user before implementation, and feedback must be captured in `XX_PROTOTYPE_REVIEW.md`, `00_SCREEN_FLOW.md`, `01_UI_DESIGN.md`, or the related backlog item.

### Component & Library Planning Gate

React implementation should not begin until the team has listed the UI building blocks and library choices. Record the shadcn/ui components to add, custom components to create, existing components to reuse, libraries to install, libraries intentionally not added, and whether the project needs `init --preset`, `apply --preset`, `apply --only theme`, or `N/A - reason`.

Required fields for every backlog item:

- `Related Concept Docs`
- `Related UI Docs`
- `Related HTML Preview`
- `Related Technical Docs`
- `Related QA Docs`
- `Implementation Preconditions`
- `Component & Library Plan`
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
- Related HTML Preview:
  - [Main Flow Preview](../02_UI_Screens/previews/01_main_flow_preview.html) - browser-viewable UI for user review
- Related Technical Docs:
  - [API Specs](../03_Technical_Specs/02_API_SPECS.md) - endpoint and data contract
- Related QA Docs:
  - [QA Checklist](../05_QA_Validation/02_QA_CHECKLIST.md) - acceptance and release criteria
- Implementation Preconditions:
  - [ ] Read all related documents before coding
  - [ ] Confirm screen/UI before coding
  - [ ] Show the HTML UI preview to the user and capture feedback
  - [ ] Confirm user path and screen-by-screen data flow
  - [ ] Confirm loading, empty, and error states
  - [ ] Confirm implementation scope does not conflict with documented intent
- Component & Library Plan:
  - shadcn/ui components: button, card, form, or `N/A - reason`
  - Custom components: feature-specific components or `N/A - reason`
  - Reused components: existing paths or `N/A - reason`
  - New libraries: package names and reasons or `N/A - reason`
  - Libraries intentionally not added: rejected options and reasons or `N/A - reason`
  - shadcn preset action: init --preset / apply --preset / apply --only theme / N/A - reason
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
