# Cursor Agent Instructions

Use this file as repo-level guidance for Cursor-assisted work.

Before editing:

- Read AGENTS.md and AGENTLOOP.md.
- Use the active task contract when present.
- Run `agentloop doctor --redact-paths` before Start when you need to confirm agent-readiness guidance is current.
- Before broad file reads or long-session continuation, use one preflight: call MCP tool `agentloop_start` when MCP tools are configured; otherwise run `agentloop start --for cursor --goal implement --redact-paths`. Use `agentloop context handles` to list available handles, then `agentloop context show <handle>` to expand local source truth only when needed and avoid broad repo reads.
- Keep diffs focused on acceptance criteria.

Verification:

- Run configured commands from agentloop.config.json.
- Record failures honestly.
- Generate or update a handoff summary before stopping.

If Cursor workspace rules are configured elsewhere, link this guidance there.
