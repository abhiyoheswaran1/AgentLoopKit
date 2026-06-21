# Interview Cycle 194: Task Lifecycle Redaction Consistency

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

Should task lifecycle mutation commands accept `--redact-paths` like other shareable evidence commands?

## Persona Notes

- Nora, DX: Agents and humans copy command logs into handoffs. A harmless redaction flag should not turn a status update into an unknown-option failure.
- Samir, Security: Path redaction should affect displayed output only. Mutating commands must still write the same task state and archive paths.
- Lina, Agentic Engineer: Long sessions use repetitive command patterns. Consistent flags reduce brittle automation and recovery friction.
- Dogfood Steward: The live dogfood loop tried `task status <path> in-progress --redact-paths` and hit an option rejection before any product work began.

## Decision

Accept `--redact-paths` on `task set`, `task status`, `task done`, `task archive`, and `task clear`. Reuse the existing local-root redaction helper for human and JSON path fields only.

## Non-Goals

- No task state semantics, status values, archive movement rules, task contract format, JSON field shape, dependencies, release behavior, tags, publishing, or package version changes.
