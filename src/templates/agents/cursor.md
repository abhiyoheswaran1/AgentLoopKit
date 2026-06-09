# Cursor Agent Instructions

Use this file as repo-level guidance for Cursor-assisted work.

Before editing:

- Read AGENTS.md and AGENTLOOP.md.
- Use the active task contract when present.
- Run `agentloop task list` when several task contracts exist.
- Run `agentloop task show <path>` before implementing a selected task.
- Run `agentloop task status <path> in-progress` when implementation starts.
- Run `agentloop task archive <path>` only after verification and handoff are complete.
- Keep diffs focused on acceptance criteria.

Verification:

- Run configured commands from agentloop.config.json.
- Record failures honestly.
- Generate or update a handoff summary before stopping.

If Cursor workspace rules are configured elsewhere, link this guidance there.
