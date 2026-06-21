# Interview Cycle 188: Check-Gates Dirty Examples

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

Should `check-gates` include dirty non-evidence path examples when it recommends `agentloop create-task`?

## Persona Notes

- Nora, Developer Experience Designer: If the next command is `create-task`, users need the same bounded examples they see in `status` and `next`.
- Lina, Agentic Engineer: Agents often start from gate output. Examples help them decide whether existing dirty files belong to the new task before mutating more state.
- Tom, Skeptical Senior Developer: Keep it deterministic and bounded. Use Git status paths, not file reads or ownership guesses.
- Dogfood Steward: The gap surfaced after archiving a task: `check-gates` recommended `create-task` with 110 dirty non-evidence files but showed no examples.

## Decision

Append up to five repo-relative dirty non-evidence examples to `check-gates` create-task next-action reasons when dirty non-evidence files exist. Exclude AgentLoop evidence-only dirty files.

## Constraints

- Do not change gate pass/warn/fail semantics, strict-mode exit behavior, task evidence resolution, verification selection, next-action command selection, file-content reads, release behavior, dependencies, tags, publishing, or package versions.
