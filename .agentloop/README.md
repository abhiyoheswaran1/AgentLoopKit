# AgentLoopKit Workspace

This directory contains AgentLoopKit's own repo-local engineering loop artifacts.

## Current Internal Use

- Product panel: `product-panel.md`
- Target personas: `user-personas.md`
- Backlog: `backlog.md`
- Dogfood log: `dogfood-log.md`
- Simulated research cycles: `research/`
- Task contracts: `tasks/`
- Verification reports: `reports/`
- Handoffs: `handoffs/`

## Dogfood Commands

```bash
agentloop create-task --title "Describe the next focused change" --type feature
agentloop status
agentloop verify
agentloop handoff
```

Use `npx projscan doctor --format markdown` during implementation work in this repository.
