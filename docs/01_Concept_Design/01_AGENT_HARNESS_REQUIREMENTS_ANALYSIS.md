# Agent Harness Requirements Analysis
> Created: 2026-07-17 01:04
> Last Updated: 2026-07-17 01:31

## 1. Purpose

This document translates the approved user request into traceable requirements for the next Solmate agent harness iteration. It is the canonical requirements input for architecture, implementation planning, and QA.

The requested outcome is not merely a larger agent catalog. The harness must make specialist collaboration reliable across Claude Code and Codex while preserving Solmate's existing document-reference and independent-verification gates.

## 2. User Need

The user identified the following needs after reviewing `revfactory/harness` and its generated examples:

- establish explicit workflows instead of relying on an agent to improvise the execution order;
- define operational personas such as Architect, Logic Builder, and QA Inspector;
- establish an inter-agent communication protocol;
- handle agent, tool, contract, and verification failures explicitly;
- create a user-requirements analysis artifact before design and implementation;
- retain Solmate's stronger machine-enforced document and verification evidence;
- support both Claude Code and Codex without assuming one runtime's private tool names in the canonical contract.

## 3. Problem Statement

The current harness solves two high-risk failures well:

1. implementation can be gated on proof that linked documents were read;
2. completion can be gated on independent verification evidence.

It does not yet define:

- how a request becomes a stable requirements artifact;
- when an Architect or Logic Builder is necessary;
- which team topology fits a task;
- how agents exchange structured status, findings, decisions, and artifact references;
- how retryable failures differ from contract or approval failures;
- how intermediate state survives agent or session termination;
- how role permissions and file ownership prevent conflicting edits;
- how requirements are traced through design, changes, and QA evidence.

## 4. Target Users And Work Types

| User / Work Type | Primary Need | Harness Behavior |
|---|---|---|
| Project owner | Retain decision authority | Coordinator routes unresolved scope and risk decisions to the user |
| New feature work | Convert intent into testable requirements | Requirements Analysis is required before architecture or code |
| Small code change | Avoid procedural overhead | Use the minimal core path without optional specialists |
| Complex feature | Separate product, architecture, logic, implementation, and QA concerns | Activate specialists through an Expert Pool decision |
| Code / deploy work | Prevent unverified completion | Context and Verification Receipts remain mandatory |
| Docs / prototype work | Keep the process lightweight | Specialist delegation is advisory unless safety or approval is involved |
| Claude Code | Use native project-agent capabilities | Claude adapter maps the canonical roles to supported project agents |
| Codex | Use available subagents or tasks | Codex adapter maps the same contract without inventing unsupported files |

## 5. Functional Requirements

| ID | Requirement | Priority | Acceptance Summary |
|---|---|---:|---|
| FR-001 | Produce a canonical User Requirements Analysis before new-feature design or implementation | P0 | Functional, non-functional, scope, assumptions, questions, and acceptance criteria are present |
| FR-002 | Maintain a minimal core team and activate optional specialists only when justified | P0 | Small tasks do not automatically spawn Architect, Logic Builder, or Release Guardian |
| FR-003 | Define every persona with mission, non-goals, inputs, outputs, permissions, escalation, and completion criteria | P0 | Role files can be checked for all mandatory persona fields |
| FR-004 | Preserve the existing Context Receipt gate and linked-document read proof | P0 | Existing preflight behavior remains compatible |
| FR-005 | Add architecture and business-logic design gates for tasks whose complexity requires them | P0 | Coordinator records why each optional gate is invoked or skipped |
| FR-006 | Define a runtime-neutral structured inter-agent message envelope | P0 | Every handoff can identify task, attempt, sender, recipient, status, artifacts, blockers, and next action |
| FR-007 | Define workflow states and legal transitions, including blocked, rework, degraded, cancelled, and complete | P0 | Illegal completion and bypass transitions are rejected |
| FR-008 | Keep QA Inspector independent and non-writing | P0 | QA cannot modify implementation files and must return findings through the Coordinator |
| FR-009 | Distinguish retryable operational errors from context, contract, decision, and verification failures | P0 | Each error class has an explicit retry, escalation, and completion policy |
| FR-010 | Support Claude Code and Codex through adapters that reference one canonical contract | P0 | Runtime differences do not duplicate the business policy |
| FR-011 | Preserve intermediate artifacts and attempts for audit and recovery | P1 | Previous attempts are not overwritten; task manifests identify the active attempt |
| FR-012 | Trace requirements through architecture, logic, implementation, and QA evidence | P0 | Each completed requirement has linked design, change, and verification evidence |
| FR-013 | Support Pipeline, Fan-out/Fan-in, Expert Pool, Producer-Reviewer, and Supervisor patterns selectively | P1 | Coordinator records the selected topology and reason; hierarchy depth is bounded |
| FR-014 | Detect role, skill, and contract drift during harness maintenance | P1 | Validation reports missing, duplicate, or stale adapters and role references |
| FR-015 | Calibrate enforcement through warning tasks before blocking rollout | P0 | Five real tasks record false positives and unresolved gaps before strict mode |

