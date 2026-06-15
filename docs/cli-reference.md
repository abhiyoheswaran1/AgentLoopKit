# CLI Reference

AgentLoopKit exposes the same CLI through two binaries:

```bash
agentloop init
agentloopkit init
```

The examples below use `agentloop`. Replace it with `npx agentloopkit` when you do not have the package installed locally.

For a complete command sequence, see the [End-to-end workflow](../examples/end-to-end/README.md).

`init` uses the current directory as the setup target. Other repo commands search upward for the nearest `agentloop.config.json` and use that folder as the AgentLoop root. This lets agents run `status`, `create-task`, `verify`, `handoff`, and related commands from nested source folders after root setup.

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

## Upgrade Harness

```bash
agentloop upgrade-harness
agentloop upgrade-harness --dry-run
agentloop upgrade-harness --details
agentloop upgrade-harness --suggestions
agentloop upgrade-harness --json
agentloop upgrade-harness --json --redact-paths
```

`upgrade-harness` inspects existing generated guidance after a CLI upgrade. It reads `AGENTS.md`, `AGENTLOOP.md`, `.agentloop/harness/commands.md`, `.agentloop/README.md`, and `.agentloop/manifest.json`, then reports whether the harness mentions the current review-readiness loop: `ship`, `prepare-pr`, run ledger or file intent, `maintainer-check`, `review-context`, and upgrade guidance.

Use `--details` or `--suggestions` when you want copyable Markdown guidance for missing current-loop topics. JSON output includes the same suggestions as structured data.

The command is read-only. It does not overwrite guidance, merge templates, create tasks, run verification commands, read `.env` contents, call external APIs, or upload files. Use `init --dry-run` after `upgrade-harness` when you also want to see missing generated files.

Use `--redact-paths` before pasting output into a public issue, PR, or CI log. It replaces the absolute AgentLoop root with `[agentloop-root]`.

Existing repos can use the latest CLI before refreshing old guidance:

```bash
npx --yes agentloopkit@latest upgrade-harness --dry-run
npx --yes agentloopkit@latest ship
npx --yes agentloopkit@latest prepare-pr
```

## Doctor

```bash
agentloop doctor
agentloop doctor --json
agentloop doctor --strict
agentloop doctor --redact-paths
```

`doctor` checks setup health, template manifest state, configured commands, Git root, current working tree, package manager detection, project type detection, missing commands, monorepo signals, and risk-file categories.

Env files are reported by path only. AgentLoopKit does not read `.env` contents.
Risk-file scanning is bounded; on very large repos, doctor reports when the scan stops early so you can run targeted checks.

Warnings keep exit code `0` by default. Use `--strict` when warnings should fail CI or a team setup gate.

Use `--redact-paths` before pasting doctor output into a public issue, PR, or CI log. It hides the absolute Git root and keeps repo-relative risk-file paths readable. Default JSON keeps the absolute Git root for scripts that need it.

## Task Contracts

```bash
agentloop create-task --type feature --title "Add settings page" \
  --problem-statement "Users cannot manage account preferences" \
  --desired-outcome "Users can update settings from the app" \
  --likely-file src/settings \
  --forbidden-file migrations/ \
  --acceptance "Settings can be saved" \
  --include-config-commands \
  --verification "pnpm test" \
  --risk "Touches account preferences" \
  --rollback "Remove the settings route"
agentloop create-task --type bugfix --title "Fix release guard" \
  --verification "npm test -- tests/prepublish-check.test.ts" \
  --post-verification "npm run dogfood:strict"
```

Supported task types are `feature`, `bugfix`, `refactor`, `tests`, `test-generation`, `docs`, `release`, `security-review`, `dependency-upgrade`, and `migration`.

Task contracts record the problem statement, desired outcome, constraints, non-goals, assumptions, likely files, files not to touch, acceptance criteria, verification commands, post-verification gates, risk notes, and rollback notes.

`create-task` sets the new contract as the active task. With `--json`, output includes both `task` and `activeTask`. Use `task set <path>` when you need to switch back to an older or alternate contract.

Use `--verification` for commands that `agentloop verify --task-commands` may run before the verification report exists. Use `--post-verification` for gates that need existing AgentLoop evidence, such as `npm run dogfood:strict`, `agentloop ship`, `agentloop prepare-pr`, `agentloop check-gates`, `agentloop maintainer-check`, or reviewer-handoff checks. Post-verification gates are recorded in the task contract but are not executed by `agentloop verify --task-commands`.

