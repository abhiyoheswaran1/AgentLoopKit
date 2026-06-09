# Changelog

## 0.2.1

Review-safety release candidate:

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
