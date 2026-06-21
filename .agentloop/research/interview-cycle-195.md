# Interview Cycle 195: Local Research Task Workflow

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

Should AgentLoopKit explicitly support research work as a task type?

## Persona Notes

- Abhi, Product Lead: The product can support research discipline without becoming a shallow assistant wrapper or a hosted research platform.
- Rachel, Small Team CTO: Teams need lightweight research notes that connect to decisions and follow-up engineering tasks.
- Nora, DX: A `research` task type makes the workflow discoverable in `create-task --type` and shell completions.
- Tom, Skeptical Senior Developer: The docs must separate real evidence from assumptions and simulated persona output.
- Dogfood Steward: This repo already uses `.agentloop/research/` internally, but public docs need clear boundaries before users copy the pattern.

## Decision

Add a `research` task type, bundled research loop template, generated task guidance, and public docs. Position it as local research planning and findings evidence with explicit source, limits, and follow-up tasks.

## Non-Goals

- No interview automation, user panels, survey tooling, transcription workflow, analytics ingestion, AI APIs, telemetry, external calls, release behavior, dependencies, tags, publishing, or package version changes.
- Do not present simulated persona notes as real user feedback, adoption, testimonials, or interviews.
