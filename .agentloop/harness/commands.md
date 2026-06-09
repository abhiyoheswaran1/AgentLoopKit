# Commands

Detected during AgentLoopKit init:

- Test: npx pnpm@10.12.1 test
- Lint: npx pnpm@10.12.1 lint
- Typecheck: npx pnpm@10.12.1 typecheck
- Build: npx pnpm@10.12.1 build
- Format: npx pnpm@10.12.1 format
- Repo health: npx projscan doctor --format markdown

Rules:

- Use `agentloop task list` to inspect task contracts before pinning one.
- Use `agentloop task show <path>` to read a task contract without changing active state.
- Use `agentloop task set <path>` when the active task is ambiguous.
- Use `agentloop task status <path> <status>` to update task state without hand-editing Markdown.
- Use `agentloop status` to inspect active task, latest report, dirty files, and next action.
- Run targeted checks while developing.
- Run configured verification before claiming completion.
- Dogfood projscan during implementation work in this repository.
- If a command fails, report the failure and fix it when reasonable.
- If a command is not configured, say so in the handoff.
