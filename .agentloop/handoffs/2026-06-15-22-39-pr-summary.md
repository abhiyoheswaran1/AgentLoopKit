# PR Summary

- Generated: 2026-06-15-22-39
- Task context: `Add local release proof helper`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/dogfood-log.md`
- M `docs/release-proof.md`
- M `src/core/release-proof.ts`
- M `tests/release-proof.test.ts`
- ?? `.agentloop/handoffs/2026-06-15-22-38-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-22-36-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-22-37-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-22-39-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-22-37-verify-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-22-37-verify-2/metadata.json`
- ?? `.agentloop/runs/2026-06-15-22-37-verify-2/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-22-37-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-22-37-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-22-37-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-22-38-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-22-38-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-22-38-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-22-38-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-22-39-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-22-39-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-22-39-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-15-add-local-release-proof-helper.md`

## Change Areas
### Source
- M `src/core/release-proof.ts`

### Tests
- M `tests/release-proof.test.ts`

### AgentLoop
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-15-22-38-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-22-36-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-22-37-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-22-39-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-22-37-verify-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-22-37-verify-2/metadata.json`
- ?? `.agentloop/runs/2026-06-15-22-37-verify-2/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-22-37-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-22-37-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-22-37-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-22-38-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-22-38-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-22-38-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-22-38-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-22-39-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-22-39-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-22-39-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-15-add-local-release-proof-helper.md`

### Documentation
- M `docs/release-proof.md`

## Diff Stats
```text
.agentloop/dogfood-log.md   | 34 ++++++++++++++++
 docs/release-proof.md       |  4 ++
 src/core/release-proof.ts   | 57 +++++++++++++++-----------
 tests/release-proof.test.ts | 97 +++++++++++++++++++++++++++++++++++++++------
 4 files changed, 155 insertions(+), 37 deletions(-)
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
