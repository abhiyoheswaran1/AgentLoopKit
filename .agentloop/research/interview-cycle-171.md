# Interview Cycle 171: PR Handoff Not Run Details

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

`prepare-pr` and deterministic PR summaries tell reviewers to check the verification report for skipped commands even when the report already has a structured `Not Run` section. Should handoffs render those details directly?

## Persona Notes

- Tom, Skeptical Senior Developer: If the evidence exists in a structured local artifact, the handoff should not make reviewers chase it.
- Lina, Agentic Engineer: Agents need the PR body to explain what was not verified without opening several files.
- Nora, Developer Experience Designer: Use a clear fallback when nothing was skipped instead of a vague "check the report" instruction.
- Dogfood Steward: This surfaced after using `verify --only-task-commands`, where the report precisely listed configured commands that were intentionally not run.

## Decision

Render concrete verification report `Not Run` entries in `prepare-pr` and deterministic handoff summaries. Treat the generated `Nothing skipped.` placeholder as `No skipped commands were recorded.`

## Constraints

- Do not change verification report generation.
- Do not change readiness scoring.
- Do not execute additional verification commands.
- Do not release, tag, or publish.
