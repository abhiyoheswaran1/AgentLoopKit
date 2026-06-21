# Interview Cycle 181: Not Run Command-String Context

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

When a verification report lists configured commands under `Not Run`, should human Markdown include only the alias or also the configured command string?

## Persona Notes

- Tom, Skeptical Senior Developer: Aliases like `test` and `build` are too thin in a PR handoff; reviewers need to know the command behind them.
- Lina, Agentic Engineer: Task-only verification often runs focused commands, so handoffs should make skipped configured checks easy to understand without opening config.
- Nora, Developer Experience Designer: Keep JSON stable for automation, but make human report lines self-explanatory.
- Dogfood Steward: The issue surfaced when `prepare-pr` copied `Not Run` aliases from task-only verification into reviewer-facing Markdown.

## Decision

Render human verification report `Not Run` entries as `alias: command` for configured commands, using Markdown-safe inline code for the configured command string. Keep JSON `notRun` as the existing alias list.

## Constraints

- Do not change command selection, command execution, task-command parsing, duplicate handling, verification status semantics, JSON evidence shape, release behavior, dependency behavior, tags, publishing, or package versions.
- Do not add fuzzy command coverage inference.
