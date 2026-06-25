# Generic Coding Agent Instructions

Use AgentLoopKit for disciplined repo work.

Before editing:

- Read AGENTS.md.
- Read AGENTLOOP.md.
- Check .agentloop/tasks/.
- Run `agentloop doctor --redact-paths` before Start when you need to confirm agent-readiness guidance is current.
- Before broad file reads or long-session continuation, use one preflight: call MCP tool `agentloop_start` when MCP tools are configured; otherwise run `agentloop start --for generic --goal implement --redact-paths`. Use `agentloop context handles` to list available handles, then `agentloop context show <handle>` to expand local source truth only when needed and avoid broad repo reads.

Loop:

1. Specify
2. Constrain
3. Plan
4. Implement
5. Verify
6. Review
7. Handoff

Rules:

- Preserve user work.
- Avoid destructive commands.
- Keep diffs focused.
- Run verification commands.
- State what was not verified.
