# PR Summaries

Run:

```bash
agentloop handoff
```

The summary uses deterministic inputs:

- git status
- git diff stats
- active task contract from `agentloop task set`, or the newest task when no task is pinned
- latest verification report
- config

It writes:

```text
.agentloop/handoffs/YYYY-MM-DD-HH-mm-pr-summary.md
```

No LLM is required.

Use `agentloop summarize` to preview the same deterministic summary without writing a file. `agentloop summarize --write` remains available for scripts that already use it.
