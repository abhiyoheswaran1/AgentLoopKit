# Interview Cycle 7

## Context

AgentLoopKit has a read-only `status` command that tells agents and reviewers the active task, latest verification report, working tree state, and next action. Dogfooding showed one unsafe edge: a failed latest report should block handoff suggestions.

This is simulated internal product-panel feedback. It is not real user research.

## Personas interviewed

- Power User / Agentic Engineer
- AI-Skeptical Senior Engineer
- Open Source Maintainer
- Security Reviewer

## Feedback summary

The strongest signal: `status` should fail closed. If verification failed, the command should point users back to verification instead of suggesting a summary or next task.

## Raw simulated feedback

### Power User / Agentic Engineer

- Liked: one command to orient long agent sessions.
- Confused: a failed report can look like completed evidence.
- Would need before using it: the next action must protect the loop.
- Would recommend/star it if: agents recover from failed checks without extra prompting.
- Would abandon it if: the tool nudges handoff before verification passes.

### AI-Skeptical Senior Engineer

- Liked: deterministic status output.
- Confused: whether a failed report counts as evidence.
- Would need before using it: failed means fix, not summarize.
- Would recommend/star it if: the CLI improves review discipline without hype.
- Would abandon it if: the command overstates readiness.

### Open Source Maintainer

- Liked: PR-ready local state.
- Confused: contributors may paste a handoff with failed checks.
- Would need before using it: clear failed-check guidance.
- Would recommend/star it if: PRs include fewer avoidable failed-check handoffs.
- Would abandon it if: generated summaries bury failed verification.

### Security Reviewer

- Liked: `status` does not execute commands or read secrets.
- Confused: no issue with implementation boundary, but failed evidence should block handoff.
- Would need before using it: safe next-action ordering.
- Would recommend/star it if: safety rules show up in CLI behavior.
- Would abandon it if: convenience outranks failed verification evidence.

## Product council debate

- Abhi: This sharpens the product belief: auditable work before handoff.
- Maya: One conditional branch is enough. Do not add status scoring.
- Elias: This helps maintainers trust generated handoff flow.
- Nora: The next action text should be direct and copyable.
- Samir: Failed verification must be treated as a stop sign.
- Lina: Agents need this guard when resuming long sessions.
- Tom: Do not call failed checks “evidence” for handoff.
- Rachel: Teams can teach this rule without meetings.

## Decision

Make `agentloop status` return `agentloop verify` as the next command when the latest report has `Overall status: fail`.

## Non-decisions

- No automatic rerun.
- No failure classification.
- No task status lifecycle.
- No new command.

## Resulting tasks

- Add a failing Vitest test for failed latest verification reports.
- Update `chooseNextAction`.
- Update status docs, backlog, decisions, and dogfood notes.

## Success criteria

- `status --json` points to `agentloop verify` when the latest report failed.
- Markdown status output shows failed verification and the safer next action.
- Existing no-task and passing-report behavior remains unchanged.
- Full checks and projscan pass.
