# PR Summary

- Generated: 2026-06-12-00-04
- Task context: `Build local acceptance layer commands`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/github-actions.md`
- M `examples/end-to-end/README.md`
- M `scripts/smoke-cli.mjs`
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `tests/cli-docs-drift.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-00-04-pr-summary.md`
- ?? `.agentloop/reports/2026-06-11-23-57-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-00-04-ship-report.md`
- ?? `.agentloop/runs/`
- ?? `.agentloop/tasks/2026-06-11-build-local-acceptance-layer-commands.md`
- ?? `src/cli/commands/maintainer-check.ts`
- ?? `src/cli/commands/prepare-pr.ts`
- ?? `src/cli/commands/runs.ts`
- ?? `src/cli/commands/ship.ts`
- ?? `src/core/maintainer-check.ts`
- ?? `src/core/prepare-pr.ts`
- ?? `src/core/readiness-score.ts`
- ?? `src/core/runs.ts`
- ?? `src/core/ship.ts`
- ?? `tests/maintainer-check.test.ts`
- ?? `tests/prepare-pr.test.ts`
- ?? `tests/readiness-score.test.ts`
- ?? `tests/runs.test.ts`
- ?? `tests/ship.test.ts`

## Change Areas
### Source
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- ?? `src/cli/commands/maintainer-check.ts`
- ?? `src/cli/commands/prepare-pr.ts`
- ?? `src/cli/commands/runs.ts`
- ?? `src/cli/commands/ship.ts`
- ?? `src/core/maintainer-check.ts`
- ?? `src/core/prepare-pr.ts`
- ?? `src/core/readiness-score.ts`
- ?? `src/core/runs.ts`
- ?? `src/core/ship.ts`

### Tests
- M `tests/cli-docs-drift.test.ts`
- ?? `tests/maintainer-check.test.ts`
- ?? `tests/prepare-pr.test.ts`
- ?? `tests/readiness-score.test.ts`
- ?? `tests/runs.test.ts`
- ?? `tests/ship.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- ?? `.agentloop/handoffs/2026-06-12-00-04-pr-summary.md`
- ?? `.agentloop/reports/2026-06-11-23-57-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-00-04-ship-report.md`
- ?? `.agentloop/runs/`
- ?? `.agentloop/tasks/2026-06-11-build-local-acceptance-layer-commands.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/github-actions.md`
- M `examples/end-to-end/README.md`

### CI / Automation
- M `scripts/smoke-cli.mjs`

## Diff Stats
```text
.agentloop/backlog.md         |  1 +
 CHANGELOG.md                  |  4 +++
 DECISIONS.md                  |  6 ++++
 FINAL_HANDOFF.md              | 16 ++++++++++
 README.md                     | 30 +++++++++++++-----
 docs/cli-reference.md         | 49 ++++++++++++++++++++++++++++
 docs/github-actions.md        | 74 ++++++++++++++++++++++++++++++++++++++++++-
 examples/end-to-end/README.md | 32 ++++++++++++++++---
 scripts/smoke-cli.mjs         | 46 +++++++++++++++++++++++++++
 src/cli/index.ts              | 10 ++++++
 src/core/completions.ts       |  6 ++++
 tests/cli-docs-drift.test.ts  |  6 ++++
 12 files changed, 266 insertions(+), 14 deletions(-)
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
