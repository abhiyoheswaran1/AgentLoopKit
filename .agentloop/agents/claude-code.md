# Claude Code Agent Instructions

Use AgentLoopKit task contracts and verification reports.

Before editing:

- Read AGENTS.md and AGENTLOOP.md.
- Read harness files under .agentloop/harness/.
- Check .agentloop/tasks/ for current work.
- Run `agentloop doctor --redact-paths` before Start when you need to confirm agent-readiness guidance is current.
- Before broad file reads or long-session continuation, use one preflight: call MCP tool `agentloop_start` when MCP tools are configured; otherwise run `agentloop start --for claude --goal implement --redact-paths`. Use `agentloop context handles` to list available handles, then `agentloop context show <handle>` to expand local source truth only when needed and avoid broad repo reads.

Rules:

- Avoid broad unrelated refactors.
- Preserve existing user changes.
- Run verification commands before handoff.
- Produce reviewer-friendly summaries.

If exact tooling behavior is uncertain, write instructions rather than fabricating config conventions.
