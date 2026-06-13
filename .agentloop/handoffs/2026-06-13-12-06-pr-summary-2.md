# PR Summary

- Generated: 2026-06-13-12-06
- Task context: `Escape prepare-pr list Markdown`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `src/core/markdown-format.ts`
- M `src/core/prepare-pr.ts`
- M `tests/prepare-pr.test.ts`
- ?? `.agentloop/handoffs/2026-06-13-12-06-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-12-01-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-12-06-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-12-02-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-12-02-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-12-02-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-13-12-06-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-12-06-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-12-06-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-13-12-06-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-12-06-ship/score.json`
- ?? `.agentloop/runs/2026-06-13-12-06-ship/ship-report.md`
- ?? `.agentloop/tasks/archive/2026-06-13-escape-prepare-pr-list-markdown.md`

## Change Areas
### Source
- M `src/core/markdown-format.ts`
- M `src/core/prepare-pr.ts`

### Tests
- M `tests/prepare-pr.test.ts`

### AgentLoop
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-13-12-06-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-12-01-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-12-06-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-12-02-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-12-02-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-12-02-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-13-12-06-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-12-06-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-12-06-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-13-12-06-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-12-06-ship/score.json`
- ?? `.agentloop/runs/2026-06-13-12-06-ship/ship-report.md`
- ?? `.agentloop/tasks/archive/2026-06-13-escape-prepare-pr-list-markdown.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/cli-reference.md`

## Diff Stats
```text
.agentloop/dogfood-log.md   | 26 +++++++++++++++++++++++
 CHANGELOG.md                |  1 +
 docs/cli-reference.md       |  3 ++-
 src/core/markdown-format.ts |  8 +++++++
 src/core/prepare-pr.ts      |  6 ++++--
 tests/prepare-pr.test.ts    | 52 ++++++++++++++++++++++++++++++++++++++++-----
 6 files changed, 88 insertions(+), 8 deletions(-)
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