Task verification command list items may be written as plain Markdown list text or as inline code, for example `- npm test` or ``- `npm test` ``. AgentLoopKit unwraps one balanced inline-code wrapper before execution.

When a `--verification` command looks like a post-verification gate, `create-task` prints a warning and JSON output includes a `warnings` array. AgentLoopKit does not move commands between sections; the warning tells you when to use `--post-verification`.

Use `--include-config-commands` to copy non-empty `test`, `lint`, `typecheck`, and `build` commands from `agentloop.config.json` into the contract's `Verification Commands` section. AgentLoopKit de-duplicates exact command strings and does not run those commands during task creation.

## Task State

```bash
agentloop task list
agentloop task show .agentloop/tasks/<task-file>.md
agentloop task set .agentloop/tasks/<task-file>.md
agentloop task status .agentloop/tasks/<task-file>.md in-progress
agentloop task done
agentloop task done .agentloop/tasks/<task-file>.md
agentloop task current
agentloop task clear
agentloop task archive .agentloop/tasks/<task-file>.md
agentloop task archive --status done --dry-run
agentloop task archive --status done
agentloop task doctor
```

`task list --json` returns `path`, `title`, `status`, `active`, and `modifiedAt`. Listing tasks does not create or update `.agentloop/state.json`.

Supported statuses are `proposed`, `in-progress`, `blocked`, `deferred`, `review`, and `done`. Use `deferred` for parked work that should remain visible but should not become the next unpinned task.

`task done` marks the active task `done`. Pass a path to mark a non-active task done.

Archive task contracts after verification and handoff, not as a substitute for either. Use `task archive --status done --dry-run` to preview a bulk cleanup, then run `task archive --status done` to move finished contracts into `.agentloop/tasks/archive/`. Bulk archive only accepts `done`; parked or active work still requires an explicit path.

`task doctor` is read-only. It warns about missing, legacy, unsupported, and terminal statuses, likely post-verification gates listed under `Verification Commands`, and open task contracts that still contain AgentLoopKit placeholder text in review-critical sections. Replace placeholder sections before asking an agent to implement the task. `deferred` tasks are treated as parked backlog and do not trigger placeholder warnings.

## Status And Next

```bash
agentloop status
agentloop status --brief
agentloop status --json
agentloop status --redact-paths
agentloop next
agentloop next --json
agentloop next --redact-paths
```

`status` shows the pinned active task, newest open task when no task is pinned, deferred tasks, current verification report, newest local run ledger entry, working tree state, Git root, configured commands, missing commands, and next suggested command. Clean `review` tasks with passing verification point to `agentloop task done` before the next task starts.

Use `--brief` when an agent or script needs one compact human-readable line plus the reason. Brief output includes the latest run evidence when `.agentloop/runs/` exists. `next` uses the same decision rules but prints only the next action. These commands do not run verification commands, call an LLM, read `.env` contents, or write task state.

Use `status --redact-paths` or `next --redact-paths` before pasting output into public logs. It replaces the absolute Git root with `[git-root]` and keeps repo-relative AgentLoop artifact paths. Default JSON keeps the absolute Git root for scripts that need it.

See [status.md](status.md).

## Review Context

```bash
agentloop review-context
agentloop review-context --json
agentloop review-context --redact-paths
```

`review-context` prints one read-only local snapshot for agents and scripts that do not use MCP. It combines active task state, latest verification, review gates, policy status, artifact inventory, recent run ledger entries, latest ship score, optional imported GitHub issue or PR metadata, working-tree state, safety notes, and the next recommended action.

The command does not run verification, write files, include full Markdown artifact bodies, read `.env` contents, call external APIs, or post to GitHub.

## Verification

```bash
agentloop verify
agentloop verify --json
agentloop verify --task-commands
agentloop verify --task .agentloop/tasks/<task-file>.md
agentloop verify --task .agentloop/tasks/<task-file>.md --task-commands
agentloop verify --task .agentloop/tasks/<task-file>.md --task-commands --only-task-commands
agentloop verify --timeout-ms 120000
agentloop verify --progress
agentloop verify --write-run
agentloop verify --redact-paths
```

