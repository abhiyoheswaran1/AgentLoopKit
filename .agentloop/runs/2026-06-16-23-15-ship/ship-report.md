# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-16-23-15`
- Review readiness score: `92`/100
- Task: `Add maintainer-check review area counts` (`in-progress`) - `.agentloop/tasks/2026-06-16-add-maintainer-check-review-area-counts-2.md`
- Verification: `pass` - `.agentloop/reports/2026-06-16-23-12-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-16-23-15-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `687 changed files is broad for one review.`
- `Verification evidence`: `100`/100 (weight `25`) - `Latest verification report passed.`
- `Evidence freshness`: `100`/100 (weight `15`) - `Verification evidence matches current task timing.`
- `Policy and gate compliance`: `100`/100 (weight `15`) - `Review gates passed.`
- `Handoff readiness`: `100`/100 (weight `10`) - `Reviewer handoff evidence exists.`
- `Risk flags`: `100`/100 (weight `5`) - `No risk-sensitive files detected.`

## Strengths

- Task contract has problem, outcome, acceptance criteria, verification commands, risk notes, and rollback notes.
- Verification evidence is passing.
- Review gates pass.
- Reviewer handoff exists.

## Warnings

- Large change set; consider splitting before review.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/harness/autonomous-dogfooding.md`
- D `.agentloop/tasks/2026-06-16-prevent-stale-agentloop-task-state.md`
- M `.agentloop/tasks/2026-06-16-publish-github-marketplace-action.md`
- M `AGENTLOOP.md`
- M `README.md`
- M `docs/check-gates.md`
- M `docs/cli-reference.md`
- M `docs/configuration.md`
- M `docs/getting-started.md`
- M `docs/maintenance-guards.md`
- M `docs/policies.md`
- M `docs/status.md`
- M `docs/upgrading-existing-repos.md`
- M `scripts/dogfood-start.mjs`
- M `scripts/dogfood.mjs`
- M `scripts/maintenance-check.mjs`
- M `scripts/smoke-packed-release.mjs`
- M `src/cli/commands/artifacts.ts`
- M `src/cli/commands/init.ts`
- M `src/cli/commands/next.ts`
- M `src/cli/commands/task.ts`
- M `src/core/artifacts.ts`
- M `src/core/check-gates.ts`
- M `src/core/evidence.ts`
- M `src/core/handoff-coverage.ts`
- M `src/core/maintainer-check.ts`
- M `src/core/policy-packs.ts`
- M `src/core/pr-summary.ts`
- M `src/core/review-context.ts`
- M `src/core/status.ts`
- M `src/core/task-state.ts`
- M `src/templates/root/AGENTLOOP.md`
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
- M `tests/release-smoke.test.ts`
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
- ?? `.agentloop/handoffs/2026-06-16-19-47-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-48-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-19-48-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-57-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-58-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-19-58-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-20-08-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-20-08-pr-summary-3.md`
- ?? `.agentloop/handoffs/2026-06-16-20-08-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-20-18-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-20-20-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-20-20-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-20-28-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-20-29-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-20-29-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-20-38-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-20-39-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-20-39-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-20-49-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-20-50-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-20-50-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-20-59-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-20-59-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-21-00-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-21-09-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-21-09-pr-summary-3.md`
- ?? `.agentloop/handoffs/2026-06-16-21-09-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-21-19-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-21-19-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-21-20-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-21-33-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-21-34-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-21-34-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-21-39-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-21-39-pr-summary-3.md`
- ?? `.agentloop/handoffs/2026-06-16-21-39-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-21-47-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-21-48-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-21-48-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-21-54-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-21-54-pr-summary-3.md`
- ?? `.agentloop/handoffs/2026-06-16-21-54-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-22-00-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-22-00-pr-summary-3.md`
- ?? `.agentloop/handoffs/2026-06-16-22-00-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-22-03-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-22-04-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-22-04-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-22-13-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-22-14-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-22-14-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-22-21-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-22-21-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-22-22-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-22-28-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-22-28-pr-summary-3.md`
- ?? `.agentloop/handoffs/2026-06-16-22-28-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-22-38-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-16-22-38-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-22-39-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-22-39-pr-summary-3.md`
- ?? `.agentloop/handoffs/2026-06-16-22-39-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-22-48-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-16-22-48-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-22-48-pr-summary-3.md`
- ?? `.agentloop/handoffs/2026-06-16-22-48-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-22-49-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-22-49-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-23-04-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-16-23-04-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-23-05-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-23-05-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-23-06-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-18-50-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-18-59-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-07-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-18-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-20-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-27-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-29-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-36-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-45-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-54-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-20-05-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-20-15-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-20-25-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-20-35-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-20-46-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-20-56-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-21-06-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-21-16-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-21-30-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-21-36-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-21-45-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-21-52-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-21-58-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-22-02-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-22-11-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-22-19-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-22-25-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-22-35-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-22-38-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-22-44-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-22-48-ship-report-2.md`
- ?? `.agentloop/reports/2026-06-16-22-48-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-22-57-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-23-01-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-23-04-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-23-12-verification-report.md`
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
- ?? `.agentloop/runs/2026-06-16-19-47-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-47-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-47-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-47-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-47-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-47-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-47-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-19-48-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-48-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-48-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-48-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-48-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-48-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-48-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-48-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-57-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-57-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-57-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-57-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-57-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-57-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-57-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-19-58-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-58-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-58-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-58-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-58-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-58-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-58-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-58-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-20-08-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-08-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-20-08-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-08-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-20-08-handoff-3/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-08-handoff-3/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-20-08-handoff-3/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-08-handoff-3/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-20-08-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-08-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-20-08-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-08-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-20-08-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-08-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-08-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-20-18-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-18-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-20-18-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-18-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-20-18-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-18-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-18-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-20-20-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-20-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-20-20-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-20-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-20-20-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-20-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-20-20-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-20-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-20-28-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-28-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-20-28-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-28-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-20-28-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-28-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-28-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-20-29-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-29-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-20-29-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-29-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-20-29-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-29-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-20-29-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-29-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-20-38-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-38-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-20-38-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-38-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-20-38-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-38-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-38-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-20-39-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-39-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-20-39-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-39-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-20-39-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-39-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-20-39-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-39-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-20-49-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-49-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-20-49-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-49-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-20-49-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-49-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-49-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-20-50-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-50-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-20-50-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-50-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-20-50-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-50-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-20-50-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-50-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-20-58-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-58-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-58-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-20-59-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-59-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-20-59-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-59-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-20-59-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-20-59-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-20-59-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-20-59-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-21-00-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-00-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-21-00-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-00-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-21-09-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-09-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-21-09-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-09-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-21-09-handoff-3/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-09-handoff-3/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-21-09-handoff-3/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-09-handoff-3/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-21-09-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-09-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-21-09-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-09-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-21-09-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-09-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-09-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-21-19-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-19-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-21-19-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-19-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-21-19-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-19-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-21-19-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-19-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-21-19-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-19-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-19-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-21-20-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-20-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-21-20-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-20-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-21-33-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-33-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-21-33-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-33-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-21-33-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-33-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-33-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-21-34-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-34-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-21-34-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-34-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-21-34-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-34-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-21-34-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-34-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-21-38-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-38-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-38-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-21-39-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-39-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-21-39-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-39-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-21-39-handoff-3/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-39-handoff-3/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-21-39-handoff-3/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-39-handoff-3/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-21-39-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-39-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-21-39-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-39-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-21-47-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-47-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-21-47-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-47-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-21-47-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-47-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-47-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-21-48-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-48-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-21-48-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-48-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-21-48-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-48-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-21-48-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-48-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-21-53-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-53-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-53-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-21-54-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-54-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-21-54-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-54-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-21-54-handoff-3/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-54-handoff-3/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-21-54-handoff-3/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-54-handoff-3/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-21-54-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-21-54-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-21-54-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-21-54-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-00-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-00-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-00-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-00-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-00-handoff-3/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-00-handoff-3/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-00-handoff-3/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-00-handoff-3/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-00-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-00-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-00-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-00-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-00-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-00-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-00-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-22-03-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-03-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-03-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-03-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-03-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-03-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-03-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-22-04-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-04-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-04-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-04-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-04-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-04-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-04-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-04-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-13-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-13-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-13-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-13-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-13-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-13-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-13-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-22-14-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-14-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-14-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-14-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-14-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-14-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-14-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-14-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-21-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-21-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-21-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-21-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-21-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-21-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-21-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-21-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-21-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-21-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-21-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-22-22-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-22-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-22-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-22-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-28-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-28-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-28-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-28-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-28-handoff-3/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-28-handoff-3/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-28-handoff-3/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-28-handoff-3/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-28-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-28-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-28-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-28-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-28-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-28-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-28-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-22-38-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-38-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-38-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-38-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-38-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-22-38-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-22-38-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-38-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-38-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-22-39-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-39-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-39-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-39-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-39-handoff-3/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-39-handoff-3/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-39-handoff-3/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-39-handoff-3/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-39-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-39-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-39-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-39-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-48-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-48-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-48-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-48-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-48-ship-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-48-ship-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-48-ship-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-48-ship-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-48-ship-2/score.json`
- ?? `.agentloop/runs/2026-06-16-22-48-ship-2/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-22-48-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-48-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-48-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-48-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-48-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-22-48-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-22-48-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-48-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-48-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-22-49-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-49-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-49-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-49-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-22-49-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-22-49-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-22-49-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-22-49-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-23-00-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-23-00-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-23-00-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-23-04-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-23-04-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-23-04-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-23-04-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-23-04-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-23-04-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-23-04-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-23-04-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-23-04-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-23-05-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-23-05-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-23-05-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-23-05-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-23-05-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-23-05-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-23-05-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-23-05-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-23-06-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-23-06-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-23-06-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-23-06-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-23-15-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-23-15-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-23-15-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-accept-redacted-artifact-inventory-flag.md`
- ?? `.agentloop/tasks/2026-06-16-accept-redacted-task-doctor-flag.md`
- ?? `.agentloop/tasks/2026-06-16-add-init-cli-next-step-guidance-2.md`
- ?? `.agentloop/tasks/2026-06-16-add-maintainer-check-review-area-counts-2.md`
- ?? `.agentloop/tasks/2026-06-16-add-maintainer-check-review-area-counts.md`
- ?? `.agentloop/tasks/2026-06-16-add-policy-pack-maintenance-coverage-2.md`
- ?? `.agentloop/tasks/2026-06-16-align-check-gates-active-task-next-action-2.md`
- ?? `.agentloop/tasks/2026-06-16-complete-redaction-guidance-smoke-coverage-2.md`
- ?? `.agentloop/tasks/2026-06-16-decouple-maintenance-check-from-strict-release-proof.md`
- ?? `.agentloop/tasks/2026-06-16-document-check-gates-task-done-next-action-2.md`
- ?? `.agentloop/tasks/2026-06-16-exclude-agentflight-placeholders-from-artifact-latest-task-2.md`
- ?? `.agentloop/tasks/2026-06-16-exclude-parked-tasks-from-artifact-latest-task-2.md`
- ?? `.agentloop/tasks/2026-06-16-group-agentflight-placeholders-in-task-list-2.md`
- ?? `.agentloop/tasks/2026-06-16-group-agentloop-evidence-churn-in-handoff-summaries-2.md`
- ?? `.agentloop/tasks/2026-06-16-ignore-active-agentflight-placeholder-tasks-2.md`
- ?? `.agentloop/tasks/2026-06-16-ignore-active-agentflight-placeholders-in-check-gates-2.md`
- ?? `.agentloop/tasks/2026-06-16-prevent-dogfood-start-placeholder-task-clutter.md`
- ?? `.agentloop/tasks/2026-06-16-select-next-agentloopkit-dogfood-roadmap-task.md`
- ?? `.agentloop/tasks/2026-06-16-separate-agentflight-placeholders-from-roadmap-task-counts.md`
- ?? `.agentloop/tasks/2026-06-16-separate-agentflight-placeholders-in-artifact-inventory.md`
- ?? `.agentloop/tasks/2026-06-16-separate-agentloop-evidence-churn-in-maintainer-check-2.md`
- ?? `.agentloop/tasks/2026-06-16-skip-agentflight-placeholder-section-warnings-2.md`
- ?? `.agentloop/tasks/2026-06-16-suppress-task-doctor-warning-after-clean-archived-evidence-2.md`
- ?? `.agentloop/tasks/2026-06-16-surface-agentflight-placeholders-in-review-context.md`
- ?? `.agentloop/tasks/2026-06-16-use-concise-evidence-steps-in-dogfood-output-2.md`
- ?? `.agentloop/tasks/2026-06-16-use-concise-hygiene-steps-in-dogfood-output-2.md`
- ?? `.agentloop/tasks/2026-06-16-use-concise-review-context-in-dogfood-output-2.md`
- ?? `.agentloop/tasks/2026-06-16-validate-local-policy-pack-manifest-names.md`
- ?? `.agentloop/tasks/archive/2026-06-16-accept-redacted-artifact-inventory-flag-2.md`
- ?? `.agentloop/tasks/archive/2026-06-16-accept-redacted-task-doctor-flag-2.md`
- ?? `.agentloop/tasks/archive/2026-06-16-add-init-cli-next-step-guidance.md`
- ?? `.agentloop/tasks/archive/2026-06-16-add-policy-pack-maintenance-coverage.md`
- ?? `.agentloop/tasks/archive/2026-06-16-align-check-gates-active-task-next-action.md`
- ?? `.agentloop/tasks/archive/2026-06-16-bound-agentflight-placeholder-task-list-output.md`
- ?? `.agentloop/tasks/archive/2026-06-16-complete-redaction-guidance-smoke-coverage.md`
- ?? `.agentloop/tasks/archive/2026-06-16-decouple-maintenance-check-from-strict-release-proof-2.md`
- ?? `.agentloop/tasks/archive/2026-06-16-document-check-gates-task-done-next-action.md`
- ?? `.agentloop/tasks/archive/2026-06-16-exclude-agentflight-placeholders-from-artifact-latest-task.md`
- ?? `.agentloop/tasks/archive/2026-06-16-exclude-parked-tasks-from-artifact-latest-task.md`
- ?? `.agentloop/tasks/archive/2026-06-16-group-agentflight-placeholders-in-task-list.md`
- ?? `.agentloop/tasks/archive/2026-06-16-group-agentloop-evidence-churn-in-handoff-summaries.md`
- ?? `.agentloop/tasks/archive/2026-06-16-ignore-active-agentflight-placeholder-tasks.md`
- ?? `.agentloop/tasks/archive/2026-06-16-ignore-active-agentflight-placeholders-in-check-gates.md`
- ?? `.agentloop/tasks/archive/2026-06-16-prevent-dogfood-start-placeholder-task-clutter-2.md`
- ?? `.agentloop/tasks/archive/2026-06-16-prevent-stale-agentloop-task-state.md`
- ?? `.agentloop/tasks/archive/2026-06-16-separate-agentflight-placeholders-from-roadmap-task-counts-2.md`
- ?? `.agentloop/tasks/archive/2026-06-16-separate-agentflight-placeholders-in-artifact-inventory-2.md`
- ?? `.agentloop/tasks/archive/2026-06-16-separate-agentloop-evidence-churn-in-maintainer-check.md`
- ?? `.agentloop/tasks/archive/2026-06-16-skip-agentflight-placeholder-section-warnings.md`
- ?? `.agentloop/tasks/archive/2026-06-16-suppress-task-doctor-warning-after-clean-archived-evidence.md`
- ?? `.agentloop/tasks/archive/2026-06-16-surface-agentflight-placeholders-in-review-context-2.md`
- ?? `.agentloop/tasks/archive/2026-06-16-use-concise-evidence-steps-in-dogfood-output.md`
- ?? `.agentloop/tasks/archive/2026-06-16-use-concise-hygiene-steps-in-dogfood-output.md`
- ?? `.agentloop/tasks/archive/2026-06-16-use-concise-review-context-in-dogfood-output.md`
- ?? `.agentloop/tasks/archive/2026-06-16-validate-local-policy-pack-manifest-names-2.md`
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
- ?? `src/core/agentloop-evidence.ts`

