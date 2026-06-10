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
agentloop policy list
agentloop policy show security
agentloop policy status
agentloop verify
agentloop handoff
agentloop report
agentloop badge
agentloop ci-summary
```

Use `npx projscan doctor --format markdown` during implementation work in this repository.

Local policy files are repo guidance. If `agentloop policy status` reports `modified`, read the local file and follow the repo-specific rule. Do not overwrite customized policy text just to match the bundled template.
