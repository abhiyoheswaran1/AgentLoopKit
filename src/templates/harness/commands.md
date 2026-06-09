# Commands

Detected during AgentLoopKit init:

- Test: {{ testCommand }}
- Lint: {{ lintCommand }}
- Typecheck: {{ typecheckCommand }}
- Build: {{ buildCommand }}
- Format: {{ formatCommand }}

Rules:

- Use `agentloop task list` to inspect task contracts before pinning one.
- Use `agentloop task set <path>` when the active task is ambiguous.
- Use `agentloop status` to inspect active task, latest report, dirty files, and next action.
- Run targeted checks while developing.
- Run configured verification before claiming completion.
- If a command fails, report the failure and fix it when reasonable.
- If a command is not configured, say so in the handoff.