`verify` reads `agentloop.config.json`, runs configured commands, captures output excerpts, and writes a Markdown report under `.agentloop/reports/`.

Use `--task` to include task context in the report. Use `--task-commands` when you also want to run commands listed under the task contract's `Verification Commands` section. `--task-commands` uses the explicit `--task` path first, then the active task set by `create-task` or `task set`; without either, it exits before running commands. Add `--only-task-commands` when a reviewed task contract should run by itself without the configured repo commands.

Verification runs each exact command string once. If a command appears in both `agentloop.config.json` and the task contract, AgentLoopKit keeps the first configured slot and skips the duplicate task entry.

`verify --task-commands` does not run `Post-Verification Gates`. Run those after the verification report exists.

Use `--write-run` when you want verification to also create a local run ledger entry under `.agentloop/runs/`. The run records the verification report path, task reference when available, current changed files, and overall verification status.

Use `--redact-paths` before copying verification output into public issues, PRs, or CI logs. It replaces the local repo root with `[git-root]` in the generated Markdown report, JSON `markdown`, command-output excerpts, and run-ledger verification report copies. Default output keeps raw command output for private local debugging.

Use `--progress` for long local checks. It prints bounded start/finish lines for each command and keeps raw command output in the verification report. JSON output remains parseable when `--json` and `--progress` are combined.

Failed reports include a short failure summary with each failed command, exit code, timeout state, and useful final output lines. If no commands are configured, AgentLoopKit writes a report saying nothing was verified.

See [verification-reports.md](verification-reports.md).

## Ship And Prepare PR

```bash
agentloop ship
agentloop ship --json
agentloop ship --github-comment
agentloop ship --github-comment --redact-paths
agentloop ship --run-verify
agentloop ship --run-verify --task-commands

agentloop prepare-pr
agentloop prepare-pr --json
agentloop prepare-pr --stdout
agentloop prepare-pr --write
agentloop prepare-pr --github-comment
agentloop prepare-pr --json --github-comment --redact-paths
```

`ship` runs the local review-readiness flow. It detects the active task, reads Git status and diff stats, checks current verification evidence, runs gates, writes or links a handoff, calculates a deterministic review-readiness score, writes a Markdown ship report under `.agentloop/reports/`, and records a run under `.agentloop/runs/`.

The readiness score is evidence-based. It scores task clarity, scope control, verification evidence, evidence freshness, policy and gate compliance, handoff readiness, and risk flags. It does not claim to measure code quality.

`ship` scores the review evidence it creates during the command, so the generated handoff and ship run can satisfy handoff freshness without requiring an immediate extra `agentloop handoff` run.

By default, `ship` reuses current verification evidence. Use `--run-verify` when you want it to run configured verification commands first. Use `--task-commands` with `--run-verify` to also run verification commands recorded in the task contract.

Use `ship --github-comment` when CI needs compact review-readiness Markdown for a pull request comment. With `--json`, the comment appears as `githubComment`. Without `--json`, the command prints only the comment Markdown. AgentLoopKit does not read GitHub tokens, call GitHub APIs, or post comments by itself.

`prepare-pr` generates a PR title and body from the active task, changed files, verification evidence, ship report, gates, risk notes, rollback notes, and optional imported GitHub issue or PR metadata. It groups changed files by review area so reviewers can scan risk-sensitive paths, source, tests, AgentLoop evidence, docs, CI, config, and other files. `--github-comment` includes Markdown suitable for a PR comment. The CLI does not read GitHub tokens or post comments by itself.

PR-facing Markdown uses repo-relative AgentLoop artifact paths. `prepare-pr` escapes Markdown control characters in task-derived list prose and imported issue or PR excerpts, so acceptance criteria, risk notes, and GitHub metadata do not turn into unintended checkboxes, headings, or links.
JSON output keeps path fields unchanged for scripts.
Use `--redact-paths` with `ship` or `prepare-pr` before copying review-readiness output into public logs or PR comments. It hides the absolute Git root inside embedded gate evidence while keeping repo-relative AgentLoop artifact paths.

When a fresh ship run already matches the active task, current verification report, existing ship report, and non-generated changed files, `prepare-pr` reuses that run instead of writing a duplicate run ledger entry. If the evidence is missing or no longer matches, it refreshes ship evidence first.

