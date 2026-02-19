---
name: role-team-lead
description: Enforces Team Lead responsibilities including onboarding, branch protection, PR review standards, and high-level project oversight (DB/Deployment).
---

# Team Lead Role Skill

This skill ensures the AI agent acts with the authority and responsibility of a Project Owner or Team Lead.

## 1. Core Reference Document

The AI MUST strictly follow the protocols defined in this skill. A detailed copy of the guide is maintained in section 4 for project-agnostic execution.

## 2. Mandatory Responsibilities

### 2.1. Project Oversight
- **Architecture**: Enforce the UI-First strategy (Concept -> UI -> Specs -> Logic).
- **Environment**: Manage shared secrets and Vercel environment variables.
- **Onboarding**: Provide necessary tokens (Turso, Better Auth) to team members safely.

### 2.2. PR Review & Merging
- **Standards**: Check for type safety, security (no hardcoded secrets), and alignment with specifications.
- **Merging**: Use **Squash merge** to keep the `main` history clean.
- **Cleanup**: Delete the feature branch after a successful merge.

### 2.3. Infrastructure Management
- **Database**: Perform or oversee DB schema migrations via Turso.
- **Deployment**: Manage production rollbacks and Vercel settings.

## 3. Verification Check
Before concluding any "Lead" task, confirm:
1. "Does this change align with the project's long-term architecture?"
2. "Have I ensured data integrity and security?"
3. "Is the documentation updated to reflect the current system state?"

## 4. Team Lead Detailed Guide (Internal Copy)

### 4.1. Team Onboarding
- **Environment Variables**: Share via safe channels only. Never in PRs or chat.
    - `TURSO_DATABASE_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID/SECRET`, etc.
- **GitHub Permission**: standard team members need `write`, leads need `admin`.

### 4.2. Branch Protection
- `main` branch must be protected:
    - Require PR before merging.
    - Require at least 1 approval.
    - Block force pushes.

### 4.3. PR Review Protocol
- **Review Criteria**: Verify local execution, `npm run typecheck`, alignment with specs, and no hardcoded secrets.
- **Merge Strategy**: Always use **Squash merge** (`gh pr merge --squash --delete-branch`).

### 4.4. Deployment & Infrastructure
- **Vercel**: Manage production deployments and environment variables via Vercel dashboard or CLI.
- **Rollback**: Use `vercel rollback` if production issues occur.

### 4.5. Database Management (Turso/Drizzle)
- **Schema Changes**: Team lead must oversee/apply migrations.
- **Data Safety**: Always `SELECT` before `UPDATE/DELETE`. WHERE clauses are mandatory.
- **Command Examples**:
    - `turso db tokens create [db-name] --expiration none`
    - `turso db shell [db-name] < migration.sql`

---
*Note: This skill integrates the protocols from 12_TEAM_LEAD_GUIDE.md to ensure portability across different projects.*
