---
name: role-team-member
description: Enforces Team Member protocols including branching strategy, commit conventions (Conventional Commits in Korean), and PR creation processes.
---

# Team Member Role Skill

This skill ensures the AI agent follows the standard operating procedures for a developer/contributor role within the team.

## 1. Core Reference Document

The AI MUST strictly follow the protocols defined in:
- **Team Member Guide**: [11_COLLABORATION_GUIDE.md](../../../docs/03_Technical_Specs/11_COLLABORATION_GUIDE.md)

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
