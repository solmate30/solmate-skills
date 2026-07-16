# solmate-skills Usage Guide

<a id="solmate-skills-usage-guide"></a>

Created Date: 2026-06-25 03:00  
Last Updated Date: 2026-07-17 00:33

**Language:** English (default) · [Korean version below](#solmate-skills-usage-guide-korean)

This is a **human-readable** guide for choosing and invoking skills.  
Agent execution rules live in each `SKILL.md` and the project `AGENTS.md` when it is linked or installed.

---

## 1. How to Invoke Skills

### Cursor / Claude Code (recommended)

Use slash commands or natural language in chat:

```text
/rules-product
Use /rules-workflow to implement this feature
Run /verify-implementation on the current changes
```

### Install locations

```bash
npx solmate-skills@latest install all      # .agent/skills/<skill-name>/ + ./USAGE.md
npx solmate-skills@latest install hooks    # Claude Code suggestions (optional) + ./USAGE.md
npx solmate-skills@latest install agents   # Refresh rules-workflow + native Claude project agents
```

Every `install` command (single skill, `all`, `hooks`, or `agents`) copies `USAGE.md` to the **project root**. Installing `rules-workflow` or `all` also installs the namespaced Claude agents automatically.

### Local development (symlink)

When hacking on the `solmate-skills` repo itself:

```bash
# Run from the target project root
bash /path/to/solmate-skills/init-skills.sh
```

This symlinks `.agent/skills/` to the repo, links `AGENTS.md` and `USAGE.md` at the project root, and links the namespaced Claude agents under `.claude/agents/`.

---

## 2. Situation Cheat Sheet

| You say / situation | Skill | Notes |
|:---|:---|:---|
| "Where do I start?" / new project | `rules-product` | **Recommended entry point** |
| "Where are we?" / resume work | `rules-product` | Phase diagnosis, then delegate |
| Vision, Lean Canvas, UI docs | `docs-plan` | Layers 1–2 |
| DB, API, backlog, QA docs | `docs-dev` | Layers 3–5 |
| Unsure which doc layer | `rules-docs` | 5-layer and gate rules |
| Implement a feature / pre-commit·PR | `rules-workflow` | 18-step workflow |
| React screens / components | `rules-react` | Component & Library Plan first |
| shadcn/ui setup / customization | `tools-shadcn` | preset init/apply |
| Coding conventions / overengineering | `rules-dev` | YAGNI/KISS/DRY **canonical source** |
| "Which tech should we use?" | `manage-decisions` | 6 decision-type templates |
| Full check before PR | `verify-implementation` | Runs verify-* in order |
| Docs only | `verify-docs` | Backlog, gates, metadata |
| UI vs docs | `verify-ui` | HTML Preview, flows, states |
| Code quality only | `verify-code` | Pre-PR review |
| Security | `verify-security` | OWASP Top 10 |
| Performance / Lighthouse | `verify-performance` | Core Web Vitals |
| Drizzle schema | `verify-drizzle-schema` | After schema changes |
| solmate-skills package changes | `verify-skills` | Pre-publish metadata |
| Pitch deck | `docs-pitch` | Layer 1 docs first |
| Business plan | `docs-business` | Grants, investment, partnerships |
| Branch / commit / PR (member) | `role-team-member` | |
| Deploy / DB / PR review (lead) | `role-team-lead` | |
| AI–human collaboration | `manage-collaboration` | |
| Skill package maintenance | `manage-skills` | Detect missing verify skills |
| Obsidian sync | `tools-obsidian` | |
| Premium design reference | `ext-awesome-design` | DESIGN.md templates |
| Korea-specific services | `ext-k-skill` | Law, delivery, transit, etc. |

---

## 3. Core Orchestrators

```text
                    ┌─────────────────────┐
                    │   rules-product     │
                    │ (entry · phase diag)│
                    └──────────┬──────────┘
                               │ delegates
           ┌───────────────────┼───────────────────┐
           ▼                   ▼                   ▼
    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │  docs-plan  │    │rules-workflow│   │ verify-impl │
    │  docs-dev   │    │ (18 steps)   │   │ (master QA) │
    │ rules-react │    └──────┬──────┘    └──────┬──────┘
    └─────────────┘           │                   │
                              │                   ▼
                              │            verify-docs … verify-skills
                              ▼
                         commit / PR
```

| Skill | Role | When to use alone |
|:---|:---|:---|
| `rules-product` | Diagnose phase, check gates, delegate | **Default first step** |
| `rules-workflow` | Plan → implement → cleanup → PR (18 steps) | Feature work, commit/PR prep |
| `verify-implementation` | Run verify-* by changed files, unified report | Pre-PR / pre-release |

### Agent harness sequence

For backlog tasks with `Work Type: code` or `Work Type: deploy`:

```text
Coordinator
  -> read-only Context Agent -> Context Receipt
  -> Implementation Agent    -> Change Receipt
  -> read-only Verifier       -> Verification Receipt
  -> Coordinator completion decision
```

- Claude Code uses `.claude/agents/solmate-context-reader.md`, `solmate-implementer.md`, and `solmate-verifier.md`.
- Codex uses available subagents or separate tasks with the same canonical contract from `rules-workflow/resources/agent-harness-contract.md`.
- The verifier reports findings but does not modify source files.
- Receipt summaries stay in the backlog; detailed verification links to a QA document or GitHub PR.
- Use warning mode for the first five real tasks, then switch to blocking checks:

```bash
npx solmate-skills preflight TASK-000 --strict
npx solmate-skills verify TASK-000 --strict
```

### Individual verify-* vs master

| Situation | Use |
|:---|:---|
| Full pre-PR / pre-release | `verify-implementation` |
| Docs only changed | `verify-docs` |
| TSX screens only | `verify-ui` |
| API / auth / env changed | `verify-security` (+ `verify-code` if needed) |
| Schema only | `verify-drizzle-schema` |
| solmate-skills repo itself | `verify-skills` |

---

## 4. Full Pipeline (with Gates)

```text
Phase 1  Planning docs       → docs-plan (01_Concept_Design)
Phase 2  UI design docs      → docs-plan (02_UI_Screens)
         HTML UI Preview Gate → previews/ HTML + user feedback
         UI-First Gate        → screens, flows, data, states
         Pre-Code Technical Brief → API, state, acceptance criteria
         Component & Library Planning Gate → shadcn, custom, reuse, libraries
         Context Receipt Gate  → linked docs read by a read-only agent
Phase 3  React implementation → rules-react (+ tools-shadcn)
Phase 4  Dev docs              → docs-dev (03–05)
Phase 5  Independent verification → Verification Receipt + verify-implementation
Phase 6  Deliverables (opt.)   → docs-pitch / docs-business
```

Implementation detail: `rules-workflow` (18 steps).  
YAGNI/KISS/DRY canonical rules: `rules-dev`.

### Flow Status Block

Agents report progress in this format (field labels may appear in Korean in project docs):

```text
[Flow]
현재: Phase 2 — UI 설계
Gate: UI-First Gate 진행 중
완료: Phase 1 — Concept
다음: Pre-Code Technical Brief
필요 확인: 화면별 오류 상태
권장 스킬: /docs-plan
```

---

## 5. Skill Catalog (26 skills)

Each entry: **When** / **Prerequisites** / **Invoke** / **Outputs** / **Next**

### 5.1. Governance & operations

#### `rules-product`

- **When:** New project, resume, "what should I do next?"
- **Prerequisites:** None
- **Invoke:** `/rules-product` — diagnose current progress
- **Outputs:** Flow Status Block, next skill, gate pass/fail
- **Next:** `docs-plan`, `docs-dev`, `rules-react`, `rules-workflow`, or `verify-implementation` by phase

#### `rules-workflow`

- **When:** Feature implementation, planning, commit/PR (18 steps)
- **Prerequisites:** HTML UI Preview Gate, UI-First Gate, Backlog Context Lock, Component & Library Plan, Context Receipt (code/deploy)
- **Invoke:** `/rules-workflow` — implement this backlog item
- **Outputs:** Context Receipt, plan review, Change Receipt, independent Verification Receipt, PR readiness
- **Next:** `verify-implementation`

#### `rules-dev`

- **When:** Conventions, env setup, avoid overengineering
- **Prerequisites:** Project `AGENTS.md` or `DEVELOPMENT_PRINCIPLES.md`
- **Invoke:** `/rules-dev` — is this minimal implementation?
- **Outputs:** YAGNI/KISS/DRY gate verdict, coding standards
- **Next:** `rules-workflow` when coding

#### `rules-docs`

- **When:** Doc structure, metadata, gates; unsure which layer
- **Prerequisites:** None
- **Invoke:** `/rules-docs` — is this doc in the right layer?
- **Outputs:** 5-layer placement, Related Documents, gate requirements
- **Next:** `docs-plan` or `docs-dev`

#### `manage-collaboration`

- **When:** Branch/PR/approval flow, AI–human standards
- **Prerequisites:** Team role agreed (`role-team-lead` / `role-team-member`)
- **Invoke:** `/manage-collaboration` — does this PR flow match standards?
- **Outputs:** Collaboration checklist
- **Next:** `role-team-member` or `role-team-lead`

#### `manage-decisions`

- **When:** Stack, DB, API, UX, architecture decisions
- **Prerequisites:** None (conversation-driven)
- **Invoke:** `/manage-decisions` — guide DB design decision
- **Outputs:** Typed questions, decision record
- **Next:** `docs-dev` or `rules-workflow`

#### `manage-skills`

- **When:** After adding/editing skills in solmate-skills repo
- **Prerequisites:** Skill file changes in session
- **Invoke:** `/manage-skills` — any missing verify skills?
- **Outputs:** Gap list, update suggestions
- **Next:** `verify-skills`

#### `role-team-lead`

- **When:** Lead — onboarding, branch protection, PR review, DB, deploy
- **Prerequisites:** Lead role agreed
- **Invoke:** `/role-team-lead` — pre-deploy checklist
- **Outputs:** Lead responsibility checklist
- **Next:** `verify-implementation`, `manage-collaboration`

#### `role-team-member`

- **When:** Member — branch, Conventional Commits (Korean), PR
- **Prerequisites:** Member role agreed
- **Invoke:** `/role-team-member` — review commit message
- **Outputs:** Branch/commit/PR guide
- **Next:** `rules-workflow`, `verify-code`

### 5.2. Documentation

#### `docs-plan`

- **When:** Vision, Lean Canvas, specs, UI design, HTML previews
- **Prerequisites:** Ask before Write
- **Invoke:** `/docs-plan` — draft Layer 1 planning docs
- **Outputs:** `docs/01_*`, `docs/02_*`, `previews/*.html`
- **Next:** `verify-docs`, then `docs-dev` or `rules-react`

#### `docs-dev`

- **When:** DB schema, API, backlog, roadmap, QA, component/library plans
- **Prerequisites:** Related Concept/UI docs; backlog needs Related Docs
- **Invoke:** `/docs-dev` — write API spec and backlog
- **Outputs:** `docs/03_*`, `docs/04_*`, `docs/05_*`
- **Next:** `rules-workflow`, `verify-docs`

#### `docs-pitch`

- **When:** Investor, hackathon, demo day deck
- **Prerequisites:** Layer 1 (`VISION_CORE`, `LEAN_CANVAS`, `PRODUCT_SPECS`)
- **Invoke:** `/docs-pitch` — Reveal.js HTML deck
- **Outputs:** Markdown or `pitch/index.html`
- **Next:** `verify-docs` (optional)

#### `docs-business`

- **When:** Grants, investment, partnership business plan
- **Prerequisites:** Layer 1 planning docs
- **Invoke:** `/docs-business` — draft business plan
- **Outputs:** Structured business plan Markdown
- **Next:** Standalone deliverable

### 5.3. Development & UI

#### `rules-react`

- **When:** React pages, components, refactor
- **Prerequisites:** UI docs, HTML Preview confirmed, Component & Library Plan
- **Invoke:** `/rules-react` — implement this screen
- **Outputs:** React code under `src/`
- **Next:** `verify-ui`, `verify-code`

#### `tools-shadcn`

- **When:** shadcn/ui init, add components, theme/preset
- **Prerequisites:** Component & Library Plan preset action
- **Invoke:** `/tools-shadcn` — add button, form to project
- **Outputs:** shadcn components, preset commands
- **Next:** `rules-react`

#### `tools-obsidian`

- **When:** Sync project docs with Obsidian vault
- **Prerequisites:** Vault path
- **Invoke:** `/tools-obsidian` — check sync status
- **Outputs:** Link status, metadata compatibility
- **Next:** None

### 5.4. Verification (verify-*)

#### `verify-implementation`

- **When:** Pre-PR unified check (**default**)
- **Prerequisites:** Changes to verify
- **Invoke:** `/verify-implementation` — full verification
- **Outputs:** Pass/Fail report incl. YAGNI/KISS/DRY Gate
- **Next:** Fix and re-run, or scoped verify-* skills

#### `verify-docs`

- **When:** After doc edits; backlog/gate alignment
- **Prerequisites:** `docs/` changes
- **Invoke:** `/verify-docs` — validate backlog Related Docs
- **Outputs:** Layer/metadata/gate violations
- **Next:** `docs-plan` / `docs-dev`

#### `verify-ui`

- **When:** After React/TSX UI work
- **Prerequisites:** `docs/02_UI_Screens/`, HTML Preview
- **Invoke:** `/verify-ui` — does UI match docs?
- **Outputs:** Screen/flow/state mismatches
- **Next:** `rules-react`

#### `verify-code`

- **When:** Pre-PR code quality, overengineering
- **Prerequisites:** Code changes
- **Invoke:** `/verify-code` — pre-PR review
- **Outputs:** Issue table (YAGNI/KISS/DRY tags)
- **Next:** Fix or `verify-implementation`

#### `verify-security`

- **When:** auth, API, middleware, env, DB changes
- **Prerequisites:** Security-sensitive changes
- **Invoke:** `/verify-security` — OWASP check
- **Outputs:** Vulnerabilities, auth, secrets
- **Next:** Fix and re-run

#### `verify-performance`

- **When:** Page, layout, images, bundle; pre-deploy
- **Prerequisites:** Frontend performance impact
- **Invoke:** `/verify-performance` — Lighthouse check
- **Outputs:** LCP, CLS, bundle, image issues
- **Next:** Fix and re-run

#### `verify-drizzle-schema`

- **When:** Drizzle schema/migration changes
- **Prerequisites:** `DB_SCHEMA.md` or equivalent
- **Invoke:** `/verify-drizzle-schema` — schema alignment
- **Outputs:** Schema/doc mismatches
- **Next:** `docs-dev`

#### `verify-skills`

- **When:** solmate-skills package edit, pre-publish
- **Prerequisites:** `SKILL.md`, `package.json`, `README.md`, `AGENTS.md` changes
- **Invoke:** `/verify-skills` — release readiness
- **Outputs:** CLI, frontmatter, version sync, npm pack
- **Next:** `npm publish`

### 5.5. External extensions

#### `ext-awesome-design`

- **When:** Premium design tokens, DESIGN.md, brand UI styles
- **Prerequisites:** None (reference library)
- **Invoke:** Reference stripe DESIGN.md from ext-awesome-design
- **Outputs:** Design reference, DESIGN.md draft
- **Next:** `docs-plan`, `rules-react`

#### `ext-k-skill`

- **When:** Korea-specific data (law, delivery, KTX, fine dust, etc.)
- **Prerequisites:** Per-feature setup in ext-k-skill package
- **Invoke:** See ext-k-skill README and feature guides
- **Outputs:** Feature-specific API results
- **Next:** None (tooling)

> `ext-k-skill` is separate from the core Solmate workflow. Run `k-skill-setup` and per-feature docs after install.

---

## 6. Documentation System

### Which skill writes which docs

```text
Product vision, Lean Canvas, UI design  →  docs-plan
DB schema, API specs, roadmap, QA       →  docs-dev
Unsure which layer?                     →  rules-docs
```

### 5-Layer structure

```text
docs/
├── 01_Concept_Design/   ← docs-plan
├── 02_UI_Screens/       ← docs-plan (+ previews/)
├── 03_Technical_Specs/  ← docs-dev
├── 04_Logic_Progress/   ← docs-dev
└── 05_QA_Validation/    ← docs-dev
```

---

## 7. Gates (detail)

### HTML UI Preview Gate

- Path: `docs/02_UI_Screens/previews/`
- Link from UI docs with relative paths
- Show HTML to user before implementation; record feedback

### UI-First Gate

- Screen structure, user paths, CTAs, data flow
- Loading, empty, error states before coding

### Component & Library Planning Gate

- shadcn/ui, custom, reused components
- Libraries to add/avoid, preset action (`init --preset`, `apply --preset`, etc.)
- Record in backlog `Component & Library Plan`

### Backlog Context Lock

Required fields per item in `docs/04_Logic_Progress/00_BACKLOG.md`:

- `Related Concept Docs`, `Related UI Docs`, `Related HTML Preview`
- `Related Technical Docs`, `Related QA Docs`
- `Work Type`, `Implementation Preconditions`, `Component & Library Plan`
- `Context Receipt`, `Change Receipt`, `Verification Receipt`
- `Acceptance Criteria`, `Document Sync Check`

Use `N/A - reason` when a doc does not exist. Pause implementation if a missing doc blocks a safe decision.

### Agent Harness Gate

- Canonical contract: `rules-workflow/resources/agent-harness-contract.md`
- `code` and `deploy`: Context Receipt before implementation; Verification Receipt before Done, PR, merge, publish, or deploy
- `docs` and `prototype`: advisory receipts
- Context and Verification agents are read-only
- Verification details must link to an existing `docs/05_QA_Validation/` document or GitHub PR
- Default CLI mode is `warning`; `--strict` returns a blocking non-zero exit

### YAGNI/KISS/DRY Gate

- **Canonical:** `rules-dev` § Minimal Implementation Gate
- Referenced by `rules-workflow`, `verify-code` Area 3, `verify-implementation` report
- Prototype/spike: advisory only; do not drop security, validation, or error handling for "simplicity"

### Backlog item template

<a id="backlog-item-template"></a>

```markdown
### [ ] TASK-000: Implement feature name

- Status: ToDo
- Work Type: code
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
- Context Receipt:
  - Status: PENDING
  - Required References Read:
    - PENDING - repeat every linked Related document after reading it
  - Constraints:
    - PENDING - extracted implementation constraints
  - Conflicts: PENDING - use `None` only after checking
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
- Change Receipt:
  - Files Changed:
    - PENDING
  - Requirements Covered:
    - PENDING
  - Excluded Scope: PENDING
  - Basic Checks:
    - PENDING
  - Remaining Risks: PENDING
- Verification Receipt:
  - Status: PENDING
  - Commands and Results:
    - PENDING - `command` - PASS/FAIL - exact scope and result
  - Unrun Checks:
    - PENDING - skipped checks and reasons
  - Detailed Evidence:
    - PENDING - link an existing QA document or GitHub PR
- Document Sync Check:
  - [ ] No mismatch between implementation and linked documents
  - [ ] Update related documents if implementation changes the agreed behavior
```

---

## 8. Hooks (Claude Code suggestions)

Keyword and file-pattern **suggestions** (not forced runs):

```bash
npx solmate-skills@latest install hooks
bash .agent/skills/hooks/install.sh
```

| Script | Event | Examples |
|:---|:---|:---|
| `solmate-suggest.sh` | UserPromptSubmit | decisions, security, performance, PR, docs |
| `solmate-watch.sh` | PreToolUse (Write/Edit) | `schema.ts`, `page.tsx`, `SKILL.md`, `AGENTS.md` |

Re-run `install hooks` to pick up 2.0.10 false-positive fixes on existing projects.

---

## 9. Recommended Prompts

**Project diagnosis (new or resume)**

```text
Use /rules-product to diagnose this project's current progress and recommend next steps with a Flow Status Block.
```

**Feature implementation**

```text
Use /rules-workflow for this feature. Start with a Flow Status Block and follow the UI-First flow.
```

**Pre-PR verification**

```text
Run /verify-implementation on current changes. Include a Flow Status Block in the report.
```

---

## 10. Related Documents

| Document | Audience | Content |
|:---|:---|:---|
| [README.md](./README.md) | First-time installers | Install, 5-minute start, changelog |
| [USAGE.md](./USAGE.md) (this file) | Daily users | Cheat sheet, catalog, gates (EN + KO) |
| `AGENTS.md` | Installed project AI | Global rules, skill table, suggestions |
| `<skill>/SKILL.md` | AI agents | Per-skill execution spec |

---

# solmate-skills Usage Guide (Korean)

<a id="solmate-skills-usage-guide-korean"></a>

**언어:** [English (default)](#solmate-skills-usage-guide) · 한국어 (아래)

사람이 읽기 위한 스킬 사용법 가이드입니다.  
에이전트 실행 규칙의 정본은 각 `SKILL.md`와 프로젝트에 링크 또는 설치된 `AGENTS.md`입니다.

---

## 1. 스킬 호출 방법

### Cursor / Claude Code (권장)

채팅에서 슬래시 명령 또는 자연어로 호출합니다.

```text
/rules-product
/rules-workflow를 사용해서 이 기능 구현을 진행해줘
/verify-implementation으로 현재 변경사항을 검증해줘
```

### 설치 위치

```bash
npx solmate-skills@latest install all      # .agent/skills/<skill-name>/ + ./USAGE.md
npx solmate-skills@latest install hooks    # Claude Code 자동 제안 (별도) + ./USAGE.md
npx solmate-skills@latest install agents   # rules-workflow + Claude 프로젝트 에이전트 갱신
```

모든 `install` 명령(단일 스킬, `all`, `hooks`, `agents`)은 `USAGE.md`를 **프로젝트 루트**에 복사합니다. `rules-workflow` 또는 `all` 설치 시 Claude 에이전트도 자동 설치됩니다.

### 로컬 개발 (symlink)

`solmate-skills` 저장소를 직접 수정하며 테스트할 때:

```bash
# 대상 프로젝트 루트에서 실행
bash /path/to/solmate-skills/init-skills.sh
```

`.agent/skills/`가 저장소로 symlink되고, `AGENTS.md`와 `USAGE.md`가 루트에 링크되며, `.claude/agents/`에 Solmate 에이전트가 연결됩니다.

---

## 2. 상황별 스킬 선택 (치트시트)

| 사용자가 말하는 것 | 추천 스킬 | 비고 |
|:---|:---|:---|
| "뭐부터 해야 해?" / 신규 프로젝트 | `rules-product` | **가장 권장하는 시작점** |
| "지금 어디까지 왔지?" / 작업 재개 | `rules-product` | Phase 진단 후 다음 스킬 위임 |
| 비전·린캔버스·화면 설계 문서 | `docs-plan` | Layer 1-2 |
| DB·API·백로그·QA 문서 | `docs-dev` | Layer 3-5 |
| 문서 구조가 맞는지 모르겠음 | `rules-docs` | 5레이어·게이트 규칙 정본 |
| 기능 하나 구현 / 커밋·PR 전 | `rules-workflow` | 18단계 구현 워크플로 |
| React 화면·컴포넌트 구현 | `rules-react` | Component & Library Plan 선행 |
| shadcn/ui 설치·커스터마이징 | `tools-shadcn` | preset init/apply 포함 |
| 코딩 컨벤션·과잉 구현 방지 | `rules-dev` | YAGNI/KISS/DRY **정본** |
| "이거 어떤 기술 쓸까?" / 설계 결정 | `manage-decisions` | 6개 결정 유형 질문 템플릿 |
| PR 전 **전체** 점검 | `verify-implementation` | verify-* 통합 실행 |
| 문서만 점검 | `verify-docs` | 백로그·게이트·메타데이터 |
| UI가 문서와 맞는지 | `verify-ui` | HTML Preview·동선·상태 |
| 코드 품질·과잉 구현만 | `verify-code` | PR 전 코드 리뷰 |
| 보안 점검 | `verify-security` | OWASP Top 10 |
| 성능·Lighthouse | `verify-performance` | Core Web Vitals |
| Drizzle 스키마 | `verify-drizzle-schema` | 스키마 변경 시 |
| solmate-skills 패키지 수정 후 | `verify-skills` | 배포 전 메타데이터 검증 |
| 피치덱 | `docs-pitch` | Layer 1 문서 선행 |
| 사업계획서 | `docs-business` | 정부 지원·투자 심사용 |
| 브랜치·커밋·PR 규칙 (팀원) | `role-team-member` | |
| 배포·DB·PR 리뷰 (팀장) | `role-team-lead` | |
| AI-인간 협업 표준 | `manage-collaboration` | |
| 스킬 패키지 유지보수 | `manage-skills` | verify 스킬 누락 탐지 |
| Obsidian 동기화 | `tools-obsidian` | |
| 프리미엄 디자인 참고 | `ext-awesome-design` | DESIGN.md 템플릿 |
| 한국 특화 서비스 조회 | `ext-k-skill` | 법률·배송·교통 등 |

---

## 3. 핵심 오케스트레이터 관계

| 스킬 | 역할 | 단독 사용 시점 |
|:---|:---|:---|
| `rules-product` | 프로젝트 Phase 진단, Gate 확인, 하위 스킬 위임 | **항상 첫 진입점**으로 권장 |
| `rules-workflow` | 승인된 문서 기준으로 계획→구현→정리→PR (18단계) | 기능 구현·커밋·PR 직전 |
| `verify-implementation` | 변경 파일에 맞춰 verify-* 순차 실행·통합 보고 | PR·배포 전 최종 점검 |

### 에이전트 하네스 순서

`Work Type`이 `code` 또는 `deploy`인 백로그 작업은 다음 순서로 진행합니다.

```text
Coordinator
  -> 읽기 전용 Context Agent -> Context Receipt
  -> Implementation Agent    -> Change Receipt
  -> 읽기 전용 Verifier      -> Verification Receipt
  -> Coordinator 완료 판단
```

- Claude Code는 `.claude/agents/solmate-*.md`를 사용합니다.
- Codex는 `rules-workflow/resources/agent-harness-contract.md`의 같은 계약을 subagent 또는 별도 task에 전달합니다.
- 검증자는 문제를 직접 수정하지 않고 Implementation Agent로 돌려보냅니다.
- Receipt 요약은 백로그에, 상세 검증 근거는 QA 문서 또는 GitHub PR에 남깁니다.
- 처음 5개 실제 작업은 warning으로 확인한 뒤 blocking으로 전환합니다.

```bash
npx solmate-skills preflight TASK-000 --strict
npx solmate-skills verify TASK-000 --strict
```

### verify-* 개별 vs 통합

| 상황 | 사용 |
|:---|:---|
| PR·배포 전 전체 점검 | `verify-implementation` |
| 문서만 수정함 | `verify-docs` |
| TSX 화면만 수정함 | `verify-ui` |
| API·auth·env 수정함 | `verify-security` (+ 필요 시 `verify-code`) |
| 스키마만 수정함 | `verify-drizzle-schema` |
| solmate-skills 저장소 자체 수정 | `verify-skills` |

---

## 4. 전체 파이프라인 (Gate 포함)

```text
Phase 1  기획문서          → docs-plan (01_Concept_Design)
Phase 2  UI 설계 문서     → docs-plan (02_UI_Screens)
         HTML UI Preview Gate   → previews/ HTML + 사용자 피드백
         UI-First Gate          → 화면·동선·데이터 흐름·상태 확인
         Pre-Code Technical Brief → API·상태·acceptance criteria 합의
         Component & Library Planning Gate → shadcn·커스텀·재사용·라이브러리 계획
         Context Receipt Gate → 읽기 전용 에이전트의 관련 문서 확인
Phase 3  React 구현       → rules-react (+ tools-shadcn)
Phase 4  개발문서         → docs-dev (03~05)
Phase 5  독립 품질 검증   → Verification Receipt + verify-implementation
Phase 6  전달물 (선택)    → docs-pitch / docs-business
```

구현 상세: `rules-workflow` (18단계). YAGNI/KISS/DRY **정본**: `rules-dev`.

### Flow Status Block

```text
[Flow]
현재: Phase 2 — UI 설계
Gate: UI-First Gate 진행 중
완료: Phase 1 — Concept
다음: Pre-Code Technical Brief
필요 확인: 화면별 오류 상태
권장 스킬: /docs-plan
```

---

## 5. 스킬 카탈로그 (26개)

각 항목: **언제** / **선행 조건** / **호출 예** / **산출물** / **다음 스킬**  
(스킬 이름·구조는 영문 섹션 [§5](#5-skill-catalog-26-skills)과 동일합니다.)

### 5.1. 운영 및 거버넌스

| 스킬 | 언제 | 다음 스킬 |
|:---|:---|:---|
| `rules-product` | 신규·재개·"뭘 해야 하지?" | Phase별 위임 |
| `rules-workflow` | 기능 구현·18단계·PR 전 | `verify-implementation` |
| `rules-dev` | 컨벤션·과잉 구현 방지 | `rules-workflow` |
| `rules-docs` | 문서 레이어·게이트 확인 | `docs-plan` / `docs-dev` |
| `manage-collaboration` | 브랜치·PR·협업 표준 | role 스킬 |
| `manage-decisions` | 기술·DB·API·UX 결정 | `docs-dev` / `rules-workflow` |
| `manage-skills` | 스킬 패키지 수정 후 | `verify-skills` |
| `role-team-lead` | 팀장 책임·배포 | `verify-implementation` |
| `role-team-member` | 팀원·커밋·PR | `rules-workflow` |

### 5.2. 문서 작성

| 스킬 | 언제 | 산출물 |
|:---|:---|:---|
| `docs-plan` | Layer 1-2, HTML Preview | `01_*`, `02_*`, `previews/` |
| `docs-dev` | Layer 3-5, 백로그 | `03_*` ~ `05_*` |
| `docs-pitch` | 피치덱 | MD 또는 Reveal HTML |
| `docs-business` | 사업계획서 | 사업계획서 MD |

### 5.3. 개발 및 UI

| 스킬 | 언제 | 선행 조건 |
|:---|:---|:---|
| `rules-react` | React 구현 | UI 문서·Preview·Component Plan |
| `tools-shadcn` | shadcn/ui | preset action |
| `tools-obsidian` | Obsidian 동기화 | 볼트 경로 |

### 5.4. 품질 검증

| 스킬 | 언제 |
|:---|:---|
| `verify-implementation` | PR 전 통합 (**기본**) |
| `verify-docs` | 문서·백로그·게이트 |
| `verify-ui` | UI vs 문서 |
| `verify-code` | 코드·과잉 구현 |
| `verify-security` | OWASP |
| `verify-performance` | Lighthouse·CWV |
| `verify-drizzle-schema` | Drizzle 스키마 |
| `verify-skills` | 패키지 배포 전 |

### 5.5. 외부 확장

| 스킬 | 언제 |
|:---|:---|
| `ext-awesome-design` | DESIGN.md·디자인 참고 |
| `ext-k-skill` | 한국 특화 API (코어 워크플로와 별도) |

---

## 6. 문서 시스템 요약

```text
기획·UI 문서  → docs-plan (01, 02)
기술·진행·QA  → docs-dev (03, 04, 05)
레이어 불명   → rules-docs
```

---

## 7. Gate 상세

- **HTML UI Preview Gate:** `docs/02_UI_Screens/previews/`, UI 문서 링크, 사용자 피드백
- **UI-First Gate:** 화면·동선·CTA·데이터 흐름·로딩/빈/오류 상태
- **Component & Library Planning Gate:** shadcn·커스텀·재사용·라이브러리·preset
- **Backlog Context Lock:** Related Docs, Preconditions, Component Plan, Acceptance, Sync Check
- **Agent Harness Gate:** code/deploy 작업은 Context Receipt와 독립 Verification Receipt 필수
- **YAGNI/KISS/DRY Gate:** `rules-dev` 정본; 프로토타입은 기록성 체크

백로그 템플릿: [영문 §7 Backlog item template](#backlog-item-template) (필드명은 영문 유지)

---

## 8. Hooks (Claude Code 자동 제안)

```bash
npx solmate-skills@latest install hooks
bash .agent/skills/hooks/install.sh
```

키워드·파일 패턴에 맞춰 스킬을 **제안**합니다 (강제 실행 아님). 2.0.10 false-positive 수정은 hooks 재설치로 반영.

---

## 9. 권장 프롬프트 모음

**프로젝트 진단**

```text
/rules-product를 사용해서 이 프로젝트의 현재 진행 상태를 진단하고, 다음 작업을 Flow Status Block 기준으로 안내해줘.
```

**기능 구현**

```text
/rules-workflow를 사용해서 현재 기능 작업을 진행해줘. 먼저 Flow Status Block으로 현재 위치를 알려주고, UI-First 흐름에 맞춰 진행해줘.
```

**PR 전 검증**

```text
/verify-implementation으로 현재 변경사항을 전체 검증해줘. Flow Status Block을 포함해서 보고해줘.
```

---

## 10. 관련 문서

| 문서 | 대상 | 내용 |
|:---|:---|:---|
| [README.md](./README.md) | 처음 설치 | 설치, Quick Start |
| [USAGE.md](./USAGE.md) | 일상 사용자 | 영문(기본) + 한국어 |
| `AGENTS.md` | AI | 전역 규칙 |
| `<skill>/SKILL.md` | AI | 스킬별 실행 정본 |
