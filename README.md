# solmate-skills

Reusable AI-agent harness and workflow skills for disciplined product work.

`solmate-skills` packages the Solmate workflow as installable skills: plan the product, create browser-viewable UI previews, lock backlog tasks to their source documents, prove that required context was read, plan components and libraries before coding, implement with YAGNI/KISS/DRY approval gates, and independently verify the result before release.

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

# Refresh native Claude agents for the shared harness
npx solmate-skills@latest install agents
```

The installer copies each selected skill folder into `.agent/skills/<skill-name>` in your current project and copies [USAGE.md](./USAGE.md) to the project root. Installing `rules-workflow` or `all` also installs the namespaced Claude project agents under `.claude/agents/`; Codex uses the same canonical contract through `rules-workflow`, reinforced by `AGENTS.md` when that file is linked into the project.

**Detailed usage:** see `USAGE.md` at the project root (English default, Korean below) for the situation-to-skill cheat sheet, orchestrator map, full skill catalog (26 skills), gate details, and recommended prompts.

## What You Get

- **Product workflow orchestration**: `/rules-product` diagnoses the current phase and routes the agent to the right next skill.
- **UI-first planning**: `/docs-plan` creates concept and screen documents before implementation starts.
- **HTML UI Preview Gate**: major screens and flows must have browser-viewable HTML previews under `docs/02_UI_Screens/previews/`.
- **Backlog Context Lock**: every backlog item must link the Concept, UI, HTML Preview, Technical Spec, and QA documents needed for implementation.
- **Component & Library Planning Gate**: React work must name the shadcn/ui components, custom components, reused components, libraries to add, libraries to avoid, and preset action before coding.
- **YAGNI/KISS/DRY Gate**: `rules-dev` is the canonical source for avoiding future-only features, preferring the simplest existing/native path, and removing only true duplicate knowledge.
- **Implementation workflow**: `/rules-workflow` keeps coding work tied to approved documents, preconditions, and acceptance criteria.
- **Agent harness**: a read-only Context Agent proves required documents were read, an Implementation Agent returns a scoped change summary, and a read-only Verification Agent provides independent evidence before completion.
- **Machine-checkable receipts**: `preflight TASK-ID` checks linked document coverage and `verify TASK-ID` checks command results plus QA/PR evidence; `--strict` turns findings into blocking exit codes.
- **Versioned harness artifacts**: `validate-harness` checks v1 task manifests, structured messages, ordered state events, role activation, evidence gates, and exclusive write ownership.
- **Release verification**: `/verify-implementation` runs the verification family for docs, UI, code, security, performance, DB schema, and skill package readiness.

## Unreleased: Agent Harness Contracts

The next release strengthens the existing Solmate workflow with a shared Claude/Codex agent harness. It addresses two recurring failure modes in long AI-assisted projects:

1. An implementation starts from a backlog item without reading the linked concept, UI, technical, and QA documents.
2. An agent marks work complete based only on its own summary, without independent verification evidence.

The harness makes both boundaries explicit and machine-checkable while preserving the existing skill installation and backlog format.

### How the harness works

```text
Coordinator
  -> read-only Context Agent -> Context Receipt
  -> Implementation Agent    -> Change Receipt
  -> read-only QA Inspector   -> Verification Receipt
  -> Done / PR / merge / publish / deploy
```

- **Context Receipt** records every required backlog reference that was read, the extracted constraints, and any conflict found before implementation.
- **Change Receipt** records changed files, covered requirements, excluded scope, checks, and remaining risks. It is a handoff, not independent proof.
- **Verification Receipt** records commands, results, unrun checks, detailed QA evidence, and the independent PASS/FAIL decision.
- Code and deploy tasks are blocked from implementation without Context evidence and from completion without Verification evidence. Documentation and prototype work remain advisory.

The canonical contract lives at [`rules-workflow/resources/agent-harness-contract.md`](./rules-workflow/resources/agent-harness-contract.md).

### Backlog Receipt checks

Existing projects can keep their current `00_BACKLOG.md` workflow and add the checks incrementally:

```bash
# Confirm required linked documents were read before coding
npx solmate-skills preflight TASK-000

# Confirm independent command and QA/PR evidence before completion
npx solmate-skills verify TASK-000

# Turn findings into blocking exit codes for CI or release gates
npx solmate-skills preflight TASK-000 --strict
npx solmate-skills verify TASK-000 --strict
```

### Versioned manifest, message, and event checks

Projects that need structured multi-agent coordination can opt into the v1 contract without rewriting existing backlog Receipts:

```bash
npx solmate-skills validate-harness manifest _workspace/harness/TASK-000/manifest.json
npx solmate-skills validate-harness message _workspace/harness/TASK-000/attempt-01/messages/msg-001.json \
  --manifest _workspace/harness/TASK-000/manifest.json
npx solmate-skills validate-harness events _workspace/harness/TASK-000/events.jsonl \
  --manifest _workspace/harness/TASK-000/manifest.json
```

[`agent-harness-v1.schema.json`](./rules-workflow/resources/agent-harness-v1.schema.json) defines the manifest, message, and state-event shapes. The validator additionally checks task identity, legal state transitions, active roles, message authority, required evidence, canonical file paths, and exclusive write ownership.

| Mode / result | Exit code | Behavior |
|:---|:---:|:---|
| Default warning mode, valid | `0` | Reports PASS |
| Default warning mode, contract finding | `0` | Reports findings without blocking migration |
| `--strict`, contract finding | `1` | Blocks the workflow or CI step |
| Invalid command input, unreadable file, malformed JSON/JSONL | `2` | Reports an operational error |

### Compatibility and current scope

- Existing `preflight`, `verify`, and backlog Receipt fixtures continue to work without structured artifact files.
- The structured v1 contract is opt-in and warning-first; projects can move to `--strict` after a real-task pilot.
- The implementation uses the Node standard library and adds no runtime dependency.
- Claude Code can install the current namespaced `solmate-*` project agents with `install agents`; Codex follows the same canonical contract through its available delegation mechanism.
- Specialist personas, runtime orchestration, persistent recovery, pilot automation, and blocking rollout remain separate follow-up work.
- This section documents unreleased work. The package version remains `2.0.12` until a release version is approved.

## What's New in 2.0.12

`solmate-skills@2.0.12` adds a bilingual usage guide and copies it into every target project on install.

- [USAGE.md](./USAGE.md) documents all 26 skills in English (default) with Korean below: cheat sheet, orchestrator map, gates, and prompts.
- `npx solmate-skills install` (single skill, `all`, or `hooks`) now copies `USAGE.md` to the project root.
- [README.md](./README.md) is trimmed to a 5-minute start; detailed usage lives in `USAGE.md`.
- `init-skills.sh` symlinks `USAGE.md` alongside `AGENTS.md` for local development.

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

`install all` installs only skill folders that contain `SKILL.md` and adds the namespaced Claude agent adapters. Use `install hooks` separately when you want prompt/file-change suggestions. Use `install agents` to refresh `rules-workflow`, its canonical contract, and the native Claude adapters in an existing project.

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
npx solmate-skills@latest install agents
```

For a `code` or `deploy` backlog item:

```bash
npx solmate-skills preflight TASK-000 --strict
npx solmate-skills verify TASK-000 --strict
```

Example prompts: [USAGE.md §9 Recommended Prompts](./USAGE.md#9-recommended-prompts) (EN) · [§9 권장 프롬프트](./USAGE.md#9-권장-프롬프트-모음) (KO)

---

## Skills at a Glance

26 installable skills plus `hooks` and `agents` utilities. Category summary:

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
