# Changelog

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
