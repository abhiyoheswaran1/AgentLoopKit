# Interview Cycle 123

## Context

Local real-repo trials ran AgentLoopKit against temporary copies of `projscan`, `LaunchDesk`, and `EndpointOS`. The strongest repeated signal was that active task contracts with placeholder review-critical sections could reach `status` and `next` with a handoff recommendation after verification, while `ship`, `prepare-pr`, `check-gates`, and `task doctor` later exposed the placeholders.

This is simulated internal product-panel feedback. It is not real user research.

## Personas interviewed

- Open Source Maintainer
- Platform Engineer
- AI-Skeptical Senior Engineer
- Small Team CTO
- Dogfood Steward

## Feedback summary

The panel prioritized next-action correctness over new surfaces. The selected fix is to route active placeholder task contracts to `agentloop task doctor` before verification or handoff evidence, using the existing task-doctor diagnostic.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: the local evidence loop works without credentials or GitHub posting.
- What confused them: a PR draft can still include placeholder acceptance and rollback text if they follow `status` directly to handoff.
- What they would need before using it: next action should stop obvious placeholder contracts before reviewer-facing output.
- What would make them recommend/star it: boring local evidence that does not embarrass maintainers in review.
- What would make them abandon it: generated PR bodies that preserve setup placeholders as if they were real criteria.

### Platform Engineer

- What they liked: temp-copy trials showed the harness can run in CLI, web app, and larger app/service repos.
- What confused them: `doctor` and `check-gates` know about placeholder task sections, but `status` did not use that knowledge.
- What they would need before using it: one source of truth for next action.
- What would make them recommend/star it: status output that sends agents to bounded recovery before handoff.
- What would make them abandon it: more gates that disagree with each other.

### AI-Skeptical Senior Engineer

- What they liked: the trial used deterministic local commands and did not depend on model output.
- What confused them: passing verification could look stronger than it was when the task contract was still incomplete.
- What they would need before using it: review-critical placeholders must be caught before ship or PR prep.
- What would make them recommend/star it: a failing test that proves the next action is corrected.
- What would make them abandon it: scoring changes or policy expansion based on one dogfood cycle.

### Small Team CTO

- What they liked: the product helps small teams get structured handoffs without adopting a service.
- What confused them: whether the task contract is advisory or a real review gate.
- What they would need before using it: the CLI should make contract hygiene obvious at the moment a developer asks what to do next.
- What would make them recommend/star it: local-first review quality with minimal ceremony.
- What would make them abandon it: release-channel work before the core loop feels dependable.

### Dogfood Steward

- What they liked: AgentLoopKit, AgentFlight, and ProjScan all produced usable evidence during the autonomous session.
- What confused them: the task-doctor diagnostic was available but not part of the status decision tree.
- What they would need before using it: reuse existing diagnostics rather than adding another checker.
- What would make them recommend/star it: the same loop preventing the bug found by the loop.
- What would make them abandon it: mutating task files automatically or expanding scans beyond the configured task directory.

## Product council debate

- Abhi: Fix the workflow path that a real engineer will follow first.
- Maya: Reuse `inspectTaskDirectory`; do not create a second placeholder scanner.
- Elias: No new docs are needed if the CLI routes correctly.
- Nora: `status` and `next` should prefer `task doctor` before handoff when the active task has placeholder review-critical sections.
- Samir: The fix must be read-only and must not mutate task files.
- Lina: The session should keep AgentFlight and ProjScan evidence attached to the task.
- Tom: This is the smallest high-confidence fix from the trials.
- Rachel: Do not turn this into policy-pack or metadata scoring work.

## Decision

Route active task contracts with `placeholder-task-section` diagnostics to `agentloop task doctor` in `status` and therefore `next`, before verification or handoff recommendations.

## Non-decisions

- Do not alter `create-task` generated templates in this pass.
- Do not change `ship` scoring.
- Do not add policy packs or GitHub metadata scoring.
- Do not call GitHub APIs, read tokens, post comments, add telemetry, or use hosted services.
- Do not release or publish.

## Resulting task

- Add a focused status regression test for placeholder active tasks.
- Reuse task-doctor diagnostics in status next-action selection.
- Update backlog, decision log, changelog, and internal trial notes.
- Run a bug pass immediately after implementation.

## Success criteria

- `agentloop status --json` returns `agentloop task doctor` for an active task with placeholder review-critical sections.
- Human `agentloop status` prints the same next action and reason.
- The change is read-only and scoped to next-action routing.
- Focused tests and full task verification pass.
