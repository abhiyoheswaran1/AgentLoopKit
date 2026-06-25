# OpenCode Agent Instructions

Use AgentLoopKit as the working loop for this repository.

Before editing:

- Read AGENTS.md.
- Read AGENTLOOP.md.
- Check .agentloop/tasks/.
- Run `agentloop task list` when current work is unclear.
- Run `agentloop task show <path>` before implementing a selected task.
- Run `agentloop task status <path> in-progress` when implementation starts.
- Run `agentloop task done` after verification and handoff when the active task is ready to close.
- Run `agentloop task archive <path>` only after verification and handoff are complete.
- Run `agentloop task doctor` when old task files make current work unclear.
- Run `agentloop doctor --redact-paths` before Start when you need to confirm agent-readiness guidance is current.
- Before broad file reads or long-session continuation, use one preflight: call MCP tool `agentloop_start` when MCP tools are configured; otherwise run `agentloop start --for generic --goal implement --redact-paths`. Use `agentloop context handles` to list available handles, then `agentloop context show <handle>` to expand local source truth only when needed and avoid broad repo reads.
- If you start AgentFlight directly with `npx --yes agentflight start --task "<task>" --yes`, run `agentloop status --redact-paths` and `agentloop task doctor --redact-paths` afterward. If an AgentFlight placeholder becomes active, treat it as preserved session evidence: run `agentloop task clear`, then `agentloop task set <path>` for a detailed task or `agentloop create-task` for new scoped work. Do not edit or delete the placeholder as default recovery.
- Run `agentloop policy list`, `agentloop policy show <policy>`, and `agentloop policy status` before risky edits.
- Run `agentloop check-gates` before stopping to check review evidence.

Rules:

- Do not take destructive actions without explicit approval.
- Prefer small diffs.
- Verify before completion.
- Summarize changed files, tests, risks, and rollback notes.

If OpenCode config conventions differ in your setup, paste or link this file into the appropriate agent instructions.
