# Compact AgentLoop evidence in prepare-pr

## Summary

`prepare-pr` should compact generated AgentLoop evidence files in the human PR body the same way handoff summaries do: show ordinary changed files, add one AgentLoop evidence count grouped by evidence directory, and state that JSON/run-ledger evidence keeps full paths.

## Changed Files

### Source
- M `src/cli/commands/artifacts.ts`
- M `src/cli/commands/init.ts`
- M `src/cli/commands/next.ts`
- M `src/cli/commands/task.ts`
- M `src/core/artifacts.ts`
- M `src/core/change-areas.ts`
- M `src/core/check-gates.ts`
- M `src/core/evidence.ts`
- M `src/core/handoff-coverage.ts`
- M `src/core/maintainer-check.ts`
- M `src/core/policy-packs.ts`
- M `src/core/pr-summary.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/review-context.ts`
- M `src/core/status.ts`
- M `src/core/task-state.ts`
- M `src/templates/root/AGENTLOOP.md`
- ?? `src/core/agentloop-evidence.ts`

### Tests
- M `tests/artifacts.test.ts`
- M `tests/autonomous-dogfood.test.ts`
- M `tests/check-gates.test.ts`
- M `tests/dogfood-script.test.ts`
- M `tests/dogfood-start-script.test.ts`
- M `tests/handoff.test.ts`
- M `tests/init.test.ts`
- M `tests/maintainer-check.test.ts`
- M `tests/maintenance-check-script.test.ts`
- M `tests/next.test.ts`
- M `tests/policy-packs.test.ts`
- M `tests/pr-summary.test.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/release-smoke.test.ts`
- M `tests/review-context.test.ts`
- M `tests/status.test.ts`
- M `tests/task-state.test.ts`

### AgentLoop
- M `.agentloop/harness/autonomous-dogfooding.md`
- M `AGENTLOOP.md`

### Documentation
- M `README.md`
- M `docs/check-gates.md`
- M `docs/cli-reference.md`
- M `docs/configuration.md`
- M `docs/getting-started.md`
- M `docs/maintenance-guards.md`
- M `docs/policies.md`
- M `docs/status.md`
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
- M `scripts/smoke-packed-release.mjs`

### AgentLoop Evidence
- AgentLoop evidence: `697` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Review Readiness

- Score: 92/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-16-23-36-ship-report-2.md`

## Acceptance Criteria

- `prepare-pr` PR body groups generated AgentLoop evidence paths into a compact count and grouped evidence directories.
- Non-evidence changed files remain grouped by review area in the PR body.
- JSON output still includes the full flat `changedFiles` list, including AgentLoop evidence paths.
- GitHub comment output remains unchanged except for any indirect ship evidence references already present.
- Focused prepare-pr tests cover the compact body output and unchanged JSON list.

## Verification Evidence

- Overall status: pass (`.agentloop/reports/2026-06-16-23-32-verification-report.md`)



## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the prepare-pr compact rendering change and its focused test expectations; PR bodies will return to fully expanding AgentLoop evidence files.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
