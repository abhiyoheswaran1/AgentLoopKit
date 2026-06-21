# Interview Cycle 178: Exact Not Run Coverage

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

When `verify --task-commands --only-task-commands` runs a task command that exactly matches a configured command, should the configured command still appear under `Not Run`?

## Persona Notes

- Tom, Skeptical Senior Developer: Handoffs should not imply `typecheck` was skipped when the exact typecheck command ran.
- Nora, Developer Experience Designer: The `What Was Not Verified` section should describe real gaps, not implementation details of command provenance.
- Lina, Agentic Engineer: Task-only verification is useful in long sessions; exact covered commands should not create noisy handoff caveats.
- Dogfood Steward: The issue appeared in generated PR descriptions after task verification ran `npm run typecheck`.

## Decision

Filter configured `Not Run` entries after command execution when an exact same command string appears in the executed results. Keep exact string equality only so partial commands such as focused test runs do not claim full configured test coverage.

## Constraints

- Do not change which commands execute.
- Do not add fuzzy shell parsing, npm-script inference, or partial coverage matching.
- Do not change verification status semantics, release flow, tags, publishing, or package versions.
