# Interview Cycle 183: Previous Verification Next Label

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

Should `agentloop next` use the same previous-evidence verification label as `agentloop status` when no active or open task exists?

## Persona Notes

- Nora, Developer Experience Designer: Users often run `next` instead of full `status`; the same state should not use a less precise label.
- Tom, Skeptical Senior Developer: A passing verification report should remain visible, but the copy should not overstate what it proves.
- Lina, Agentic Engineer: Keep the next-action command stable for automations and change only the human line agents paste into logs.
- Dogfood Steward: The inconsistency appeared immediately after archiving the prior task and running `agentloop next`.

## Decision

Use `Latest previous verification` in human `next` output when both `activeTask` and `latestTask` are absent. Keep `Latest verification` when an active or newest open task exists.

## Constraints

- Do not change next-action routing, verification report discovery, task selection, JSON shape, command execution, release behavior, tags, publishing, or package versions.
