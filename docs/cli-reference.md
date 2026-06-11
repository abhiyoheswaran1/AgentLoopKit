# CLI Reference

AgentLoopKit exposes the same CLI through two binaries:

```bash
agentloop init
agentloopkit init
```

The examples below use `agentloop`. Replace it with `npx agentloopkit` when you do not have the package installed locally.

## Init

```bash
agentloop init
agentloop init --dry-run
agentloop init --force
agentloop init --local-only
agentloop init --json
```

`init` creates `.agentloop/`, `AGENTS.md`, `AGENTLOOP.md`, and `agentloop.config.json` in the current directory. It appends to an existing `AGENTS.md` instead of overwriting it.

`--dry-run` prints the planned file changes and writes nothing. `--force` allows initialization from a home directory after the CLI warns about the target. `--local-only` writes the same harness, then adds a marked local Git exclude block for the generated files.

Configured paths must stay inside the current repo. Absolute paths, parent traversal, Windows drive-qualified paths, and null bytes are rejected before AgentLoopKit reads or writes configured artifacts.

## Doctor

```bash
agentloop doctor
agentloop doctor --json
```

`doctor` checks setup health, template manifest state, configured commands, Git root, current working tree, package manager detection, project type detection, missing commands, monorepo signals, and risk-file categories.

Env files are reported by path only. AgentLoopKit does not read `.env` contents.

## Task Contracts

```bash
agentloop create-task --type feature --title "Add settings page" \
  --problem-statement "Users cannot manage account preferences" \
  --desired-outcome "Users can update settings from the app" \
  --likely-file src/settings \
  --forbidden-file migrations/ \
  --acceptance "Settings can be saved" \
  --verification "pnpm test" \
  --risk "Touches account preferences" \
  --rollback "Remove the settings route"
```

Supported task types are `feature`, `bugfix`, `refactor`, `tests`, `test-generation`, `docs`, `release`, `security-review`, `dependency-upgrade`, and `migration`.

Task contracts record the problem statement, desired outcome, constraints, non-goals, assumptions, likely files, files not to touch, acceptance criteria, verification commands, risk notes, and rollback notes.

## Task State

```bash
agentloop task list
agentloop task show .agentloop/tasks/<task-file>.md
agentloop task set .agentloop/tasks/<task-file>.md
agentloop task status .agentloop/tasks/<task-file>.md in-progress
agentloop task current
agentloop task clear
agentloop task archive .agentloop/tasks/<task-file>.md
agentloop task doctor
```

`task list --json` returns `path`, `title`, `status`, `active`, and `modifiedAt`. Listing tasks does not create or update `.agentloop/state.json`.

Supported statuses are `proposed`, `in-progress`, `blocked`, `deferred`, `review`, and `done`. Use `deferred` for parked work that should remain visible but should not become the next unpinned task.

Archive task contracts after verification and handoff, not as a substitute for either.

## Status And Next

```bash
agentloop status
agentloop status --json
agentloop next
agentloop next --json
```

`status` shows the pinned active task, newest open task when no task is pinned, deferred tasks, latest verification report, working tree state, Git root, configured commands, missing commands, and next suggested command.

`next` uses the same decision rules but prints only the next action. Neither command runs verification commands, calls an LLM, reads `.env` contents, or writes task state.

See [status.md](status.md).

## Verification

```bash
agentloop verify
agentloop verify --json
agentloop verify --task .agentloop/tasks/<task-file>.md
agentloop verify --task .agentloop/tasks/<task-file>.md --task-commands
```

`verify` reads `agentloop.config.json`, runs configured commands, captures output excerpts, and writes a Markdown report under `.agentloop/reports/`.

Use `--task` to include task context in the report. Use `--task-commands` when you also want to run verification commands listed inside the task contract.

Failed reports include a short failure summary with each failed command, exit code, and useful final output lines. If no commands are configured, AgentLoopKit writes a report saying nothing was verified.

See [verification-reports.md](verification-reports.md).

## Gate Checks

```bash
agentloop check-gates
agentloop check-gates --json
agentloop check-gates --strict
```

`check-gates` checks review evidence without running tests. It looks for task evidence, verification evidence, handoff evidence, task-folder hygiene, harness files, policy files, and Git context.

Warnings keep exit code `0` by default. Use `--strict` in CI when warning gates should fail.

See [check-gates.md](check-gates.md).

## Handoffs And PR Summaries

```bash
agentloop summarize
agentloop summarize --json
agentloop summarize --write
agentloop handoff
agentloop handoff --json
```

