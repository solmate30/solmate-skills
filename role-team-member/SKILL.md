---
name: role-team-member
description: Enforces Team Member protocols including branching strategy, commit conventions (Conventional Commits in Korean), and PR creation processes.
---

# Team Member Role Skill

This skill ensures the AI agent follows the standard operating procedures for a developer/contributor role within the team.

## 1. Core Reference Document

The AI MUST strictly follow the protocols defined in this skill. A detailed copy of the guide is maintained in section 4 for project-agnostic execution.

## 2. Mandatory Protocols

### 2.1. Git & Branching
- **Source**: Always branch from `main`.
- **Branch Naming**:
  - `feat/feature-name`
  - `fix/bug-name`
  - `chore/task-name`
  - `refactor/cleanup-name`
- **Conventional Commits (Korean)**: `type(scope): 설명`
  - Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `style`.
  - Example: `feat(booking): 예약 날짜 선택 UI 구현`

### 2.2. Development Flow
- Run `npm run typecheck` in the `web/` directory before pushing.
- Use `git push origin branch-name`.

### 2.3. Pull Request (PR)
- **Base Branch**: Always target `main`.
- **Merge Block**: Never push directly to `main`.
- **CI/CD**: Ensure Vercel Preview deployment succeeds.

## 3. Verification Check
Before finishing a "Member" task, confirm:
1. "Did I use the correct branch name and commit format?"
2. "Did I run a typecheck if applicable?"
3. "Did I describe the changes clearly for the Team Lead's review?"

## 4. Team Member Detailed Guide (Internal Copy)

### 4.1. Initial Setup
- **Clone & Install**: Clone the repo and run `npm install` in the `web/` directory.
- **Environment**: Create `web/.env.local` based on `.env.example`. Request common secrets (Turso, Better Auth, OAuth keys) from the Team Lead.

### 4.2. Branching & Commits
- **Always branch from latest `main`**:
    ```bash
    git checkout main && git pull origin main
    git checkout -b feat/your-feature
    ```
- **Commit Format**: `type(scope): 한국어 설명`
    - Use `feat`, `fix`, `chore`, `refactor`, `docs`, `style`.
    - Example: `feat(auth): 로그인 유효성 검사 추가`

### 4.3. Development & PR
- **Typecheck**: Always run `npm run typecheck` before pushing.
- **Pushing**: `git push origin [branch-name]`
- **PR Creation**: Target `main`. Include a clear description of changes and a checklist of verification steps.
- **Conflicts**: Prefer `rebase` over `merge` to keep history clean.
    ```bash
    git fetch origin && git rebase origin/main
    ```

### 4.4. Project Structure (Typical)
- `web/app/routes/`: Page routes.
- `web/app/components/`: Shared UI components.
- `web/app/db/`: Drizzle schemas and client.
- `web/app/services/`: External integrations (AI, etc.).

---
*Note: This skill integrates the protocols from 11_COLLABORATION_GUIDE.md to ensure portability across different projects.*
