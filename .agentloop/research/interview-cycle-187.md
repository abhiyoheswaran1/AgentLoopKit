# Interview Cycle 187: Archived Check-Gates Task Label

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

Should human `check-gates` output identify archived task evidence when the task gate is satisfied by a completed archived task?

## Persona Notes

- Nora, Developer Experience Designer: The gate can still pass, but the label should explain that this is archived evidence, not a current active task contract.
- Lina, Agentic Engineer: Agents use `check-gates` output as state. If the row says `Task contract`, an agent may infer that work is still active.
- Tom, Skeptical Senior Developer: Do not change pass/fail behavior just for copy. Keep the evidence path visible and label it honestly.
- Dogfood Steward: The issue surfaced after archiving a verified task: `status`, `next`, and `review-context` were precise, while `check-gates` still used the current-task label.

## Decision

Label archived task fallback rows as `Archived task evidence` in human `check-gates` output. Keep JSON gate id, name, message, path, gate decisions, strict exit behavior, and next-action command selection unchanged.

## Constraints

- Do not change gate pass/warn/fail semantics, strict-mode exit behavior, task evidence resolution, verification selection, next-action command selection, release behavior, dependencies, tags, publishing, or package versions.
