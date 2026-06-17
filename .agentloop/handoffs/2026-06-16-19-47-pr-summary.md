# PR Summary

- Generated: 2026-06-16-19-47
- Task context: `Surface AgentFlight placeholders in review context`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/harness/autonomous-dogfooding.md`
- D `.agentloop/tasks/2026-06-16-prevent-stale-agentloop-task-state.md`
- M `.agentloop/tasks/2026-06-16-publish-github-marketplace-action.md`
- M `AGENTLOOP.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/maintenance-guards.md`
- M `docs/status.md`
- M `docs/upgrading-existing-repos.md`
- M `scripts/dogfood-start.mjs`
- M `scripts/maintenance-check.mjs`
- M `src/cli/commands/next.ts`
- M `src/cli/commands/task.ts`
- M `src/core/artifacts.ts`
- M `src/core/check-gates.ts`
- M `src/core/review-context.ts`
- M `src/core/status.ts`
- M `src/core/task-state.ts`
- M `src/templates/root/AGENTLOOP.md`
- M `tests/artifacts.test.ts`
- M `tests/autonomous-dogfood.test.ts`
- M `tests/dogfood-start-script.test.ts`
- M `tests/maintenance-check-script.test.ts`
- M `tests/next.test.ts`
- M `tests/review-context.test.ts`
- M `tests/status.test.ts`
- M `tests/task-state.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-18-51-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-18-52-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-18-59-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-01-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-08-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-11-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-19-11-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-19-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-20-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-19-20-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-30-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-19-30-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-37-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-39-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-19-39-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-18-50-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-18-59-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-07-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-18-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-20-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-27-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-29-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-36-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-45-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-18-51-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-18-51-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-18-51-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-18-51-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-18-51-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-18-51-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-18-51-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-18-52-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-18-52-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-18-52-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-18-52-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-18-59-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-18-59-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-18-59-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-18-59-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-18-59-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-18-59-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-18-59-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-19-01-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-01-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-01-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-01-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-08-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-08-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-08-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-08-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-08-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-08-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-08-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-19-11-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-11-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-11-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-11-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-11-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-11-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-11-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-11-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-18-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-18-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-18-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-19-19-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-19-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-19-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-19-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-20-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-20-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-20-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-20-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-20-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-20-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-20-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-20-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-20-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-20-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-20-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-19-28-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-28-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-28-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-19-30-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-30-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-30-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-30-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-30-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-30-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-30-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-30-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-30-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-30-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-30-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-19-36-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-36-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-36-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-19-37-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-37-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-37-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-37-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-39-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-39-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-39-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-39-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-39-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-39-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-39-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-39-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-47-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-47-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-47-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-decouple-maintenance-check-from-strict-release-proof.md`
- ?? `.agentloop/tasks/2026-06-16-prevent-dogfood-start-placeholder-task-clutter.md`
- ?? `.agentloop/tasks/2026-06-16-separate-agentflight-placeholders-from-roadmap-task-counts.md`
- ?? `.agentloop/tasks/2026-06-16-separate-agentflight-placeholders-in-artifact-inventory.md`
- ?? `.agentloop/tasks/2026-06-16-surface-agentflight-placeholders-in-review-context-2.md`
- ?? `.agentloop/tasks/2026-06-16-surface-agentflight-placeholders-in-review-context.md`
- ?? `.agentloop/tasks/archive/2026-06-16-decouple-maintenance-check-from-strict-release-proof-2.md`
- ?? `.agentloop/tasks/archive/2026-06-16-prevent-dogfood-start-placeholder-task-clutter-2.md`
- ?? `.agentloop/tasks/archive/2026-06-16-prevent-stale-agentloop-task-state.md`
- ?? `.agentloop/tasks/archive/2026-06-16-separate-agentflight-placeholders-from-roadmap-task-counts-2.md`
- ?? `.agentloop/tasks/archive/2026-06-16-separate-agentflight-placeholders-in-artifact-inventory-2.md`
- ?? `docs/superpowers/plans/2026-06-16-agentflight-placeholder-roadmap-counts.md`
- ?? `docs/superpowers/plans/2026-06-16-artifact-inventory-agentflight-placeholders.md`
- ?? `docs/superpowers/plans/2026-06-16-decouple-maintenance-check-release-proof.md`
- ?? `docs/superpowers/plans/2026-06-16-dogfood-placeholder-task-clutter.md`
- ?? `docs/superpowers/plans/2026-06-16-review-context-agentflight-placeholders.md`

## Change Areas
### Source
- M `src/cli/commands/next.ts`
- M `src/cli/commands/task.ts`
- M `src/core/artifacts.ts`
- M `src/core/check-gates.ts`
- M `src/core/review-context.ts`
- M `src/core/status.ts`
- M `src/core/task-state.ts`
- M `src/templates/root/AGENTLOOP.md`

### Tests
- M `tests/artifacts.test.ts`
- M `tests/autonomous-dogfood.test.ts`
- M `tests/dogfood-start-script.test.ts`
- M `tests/maintenance-check-script.test.ts`
- M `tests/next.test.ts`
- M `tests/review-context.test.ts`
- M `tests/status.test.ts`
- M `tests/task-state.test.ts`

### AgentLoop
- M `.agentloop/harness/autonomous-dogfooding.md`
- D `.agentloop/tasks/2026-06-16-prevent-stale-agentloop-task-state.md`
- M `.agentloop/tasks/2026-06-16-publish-github-marketplace-action.md`
- M `AGENTLOOP.md`
- ?? `.agentloop/handoffs/2026-06-16-18-51-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-18-52-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-18-59-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-01-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-08-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-11-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-19-11-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-19-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-20-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-19-20-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-30-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-19-30-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-37-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-39-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-19-39-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-18-50-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-18-59-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-07-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-18-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-20-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-27-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-29-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-36-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-45-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-18-51-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-18-51-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-18-51-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-18-51-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-18-51-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-18-51-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-18-51-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-18-52-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-18-52-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-18-52-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-18-52-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-18-59-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-18-59-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-18-59-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-18-59-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-18-59-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-18-59-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-18-59-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-19-01-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-01-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-01-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-01-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-08-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-08-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-08-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-08-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-08-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-08-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-08-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-19-11-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-11-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-11-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-11-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-11-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-11-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-11-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-11-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-18-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-18-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-18-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-19-19-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-19-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-19-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-19-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-20-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-20-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-20-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-20-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-20-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-20-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-20-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-20-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-20-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-20-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-20-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-19-28-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-28-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-28-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-19-30-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-30-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-30-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-30-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-30-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-30-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-30-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-30-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-30-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-30-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-30-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-19-36-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-36-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-36-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-19-37-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-37-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-37-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-37-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-39-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-39-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-39-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-39-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-39-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-39-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-39-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-39-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-47-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-47-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-47-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-decouple-maintenance-check-from-strict-release-proof.md`
- ?? `.agentloop/tasks/2026-06-16-prevent-dogfood-start-placeholder-task-clutter.md`
- ?? `.agentloop/tasks/2026-06-16-separate-agentflight-placeholders-from-roadmap-task-counts.md`
- ?? `.agentloop/tasks/2026-06-16-separate-agentflight-placeholders-in-artifact-inventory.md`
- ?? `.agentloop/tasks/2026-06-16-surface-agentflight-placeholders-in-review-context-2.md`
- ?? `.agentloop/tasks/2026-06-16-surface-agentflight-placeholders-in-review-context.md`
- ?? `.agentloop/tasks/archive/2026-06-16-decouple-maintenance-check-from-strict-release-proof-2.md`
- ?? `.agentloop/tasks/archive/2026-06-16-prevent-dogfood-start-placeholder-task-clutter-2.md`
- ?? `.agentloop/tasks/archive/2026-06-16-prevent-stale-agentloop-task-state.md`
- ?? `.agentloop/tasks/archive/2026-06-16-separate-agentflight-placeholders-from-roadmap-task-counts-2.md`
- ?? `.agentloop/tasks/archive/2026-06-16-separate-agentflight-placeholders-in-artifact-inventory-2.md`

### Documentation
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/maintenance-guards.md`
- M `docs/status.md`
- M `docs/upgrading-existing-repos.md`
- ?? `docs/superpowers/plans/2026-06-16-agentflight-placeholder-roadmap-counts.md`
- ?? `docs/superpowers/plans/2026-06-16-artifact-inventory-agentflight-placeholders.md`
- ?? `docs/superpowers/plans/2026-06-16-decouple-maintenance-check-release-proof.md`
- ?? `docs/superpowers/plans/2026-06-16-dogfood-placeholder-task-clutter.md`
- ?? `docs/superpowers/plans/2026-06-16-review-context-agentflight-placeholders.md`

