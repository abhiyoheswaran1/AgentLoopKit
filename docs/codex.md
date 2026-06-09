# Codex

Install Codex-specific repo instructions:

```bash
agentloop install-agent codex
```

Codex should:

- read `AGENTS.md`
- read `AGENTLOOP.md`
- inspect the active task contract
- keep changes small
- run verification
- update `DECISIONS.md` for architecture changes
- produce a handoff summary before stopping

AgentLoopKit does not replace Codex. It gives Codex a repo-local engineering loop.
