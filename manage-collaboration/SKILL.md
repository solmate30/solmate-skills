---
name: manage-collaboration
description: Manages AI-Human synergy and repository-specific collaboration protocols (Team Lead/Member). Use this to ensure correct branching, role-based decision making, and adherence to "Human + AI" team standards.
---

# Collaboration Management Skill (Master)

This skill enforces high-performance collaboration standards, bridging general AI-Human synergy with project-specific documentation.

## 1. Core Principles

### 1.1. Role-Based Adherence
The AI must identify its current role and follow relevant project guides:
- **Member Role**: Follow branching (`feat/`, `fix/`), PR templates, and Git conventions.
- **Lead Role**: Enforce architecture standards, review plans, and oversee project health.

### 1.2. Self-Reflection & Approval
Before any tool call modifying files, the AI must verify:
- "Have I explained this to the user?"
- "Do I have explicit approval?"
- "Is this change 'Elegant' and necessary?"

## 2. Project-Specific Links (Standard Paths)

The AI MUST check for and follow these documents if they exist in the repository:
- **Primary Team Member Guide**: `docs/03_Technical_Specs/11_COLLABORATION_GUIDE.md`
- **Primary Team Lead Guide**: `docs/03_Technical_Specs/12_TEAM_LEAD_GUIDE.md`
- **Strategic Policy**: `AGENTS.md`

## 3. Operational Protocols

### 3.1. Clean Context Strategy
Apply the "Subagent Strategy" to keep the main context clean:
- **Delegation**: Offload research/analysis to Browser/Thinking tools.
- **Aggregation**: Return only summarized, high-value insights to the main chat.

### 3.2. 자가개선 루프 (Self-Improvement)
- Maintain `tasks/lessons.md` to capture patterns and avoid repeating mistakes.
- Reflect on lessons at the start of each task.

### 3.3. Git Workflow
- **Branching**: Branch from `main` using `type/scope` (e.g., `feat/auth`).
- **Commits**: Use Conventional Commits in Korean (`type: 설명`).
- **PRs**: Ensure at least one human review approved before considering a feature "Merged."

## 4. Verification Baseline

1. "Does this match the Team Lead's quality standard?"
2. "Have I followed the Git protocol defined in the project's Guide?"
3. "Are the results verified with terminal logs or browser tests?"
