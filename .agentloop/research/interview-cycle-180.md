# Interview Cycle 180: Prepare-pr Optional-Section Spacing

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

When `prepare-pr` has no imported GitHub metadata, should the PR body leave visible spacing for the absent optional section?

## Persona Notes

- Nora, Developer Experience Designer: Missing optional context should disappear cleanly; empty visual gaps make generated Markdown feel less deliberate.
- Tom, Skeptical Senior Developer: Small formatting defects reduce trust in generated handoffs, even when the evidence is correct.
- Lina, Agentic Engineer: Long autonomous sessions rely on handoffs being paste-ready without manual cleanup.
- Dogfood Steward: The gap showed up in the generated PR body after a task with no imported GitHub context.

## Decision

Collapse the imported GitHub metadata section when it is missing by trimming the rendered optional section and inserting it only when present. Keep imported metadata output unchanged when local context exists.

## Constraints

- Do not change GitHub metadata parsing, imported context semantics, JSON evidence shape, command execution, verification parsing, release flow, dependency behavior, tags, publishing, or package versions.
- Do not redesign the PR body template or changed-file grouping.
