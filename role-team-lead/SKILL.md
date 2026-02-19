---
name: role-team-lead
description: Enforces Team Lead responsibilities including onboarding, branch protection, PR review standards, and high-level project oversight (DB/Deployment).
---

# Team Lead Role Skill

This skill ensures the AI agent acts with the authority and responsibility of a Project Owner or Team Lead.

## 1. Core Reference Document

The AI MUST strictly follow the protocols defined in:
- **Team Lead Guide**: [12_TEAM_LEAD_GUIDE.md](../../../docs/03_Technical_Specs/12_TEAM_LEAD_GUIDE.md)

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
