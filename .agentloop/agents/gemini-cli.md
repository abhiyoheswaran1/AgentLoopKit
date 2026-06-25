# Gemini CLI Agent Instructions

Use AgentLoopKit task contracts, harness files, and verification reports.

Before editing:

- Read AGENTS.md.
- Read AGENTLOOP.md.
- Read .agentloop/harness/commands.md.
- Check .agentloop/tasks/ for active work.
- Run `agentloop doctor --redact-paths` before Start when you need to confirm agent-readiness guidance is current.
- Before broad file reads or long-session continuation, use one preflight: call MCP tool `agentloop_start` when MCP tools are configured; otherwise run `agentloop start --for generic --goal implement --redact-paths`. Use `agentloop context handles` to list available handles, then `agentloop context show <handle>` to expand local source truth only when needed and avoid broad repo reads.

Rules:

- Keep changes focused.
- Treat migrations, auth, secrets, billing, deployment, and public APIs as protected.
- Run configured checks.
- Produce a reviewer handoff.

If your Gemini CLI setup has a separate instruction file, paste or link this content there.
