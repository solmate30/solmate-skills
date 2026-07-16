# Decision Log
> Created: 2026-07-17 01:04
> Last Updated: 2026-07-17 01:04

## 1. Decision Scope

This log records user-approved decisions for the enhanced Solmate agent harness. Changes to these decisions require a new dated entry rather than rewriting the historical rationale.

## 2. Decisions

### 2026-07-17 - Core Team Plus Optional Expert Pool

- **ID**: DEC-001
- **Type**: Architecture
- **Decision**: Keep Coordinator, Context Reader, Implementer, and QA Inspector as the minimal path. Activate Requirements Analyst, Architect, Logic Builder, Security Inspector, and Release Guardian only when recorded conditions apply.
- **Reason**: This preserves role separation and independent verification without imposing a full multi-agent team on small tasks.
- **Rejected Alternative**: Always run every specialist or automatically use Agent Teams whenever two roles exist.
- **Reconsider When**: Pilot evidence shows a specialist is required in nearly all tasks or role activation itself causes repeated failures.

### 2026-07-17 - Canonical Documents And Execution Workspace Are Separate

- **ID**: DEC-002
- **Type**: Architecture
- **Decision**: Approved requirements, architecture, logic, backlog, and QA evidence remain under the 5-Layer `docs/` structure. `_workspace/harness/<task-id>/` stores runtime manifests, messages, attempts, and temporary evidence.
- **Reason**: Project decisions must survive runtime and session changes, while execution details need an append-only recovery area.
- **Rejected Alternative**: Treat `_workspace/` as the sole source of truth or copy all intermediate messages into permanent project specifications.
- **Reconsider When**: A future runtime offers an auditable durable store that can export stable project documents without vendor lock-in.

### 2026-07-17 - Coordinator Owns Decisions And State

- **ID**: DEC-003
- **Type**: Workflow
- **Decision**: Agents may communicate directly for bounded clarification and status, but scope, acceptance, architecture, risk, state transition, PASS, release, and completion decisions must route through Coordinator.
- **Reason**: Direct peer communication improves efficiency, but distributed decision authority makes user approval and audit trails unreliable.
- **Rejected Alternative**: Fully peer-to-peer self-governing agent decisions or Coordinator-only transport for every low-risk clarification.
- **Reconsider When**: Structured consensus and decision persistence can be independently verified across both Claude Code and Codex.

### 2026-07-17 - Architect And Logic Builder Remain Separate Roles

- **ID**: DEC-004
- **Type**: Architecture
- **Decision**: Architect owns system boundaries, public contracts, dependencies, persistence, and deployment topology. Logic Builder owns business rules, state transitions, invariants, calculations, authorization rules, and failure behavior.
- **Reason**: Combining both roles makes architecture documents broad while leaving domain behavior implicit. Separation also enables either role to be skipped independently for small work.
- **Rejected Alternative**: A single Architect role that owns every design concern.
- **Reconsider When**: Repeated small tasks show the separation creates duplicated artifacts without improving correctness.

### 2026-07-17 - QA Inspector Is Independent And Non-Writing

- **ID**: DEC-005
- **Type**: Quality
- **Decision**: QA Inspector inspects and executes checks but does not modify implementation files or close its own findings. Rework returns to Implementer through Coordinator.
- **Reason**: The producer cannot be the sole source of verification evidence. Direct QA fixes blur ownership and can leave changes unverified.
- **Rejected Alternative**: A general-purpose QA agent that fixes findings immediately and reports the result as verified.
- **Reconsider When**: None for final verification. A separate test-authoring role may write tests before the final independent verification attempt.

### 2026-07-17 - Typed Failure States Replace Generic Retry

- **ID**: DEC-006
- **Type**: Reliability
- **Decision**: Classify context, decision, contract, transient, timeout, implementation, verification, critical-artifact, degraded-capability, and conflict failures. Only transient and timeout failures receive one automatic retry; implementation rework is capped at two loops before user review.
- **Reason**: “Retry once and continue without the result” is unsafe for critical code and deploy artifacts. Failure type determines whether retry can help.
- **Rejected Alternative**: One generic retry policy for all failures or unlimited producer-reviewer loops.
- **Reconsider When**: Pilot evidence supports different limits for a specific runtime or work type.

### 2026-07-17 - One Canonical Contract With Thin Runtime Adapters

- **ID**: DEC-007
- **Type**: Technical Choice
- **Decision**: Keep role, message, state, artifact, receipt, and error semantics runtime-neutral. Claude Code and Codex adapters map only supported capabilities.
- **Reason**: Claude-only tool names and experimental APIs would make the policy brittle and duplicate behavior across runtimes.
- **Rejected Alternative**: Separate full workflow specifications for Claude Code and Codex or an invented `.codex/agents/` format.
- **Reconsider When**: Both runtimes adopt a shared, stable agent manifest standard.

### 2026-07-17 - Machine Enforcement Extends Existing Receipts

- **ID**: DEC-008
- **Type**: Compatibility
- **Decision**: Preserve Context, Change, and Verification Receipts and existing `preflight` / `verify` commands. Add Requirements, Design, Error, and Release evidence incrementally in warning mode before blocking.
- **Reason**: The current implementation already protects the two highest-risk boundaries. Replacing it would create migration risk without user value.
- **Rejected Alternative**: Replace the receipt model with an entirely new event protocol in one release.
- **Reconsider When**: A versioned migration proves that a consolidated schema is simpler and fully backward compatible.

### 2026-07-17 - No User-Facing UI In This Scope

- **ID**: DEC-009
- **Type**: Scope
- **Decision**: This enhancement is a skill, contract, CLI, and runtime-adapter capability. It does not introduce a user-facing application screen, so UI documents and HTML Preview are not required for this scope.
- **Reason**: Creating a decorative preview for a non-UI protocol would add ceremony without validating the actual risk.
- **Rejected Alternative**: Add a dashboard or HTML workflow viewer during the first implementation.
- **Reconsider When**: Users request interactive task-state inspection or architecture visualization as a product feature.

## 3. Related Documents

- **Concept_Design**: [Agent Harness Requirements Analysis](../01_Concept_Design/01_AGENT_HARNESS_REQUIREMENTS_ANALYSIS.md) - user-approved needs and scope
- **Technical_Specs**: [Agent Harness Architecture](../03_Technical_Specs/01_AGENT_HARNESS_ARCHITECTURE.md) - implementation-neutral architecture resulting from these decisions
- **Logic_Progress**: [Backlog](./00_BACKLOG.md) - tasks governed by the decisions
- **Logic_Progress**: [Execution Plan](./01_EXECUTION_PLAN.md) - staged delivery and rollout
- **QA_Validation**: [Agent Harness Test Scenarios](../05_QA_Validation/01_TEST_SCENARIOS.md) - verification of decision outcomes
