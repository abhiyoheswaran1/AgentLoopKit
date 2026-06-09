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
agentloop status
agentloop policy list
agentloop policy show security
agentloop verify
agentloop handoff
agentloop report
agentloop badge
```

Use `npx projscan doctor --format markdown` during implementation work in this repository.
