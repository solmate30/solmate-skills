# Agent Harness Execution Plan
> Created: 2026-07-17 01:04
> Last Updated: 2026-07-17 02:39

## 1. Objective

Deliver the enhanced harness as a backward-compatible evolution of the existing Context, Implementation, and Verification flow. This plan records future work but does not authorize code changes, publishing, or deployment.

## 2. Delivery Principles

- [ ] Preserve existing `preflight` and `verify` behavior until replacement evidence is complete.
- [ ] Implement one canonical contract and thin runtime adapters.
- [ ] Keep optional specialists conditional and measurable.
- [ ] Use standard JSON/JSONL parsing rather than ad hoc text protocols.
- [ ] Keep QA Inspector independent from implementation.
- [ ] Roll out new enforcement in warning mode for five real tasks.
- [ ] Require separate user approval before code implementation, blocking rollout, merge, publish, or deploy.

## 3. Phase A - Design Baseline

- [x] Record the approved user requirements and scope.
- [x] Define core and optional role responsibilities.
- [x] Define topology-selection rules.
- [x] Define persona contract fields.
- [x] Define workflow states and legal transitions.
- [x] Define canonical document and execution-workspace ownership.
- [x] Define the structured message envelope and routing rules.
- [x] Define error classes, retry limits, and escalation behavior.
- [x] Define Claude Code and Codex adapter boundaries.
- [x] Define traceability and QA scenarios.
- [x] Obtain user review of the completed design baseline.

**Exit Evidence**: Requirements Analysis, Architecture, Decision Log, Backlog, this Execution Plan, and QA Test Scenarios are mutually linked and reviewed.

**Approval Record**: The user approved the design baseline and Phase B implementation on 2026-07-17. Phases C-G remain unapproved until their own gates are reached.

## 4. Phase B - Contract And Validator Implementation

- [x] Extend the canonical harness contract with Requirements, Design, Error, and Release evidence definitions.
- [x] Define a versioned task manifest schema.
- [x] Define a versioned inter-agent message schema.
- [x] Define an append-only event schema for state transitions.
- [x] Implement structured parsing and schema validation.
- [x] Implement legal state-transition validation.
- [x] Implement role activation and `Skipped - reason` validation.
- [x] Implement exclusive write-ownership validation for parallel work.
- [x] Keep existing backlog receipt parsing backward compatible.
- [x] Add unit tests for valid and invalid manifests, messages, events, and transitions.
- [x] Add migration guidance for existing projects.

**Exit Evidence**: Automated tests prove schema versioning, transition rejection, compatibility, and no regression in current receipt checks.

**Completion Evidence**: [Agent Harness Contract Implementation QA](../05_QA_Validation/03_AGENT_HARNESS_CONTRACT_QA.md) records automated checks, external schema compilation, independent QA corrections, and the final PASS Receipt.

## 5. Phase C - Persona And Runtime Adapters

- [ ] Create or update the Requirements Analyst persona.
- [ ] Preserve and update the Context Reader persona.
- [ ] Create the Architect persona.
- [ ] Create the Logic Builder persona.
- [ ] Update the Implementer persona with write ownership and message requirements.
- [ ] Rename or evolve Verifier semantics to QA Inspector without losing read-only enforcement.
- [ ] Create the conditional Release Guardian persona.
- [ ] Add Security Inspector routing to the existing security verification skill rather than duplicating its knowledge.
- [ ] Map Claude Code tools and permissions to each persona.
- [ ] Map Codex delegation instructions to the same persona contracts.
- [ ] Add capability negotiation and degraded-mode reporting.
- [ ] Verify that unrelated user-defined Claude agents remain untouched by installation.

**Exit Evidence**: Both runtimes can execute the same fixture task and produce equivalent contract fields despite different native tools.

## 6. Phase D - Orchestration And Recovery

