# Changelog

## Unreleased

- Added deterministic PR summary change-area classification for source, tests, docs, CI, config, AgentLoop, risk-sensitive, and uncategorized paths
- Added path-based review-focus hints to PR summaries without LLM calls or file-content inspection

## 0.15.1

Trust-polish GitHub patch release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added category-level `agentloop doctor` risk-file warnings with capped path examples
- Kept risk-file findings warning-only and path-only
- Reduced noisy risk-file false positives from Markdown docs and templates
- Replaced the unproven custom config schema URL with the GitHub raw schema URL
- Clarified that CLI config validation is local and does not fetch the schema URL at runtime
- Updated README, configuration docs, product-panel records, and release handoff notes

## 0.15.0

CI-context GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added allowlisted GitHub Actions context to `agentloop verify` reports
- Added a generic `CI=true` fallback for verification reports outside GitHub Actions
- Kept local verification reports quiet when CI is not detected
- Added tests for GitHub Actions metadata, generic CI metadata, local omission, and CI-env test isolation
- Updated README, verification docs, GitHub Actions docs, examples, generated harness guidance, product-panel records, and release handoff notes

## 0.14.0

check-gates strict-mode GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added `agentloop check-gates --strict` so CI can treat warning gates as failures
- Kept default `agentloop check-gates` warning behavior unchanged for local use
- Added `strict` to `check-gates --json` output
- Added strict-mode text to generated gate-check reports
- Added Vitest coverage for default warning behavior and strict warning failure
- Updated README, getting-started docs, gate-check docs, generated harness guidance, and README visual sources

## 0.13.0

check-gates GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added `agentloop check-gates` to check review-evidence readiness without running tests
- Added `agentloop check-gates --json` for deterministic agent and CI usage
- Checks task contract, verification report, handoff summary, repo harness, safety policies, and git context
- Added Vitest coverage for ready and missing-evidence paths
- Updated README, getting-started docs, gate-check docs, generated harness guidance, shell completions, agent templates, and README visual assets

## 0.12.0

create-task JSON output GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added `agentloop create-task --json` for machine-readable task creation
- JSON output includes the created task path and Markdown content
- Default human-readable `create-task` output remains unchanged
- Added Vitest coverage for JSON task creation output
- Updated README, getting-started docs, task-contract docs, generated task guidance, and README visual assets for the current task lifecycle

## 0.11.0

Task archive GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added `agentloop task archive <path>` to move one named task contract into `.agentloop/tasks/archive/`
- Archive refuses to overwrite an existing archived task file
- Archiving the active task clears the active task pointer
- Normal `agentloop task list` output excludes archived task contracts
- Updated README, getting-started docs, task docs, generated harness guidance, shell completions, and README visual assets for the archive workflow

## 0.10.0

Shell completions GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added `agentloop completion <bash|zsh|fish>` to print shell completion scripts
- Added static bash, zsh, and fish completion output with no shell profile mutation
- Completion scripts cover top-level commands, task subcommands, task status values, install-agent names, and supported shell names
- Added Vitest coverage for completion rendering and unsupported shell errors
- Updated README, getting-started docs, and README visual assets for the shell-completion workflow

## 0.9.0

Task status transitions GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added `agentloop task status <path> <status>` to update a task contract's `- Status:` line
- Added JSON output for status updates
- Added a fixed status set: `proposed`, `in-progress`, `blocked`, `review`, and `done`
- Updated generated AGENTS, AGENTLOOP, harness, task, and agent templates with task-status guidance
- Refreshed README screenshots and VHS terminal demo to show the task lifecycle command

## 0.8.0

Launch-quality monorepo guidance and docs trust GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added generated monorepo verification guidance to `.agentloop/harness/commands.md`, `.agentloop/README.md`, and `.agentloop/tasks/README.md`
- Updated docs to explain root checks versus package-level checks without claiming workspace orchestration support
- Updated the `doctor` monorepo warning with package-specific verification command examples
- Added a local Markdown link checker with tests, `pnpm check:links`, and CI coverage

## 0.7.0

Monorepo doctor awareness GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added monorepo marker detection to `agentloop doctor` for package workspaces, `pnpm-workspace.yaml`, Turbo, Nx, Lerna, and Rush config files
- `doctor` now reports detected workspace markers as warnings without changing project type or failing setup

## 0.6.0

Task reading GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added `agentloop task show <path>` and `agentloop task show <path> --json` to read a selected task contract without changing active state
- Updated docs and generated agent templates to use the `task list`, `task show`, `task set` sequence

## 0.5.0

Task discovery GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added `agentloop task list` and `agentloop task list --json` to inspect task contracts before pinning one
- Updated agent and harness templates to guide agents toward task discovery before active-task selection

## 0.4.0

Active task lifecycle GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added `agentloop task set <path>` to pin the active task contract
- Added `agentloop task current` and `agentloop task clear`
- Added `.agentloop/state.json` as a transparent repo-local active task pointer
- Updated `agentloop status` and deterministic handoffs to prefer the pinned active task before falling back to newest task file

## 0.3.0

Handoff command GitHub release. npm publish is pending trusted-publishing or local-auth repair:

- Added `agentloop handoff` as the clearer command for writing reviewer handoffs
- Kept `agentloop summarize` read-only unless `--write` is passed
- Updated `agentloop status` to suggest `agentloop handoff` when task and verification evidence exist
- Fixed repeated non-interactive `create-task` flags so all values are preserved
- Added `create-task --likely-file` and `--forbidden-file` for non-interactive task scoping
- Added `create-task` aliases for full task-contract fields: `--problem-statement`, `--desired-outcome`, `--assumption`, `--verification`, and `--rollback`
- Updated latest task/report detection to prefer newest modified Markdown files instead of filename order
- Updated first-run docs, generated workspace README guidance, and PR summary docs

## 0.2.1

Review-safety GitHub release. npm publish is pending trusted-publishing or local-auth repair:

- Verification reports now preserve the beginning and ending output when a command log is truncated
- Truncated command output includes a clear marker with the original output length
- `agentloop status` now points back to `agentloop verify` when the latest verification report failed
- Added release recovery docs for the `v0.2.0` GitHub/npm split
- Added GitHub contributor labels and good-first-issue guidance

## 0.2.0

Status command:

- Added `agentloop status` for active task, latest verification report, dirty files, configured commands, and next action
- Added `agentloop status --json` for machine-readable automation
- Fixed `agentloop version` and `agentloop --version` to read from `package.json`
- Added Vitest coverage for status and version behavior

## 0.1.1

README and release polish:

- Added README hero and verification screenshots rendered with Playwright
- Added a VHS terminal demo for the published npm CLI
- Updated README publishing status now that `agentloopkit` is live on npm
- Added a publish workflow guard that skips npm publish when the package version already exists
- Updated launch checklist and final handoff status

## 0.1.0

Initial MVP:

- TypeScript Node CLI
- `init`, `doctor`, `create-task`, `verify`, `summarize`, `install-agent`, `list-templates`, and `version`
- AgentLoopKit templates for loops, gates, policies, handoffs, agents, tasks, and harness files
- Deterministic verification reports and PR summaries
- Vitest coverage for core behavior
- GitHub Actions CI

Follow-up launch polish:

- Added `agentloop init --dry-run`
- Added `schema/agentloop.config.schema.json`
- Included the schema in npm package contents
- Added GitHub Actions workflow for npm trusted publishing
- Added generated `.agentloop/README.md`
- Added `agentloop install-agent all`
- Added internal product panel, personas, simulated review cycles, backlog, dogfood log, and final handoff
- Added launch checklist
