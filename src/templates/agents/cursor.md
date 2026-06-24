# Cursor Agent Instructions

Use this file as repo-level guidance for Cursor-assisted work.

Before editing:

- Read AGENTS.md and AGENTLOOP.md.
- Use the active task contract when present.
- Run `agentloop task list` when several task contracts exist.
- Run `agentloop task show <path>` before implementing a selected task.
- Run `agentloop task status <path> in-progress` when implementation starts.
- Run `agentloop task done` after verification and handoff when the active task is ready to close.
- Run `agentloop task archive <path>` only after verification and handoff are complete.
- Run `agentloop task doctor` when old task files make current work unclear.
- Run `agentloop start --for cursor --goal implement --redact-paths` before broad file reads or long-session continuation. Use `agentloop context show <handle>` to expand local source truth only when needed.
- If you start AgentFlight directly with `npx --yes agentflight start --task "<task>" --yes`, run `agentloop status --redact-paths` and `agentloop task doctor --redact-paths` afterward. If an AgentFlight placeholder becomes active, treat it as preserved session evidence: run `agentloop task clear`, then `agentloop task set <path>` for a detailed task or `agentloop create-task` for new scoped work. Do not edit or delete the placeholder as default recovery.
- Run `agentloop policy list`, `agentloop policy show <policy>`, and `agentloop policy status` before risky edits.
- Run `agentloop check-gates` before stopping to check review evidence.
- Keep diffs focused on acceptance criteria.

Verification:

- Run configured commands from agentloop.config.json.
- Record failures honestly.
- Generate or update a handoff summary before stopping.

If Cursor workspace rules are configured elsewhere, link this guidance there.
