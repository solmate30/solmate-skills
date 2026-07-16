# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

`solmate-skills` is an npm package that ships curated AI skill files (SKILL.md) to downstream projects. It is **not** an application — it is a skill library and CLI tool. Each installable top-level directory contains `SKILL.md` and is copied into `.agent/skills/<skill-name>` of a target project.

## CLI Commands

```bash
# List available skills
npx solmate-skills list

# Install a specific skill into the current project
npx solmate-skills install <skill-name>

# Install all skills
npx solmate-skills@latest install all

# Refresh native Claude project agents
npx solmate-skills@latest install agents

# Check backlog context and verification receipts
npx solmate-skills preflight TASK-000 --strict
npx solmate-skills verify TASK-000 --strict
```

Run `npm test` to validate the harness receipt parser and blocking behavior. There is no build or lint script.

## Installing Skills via Symlink (Dev)

`init-skills.sh` creates symlinks from a target project's `.agent/skills/` to this repo, links `AGENTS.md` and `USAGE.md` to the project root, and links the namespaced Claude project agents under `.claude/agents/`. Run it from inside the target project:

```bash
bash /Users/namhyeongseog/Documents/solmate-skills/init-skills.sh
```

## Repository Structure

```
bin/cli.js          — CLI entrypoint; discovers skills as top-level dirs, copies them to .agent/skills/
bin/harness-check.js — Backlog Context/Verification Receipt parser and blocking checks
AGENTS.md           — Global AI collaboration rules (linked into target projects)
init-skills.sh      — Symlink installer for local development
<skill-name>/
  SKILL.md          — Frontmatter + instructions consumed by the AI agent
  templates/        — (optional) document templates
  resources/        — (optional) reference files
  examples/         — (optional) example outputs
  adapters/         — (optional) runtime-specific thin adapters; canonical policy remains in resources/
```

Skills discovered by `bin/cli.js` = any top-level directory not in `IGNORED_FOLDERS` (`bin`, `node_modules`, `.git`, `.github`, `.gemini`, `.agent`).

## Adding or Modifying Skills

- Each skill lives in its own top-level directory and must contain a `SKILL.md`.
- `SKILL.md` frontmatter fields: `name`, `description`, and optionally `disable-model-invocation`, `argument-hint`.
- After adding a skill, run `/manage-skills` to check for coverage gaps in `verify-*` skills.
- Keep `AGENTS.md` and `README.md` skill tables in sync when adding or removing skills.

## AGENTS.md — Global AI Rules

`AGENTS.md` is the authoritative rules file that gets linked into every project. Key rules it enforces (relevant to working in this repo):

- **No emojis** in any AI output.
- **Answer before acting**: explain before modifying files; get explicit approval.
- **Self-Reflection Check**: before any file edit, confirm the user was informed, gave approval, and the change is safe.
- **Conventional Commits in Korean**: `type(scope): 한글 요약` (e.g. `feat(login): 소셜 로그인 API 연동`).
- **5-Layer doc structure**: `docs/01_Concept_Design/`, `02_UI_Screens/`, `03_Technical_Specs/`, `04_Logic_Progress/`, `05_QA_Validation/`.
- **Backlogs and roadmaps** belong exclusively in `docs/04_Logic_Progress/`.
- **Agent Harness Gate**: code/deploy work requires a passing Context Receipt before implementation and an independent Verification Receipt before completion or release.

## Skill Categories

| Category | Skills |
|---|---|
| Rules / Governance | `rules-docs`, `rules-dev`, `rules-workflow`, `manage-collaboration`, `manage-decisions`, `manage-skills` |
| Documentation | `docs-plan`, `docs-dev`, `docs-pitch`, `docs-business`, `verify-docs`, `tools-obsidian`, `ext-awesome-design`, `ext-k-skill` |
| Development Workflow | `rules-product`, `verify-implementation`, `verify-drizzle-schema`, `verify-security`, `verify-performance`, `verify-code` |
| UI / Frontend | `rules-react`, `tools-shadcn` |
| Role-based | `role-team-lead`, `role-team-member` |

## Publishing

This package is published to npm as `solmate-skills`. Bump `version` in `package.json` and publish via `npm publish` when releasing changes.