JSON output includes `shipEvidence.source` as `reused` or `refreshed`, plus `shipEvidence.runId` when the evidence came from a run ledger entry.

## Run Ledger And Intent

```bash
agentloop runs
agentloop runs --latest
agentloop runs --limit 5
agentloop runs --json
agentloop show-run <id>
agentloop show-run <id> --json
agentloop intent src/auth/callback.ts
agentloop intent src/auth/callback.ts --json
```

`ship` records a local run folder under `.agentloop/runs/` automatically. `verify --write-run`, `summarize --write-run`, and `handoff --write-run` can also write run records when you want narrower evidence history. Runs store metadata, changed files JSON, and command-specific artifacts such as score JSON, verification reports, diff stats, ship reports, or PR summaries.

Use `runs --latest` for the newest entry, or `runs --limit <count>` for a bounded recent list. Invalid limits fail before AgentLoopKit loads the workspace or reads run metadata.

Run ledger JSON and Markdown use display-safe paths. AgentLoopKit artifacts render as `.agentloop/...`; repo files render as repo-relative paths; older absolute paths outside the repo collapse to the filename.

`intent <file>` reads the local run ledger and shows which previous AgentLoopKit runs changed that file. It uses local ledger metadata only.

## Maintainer Check

```bash
agentloop maintainer-check
agentloop maintainer-check --json
agentloop maintainer-check --redact-paths
```

`maintainer-check` helps maintainers evaluate AI-assisted pull requests. It checks for a task contract, fresh verification evidence, handoff evidence, optional imported GitHub issue or PR metadata, changed file count, dependency and lockfile changes, migrations, auth/security-sensitive files, and generated output files.

When the repo has dirty files, handoff evidence must come from the latest handoff or ship run and cover those files. An older PR summary still appears in the output, but `maintainer-check` warns that it is stale.

If a verified task was archived after handoff, `maintainer-check` can use the latest run ledger entry when it still points to an existing archived task contract.

Missing imported GitHub metadata is neutral. Invalid local metadata is a warning because reviewers cannot rely on it.

Use `--redact-paths` before pasting maintainer-check output into a public issue, PR, or CI log. Default JSON keeps existing repo-relative paths unchanged for scripts.

It is read-only. It does not write reports, run verification commands, call GitHub APIs, read tokens, or upload files.

## Gate Checks

```bash
agentloop check-gates
agentloop check-gates --json
agentloop check-gates --strict
agentloop check-gates --redact-paths
```

`check-gates` checks review evidence without running tests. It looks for task evidence, current verification evidence, handoff evidence, task-folder hygiene, harness files, policy files, and Git context.

If the latest verification report is older than the active or newest open task, `check-gates` treats it as stale and asks you to rerun verification for that task.

If the working tree has dirty files and the latest review-evidence run does not cover them, `check-gates` warns and asks you to refresh the handoff. Review-evidence runs are `handoff` runs and `ship` runs that record a handoff path.

Warnings keep exit code `0` by default. Use `--strict` in CI when warning gates should fail.

Clean committed work does not fail strict gates only because there are no changed files. The Git context gate reports that state as pass when the repo is inside Git.

Use `--redact-paths` when gate output will be copied into a public issue, PR, or CI log. It hides the absolute Git root without changing gate decisions.

See [check-gates.md](check-gates.md).

## Handoffs And PR Summaries

```bash
agentloop summarize
agentloop summarize --json
agentloop summarize --write
agentloop summarize --write-run
agentloop summarize --redact-paths
agentloop handoff
agentloop handoff --json
agentloop handoff --write-run
agentloop handoff --redact-paths
```

`summarize` previews a deterministic reviewer summary. `handoff` writes that summary to `.agentloop/handoffs/`.

The summary reads Git status, Git diff stats, active task or newest open task, current verification report, and config settings. It groups changed files into review areas and adds review-focus hints from file paths only. It does not call an LLM.

Use `--write-run` when you want a summary or handoff to also create a local run ledger entry under `.agentloop/runs/`. For `summarize`, this does not write a handoff file unless you also pass `--write`; for `handoff`, the handoff file is written by default.

If the latest verification report is older than the task, `summarize` and `handoff` leave verification as missing instead of showing stale passing evidence.

