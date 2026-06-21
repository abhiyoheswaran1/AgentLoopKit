# Interview Cycle 185: Previous Verification Brief Label

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

Should compact `status --brief` mark retained latest verification evidence as previous when no active or open task exists?

## Persona Notes

- Nora, Developer Experience Designer: The compact status line is often pasted into agent prompts; it should not contradict the fuller Markdown output.
- Lina, Agentic Engineer: Keep the `verification=` key stable so compact status remains easy to scan, but encode previous evidence explicitly.
- Tom, Skeptical Senior Developer: A passing report after archive is useful history, not current-task proof.
- Dogfood Steward: The inconsistency appeared immediately after the full status and next labels were fixed.

## Decision

Render `verification=previous:<status>` in `status --brief` when a latest report exists and both `activeTask` and `latestTask` are absent. Keep `verification=<status>` when current task context exists.

## Constraints

- Do not change task selection, next-action command selection, verification selection, JSON field shape, release behavior, dependencies, tags, publishing, or package versions.