## Diff Stat

```text
.agentloop/harness/autonomous-dogfooding.md        |   2 +
 ...026-06-16-prevent-stale-agentloop-task-state.md |  78 ---
 ...2026-06-16-publish-github-marketplace-action.md |   2 +-
 AGENTLOOP.md                                       |   2 +
 README.md                                          |   6 +-
 docs/check-gates.md                                |   1 +
 docs/cli-reference.md                              |  20 +-
 docs/configuration.md                              |   2 +
 docs/getting-started.md                            |   2 +-
 docs/maintenance-guards.md                         |   6 +-
 docs/policies.md                                   |   2 +
 docs/status.md                                     |  17 +-
 docs/upgrading-existing-repos.md                   |  15 +
 scripts/dogfood-start.mjs                          |  89 ++-
 scripts/dogfood.mjs                                |   8 +-
 scripts/maintenance-check.mjs                      |   6 +-
 scripts/smoke-packed-release.mjs                   |   4 +
 src/cli/commands/artifacts.ts                      |   5 +
 src/cli/commands/init.ts                           |   2 +
 src/cli/commands/next.ts                           |  26 +-
 src/cli/commands/task.ts                           |  50 +-
 src/core/artifacts.ts                              |  84 ++-
 src/core/check-gates.ts                            |  46 +-
 src/core/evidence.ts                               |   9 +-
 src/core/handoff-coverage.ts                       |  24 +
 src/core/maintainer-check.ts                       |  38 +-
 src/core/policy-packs.ts                           |  29 +-
 src/core/pr-summary.ts                             |  54 +-
 src/core/review-context.ts                         |  17 +-
 src/core/status.ts                                 | 106 ++-
 src/core/task-state.ts                             | 309 ++++++++-
 src/templates/root/AGENTLOOP.md                    |   2 +
 tests/artifacts.test.ts                            | 283 ++++++++
 tests/autonomous-dogfood.test.ts                   |  65 +-
 tests/check-gates.test.ts                          |  99 ++-
 tests/dogfood-script.test.ts                       |  10 +-
 tests/dogfood-start-script.test.ts                 | 124 +++-
 tests/handoff.test.ts                              | 113 +++-
 tests/init.test.ts                                 |  41 ++
 tests/maintainer-check.test.ts                     | 117 +++-
 tests/maintenance-check-script.test.ts             |   6 +-
 tests/next.test.ts                                 | 181 ++++++
 tests/policy-packs.test.ts                         |  50 +-
 tests/pr-summary.test.ts                           |   7 +-
 tests/release-smoke.test.ts                        |  45 +-
 tests/review-context.test.ts                       |  31 +
 tests/status.test.ts                               | 192 ++++++
 tests/task-state.test.ts                           | 715 +++++++++++++++++++++
 48 files changed, 2935 insertions(+), 207 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Add maintainer-check review area counts`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `688 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
