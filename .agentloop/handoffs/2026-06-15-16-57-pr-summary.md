# PR Summary

- Generated: 2026-06-15-16-57
- Task context: `Support redacted handoff output`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/pr-summaries.md`
- M `src/cli/commands/summarize.ts`
- M `src/core/pr-summary.ts`
- M `src/core/verification.ts`
- M `src/templates/tasks/README.md`
- M `tests/pr-summary.test.ts`
- M `tests/verification.test.ts`
- ?? `.agentloop/handoffs/2026-06-15-16-53-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-16-56-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-16-43-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-16-48-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-16-43-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-16-43-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-16-43-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-16-52-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-16-52-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-16-52-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-16-53-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-16-53-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-16-53-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-16-53-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-16-56-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-16-56-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-16-56-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-16-56-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-15-support-redacted-handoff-output.md`

## Change Areas
### Source
- M `src/cli/commands/summarize.ts`
- M `src/core/pr-summary.ts`
- M `src/core/verification.ts`
- M `src/templates/tasks/README.md`

### Tests
- M `tests/pr-summary.test.ts`
- M `tests/verification.test.ts`

### AgentLoop
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-15-16-53-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-16-56-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-16-43-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-16-48-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-16-43-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-16-43-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-16-43-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-16-52-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-16-52-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-16-52-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-16-53-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-16-53-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-16-53-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-16-53-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-16-56-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-16-56-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-16-56-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-16-56-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-15-support-redacted-handoff-output.md`

### Documentation
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/pr-summaries.md`

## Diff Stats
```text
.agentloop/dogfood-log.md     | 41 +++++++++++++++++++++++++++++++
 CHANGELOG.md                  |  2 ++
 README.md                     |  2 +-
 docs/cli-reference.md         |  6 +++++
 docs/pr-summaries.md          |  2 ++
 src/cli/commands/summarize.ts |  3 +++
 src/core/pr-summary.ts        | 23 ++++++++++++++++--
 src/core/verification.ts      | 10 +++++++-
 src/templates/tasks/README.md |  2 ++
 tests/pr-summary.test.ts      | 56 +++++++++++++++++++++++++++++++++++++++++--
 tests/verification.test.ts    | 48 +++++++++++++++++++++++++++++++++++++
 11 files changed, 189 insertions(+), 6 deletions(-)
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
