# Commands

Detected during AgentLoopKit init:

- Test: {{ testCommand }}
- Lint: {{ lintCommand }}
- Typecheck: {{ typecheckCommand }}
- Build: {{ buildCommand }}
- Format: {{ formatCommand }}

Rules:

- Run targeted checks while developing.
- Run configured verification before claiming completion.
- If a command fails, report the failure and fix it when reasonable.
- If a command is not configured, say so in the handoff.
