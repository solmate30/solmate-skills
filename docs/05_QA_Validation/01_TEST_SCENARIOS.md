# Agent Harness Test Scenarios
> Created: 2026-07-17 01:04
> Last Updated: 2026-07-17 01:15

## 1. Purpose

This document defines design-stage acceptance and future implementation scenarios for the enhanced Solmate agent harness. A scenario is not considered passing until independent evidence identifies the command, fixture, result, and relevant requirement.

## 2. Global Rubric Validation

| Criterion | Status | Evidence / Design Response |
|---|---|---|
| Functionality | Pass at design stage | Requirements, architecture, state transitions, messages, errors, execution plan, and tests are defined; implementation remains pending |
| Potential Impact | Pass at design stage | The design targets the recurring failures of unread context, improvised workflows, conflicting agents, and unsupported completion claims |
| Novelty | Pass at design stage | Solmate combines role/topology design with machine-enforced document and independent-verification Receipts rather than relying on personas alone |
| UX | Pass at design stage | Minimal topology is the default; optional specialists and warning rollout limit procedural and latency overhead |
| Open-source | Pass at design stage | Runtime-neutral contracts, standard JSON/JSONL, and thin adapters allow reuse without a proprietary orchestration service |
| Business Plan | Pass at design stage | Reliable Claude/Codex workflow behavior strengthens the package's value and reduces support cost from inconsistent agent execution |

Implementation-stage status must replace these design-stage statements with executable evidence.

## 3. Requirement Traceability Matrix

| Requirement | Architecture Coverage | Primary Scenario | Design Status |
|---|---|---|---|
| FR-001 | Artifact Model, Receipt Integration | QA-REQ-001 | Covered |
| FR-002 | Role Catalog, Activation Rules | QA-ROLE-001 | Covered |
| FR-003 | Persona Contract, Permissions | QA-ROLE-002 | Covered |
| FR-004 | Receipt Integration, Compatibility | QA-COMPAT-001 | Covered |
| FR-005 | Optional Specialists, State Machine | QA-DESIGN-001 | Covered |
| FR-006 | Message Protocol | QA-MSG-001, QA-MSG-002 | Covered |
| FR-007 | State Machine, Error Handling | QA-STATE-001, QA-STATE-002 | Covered |
| FR-008 | Permissions, QA Role | QA-QA-001, QA-QA-002 | Covered |
| FR-009 | Error Handling | QA-ERR-001 through QA-ERR-006 | Covered |
| FR-010 | Runtime Adapters | QA-ADAPTER-001 | Covered |
| FR-011 | Execution Workspace | QA-RECOVERY-001, QA-RECOVERY-002 | Covered |
| FR-012 | Requirements Traceability | QA-TRACE-001 | Covered |
| FR-013 | Topology Selection | QA-TOPO-001 through QA-TOPO-003 | Covered |
| FR-014 | Compatibility And Maintenance | QA-DRIFT-001 | Covered |
| FR-015 | Warning Pilot | QA-PILOT-001 | Covered |

### 3.1 Non-Functional Requirement Traceability

| Requirement | Primary Scenario | Design Status |
|---|---|---|
| NFR-001 | QA-SEC-001, QA-ERR-006 | Covered |
| NFR-002 | QA-STATE-001, QA-RECOVERY-002 | Covered |
| NFR-003 | QA-ADAPTER-001 | Covered |
| NFR-004 | QA-ROLE-001, QA-TOPO-001 | Covered |
| NFR-005 | QA-COST-001, QA-PILOT-001 | Covered |
| NFR-006 | QA-MSG-001, QA-STATE-002 | Covered |
| NFR-007 | QA-COMPAT-001 | Covered |
| NFR-008 | QA-QA-001, QA-QA-002 | Covered |
| NFR-009 | QA-RECOVERY-001, QA-RECOVERY-002 | Covered |
| NFR-010 | QA-LICENSE-001 | Covered |

## 4. Requirements And Context Scenarios

### QA-REQ-001 - Requirements Artifact Completeness

