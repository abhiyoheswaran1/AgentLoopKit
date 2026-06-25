# OpenCode Agent Instructions

Use AgentLoopKit as the working loop for this repository.

Before editing:

- Read AGENTS.md.
- Read AGENTLOOP.md.
- Check .agentloop/tasks/.
- Run `agentloop doctor --redact-paths` before Start when you need to confirm agent-readiness guidance is current.
- Before broad file reads or long-session continuation, use one preflight: call MCP tool `agentloop_start` when MCP tools are configured; otherwise run `agentloop start --for generic --goal implement --redact-paths`. Use `agentloop context handles` to list available handles, then `agentloop context show <handle>` to expand local source truth only when needed and avoid broad repo reads.

Rules:

- Do not take destructive actions without explicit approval.
- Prefer small diffs.
- Verify before completion.
- Summarize changed files, tests, risks, and rollback notes.

If OpenCode config conventions differ in your setup, paste or link this file into the appropriate agent instructions.
