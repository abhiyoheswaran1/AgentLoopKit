# Interview Cycle 153

## Context

After stale-state and placeholder routing improvements, `agentloop status`, `agentloop next`, and `agentloop task doctor` can prevent weak task contracts from reaching handoff. The remaining first-loop gap is earlier: a thin `create-task` call can still write and pin a contract with generated placeholders before an agent asks for status.

This is simulated internal product-panel feedback. It is not real user research.

## Personas Interviewed

- Indie Hacker Using Codex
- Open Source Maintainer
- AI-Skeptical Senior Engineer
- Platform Engineer
- Dogfood Steward

## Feedback Summary

The panel preferred a warning over a hard failure. Draft tasks are useful while exploring, but agents and maintainers need an immediate quality signal when review-critical sections still contain generated placeholders. The warning should be structured for JSON callers and compact in human output, and it should reuse the same placeholder-section source of truth as task doctor.

## Product Council Debate

- Abhi: Improve the loop at the first write, before agents start implementing from a weak contract.
- Maya: Share the detector with the task-contract generator instead of maintaining a second placeholder list.
- Elias: Keep public docs clear that the command remains permissive and local.
- Nora: Human output should name the incomplete sections directly.
- Samir: Do not make task creation fatal, execute commands, mutate more files, read tokens, or add network calls.
- Lina: JSON output should give agents a machine-readable warning they can use before starting implementation.
- Tom: This is useful only if complete task contracts stay quiet and tests prove that boundary.

## Decision

Add `TASK_CONTRACT_PLACEHOLDER_SECTIONS` warnings to `agentloop create-task` when the generated contract still contains review-critical placeholder sections. Keep task creation successful and active-task pinning unchanged. Share the placeholder detector from `src/core/task-contract.ts` so generated defaults, `create-task`, and `task doctor` stay aligned.

## Non-Decisions

- Do not make missing task fields fatal.
- Do not redesign the interactive prompt.
- Do not change task doctor next-action routing.
- Do not execute verification commands during task creation.
- Do not add network calls, telemetry, token reads, release work, or publishing behavior.

## Success Criteria

- Thin `create-task --json` output includes `TASK_CONTRACT_PLACEHOLDER_SECTIONS` with section names.
- Thin human `create-task` output names the review-critical placeholder sections.
- Fully specified contracts do not produce placeholder warnings.
- Existing task-doctor placeholder diagnostics still pass.
- Focused tests, typecheck, docs checks, AgentLoop verification, ProjScan, AgentFlight, and dogfood pass before handoff.
