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

The installer copies each selected skill folder into `.agent/skills/<skill-name>` in your current project and copies [USAGE.md](./USAGE.md) to the project root.

**Detailed usage:** see `USAGE.md` at the project root (English default, Korean below) for the situation-to-skill cheat sheet, orchestrator map, full skill catalog (26 skills), gate details, and recommended prompts.

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
- [USAGE.md](./USAGE.md) adds a bilingual usage guide: English (default) and Korean below, with cheat sheet, orchestrator map, and full skill catalog.

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

Install skills, then invoke one command based on your situation.

| Situation | Start with | Notes |
|:---|:---|:---|
| New project or "where do I start?" | `/rules-product` | Diagnoses phase and delegates to the right skill |
| Implement one feature | `/rules-product` then `/rules-workflow` | Gates must pass before coding |
| Pre-PR / pre-release check | `/verify-implementation` | Runs the verify-* family in order |

**Recommended first line:**

```text
/rules-product
```

### Orchestrator map

```text
rules-product  →  diagnose phase, check gates, delegate
rules-workflow →  plan → implement → verify → PR (18 steps)
verify-implementation →  run verify-* skills and report
```

Full pipeline, gates, backlog template, and all 26 skill entries: **[USAGE.md](./USAGE.md)**

### Flow Status Block

`rules-product` and `rules-workflow` report progress in this format:

```text
[Flow]
현재: Phase 2 — UI 설계
Gate: UI-First Gate 진행 중
완료: Phase 1 — Concept
다음: Pre-Code Technical Brief
필요 확인: 화면별 오류 상태
권장 스킬: /docs-plan
```

### Existing projects

Reinstall from the project root, then diagnose — do not restart from Phase 1 by default.

```bash
npx solmate-skills@latest install all
npx solmate-skills@latest install hooks
```

Example prompts: [USAGE.md §9 Recommended Prompts](./USAGE.md#9-recommended-prompts) (EN) · [§9 권장 프롬프트](./USAGE.md#9-권장-프롬프트-모음) (KO)

---

## Skills at a Glance

26 installable skills plus `hooks`. Category summary:

| Category | Skills |
|:---|:---|
| Orchestration | `rules-product`, `rules-workflow` |
| Rules | `rules-docs`, `rules-dev`, `rules-react`, `manage-collaboration`, `manage-decisions`, `manage-skills` |
| Documentation | `docs-plan`, `docs-dev`, `docs-pitch`, `docs-business` |
| Verification | `verify-implementation`, `verify-docs`, `verify-ui`, `verify-code`, `verify-security`, `verify-performance`, `verify-drizzle-schema`, `verify-skills` |
| Roles | `role-team-lead`, `role-team-member` |
| Tools | `tools-shadcn`, `tools-obsidian` |
| External | `ext-awesome-design`, `ext-k-skill` |

**Situation cheat sheet, per-skill when/prerequisites/outputs/next:** [USAGE.md](./USAGE.md)

---

## Hooks (optional)

For Claude Code, install hooks to get keyword and file-pattern skill suggestions:

```bash
npx solmate-skills@latest install hooks
bash .agent/skills/hooks/install.sh
```

Details: [USAGE.md §8 Hooks](./USAGE.md#8-hooks-claude-code-suggestions) (EN) · [§8 Hooks 한국어](./USAGE.md#8-hooks-claude-code-자동-제안) (KO)
