# PR Summary

- Generated: 2026-06-16-00-29
- Task context: `Make doctor output Markdown-safe`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`
- M `src/core/doctor.ts`
- M `tests/doctor.test.ts`
- ?? `.agentloop/reports/2026-06-16-00-27-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-00-27-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-00-27-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-00-27-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-make-doctor-output-markdown-safe.md`

## Change Areas
### Source
- M `src/core/doctor.ts`

### Tests
- M `tests/doctor.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- ?? `.agentloop/reports/2026-06-16-00-27-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-00-27-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-00-27-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-00-27-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-make-doctor-output-markdown-safe.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`

## Diff Stats
```text
.agentloop/backlog.md   |  6 +++++
 CHANGELOG.md            |  1 +
 docs/cli-reference.md   |  3 ++-
 docs/getting-started.md |  3 ++-
 src/core/doctor.ts      | 21 ++++++++++++++----
 tests/doctor.test.ts    | 58 +++++++++++++++++++++++++++++++++++++++++++++++++
 6 files changed, 86 insertions(+), 6 deletions(-)
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
