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

## CI Context

When `agentloop verify` runs in GitHub Actions, the report includes an allowlisted `CI Context` section:

- provider
- workflow
- event
- ref
- commit
- run URL
- run attempt

When `CI=true` is present outside GitHub Actions, the report records `Generic CI` without provider-specific fields.

Local reports omit this section. AgentLoopKit does not read `.env` files and does not print arbitrary environment variables. It only reads a small allowlist of CI variables needed for report provenance.

Use `agentloop report` after `agentloop verify` when you want a browser-readable local artifact that includes the latest verification report. The report command reads existing evidence only; it does not run tests or other project commands.
