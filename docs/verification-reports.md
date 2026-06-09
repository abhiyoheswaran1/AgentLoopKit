# Verification Reports

Run:

```bash
agentloop verify
```

AgentLoopKit loads `agentloop.config.json`, runs configured commands, and writes:

```text
.agentloop/reports/YYYY-MM-DD-HH-mm-verification-report.md
```

Supported checks:

- test
- lint
- typecheck
- build
- custom commands through `--command`

Flags:

```bash
agentloop verify --no-build
agentloop verify --command "node smoke-test.js"
agentloop verify --json
```

Failures stay visible. The command exits non-zero when verification fails.

Long command output is shortened in the report. AgentLoopKit keeps the beginning and ending output with a truncation marker, so setup context and final error lines remain visible without committing huge logs.