### CI / Automation
- M `scripts/dogfood-start.mjs`
- M `scripts/maintenance-check.mjs`

## Diff Stats
```text
.agentloop/harness/autonomous-dogfooding.md        |   2 +
 ...026-06-16-prevent-stale-agentloop-task-state.md |  78 ----
 ...2026-06-16-publish-github-marketplace-action.md |   2 +-
 AGENTLOOP.md                                       |   2 +
 README.md                                          |   4 +-
 docs/cli-reference.md                              |   8 +-
 docs/maintenance-guards.md                         |   6 +-
 docs/status.md                                     |  16 +-
 docs/upgrading-existing-repos.md                   |  15 +
 scripts/dogfood-start.mjs                          |  89 ++++-
 scripts/maintenance-check.mjs                      |   6 +-
 src/cli/commands/next.ts                           |  26 +-
 src/cli/commands/task.ts                           |   9 +-
 src/core/artifacts.ts                              |  75 ++--
 src/core/check-gates.ts                            |  19 +-
 src/core/review-context.ts                         |  17 +-
 src/core/status.ts                                 |  98 ++++-
 src/core/task-state.ts                             | 264 ++++++++++++-
 src/templates/root/AGENTLOOP.md                    |   2 +
 tests/artifacts.test.ts                            |  85 +++++
 tests/autonomous-dogfood.test.ts                   |   8 +-
 tests/dogfood-start-script.test.ts                 | 124 +++++-
 tests/maintenance-check-script.test.ts             |   6 +-
 tests/next.test.ts                                 | 121 ++++++
 tests/review-context.test.ts                       |  31 ++
 tests/status.test.ts                               | 138 +++++++
 tests/task-state.test.ts                           | 416 +++++++++++++++++++++
 27 files changed, 1514 insertions(+), 153 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Review source changes for behavior and public API impact.
- Check tests cover the changed behavior.
- Check docs match the implemented command behavior.
- Review CI or automation changes for permissions and secret handling.
- Review AgentLoop artifacts for accurate task, verification, and handoff evidence.

## Verification Performed
- Overall status: pass

## Verification Not Performed
- Check the verification report for skipped commands.

## Risks
- Re-check protected files such as migrations, secrets, auth, billing, deployment, and public APIs before merge.

## Rollback Notes
- Revert the changed files or revert the merge commit if this lands as a PR.

## Reviewer Checklist
- [ ] Acceptance criteria match the task contract.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk areas have been reviewed.
- [ ] Rollback plan is clear.

## Follow-Ups
- Capture any deferred work in ROADMAP.md or a new task contract.
