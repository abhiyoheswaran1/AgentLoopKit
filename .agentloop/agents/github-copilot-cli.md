# GitHub Copilot CLI Agent Instructions

Use AgentLoopKit as the engineering loop for this repo.

Before editing:

- Read AGENTS.md.
- Read AGENTLOOP.md.
- Check task contracts in .agentloop/tasks/.
- Run `agentloop doctor --redact-paths` before Start when you need to confirm agent-readiness guidance is current.
- Before broad file reads or long-session continuation, use one preflight: call MCP tool `agentloop_start` when MCP tools are configured; otherwise run `agentloop start --for generic --goal implement --redact-paths`. Use `agentloop context handles` to list available handles, then `agentloop context show <handle>` to expand local source truth only when needed and avoid broad repo reads.

Rules:

- Do not overwrite existing instructions.
- Avoid unrelated refactors.
- Run verification commands before handoff.
- Include risks and rollback notes in summaries.

If exact Copilot CLI instruction conventions change, prefer linking this file from the supported location.