Use `--redact-paths` before copying summary or handoff output into public issues, PRs, or CI logs. It replaces local absolute roots in the Markdown with `[git-root]` while keeping repo-relative changed-file paths readable.

See [pr-summaries.md](pr-summaries.md).

## Local Evidence Reports

```bash
agentloop artifacts
agentloop artifacts --type verification
agentloop artifacts --type ship-report
agentloop artifacts --type ci-summary --latest
agentloop artifacts --type run --latest
agentloop artifacts --stale
agentloop artifacts --stale --type ship-report
agentloop artifacts --stale --limit 25
agentloop artifacts --stale --json
agentloop artifacts --json
agentloop artifacts --json --latest

agentloop report
agentloop report --json
agentloop report --out .agentloop/reports/review.html

agentloop badge
agentloop badge --source gates
agentloop badge --json
```

`artifacts` inventories existing local AgentLoop evidence without writing files. It reports task counts, task statuses, latest verification report, latest handoff, latest ship report, HTML reports, badges, CI summaries, release notes, and run ledger entries. Use `--type` to filter to `task`, `verification`, `handoff`, `ship-report`, `html-report`, `badge`, `ci-summary`, `release-notes`, or `run`. Use `--latest` to print only the latest matching artifact entries. Use `--stale` to preview older verification, handoff, ship report, and run-ledger evidence candidates while keeping the latest evidence protected. Markdown stale previews show the first 50 candidates by default. Use `--type ship-report` with `--stale` to inspect only ship report candidates. Use `--limit <count>` with `--stale` to change the cap while still reporting total and hidden counts. JSON output uses repo-relative paths, returns all stale candidates unless you pass `--limit`, and does not include artifact file contents.

`artifacts --stale` is a read-only cleanup preview. It does not delete files, write files, read `.env` contents, follow symlinked artifact roots outside the repo, or run verification commands.

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

## Dogfood Scripts

```bash
npm run test:quick
npm run test:unit
npm run test:integration
npm run test:release
npm run dogfood
npm run dogfood:json
npm run dogfood:strict
npm run dogfood:strict:json
npm run release-flow
```

`test:quick` runs the fast unit-oriented suite through `test:unit`. `test:integration` runs slower CLI workflow tests. `test:release` runs the full Vitest suite through `npm test`.

The dogfood scripts run AgentLoopKit's local self-check path for this repository, including public-doc hygiene, dependency audit, review gates, artifact inventory, maintainer reviewability, review context, AgentFlight health, and ProjScan health. JSON mode prints one structured summary with mode, overall status, step results, exit codes, durations, and safety notes for agents and CI logs. It redacts the current workspace root as `[git-root]` before printing structured output.

The scripts do not publish packages, create tags, post comments, read tokens, read `.env` files, or run verification commands.

`release-flow` runs the local release gate: prepublish metadata check, lint, typecheck, full tests, build, public docs hygiene, link checking, strict dogfood, packed release smoke, and `agentloop release-check --strict --redact-paths`. It does not publish packages, create tags, or create GitHub releases.

## Release Notes And npm Status

```bash
agentloop release-notes
agentloop release-notes --from <tag> --to HEAD
agentloop release-notes --release-version <version>
agentloop release-notes --public
agentloop release-notes --json
agentloop release-notes --write

agentloop release-check
agentloop release-check --json
agentloop release-check --strict
agentloop release-check --redact-paths

agentloop release-proof
agentloop release-proof --json
agentloop release-proof --strict
agentloop release-proof --redact-paths
agentloop release-proof --npm-registry-json npm-view.json
agentloop release-proof --github-release-json github-release.json
agentloop release-proof --ghcr-tags-json ghcr-tags.json
agentloop release-proof --mcp-registry-json mcp-registry.json

agentloop npm-status
agentloop npm-status --agentloopkit
agentloop npm-status --json
agentloop npm-status --expect-current
agentloop npm-status --registry-json npm-view.json
```

`release-notes` drafts local release notes from package metadata, changelog entries, Git history, changed files, working tree status, the active task, the current verification report, and the latest CI summary when those artifacts exist. Use `--public` for concise release-page copy that keeps changed-file inventory and local AgentLoop evidence out of the rendered Markdown. User-provided Git refs must be ordinary refs such as `v1.2.3` or `HEAD`; option-shaped refs are rejected.