- **Given**: A new feature request with product behavior and implementation expectations.
- **When**: Requirements Analyst prepares the canonical analysis.
- **Then**: The document contains user need, FR, NFR, included/excluded scope, acceptance criteria, assumptions, unresolved questions, risks, and related-document links.
- **Failure**: Implementation begins from chat text without the required artifact or explicit small-task skip decision.
- **Evidence**: Parsed document fields and Coordinator acceptance event.

### QA-CONTEXT-001 - Linked Document Read Proof

- **Given**: A code task links Concept, Technical, and QA documents.
- **When**: Context Reader returns a Context Receipt.
- **Then**: Every linked path exists and appears in `Required References Read`; constraints and conflicts are present.
- **Failure**: Any required document is missing, unread, or silently omitted.
- **Evidence**: Existing strict `preflight` command plus manifest references.

### QA-CONTEXT-002 - Conflicting Documents

- **Given**: Two linked documents define incompatible behavior.
- **When**: Context Reader compares them.
- **Then**: State becomes `BLOCKED_CONTEXT`; both sources are preserved and Coordinator routes a decision.
- **Failure**: Context Reader chooses one silently or Implementer starts work.

## 5. Role And Design Scenarios

### QA-ROLE-001 - Minimal Task Avoids Optional Specialists

- **Given**: A small, single-module change with complete requirements and no public contract or state-machine change.
- **When**: Coordinator selects topology.
- **Then**: Core linear path is used; Requirements Analyst, Architect, Logic Builder, Security Inspector, and Release Guardian are recorded as `Skipped - reason` where considered.
- **Failure**: Full specialist team is spawned only because multiple roles are available.

### QA-ROLE-002 - Persona Contract Completeness

- **Given**: A runtime agent definition.
- **When**: Persona validation runs.
- **Then**: All persona fields are present, permissions match role responsibility, and denied tools are explicit for read-only roles.
- **Failure**: A narrative persona has no non-goals, output contract, escalation, completion evidence, or write scope.

### QA-DESIGN-001 - Architect And Logic Builder Activation

- **Given**: A feature changes an API contract and introduces three business states with failure transitions.
- **When**: Coordinator evaluates specialists.
- **Then**: Architect and Logic Builder are both activated, with non-overlapping outputs and linked Design Receipt.
- **Failure**: Implementer invents the API or state behavior during coding.

## 6. Message And State Scenarios

### QA-MSG-001 - Valid Structured Handoff

- **Given**: Architect completes an approved Architecture Decision Packet.
- **When**: A `HANDOFF` message is emitted.
- **Then**: Schema version, message/task IDs, attempt, timestamp, sender, recipient, status, summary, requirement/artifact/decision refs, blockers, next action, and retry count validate.
- **Failure**: A free-form “done” message is accepted without an artifact.

### QA-MSG-002 - Direct Peer Decision Is Rejected

- **Given**: Frontend Implementer asks Backend Implementer to change an accepted API response.
- **When**: Backend replies directly with a scope-changing decision.
- **Then**: The message is treated as `DECISION_REQUIRED`; no contract changes until Coordinator records and approves the decision.
- **Failure**: The API and UI drift without an updated requirement or decision.

### QA-STATE-001 - Legal Transition Sequence

- **Given**: All required artifacts pass.
- **When**: Coordinator advances the task.
- **Then**: Every state follows a legal transition and records reason, actor, timestamp, and artifacts.
- **Evidence**: Ordered `events.jsonl` fixture.

### QA-STATE-002 - Completion Bypass Is Rejected

- **Given**: A Change Receipt exists but independent verification has not passed.
- **When**: A role requests `CHANGE_READY -> COMPLETE`.
- **Then**: The transition is rejected as a contract error.
- **Failure**: PR, merge, publish, or deploy is reported ready.

## 7. Error And Recovery Scenarios

### QA-ERR-001 - Context Error Does Not Retry

- **Given**: A required technical document is missing.
- **Then**: State becomes `BLOCKED_CONTEXT`; no automatic retry or implementation occurs.

### QA-ERR-002 - Transient Tool Error Retries Once

- **Given**: An otherwise valid non-destructive command fails from a temporary runtime interruption.
- **Then**: One retry occurs in a new recorded attempt with unchanged scope.
- **Failure**: Retry changes requirements, deletes prior evidence, or loops indefinitely.

