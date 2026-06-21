# Interview Cycle 186: Previous Verification Review Context

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

Should `review-context` use a previous-evidence verification label when no active or open task exists?

## Persona Notes

- Nora, Developer Experience Designer: The read-only snapshot should use the same evidence language as `status` and `next`.
- Lina, Agentic Engineer: Agents consume `review-context` as state; stale-looking current proof can send them down the wrong path.
- Tom, Skeptical Senior Developer: Keep the report visible, but label what it is: previous task evidence.
- Dogfood Steward: The mismatch appeared in the no-active archived-task state after fixing the other status surfaces.

## Decision

Use `Latest previous verification` in human `review-context` output when both `activeTask` and `latestTask` are absent. Keep JSON `status.latestVerification` unchanged.

## Constraints

- Do not change task selection, next-action command selection, verification selection, review-context JSON field shape, release behavior, dependencies, tags, publishing, or package versions.
