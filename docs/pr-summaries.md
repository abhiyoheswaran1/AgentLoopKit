# PR Summaries

Run:

```bash
agentloop handoff
```

The summary uses deterministic inputs:

- git status
- git diff stats
- active task contract from `agentloop task set`, or the newest open task when no task is pinned
- latest verification report
- config

It includes:

- changed files
- change areas grouped by path, such as source, tests, docs, CI, config, AgentLoop, and risk-sensitive files
- review-focus hints based on those path groups
- verification status
- rollback notes
- reviewer checklist

It writes:

```text
.agentloop/handoffs/YYYY-MM-DD-HH-mm-pr-summary.md
```

No LLM is required.

AgentLoopKit classifies files by path only. It does not read file contents, `.env` contents, or credentials to create change-area hints.

Changed-file paths are kept as evidence, but path labels use Markdown inline-code delimiters long enough to contain paths that include backticks. A repository path cannot close its own path label by including ` in the filename.

Use `agentloop summarize` to preview the same deterministic summary without writing a file. `agentloop summarize --write` remains available for scripts that already use it.

Explicit `--task` and `--verification` inputs must point to existing Markdown artifacts inside `.agentloop/tasks/` and `.agentloop/reports/`. With `--json`, invalid input paths return a structured `ARTIFACT_PATH_INVALID` error and `handoff` does not write a summary.
Handoff output directories must resolve inside the current repo. With `--json`, a configured `.agentloop/handoffs/` symlink that points outside the repo returns `OUTPUT_PATH_INVALID` and writes no summary.
With `--json`, invalid `agentloop.config.json` files return a `CONFIG_ERROR` object and `handoff` does not write a summary.
Supported output formats are `markdown` and `json`. Unsupported `--format` values fail before writing handoff files. With `--json`, they return `UNSUPPORTED_OUTPUT_FORMAT` with `requestedFormat` and `supportedFormats`.

Use `agentloop task list` and `agentloop task show <path>` before handoff when the repo has several task contracts and you need to choose which one to pin.

After `agentloop handoff`, run `agentloop report` when you want one local HTML artifact that combines the task, verification report, handoff, git status, and current deterministic summary. The HTML report does not replace the Markdown source files.
