# Agent Harness Contract
> Created: 2026-07-17 00:33
> Last Updated: 2026-07-17 00:33

This file is the canonical contract for the Solmate implementation harness. Runtime-specific adapters must reference this file instead of copying the full policy.

## 1. Scope

The harness is mandatory for `code` and `deploy` backlog tasks.

- `docs`: agent delegation is optional; document verification still follows the relevant verify skill.
- `prototype`: receipts are advisory unless safety, security, data preservation, or user approval is involved.
- If a runtime cannot provide an independent worker, report `Degraded - independent agent unavailable` and obtain user approval before treating verification as complete.

## 2. Roles

### Coordinator

The main conversation owns phase diagnosis, user approval, handoffs, and final status. In `blocking` mode it must not allow a code or deploy task to move:

- to implementation without a passing Context Receipt;
- to Done, PR, merge, publish, or deploy without a passing Verification Receipt;
- past a failed receipt without returning the task to the responsible role.

### Context Agent

Read-only. Read every linked backlog reference and return a Context Receipt. Do not edit files, run destructive commands, or implement the task.

### Implementation Agent

Write-capable. Start only after the Coordinator accepts the Context Receipt. Implement only the approved scope and return a Change Receipt. New requirements go back to the Coordinator.

### Verification Agent

Read-only except for a user-approved verification report. Independently inspect the diff and run relevant checks. Do not fix findings. Return failures to the Implementation Agent through the Coordinator.

## 3. Handoff Sequence

```text
User approval
  -> Coordinator
  -> Context Agent
  -> Context Receipt
  -> Implementation Agent
  -> Change Receipt
  -> Verification Agent
  -> Verification Receipt
  -> Coordinator completion decision
```

Context gathering and verification are sequential gates. Independent document searches or test groups may run in parallel inside their own role when they do not write the same files.

## 4. Enforcement Modes

- `warning`: report missing or invalid receipt fields but return a successful process exit. Use for the first five real tasks to calibrate false positives.
- `blocking`: return a non-zero process exit for missing or invalid mandatory evidence. Use after calibration.

In warning mode the Coordinator records findings and asks the user before proceeding. Warning mode must never be reported as a PASS.

The two mandatory failures are always visible in both modes:

1. a linked required document was not recorded as read;
2. a code or deploy task has no passing verification evidence.

Run the machine checks with:

```bash
npx solmate-skills preflight TASK-000
npx solmate-skills verify TASK-000
npx solmate-skills preflight TASK-000 --strict
npx solmate-skills verify TASK-000 --strict
```

`--strict` is an alias for `--mode blocking`. The default backlog path is `docs/04_Logic_Progress/00_BACKLOG.md`; override it with `--backlog <path>`.

## 5. Receipt Contracts

Keep receipt summaries inside the backlog item. Verification details must link to a QA document or PR.

### Context Receipt

```markdown
- Context Receipt:
  - Status: PASS
  - Required References Read:
    - [Product Specs](../01_Concept_Design/03_PRODUCT_SPECS.md) - constraints extracted
    - [API Specs](../03_Technical_Specs/02_API_SPECS.md) - contract extracted
  - Constraints:
    - Approved scope and behavior constraints
  - Conflicts: None
```

Rules:

- Every relative link in the five `Related ...` fields must exist or use `N/A - reason`.
- Every linked path must appear in `Required References Read`.
- `Status: PASS`, `Constraints`, and `Conflicts` are mandatory.

### Change Receipt

```markdown
- Change Receipt:
  - Files Changed:
    - `path/to/file`
  - Requirements Covered:
    - Acceptance criterion covered by the change
  - Excluded Scope: N/A - no additional scope
  - Basic Checks:
    - `command` - PASS - concise result
  - Remaining Risks: None
```

The Change Receipt is a handoff summary. It is not independent verification and cannot replace the Verification Receipt.

### Verification Receipt

```markdown
- Verification Receipt:
  - Status: PASS
  - Commands and Results:
    - `npm test` - PASS - 42 tests
  - Unrun Checks:
    - N/A - all planned checks ran
  - Detailed Evidence:
    - [QA Report](../05_QA_Validation/10_FEATURE_QA.md) - commands, scope, and results
```

Rules:

- `Status: PASS` is mandatory and the receipt must not contain `FAIL`.
- At least one command result must contain `PASS`.
- `Unrun Checks` must explain skipped checks or explicitly state that all planned checks ran.
- `Detailed Evidence` must link to a QA document or PR.

## 6. Runtime Adapters

### Claude Code

Project agents are installed under `.claude/agents/`:

- `solmate-context-reader.md`
- `solmate-implementer.md`
- `solmate-verifier.md`

The main Claude session remains the Coordinator.

### Codex

The main Codex task remains the Coordinator. Use available subagents or separate tasks for Context and Verification, passing the relevant role section and receipt contract from this file. `rules-workflow/SKILL.md` is the required Codex adapter, and a linked project `AGENTS.md` reinforces it when present. No unsupported `.codex/agents/` format is assumed.

## 7. Related Documents

- [Implementation Workflow](../SKILL.md) - invokes this contract at implementation and verification gates
- Project root `USAGE.md` - human-facing installation and command reference