### QA-ERR-003 - Repeated Transient Failure Blocks Dependency

- **Given**: The allowed retry fails again.
- **Then**: State becomes `BLOCKED_DEPENDENCY` and reports attempts, evidence, and recovery condition.

### QA-ERR-004 - Verification Failure Routes Rework

- **Given**: QA finds a failed acceptance criterion.
- **Then**: QA emits a finding; Coordinator sets `REWORK`; Implementer creates a new attempt and Change Receipt.
- **Failure**: QA modifies source files or marks its own fix as verified.

### QA-ERR-005 - Rework Loop Limit

- **Given**: Two implementation rework attempts fail the same criterion.
- **Then**: Coordinator pauses further changes and requests a user decision with the repeated failure pattern.
- **Failure**: A third automatic loop starts.

### QA-ERR-006 - Critical Artifact Failure Cannot Degrade Silently

- **Given**: Architect, Implementer, or QA fails without producing a required critical artifact.
- **Then**: Code/deploy task remains blocked; final output explicitly names the missing artifact.
- **Failure**: Remaining partial results are used to report completion.

### QA-RECOVERY-001 - Interrupted Task Resume

- **Given**: The active agent stops after valid requirements and context events.
- **When**: The task resumes.
- **Then**: Runtime loads the latest valid manifest and events, creates or resumes the legal attempt, and does not repeat approved work unnecessarily.

### QA-RECOVERY-002 - Attempt Preservation

- **Given**: Attempt 1 fails and attempt 2 begins.
- **Then**: Attempt 1 artifacts and failure evidence remain immutable and manifest points to attempt 2 as active.

## 8. Independent QA And Boundary Scenarios

### QA-QA-001 - QA Write Attempt Is Denied

- **Given**: QA Inspector identifies a code defect.
- **When**: It attempts to use Edit or Write on implementation files.
- **Then**: Runtime permission or contract validation rejects the operation and records the violation.

### QA-QA-002 - Implementer Cannot Self-Verify

- **Given**: Implementer reports basic checks as passing.
- **Then**: Change Receipt is accepted as a handoff but cannot satisfy Verification Receipt or completion.

### QA-BOUNDARY-001 - Producer And Consumer Contract Comparison

- **Given**: A producer returns a structured response and a consumer declares its expected type.
- **Then**: QA reads both sides, compares shape, optionality, naming, and failure behavior, and links evidence.
- **Failure**: QA checks only that both files exist or only that compilation passes.

### QA-BOUNDARY-002 - State Definition And Mutation Comparison

- **Given**: A Logic Contract defines legal transitions.
- **Then**: QA compares every implementation mutation and UI branch against reachable states and identifies unauthorized or dead transitions.

### QA-TRACE-001 - End-To-End Requirement Evidence

- **Given**: A P0 functional requirement is marked complete.
- **When**: Traceability validation runs.
- **Then**: The requirement links to its approved Requirements Analysis, required Architecture or Logic artifact, Change Receipt or diff, and independent QA evidence.
- **Failure**: A requirement is marked `Pass` from implementation claims alone, or a required design artifact is absent without `Skipped - reason`.

## 9. Topology And Adapter Scenarios

### QA-TOPO-001 - Read-Only Fan-Out/Fan-In

- **Given**: Four independent document groups require analysis.
- **Then**: Read-only agents run in parallel, write no shared source, and Coordinator integrates artifact references and conflicts.

### QA-TOPO-002 - Parallel Write Ownership

- **Given**: Frontend and Backend work can proceed in parallel.
- **Then**: Exclusive paths are declared; shared contracts are frozen or owned serially.
- **Failure**: Both agents modify the same shared file without coordination.

### QA-TOPO-003 - Hierarchy Depth Limit

- **Given**: A proposed topology delegates more than two levels deep.
- **Then**: Coordinator flattens or rejects the topology unless the user approves a documented exception.

### QA-ADAPTER-001 - Claude And Codex Contract Parity

- **Given**: The same fixture task runs through both adapters.
- **Then**: Role activation, canonical states, required artifact refs, failure classification, and Receipt fields are semantically equivalent.
- **Allowed Difference**: Native tool names, peer-message support, concurrency, and resume capability.

