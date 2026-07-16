# Agent Harness Contract
> Created: 2026-07-17 00:33
> Last Updated: 2026-07-17 01:53

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

The Coordinator owns internal harness operation. It resolves the backlog task, runs `preflight`, `verify`, and any opted-in structured validation, then reports results in plain language. It must never tell the user to type an internal CLI command, supply a task ID, or create a Receipt merely to advance a normal feature request.

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

The Coordinator or CI runs the machine checks internally:

```bash
npx solmate-skills preflight TASK-000
npx solmate-skills verify TASK-000
npx solmate-skills preflight TASK-000 --strict
npx solmate-skills verify TASK-000 --strict
```

`--strict` is an alias for `--mode blocking`. The default backlog path is `docs/04_Logic_Progress/00_BACKLOG.md`; override it with `--backlog <path>`.

These commands are runtime and CI interfaces, not the normal human workflow. When a check blocks progress, explain the missing document, evidence, or failed verification and the decision needed from the user.

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

## 6. Versioned Structured Artifacts

The existing backlog Receipts remain valid. Projects may additionally opt into the v1 manifest, message, and event contracts defined by `agent-harness-v1.schema.json` in this directory. The Coordinator or CI manages these artifacts; a normal feature requester does not create or validate them manually.

```bash
npx solmate-skills validate-harness manifest _workspace/harness/TASK-000/manifest.json
npx solmate-skills validate-harness message _workspace/harness/TASK-000/attempt-01/messages/msg-001.json --manifest _workspace/harness/TASK-000/manifest.json
npx solmate-skills validate-harness events _workspace/harness/TASK-000/events.jsonl --manifest _workspace/harness/TASK-000/manifest.json
```

Rules:

- Structured validation defaults to `warning`; add `--strict` or `--mode blocking` for non-zero contract failures.
- Message and event validation requires `--manifest` so active roles, task identity, attempt, receipts, and current state can be checked together.
- Exit `0` means pass or warning-mode findings, exit `1` means a blocking contract failure, and exit `2` means an operational error such as a missing file or malformed JSON.
- Only the Coordinator may record state transitions.
- `COMPLETE` requires passing Requirements or an approved skip, Context, Design or an approved skip, Change, and Verification Receipt evidence in the manifest.
- Core code/deploy roles must be active, read-only roles cannot own write paths, and overlapping exclusive ownership across roles is rejected.
- Write scopes must use canonical project-relative paths; aliases such as `./`, duplicate separators, and embedded `.` segments are rejected. Recursive ownership uses only `directory/**` or `**`.
- Event logs begin at `INTAKE`, use contiguous sequence numbers, preserve state continuity, and require evidence for gated transitions.
- In v1, `attempt` increments only when `REWORK` returns to `IMPLEMENTING`; cancellation and ordinary state progress retain the current attempt. Operational retry events belong to the later orchestration/recovery phase.
- Direct peer `STATUS` and `QUESTION` messages may use only `INFO` or `PENDING`; PASS, FAIL, BLOCKED, decisions, rework, and completion claims route through Coordinator.
- The top-level schema uses `oneOf` so a standard Draft 2020-12 validator can validate one manifest, message, or event object. Each non-empty JSONL line is an event object.
- Timestamps use the Solmate canonical RFC 3339 profile: uppercase `T`/`Z`, years `0001` through `9999`, seconds `00` through `59`, and a required UTC marker or numeric offset. Leap-second and lowercase variants are intentionally excluded for deterministic interoperability.

### 6.1 Compatibility Migration

1. Existing projects may continue using backlog Receipts and the current `preflight` / `verify` commands without creating structured artifacts.
2. An opting-in project creates `manifest.json` and `events.jsonl`, then runs `validate-harness` in the default warning mode.
3. Message and event artifacts use `schema_version: 1`; unsupported versions are reported without rewriting the files.
4. Projects record warning findings during the five-task pilot before enabling `--strict` in automation.
5. Blocking rollout, migration of existing tasks, and removal of compatibility behavior require separate user approval.

## 7. Runtime Adapters

### Claude Code

Project agents are installed under `.claude/agents/`:

- `solmate-context-reader.md`
- `solmate-implementer.md`
- `solmate-verifier.md`

The main Claude session remains the Coordinator.

### Codex

The main Codex task remains the Coordinator. Use available subagents or separate tasks for Context and Verification, passing the relevant role section and receipt contract from this file. `rules-workflow/SKILL.md` is the required Codex adapter, and a linked project `AGENTS.md` reinforces it when present. No unsupported `.codex/agents/` format is assumed.

## 8. Related Documents

- [Implementation Workflow](../SKILL.md) - invokes this contract at implementation and verification gates
- Project root `USAGE.md` - human-facing installation and command reference
