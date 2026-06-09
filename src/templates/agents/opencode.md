# OpenCode Agent Instructions

Use AgentLoopKit as the working loop for this repository.

Before editing:

- Read AGENTS.md.
- Read AGENTLOOP.md.
- Check .agentloop/tasks/.
- Run `agentloop task list` when current work is unclear.
- Run `agentloop task show <path>` before implementing a selected task.
- Run `agentloop task status <path> in-progress` when implementation starts.

Rules:

- Do not take destructive actions without explicit approval.
- Prefer small diffs.
- Verify before completion.
- Summarize changed files, tests, risks, and rollback notes.

If OpenCode config conventions differ in your setup, paste or link this file into the appropriate agent instructions.
