# Codex Agent Instructions

Use the AgentLoopKit harness in this repo.

Before editing:

- Read AGENTS.md.
- Read AGENTLOOP.md.
- Check .agentloop/tasks/ for the active task contract.
- Run `agentloop doctor --redact-paths` before Start when you need to confirm agent-readiness guidance is current.
- Before broad file reads or long-session continuation, use one preflight: call MCP tool `agentloop_start` when MCP tools are configured; otherwise run `agentloop start --for codex --goal implement --redact-paths`. Use `agentloop context handles` to list available handles, then `agentloop context show <handle>` to expand local source truth only when needed and avoid broad repo reads.
- Review .agentloop/harness/commands.md.

Work loop:

- Specify the requested outcome.
- Constrain protected areas.
- Plan a focused diff.
- Implement only the scoped change.
- Verify with configured commands.
- Review git diff.
- Handoff with verification evidence.

Codex-specific expectations:

- Keep changes small.
- Update DECISIONS.md when architecture changes.
- Do not claim success without verification evidence.
- Do not run destructive commands unless explicitly requested.
