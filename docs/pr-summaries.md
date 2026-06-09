# PR Summaries

Run:

```bash
agentloop summarize --write
```

The summary uses deterministic inputs:

- git status
- git diff stats
- latest task contract
- latest verification report
- config

It writes:

```text
.agentloop/handoffs/YYYY-MM-DD-HH-mm-pr-summary.md
```

No LLM is required.