`release-check` checks local release readiness from package metadata, changelog entries, release scripts, git state, current verification evidence, reviewer handoff, and generated release notes. It warns when `CHANGELOG.md` still has `Unreleased` entries, verification predates the current task, or the latest generated release notes do not mention the local package version. Use `--strict` when warnings should fail CI or a maintainer release gate.

Use `--redact-paths` before pasting release-check output into a public issue, PR, or CI log. Default JSON keeps the absolute Git root for scripts that need it.

`release-proof` checks post-release evidence across public release channels. It reports whether npm, GitHub Releases, GHCR, and MCP Registry proof match the local package version. Use captured JSON flags when you want deterministic CI or release notes without live registry calls. Use `--strict` when missing proof should fail the command.

`npm-status` checks registry state without publishing. It validates package names before running `npm view --json <package> version versions`, unless you pass captured registry JSON. It refuses `.env` and `.env.*` paths for `--registry-json`.

These commands do not create tags, publish packages, read tokens, read `.env` files, upload files, or change package metadata.

See [release-notes.md](release-notes.md), [release-proof.md](release-proof.md), and [npm-status.md](npm-status.md).

## SchemaStore

```bash
agentloop schemastore
agentloop schemastore --json
```

`schemastore` prints the catalog entry for `agentloop.config.json`. Maintainers can use the JSON output when preparing a SchemaStore contribution.

It does not write files, open a pull request, call SchemaStore, call GitHub APIs, read tokens, or modify package metadata.

See [schemastore.md](schemastore.md).

## GitHub Metadata

```bash
agentloop github import --issue-json issue.json
agentloop github import --pr-json pr.json
agentloop github import --issue-json issue.json --pr-json pr.json
agentloop github import --issue-json issue.json --dry-run
agentloop github import --issue-json issue.json --json
```

`github import` reads explicit local JSON files from `gh issue view --json ...`, `gh pr view --json ...`, or compatible GitHub API output. It normalizes issue and pull request metadata into `.agentloop/github/context.json`. If you pass `--output`, the path must stay under `.agentloop/github/`.

`review-context`, `prepare-pr`, and `maintainer-check` read that local context file when it exists. Missing metadata does not block review evidence. PR-facing output escapes issue and PR prose before rendering it.

It does not run `gh`, call GitHub APIs, read GitHub tokens, read `.env` files, post comments, upload files, or execute commands from issue or pull request text.

See [github-metadata.md](github-metadata.md).

## MCP Server

```bash
agentloop mcp-server
```

The MCP server is read-only. It exposes existing repo evidence to MCP clients through stdio: status, next action, task contracts, active task, policies, policy template status, latest verification report, latest ship report, artifact inventory metadata, review context snapshots, run ledger summaries and details, file intent matches, maintainer reviewability checks, gate status, and handoff summaries.

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
agentloop policy packs
agentloop policy packs --json
agentloop policy pack show agentloop-baseline
agentloop policy pack apply agentloop-baseline --dry-run
agentloop policy pack apply agentloop-baseline
```

`policy` reads Markdown files from `.agentloop/policies/`. `policy status` compares local Markdown with bundled templates and reports `current`, `modified`, `missing`, and `extra` files.

`policy packs` lists bundled packs and local organization packs configured in `agentloop.config.json`. `policy pack apply` copies missing policy files and skips existing files. It does not overwrite local policy edits.

It does not enforce compliance, scan source code, fetch remote policy packs, read `.env` files, or call a service.

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
agentloop version
```

`list-templates` shows bundled loop, policy, handoff, gate, and agent templates.

`completion` prints completion scripts to stdout. It does not edit `.zshrc`, `.bashrc`, fish config, PowerShell startup files, or other shell profile files.

`version` prints the installed AgentLoopKit CLI version.

## JSON Errors

Commands that support `--json` return parseable errors for invalid config, invalid artifact paths, unsupported values, and unsafe output paths. When validation fails, AgentLoopKit avoids partial writes.

## Safety Summary

AgentLoopKit does not install hooks, run postinstall scripts, collect telemetry, require API keys, upload files, read `.env` contents, or execute verification commands unless you explicitly run `agentloop verify`.
