# Interview Cycle 190: Review Context Gate Evidence Source

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

Should human `review-context` output say where task gate evidence came from instead of only showing `Gates: pass`?

## Persona Notes

- Nora, Developer Experience Designer: The one-shot snapshot should carry the same task-evidence clarity as `check-gates`; otherwise agents need a second command to understand the state.
- Lina, Agentic Engineer: Long sessions often start from `review-context`. Knowing whether evidence is active, latest open, archived, or missing prevents stale-task assumptions.
- Tom, Skeptical Senior Developer: Keep this presentation-only. Do not change gate semantics or invent a new evidence model.
- Dogfood Steward: The gap appeared immediately after archiving a completed task: `status`, `next`, and `check-gates` were precise, while `review-context` still collapsed gates to a status.

## Decision

Append a concise task-evidence source label to human `review-context` gate summaries when the task gate is present. Derive the label from existing status context and gate data: active task evidence, latest open task evidence, archived task evidence, missing task evidence, or a generic task evidence fallback.

## Constraints

- Do not change review-context JSON fields, gate ids, gate messages, gate status semantics, next-action routing, check-gates behavior, file reads, release behavior, dependencies, tags, publishing, or package versions.
