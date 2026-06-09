# Commands

Detected during AgentLoopKit init:

- Test: {{ testCommand }}
- Lint: {{ lintCommand }}
- Typecheck: {{ typecheckCommand }}
- Build: {{ buildCommand }}
- Format: {{ formatCommand }}

Rules:

- Use `agentloop task list` to inspect task contracts before pinning one.
- Use `agentloop task show <path>` to read a task contract without changing active state.
- Use `agentloop task set <path>` when the active task is ambiguous.
- Use `agentloop task status <path> <status>` to update task state without hand-editing Markdown.
- Use `agentloop status` to inspect active task, latest report, dirty files, and next action.
- Run targeted checks while developing.
- Run configured verification before claiming completion.
- If a command fails, report the failure and fix it when reasonable.
- If a command is not configured, say so in the handoff.

## Monorepos

If `agentloop doctor` reports workspace or monorepo markers, treat root commands as coverage clues, not proof that every package was checked.

- Add package-specific verification commands to the task contract when a change is scoped to one package.
- Prefer the repo's existing command style, such as `pnpm --filter <package> test`, `npm --workspace <package> test`, or a package-local command.
- Run root checks when they cover the touched area.
- In the handoff, separate root checks, package-level checks, and checks that were not run.
- Do not claim full monorepo verification from a root-only command unless the repo documentation says that command covers all affected packages.