- [ ] Add minimal linear topology orchestration.
- [ ] Add conditional Expert Pool activation.
- [ ] Add read-only Fan-out/Fan-in for document search and independent test groups.
- [ ] Add Producer-Reviewer rework routing with a two-loop cap.
- [ ] Add Supervisor allocation only for tasks with declared independent ownership.
- [ ] Persist `manifest.json` and `events.jsonl` under a task workspace.
- [ ] Preserve failed attempts and create a new attempt directory on retry.
- [ ] Resume from the latest valid state after interruption.
- [ ] Reject direct peer messages that attempt to change scope or task state.
- [ ] Prevent completion from partial critical artifacts.
- [ ] Redact or reject secrets and sensitive raw data in execution artifacts.

**Exit Evidence**: Recovery fixtures prove that interruption, retry, rework, and degraded capability do not lose prior evidence or bypass a gate.

## 7. Phase E - Incremental QA And Evaluation

- [ ] Add requirements-to-design traceability checks.
- [ ] Add design-to-change traceability checks.
- [ ] Add change-to-verification traceability checks.
- [ ] Add producer-consumer boundary checks for API, type, route, state, and persistence contracts.
- [ ] Verify QA Inspector cannot write implementation files.
- [ ] Verify Implementer cannot self-issue the final Verification Receipt.
- [ ] Test small, medium, and complex topology selection.
- [ ] Compare enhanced-harness and current-harness results on identical fixtures.
- [ ] Measure agent count, token/time proxy, retries, false positives, and escaped defects.
- [ ] Record unsupported runtime capabilities without fabricating success.

**Exit Evidence**: QA report maps every P0 requirement to passing independent evidence and records remaining risks.

## 8. Phase F - Warning Pilot And Blocking Rollout

- [ ] Select five representative real code or deploy tasks.
- [ ] Run the enhanced contract in warning mode.
- [ ] Record false positives, missing fields, runtime gaps, and user overrides per task.
- [ ] Review whether optional roles were activated appropriately.
- [ ] Review whether retry and rework limits were sufficient.
- [ ] Correct the contract and rerun affected fixtures.
- [ ] Present pilot results and proposed blocking rules to the user.
- [ ] Obtain explicit approval for blocking mode.
- [ ] Enable blocking only for validated P0 evidence.
- [ ] Document rollback to warning mode.

**Exit Evidence**: User-approved pilot report and a reversible blocking configuration.

## 9. Phase G - Release Readiness

- [ ] Run package-level skill verification.
- [ ] Run unit and integration tests.
- [ ] Run `npm pack --dry-run` and inspect included adapters, schemas, docs, and tests.
- [ ] Confirm README and USAGE describe the final installed behavior.
- [ ] Confirm version, changelog, package metadata, and npm contents agree.
- [ ] Confirm install and upgrade preserve unrelated project agents and files.
- [ ] Prepare rollback and compatibility notes.
- [ ] Obtain explicit merge and publish approval.

**Exit Evidence**: Passing Release Readiness Receipt with package, migration, rollback, and verification links.

## 10. Dependency Order

```text
Phase A
  -> Phase B
  -> Phase C
  -> Phase D
  -> Phase E
  -> Phase F
  -> Phase G
```

Phase C persona drafting may begin after Phase B schemas are stable. Phase E test-fixture design may run in parallel with Phase C, but final QA execution depends on Phases C and D.

## 11. Stop Conditions

- A new product or scope decision is required.
- A runtime cannot enforce a mandatory permission boundary.
- Existing receipt compatibility cannot be preserved without a migration decision.
- Structured artifacts would expose secrets or personal data.
- Pilot evidence shows coordination cost exceeds defect reduction for the target task class.
- The user pauses, redirects, or rejects the design.

## 12. Related Documents

- **Concept_Design**: [Agent Harness Requirements Analysis](../01_Concept_Design/01_AGENT_HARNESS_REQUIREMENTS_ANALYSIS.md) - required outcomes and constraints
- **Technical_Specs**: [Agent Harness Architecture](../03_Technical_Specs/01_AGENT_HARNESS_ARCHITECTURE.md) - target role, state, message, and adapter contracts
- **Logic_Progress**: [Backlog](./00_BACKLOG.md) - task status and gate evidence
- **Logic_Progress**: [Decision Log](./03_DECISION_LOG.md) - approved decisions governing the plan
- **QA_Validation**: [Agent Harness Test Scenarios](../05_QA_Validation/01_TEST_SCENARIOS.md) - phase exit and failure-path verification