### QA-ADAPTER-002 - Degraded Independent Agent Capability

- **Given**: A runtime cannot provide an independent QA execution context.
- **Then**: State becomes `DEGRADED`; user approval is required before any completion claim and the limitation remains visible.

## 10. Compatibility, Drift, And Security Scenarios

### QA-COMPAT-001 - Existing Receipt Fixtures Remain Valid

- **Given**: Current valid Context and Verification Receipt fixtures.
- **When**: The enhanced validator runs in compatibility mode.
- **Then**: Existing commands and exit codes remain valid; new fields are warning-only until migration.

### QA-DRIFT-001 - Role And Adapter Drift Detection

- **Given**: A role is renamed or a runtime adapter omits a mandatory persona field.
- **Then**: Package verification identifies the stale reference, duplicate role, or missing adapter mapping.

### QA-COST-001 - Agent And Model Cost Is Proportional

- **Given**: Equivalent small, medium, and complex task fixtures.
- **Then**: The small fixture uses the minimal role path; optional specialists and stronger model tiers appear only with a recorded task need.
- **Failure**: Every task uses the full team or globally forces the most expensive model tier.

### QA-LICENSE-001 - External Reference Attribution And Originality

- **Given**: A new contract or persona is informed by an external open-source project.
- **Then**: Source references and applicable license obligations are reviewed, while Solmate text and schemas are independently authored unless copied material is explicitly attributed and licensed.
- **Failure**: Substantial external text is copied without notice, source, or license review.

### QA-SEC-001 - Sensitive Workspace Content Rejected

- **Given**: A message or evidence artifact contains a credential, secret token, or prohibited raw personal data.
- **Then**: Persistence is rejected or redacted according to explicit policy and the task reports the blocked evidence.
- **Failure**: Sensitive content is written to a commit-ready workspace.

## 11. Pilot And Release Scenarios

### QA-PILOT-001 - Five-Task Warning Calibration

- **Given**: Five representative real code/deploy tasks.
- **Then**: Each records selected topology, activated/skipped roles, missing fields, false positives, retries, rework, user overrides, runtime gaps, and escaped findings.
- **Exit**: User reviews the pilot and explicitly approves or rejects blocking mode.

### QA-RELEASE-001 - Package And Documentation Agreement

- **Given**: A proposed npm release.
- **Then**: Tests, package dry run, installed adapters, schema files, README, USAGE, version, changelog, rollback, and migration guidance agree.
- **Failure**: Documentation claims behavior absent from the packaged files.

## 12. Design Document Verification Checklist

- [ ] All Markdown files use required Created and Last Updated metadata.
- [ ] All document filenames use two-digit numbering and uppercase snake case where applicable.
- [ ] Related Documents use valid relative links with relationship descriptions.
- [ ] Architecture embeds the data-flow SVG from the required assets directory.
- [ ] Every P0 FR has architecture coverage and a QA scenario.
- [ ] Backlog code/deploy tasks contain all Related fields and pending Receipt contracts.
- [ ] UI and HTML Preview fields use reasoned N/A rather than blank values.
- [ ] Decision Log records alternatives and reconsideration conditions.
- [ ] No implementation or release is represented as approved by these documents.
- [ ] External reference concepts are independently expressed and not copied verbatim.

## 13. Related Documents

- **Concept_Design**: [Agent Harness Requirements Analysis](../01_Concept_Design/01_AGENT_HARNESS_REQUIREMENTS_ANALYSIS.md) - requirement IDs and approved scope
- **Technical_Specs**: [Agent Harness Architecture](../03_Technical_Specs/01_AGENT_HARNESS_ARCHITECTURE.md) - roles, states, messages, errors, artifacts, and adapters under test
- **Logic_Progress**: [Backlog](../04_Logic_Progress/00_BACKLOG.md) - task-level acceptance and Receipt status
- **Logic_Progress**: [Execution Plan](../04_Logic_Progress/01_EXECUTION_PLAN.md) - staged implementation, pilot, and release exits
- **Logic_Progress**: [Decision Log](../04_Logic_Progress/03_DECISION_LOG.md) - approved design decisions verified by these scenarios