`summarize` previews a deterministic reviewer summary. `handoff` writes that summary to `.agentloop/handoffs/`.

The summary reads Git status, Git diff stats, active task or newest open task, latest verification report, and config settings. It groups changed files into review areas and adds review-focus hints from file paths only. It does not call an LLM.

See [pr-summaries.md](pr-summaries.md).

## Local Evidence Reports

```bash
agentloop artifacts
agentloop artifacts --json

agentloop report
agentloop report --json
agentloop report --out .agentloop/reports/review.html

agentloop badge
agentloop badge --source gates
agentloop badge --json
```

`artifacts` inventories existing local AgentLoop evidence without writing files. It reports task counts, task statuses, latest verification report, latest handoff, HTML reports, badges, CI summaries, and release notes. JSON output uses repo-relative paths.

`report` writes a local static HTML evidence report from the current task, latest verification report, latest handoff, Git status, diff stats, and deterministic summary.

`badge` writes a local SVG badge from existing verification or gate evidence.

These commands do not run tests, fetch remote assets, read `.env` contents, upload files, or call an LLM.

See [html-reports.md](html-reports.md) and [badges.md](badges.md).

## CI Summaries

```bash
agentloop ci-summary
agentloop ci-summary --json
agentloop ci-summary --write
```

`ci-summary` reads allowlisted CI provenance fields and existing AgentLoop artifacts. It reports provider, workflow or pipeline, event, ref, commit, and run URL when supported environment variables are present.

It does not call CI provider APIs, read secrets, upload files, run tests, or dump arbitrary environment variables.

See [ci-summary.md](ci-summary.md).

## Release Notes And npm Status

```bash
agentloop release-notes
agentloop release-notes --from <tag> --to HEAD
agentloop release-notes --release-version <version>
agentloop release-notes --json
agentloop release-notes --write

agentloop npm-status
agentloop npm-status --agentloopkit
agentloop npm-status --json
agentloop npm-status --expect-current
agentloop npm-status --registry-json npm-view.json
```

`release-notes` drafts local release notes from package metadata, changelog entries, Git history, changed files, working tree status, the active task, the latest verification report, and the latest CI summary when those artifacts exist.

`npm-status` checks registry state without publishing. It runs `npm view` unless you pass captured registry JSON.

Neither command creates tags, publishes packages, reads tokens, reads `.env` files, uploads files, or changes package metadata.

See [release-notes.md](release-notes.md) and [npm-status.md](npm-status.md).

## MCP Server

```bash
agentloop mcp-server
```

The MCP server is read-only. It exposes existing repo evidence to MCP clients through stdio: status, next action, task contracts, active task, policies, latest verification report, and handoff summaries.

It does not run verification commands, edit files, call external APIs, read `.env` contents, or upload data.

See [mcp.md](mcp.md).

## Policies

```bash
agentloop policy list
agentloop policy show security
agentloop policy status
agentloop policy list --json
agentloop policy show security --json
agentloop policy status --json
```

`policy` reads Markdown files from `.agentloop/policies/`. `policy status` compares local Markdown with bundled templates and reports `current`, `modified`, `missing`, and `extra` files.

It does not enforce compliance, scan source code, fetch remote policy packs, or mutate policy files.

See [policies.md](policies.md).

## Agent Instructions

```bash
agentloop install-agent codex
agentloop install-agent claude-code
agentloop install-agent cursor
agentloop install-agent opencode
agentloop install-agent gemini-cli
agentloop install-agent github-copilot-cli
agentloop install-agent all
agentloop install-agent all --json
```

`install-agent` writes agent-specific Markdown instructions under `.agentloop/agents/` and updates `AGENTS.md` with safe references. Unsupported agent names return supported names with no file writes.

## Templates And Completions

```bash
agentloop list-templates
agentloop list-templates --json

agentloop completion zsh
agentloop completion bash
agentloop completion fish
agentloop completion powershell
agentloop completion pwsh
```

`list-templates` shows bundled loop, policy, handoff, gate, and agent templates.

`completion` prints completion scripts to stdout. It does not edit `.zshrc`, `.bashrc`, fish config, PowerShell startup files, or other shell profile files.

## JSON Errors

Commands that support `--json` return parseable errors for invalid config, invalid artifact paths, unsupported values, and unsafe output paths. When validation fails, AgentLoopKit avoids partial writes.

## Safety Summary

AgentLoopKit does not install hooks, run postinstall scripts, collect telemetry, require API keys, upload files, read `.env` contents, or execute verification commands unless you explicitly run `agentloop verify`.
