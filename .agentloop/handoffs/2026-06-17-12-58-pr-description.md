# Document dogfood-start task type preflight

## Summary

The repo dogfood guide tells agents that dogfood:start validates supported task types before companion tools run and that --type test is normalized to tests.

## Changed Files

### Source
- M `src/cli/commands/artifacts.ts`
- M `src/cli/commands/badge.ts`
- M `src/cli/commands/ci-summary.ts`
- M `src/cli/commands/github.ts`
- M `src/cli/commands/init.ts`
- M `src/cli/commands/install-agent.ts`
- M `src/cli/commands/next.ts`
- M `src/cli/commands/policy.ts`
- M `src/cli/commands/release-notes.ts`
- M `src/cli/commands/report.ts`
- M `src/cli/commands/review-context.ts`
- M `src/cli/commands/runs.ts`
- M `src/cli/commands/schemastore.ts`
- M `src/cli/commands/task.ts`
- M `src/core/artifacts.ts`
- M `src/core/change-areas.ts`
- M `src/core/check-gates.ts`
- M `src/core/ci-summary.ts`
- M `src/core/completions.ts`
- M `src/core/evidence.ts`
- M `src/core/handoff-coverage.ts`
- M `src/core/html-report.ts`
- M `src/core/init.ts`
- M `src/core/maintainer-check.ts`
- M `src/core/policy-packs.ts`
- M `src/core/pr-summary.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/readiness-score.ts`
- M `src/core/release-notes.ts`
- M `src/core/review-context.ts`
- M `src/core/ship.ts`
- M `src/core/status.ts`
- M `src/core/task-state.ts`
- M `src/templates/root/AGENTLOOP.md`
- ?? `src/core/agentloop-evidence.ts`

### Tests
- M `tests/agent-installation.test.ts`
- M `tests/artifacts.test.ts`
- M `tests/autonomous-dogfood.test.ts`
- M `tests/badge.test.ts`
- M `tests/check-gates.test.ts`
- M `tests/ci-summary.test.ts`
- M `tests/completion.test.ts`
- M `tests/distribution-artifacts.test.ts`
- M `tests/dogfood-script.test.ts`
- M `tests/dogfood-start-script.test.ts`
- M `tests/github-metadata.test.ts`
- M `tests/handoff.test.ts`
- M `tests/html-report.test.ts`
- M `tests/init.test.ts`
- M `tests/maintainer-check.test.ts`
- M `tests/maintenance-check-script.test.ts`
- M `tests/next.test.ts`
- M `tests/policy-packs.test.ts`
- M `tests/policy.test.ts`
- M `tests/pr-summary.test.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/public-docs-hygiene.test.ts`
- M `tests/readiness-score.test.ts`
- M `tests/release-notes.test.ts`
- M `tests/release-smoke.test.ts`
- M `tests/review-context.test.ts`
- M `tests/runs.test.ts`
- M `tests/schemastore.test.ts`
- M `tests/ship.test.ts`
- M `tests/status.test.ts`
- M `tests/task-state.test.ts`

### AgentLoop
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/autonomous-dogfooding.md`
- M `AGENTLOOP.md`

### Documentation
- M `README.md`
- M `docs/check-gates.md`
- M `docs/ci-summary.md`
- M `docs/cli-reference.md`
- M `docs/configuration.md`
- M `docs/getting-started.md`
- M `docs/html-reports.md`
- M `docs/maintenance-guards.md`
- M `docs/policies.md`
- M `docs/release-notes.md`
- M `docs/schemastore.md`
- M `docs/status.md`
- M `docs/task-contracts.md`
- M `docs/upgrading-existing-repos.md`
- ?? `docs/superpowers/plans/2026-06-16-agentflight-placeholder-roadmap-counts.md`
- ?? `docs/superpowers/plans/2026-06-16-artifact-inventory-agentflight-placeholders.md`
- ?? `docs/superpowers/plans/2026-06-16-artifact-latest-agentflight-placeholder-filter.md`
- ?? `docs/superpowers/plans/2026-06-16-artifacts-redact-paths-flag.md`
- ?? `docs/superpowers/plans/2026-06-16-decouple-maintenance-check-release-proof.md`
- ?? `docs/superpowers/plans/2026-06-16-dogfood-concise-evidence-steps.md`
- ?? `docs/superpowers/plans/2026-06-16-dogfood-concise-hygiene-steps.md`
- ?? `docs/superpowers/plans/2026-06-16-dogfood-concise-review-context.md`
- ?? `docs/superpowers/plans/2026-06-16-dogfood-placeholder-task-clutter.md`
- ?? `docs/superpowers/plans/2026-06-16-handoff-evidence-churn-grouping.md`
- ?? `docs/superpowers/plans/2026-06-16-ignore-active-agentflight-placeholder-tasks.md`
- ?? `docs/superpowers/plans/2026-06-16-maintainer-check-evidence-churn.md`
- ?? `docs/superpowers/plans/2026-06-16-redaction-guidance-smoke-coverage.md`
- ?? `docs/superpowers/plans/2026-06-16-review-context-agentflight-placeholders.md`
- ?? `docs/superpowers/plans/2026-06-16-task-list-agentflight-placeholder-grouping.md`

### CI / Automation
- M `scripts/dogfood-start.mjs`
- M `scripts/dogfood.mjs`
- M `scripts/maintenance-check.mjs`
- M `scripts/smoke-cli.mjs`
- M `scripts/smoke-packed-release.mjs`

### Other
- M `.agentflight/config.json`
- ?? `.projscanrc.json`

### AgentLoop Evidence
- AgentLoop evidence: `2735` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Review Readiness

- Score: 92/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-17-12-58-ship-report.md`

## Acceptance Criteria

- Autonomous dogfood tests lock the guide wording for supported task types and the test alias.

## Verification Evidence

- Overall status: pass (`.agentloop/reports/2026-06-17-12-50-verification-report.md`)



## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Low risk. This updates internal harness guidance only, but stale dogfood instructions can cause companion-tool side effects.

## Rollback Notes

Revert the autonomous dogfood guide wording and the matching harness test assertions.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
