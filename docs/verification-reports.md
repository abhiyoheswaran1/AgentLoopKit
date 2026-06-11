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
- task contract commands through `--task-commands`

Flags:

```bash
agentloop verify --no-build
agentloop verify --task .agentloop/tasks/add-settings-page.md
agentloop verify --task .agentloop/tasks/add-settings-page.md --task-commands
agentloop verify --command "node smoke-test.js"
agentloop verify --json
```

Failures stay visible. The command exits non-zero when verification fails.

Reports generated with `--task` include a `Task Context` section with the task path, title, task type, and status when the task file is a readable Markdown contract inside the configured task directory. If the file is missing or outside that directory, the report says the task context is unavailable and still reports the configured command results.

`--task` is metadata-only by default. Use `--task-commands` to also run commands listed under the task contract's `Verification Commands` section. This keeps task Markdown from executing unexpectedly when a maintainer only wants the task context in the report. If `--task-commands` is requested but no runnable task commands are found, the report includes a `Task Commands` note. JSON output includes `taskCommands.requested`, `taskCommands.foundCount`, and `taskCommands.commands` for CI consumers.

When `--json` is used with an invalid `--task` path, `verify` returns an `ARTIFACT_PATH_INVALID` error with `artifactType`, `requestedPath`, `expectedDir`, and `reason`. It does not run configured or task-defined commands on that path.

Failed reports include a `Failure Summary` section before command output. It lists each failed command, its exit code, and final useful output lines. The summary uses the same captured command output; AgentLoopKit does not parse tool-specific stack traces or guess the root cause.

Long command output is shortened in the command section. AgentLoopKit keeps the beginning and ending output with a truncation marker, so setup context and final error lines remain visible without committing huge logs.

## CI Context

When `agentloop verify` runs in GitHub Actions, the report includes an allowlisted `CI Context` section:

- provider
- workflow
- event
- ref
- commit
- run URL
- run attempt

When `agentloop verify` runs in GitLab CI or Buildkite, the report records provider-specific provenance from a small allowlist:

- provider
- workflow or pipeline
- event or source
- ref
- commit
- run URL

When `CI=true` is present outside a supported provider, the report records `Generic CI` without provider-specific fields.

Local reports omit this section. AgentLoopKit does not read `.env` files and does not print arbitrary environment variables. It only reads a small allowlist of CI variables needed for report provenance.

Use `agentloop report` after `agentloop verify` when you want a browser-readable local artifact that includes the latest verification report. The report command reads existing evidence only; it does not run tests or other project commands.
