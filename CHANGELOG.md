# Changelog

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
