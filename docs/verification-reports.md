# Verification Reports

Run:

```bash
agentloop verify
```

AgentLoopKit loads `agentloop.config.json`, runs configured commands, and writes:

```text
.agentloop/reports/YYYY-MM-DD-HH-mm-verification-report.md
```

If you run `verify` more than once in the same minute, AgentLoopKit keeps the existing report and writes the next one with a numeric suffix, such as `YYYY-MM-DD-HH-mm-verification-report-2.md`.

When run from a nested folder, `verify` searches upward for the nearest `agentloop.config.json` and writes the report under that initialized root.

Supported checks:

- test
- lint
- typecheck
- build
- custom commands through `--command`
- task contract commands through `--task-commands`
- task post-verification gates through `--post-verification-gates`

Flags:

```bash
agentloop verify --no-build
agentloop verify --task-commands
agentloop verify --task .agentloop/tasks/add-settings-page.md
agentloop verify --task .agentloop/tasks/add-settings-page.md --task-commands
agentloop verify --task .agentloop/tasks/add-settings-page.md --task-commands --only-task-commands
agentloop verify --task .agentloop/tasks/add-settings-page.md --post-verification-gates
agentloop verify --command "node smoke-test.js"
agentloop verify --timeout-ms 120000
agentloop verify --progress
agentloop verify --redact-paths
agentloop verify --json
```

Failures stay visible. The command exits non-zero when verification fails.

Reports generated with `--task` include a `Task Context` section with the task path, title, task type, and status when the task file is a readable Markdown contract inside the configured task directory. Existing symlinked path ancestors are resolved before the task path is accepted. If the file is missing, outside that directory, or redirected outside by a symlink, the report says the task context is unavailable and still reports the configured command results.

`--task` is metadata-only by default. Use `--task-commands` to also run commands listed under the task contract's `Verification Commands` section. `--task-commands` uses the explicit `--task` path first, then the active task set by `create-task` or `task set`; without either, it exits before running commands. This keeps task Markdown from executing unexpectedly when a maintainer only wants the task context in the report. Add `--only-task-commands` when you want the task contract commands to run without `test`, `lint`, `typecheck`, or `build` from `agentloop.config.json`.

`verify --task-commands` does not run commands under `Post-Verification Gates`. Put commands there when they need the report produced by `agentloop verify`, for example `npm run dogfood:strict`, `agentloop ship`, `agentloop prepare-pr`, `agentloop check-gates`, `agentloop maintainer-check`, or a handoff check.

Use `--post-verification-gates` when you want `verify` to write the report first and then run commands listed under `Post-Verification Gates`. The flag requires `--task` or an active task. It stays opt-in, so task Markdown does not start running post-report gates during a normal `verify` or `verify --task-commands` run.

If a post-verification gate fails, `verify` exits non-zero and the final report includes the gate output under `Post-Verification Gates`. JSON output includes `postVerificationGates.requested`, `foundCount`, `commands`, and `results`.

If `--task-commands` is requested but no runnable task commands are found, the report includes a `Task Commands` note. JSON output includes `taskCommands.requested`, `taskCommands.foundCount`, and `taskCommands.commands` for CI consumers.

If the same exact command string appears more than once across configured, custom, or task commands, AgentLoopKit runs it once. The report includes a `Duplicate Commands` section, and JSON output includes `skippedDuplicateCommands` with `originalKey`, `duplicateKey`, and `command`.

When `--json` is used with an invalid `--task` path, `verify` returns an `ARTIFACT_PATH_INVALID` error with `artifactType`, `requestedPath`, `expectedDir`, and `reason`. It does not run configured or task-defined commands on that path.
When the configured reports directory resolves outside the current repo through a symlink, `verify --json` returns `OUTPUT_PATH_INVALID` before running configured commands.
When `--json` is used with an invalid `agentloop.config.json`, `verify` returns a `CONFIG_ERROR` object and does not run commands.

Failed reports include a `Failure Summary` section before command output. It lists each failed command, its exit code, and final useful output lines. The summary uses the same captured command output; AgentLoopKit does not parse tool-specific stack traces or guess the root cause.

Command output is kept as evidence, but report code blocks use Markdown fences long enough to contain output that itself includes backticks. A failing tool cannot close its own output block by printing ``` in its logs.

Command labels use Markdown inline-code delimiters long enough to contain the exact command string. This keeps command names readable even when a configured command contains backticks.

Use `--timeout-ms` to set a per-command timeout for long or risky checks. Timed-out commands fail verification and the report marks `Timed out: yes`.

Use `--progress` when a long verification run should show bounded terminal progress. It prints one start line and one finish line per command with elapsed time. It does not stream child-process output to the terminal, and `--json` keeps stdout as JSON even when `--progress` is present.

Long command output is shortened in the command section. AgentLoopKit keeps the beginning and ending output with a truncation marker, so setup context and final error lines remain visible without committing huge logs.

Use `--redact-paths` when verification evidence will be committed or pasted into a public issue, PR, or CI log. It replaces the local repo root with `[git-root]` in report Markdown and command-output excerpts, including reports copied into `.agentloop/runs/` by `--write-run`. It does not change which commands run.

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
