# Handoff Evidence Churn Grouping Plan

## Goal

Keep `agentloop summarize` and `agentloop handoff` readable in long autonomous sessions by grouping generated AgentLoop evidence files in the Markdown changed-file list.

## Scope

- Change PR-summary Markdown rendering only.
- Keep returned `changedFiles`, JSON output, and run-ledger changed-files evidence complete.
- Preserve stale-handoff coverage for compact evidence summaries.
- Document the compact behavior in the CLI reference.

## Tests First

- Add coverage where source files and AgentLoop evidence files are dirty; Markdown should list source files and compact the evidence files.
- Add coverage where only AgentLoop evidence files are dirty; Markdown should still show an explicit evidence count.
- Add coverage that `handoff --json --write-run` keeps the full changed-file list in JSON and run evidence.

## Verification

- `npm test -- tests/handoff.test.ts`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run dogfood:strict`
