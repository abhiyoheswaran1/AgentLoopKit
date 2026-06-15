# PR Summary

- Generated: 2026-06-16-00-51
- Task context: `Make check-gates output Markdown-safe`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/check-gates.md`
- M `docs/cli-reference.md`
- M `src/core/check-gates.ts`
- M `tests/check-gates.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-00-50-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-00-49-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-00-50-ship-report.md`
- ?? `.agentloop/runs/2026-06-16-00-50-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-00-50-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-00-50-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-00-50-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-00-50-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-00-50-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-00-50-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-00-50-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-00-50-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-16-make-check-gates-output-markdown-safe.md`

## Change Areas
### Source
- M `src/core/check-gates.ts`

### Tests
- M `tests/check-gates.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-16-00-50-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-00-49-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-00-50-ship-report.md`
- ?? `.agentloop/runs/2026-06-16-00-50-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-00-50-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-00-50-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-00-50-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-00-50-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-00-50-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-00-50-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-00-50-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-00-50-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-16-make-check-gates-output-markdown-safe.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/check-gates.md`
- M `docs/cli-reference.md`

## Diff Stats
```text
.agentloop/backlog.md     |  8 +++-
 .agentloop/dogfood-log.md | 41 ++++++++++++++++++++
 CHANGELOG.md              |  1 +
 docs/check-gates.md       |  1 +
 docs/cli-reference.md     |  1 +
 src/core/check-gates.ts   | 29 +++++++-------
 tests/check-gates.test.ts | 97 ++++++++++++++++++++++++++++++++++-------------
 7 files changed, 137 insertions(+), 41 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Review source changes for behavior and public API impact.
- Check tests cover the changed behavior.
- Check docs match the implemented command behavior.
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
