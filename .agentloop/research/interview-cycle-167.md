# Interview Cycle 167: Readiness Final-Section Parsing

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

While sharing Markdown section parsing across review surfaces, dogfooding found `readiness-score` still had a local regex that can miss a section when it is the final section in task Markdown. Should this be fixed now?

## Persona Notes

- Maya, Principal Engineer: Parser behavior should be shared and boring. Keep scoring rules unchanged.
- Tom, Skeptical Senior Developer: A deterministic review score must not depend on whether a valid section happens to be last in the file.
- Dogfood Steward: This came from implementation work, not speculative roadmap expansion. It is a small correctness fix.

## Decision

Update readiness scoring to use the shared line-based section parser. Keep readiness-specific filtering for `None recorded yet.` list placeholders and add focused tests for final `Rollback Notes`, final `Risk Notes`, and placeholder risk notes.

## Constraints

- Do not change score weights or dimension labels.
- Do not change task contract format.
- Do not change ship, prepare-pr, or review-context behavior beyond shared parser consistency.
- Do not release, tag, publish, or bump versions.
