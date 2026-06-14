# AgentLoopKit Workspace

This directory contains AgentLoopKit's own repo-local engineering loop artifacts.

`manifest.json` records the generated template version for this harness. `agentloop doctor` warns when the manifest is missing, stale, invalid, or newer than the installed CLI supports.

## Current Internal Use

- Product panel: `product-panel.md`
- Target personas: `user-personas.md`
- Backlog: `backlog.md`
- Dogfood log: `dogfood-log.md`
- Template manifest: `manifest.json`
- Simulated research cycles: `research/`
- Task contracts: `tasks/`
- Verification reports: `reports/`
- Handoffs: `handoffs/`
- Active task pointer: `state.json`

## Dogfood Commands

```bash
agentloop create-task --title "Describe the next focused change" --type feature
agentloop task set .agentloop/tasks/<task-file>.md
agentloop task doctor
agentloop status
agentloop review-context
agentloop policy list
agentloop policy show security
agentloop policy status
agentloop verify
agentloop ship
agentloop prepare-pr
agentloop maintainer-check
agentloop handoff
agentloop runs --latest
agentloop intent <file>
agentloop upgrade-harness
agentloop report
agentloop badge
agentloop ci-summary
agentloop release-proof
```

Use `npx projscan doctor --format markdown` during implementation work in this repository.

Local policy files are repo guidance. If `agentloop policy status` reports `modified`, read the local file and follow the repo-specific rule. Do not overwrite customized policy text just to match the bundled template.

Use `agentloop ship` as the main stop condition for meaningful code changes. It writes a ship report, records run evidence under `.agentloop/runs/`, and scores review-readiness evidence without claiming to measure code quality.

Use `agentloop prepare-pr` when reviewers need PR-ready copy. Use `agentloop maintainer-check` when reviewing whether an AI-assisted change has enough task, verification, handoff or ship, and risk evidence.

Use `agentloop upgrade-harness` after AgentLoopKit CLI upgrades. It reports stale local guidance and writes nothing.