## 6. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-001 | Safety | Authentication, authorization, security, accessibility, data preservation, and verification may not be removed for simplicity |
| NFR-002 | Auditability | Decisions, handoffs, attempts, failures, and evidence must remain inspectable after the active session ends |
| NFR-003 | Portability | Canonical contracts may not depend on Claude-only or Codex-only tool names |
| NFR-004 | Simplicity | The minimal linear workflow is the default; multi-agent topologies require a recorded benefit |
| NFR-005 | Cost Control | Model choice and agent count are task-sensitive rather than globally fixed to the most expensive option |
| NFR-006 | Determinism | Machine-checkable fields use versioned structured schemas and explicit state transitions |
| NFR-007 | Compatibility | Existing backlog receipts and `preflight` / `verify` commands remain valid during migration |
| NFR-008 | Independence | Verification evidence must come from a role that did not implement the change |
| NFR-009 | Recoverability | A stopped agent or interrupted session can resume from persisted artifacts without silently restarting the task |
| NFR-010 | Open Source | Concepts may be inspired by external projects, but Solmate contracts are independently written and attributable where necessary |

## 7. Approved Scope

### Included

- requirements-analysis contract and template;
- core and optional role catalog;
- persona schema and permission matrix;
- topology-selection rules;
- runtime-neutral handoff message schema;
- task state machine and error classification;
- artifact ownership and persistence rules;
- incremental QA and independent final verification;
- Claude Code and Codex adapter boundaries;
- validation, pilot, and blocking-rollout plan.

### Excluded From This Design Stage

- implementation changes to skills, CLI, or installers;
- creation of a general-purpose multi-agent runtime service;
- direct dependency on experimental runtime APIs;
- automatic model purchasing or account configuration;
- a visual end-user interface;
- replacing project-specific domain skills with generic personas.

## 8. Acceptance Criteria

- [ ] Every P0 functional requirement maps to an architecture section and QA scenario.
- [ ] The minimal path remains usable with Coordinator, Context Reader, Implementer, and QA Inspector.
- [ ] Requirements Analyst, Architect, Logic Builder, and Release Guardian have explicit activation conditions.
- [ ] Direct peer communication cannot approve scope, decisions, completion, or release.
- [ ] Code and deploy tasks cannot complete from partial critical artifacts.
- [ ] QA Inspector cannot edit implementation files or self-resolve its own findings.
- [ ] Retryable and non-retryable errors have distinct transitions.
- [ ] Claude Code and Codex use the same role and receipt semantics.
- [ ] Existing Context, Change, and Verification Receipts remain part of the enhanced workflow.
- [ ] The design does not require a UI document or HTML Preview because no user-facing screen is introduced.

## 9. Risks And Constraints

| Risk | Constraint / Response |
|---|---|
| Excessive agents increase cost and coordination latency | Use Expert Pool activation and a four-role minimal path |
| Free-form messages become untraceable decisions | Require a structured envelope and Coordinator-owned decision recording |
| Agents write overlapping files | Declare write ownership before implementation and serialize shared-file changes |
| QA loses independence by fixing findings | Keep QA read-only and route rework to Implementer |
| Runtime tools evolve | Keep runtime adapters thin and canonical policy tool-neutral |
| New gates create checklist fatigue | Make architecture and logic gates conditional; retain strict gates only for critical evidence |
| External source text creates licensing ambiguity | Reimplement concepts in original language and retain source references without copying substantial text |

## 10. Decision Status

The user approved the following direction on 2026-07-17:

- fixed core team plus optional specialists;
- canonical project documents plus an execution-only workspace;
- Coordinator-centered decisions with limited direct peer communication;
- separate Architect and Logic Builder responsibilities;
- independent, non-writing QA Inspector;
- explicit blocked, rework, degraded, and completion states;
- one canonical contract with Claude Code and Codex adapters.

No unresolved product decision blocks the technical design. The user reviewed and approved the design baseline and `TASK-HARNESS-002` implementation on 2026-07-17. Later persona, orchestration, blocking rollout, merge, publish, and deploy phases remain separately gated.

## 11. External References

- [revfactory/harness](https://github.com/revfactory/harness) - team topology, persona, file-handoff, and QA ideas used as comparative design input
- [revfactory/harness-100](https://github.com/revfactory/harness-100) - generated fullstack and product-management examples used to identify useful patterns and unsafe defaults

## 12. Related Documents

- **Technical_Specs**: [Agent Harness Architecture](../03_Technical_Specs/01_AGENT_HARNESS_ARCHITECTURE.md) - technical realization of these requirements
- **Logic_Progress**: [Decision Log](../04_Logic_Progress/03_DECISION_LOG.md) - approved architecture decisions and alternatives
- **Logic_Progress**: [Execution Plan](../04_Logic_Progress/01_EXECUTION_PLAN.md) - approved design-to-implementation sequence
- **QA_Validation**: [Agent Harness Test Scenarios](../05_QA_Validation/01_TEST_SCENARIOS.md) - traceable validation criteria
