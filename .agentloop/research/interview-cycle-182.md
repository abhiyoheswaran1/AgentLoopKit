# Interview Cycle 182: Previous Verification Status Label

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

When `agentloop status` has no active or open task but still finds a latest verification report, should the human label describe it as current or previous evidence?

## Persona Notes

- Nora, Developer Experience Designer: The next action can be correct while the label still implies current work; make the human copy match the task state.
- Tom, Skeptical Senior Developer: Do not hide the report, but do not let a passing report look attached to a nonexistent task.
- Lina, Agentic Engineer: Keep JSON stable for scripts and change only the Markdown label that agents paste into handoffs.
- Dogfood Steward: The issue surfaced after done-and-archive handoff, where old verification evidence stayed useful but was no longer current-task proof.

## Decision

Use `Latest previous verification` in human `status` output when both `activeTask` and `latestTask` are absent. Keep `Latest verification` when an active or newest open task exists.

## Constraints

- Do not change verification report discovery, task selection, next-action ordering, JSON shape, command execution, release behavior, tags, publishing, or package versions.
