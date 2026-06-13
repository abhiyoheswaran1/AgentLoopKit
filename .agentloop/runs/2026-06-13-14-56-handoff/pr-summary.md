# PR Summary

- Generated: 2026-06-13-14-56
- Task context: `Release 0.29.0`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `ROADMAP.md`
- M `docs/launch-checklist.md`
- M `docs/npm-publishing.md`
- M `docs/release-status.md`
- M `package.json`
- M `pnpm-lock.yaml`
- M `server.json`
- ?? `.agentloop/handoffs/2026-06-13-14-55-release-notes.md`
- ?? `.agentloop/reports/2026-06-13-14-47-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-14-52-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-14-52-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-14-52-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-13-release-0-29-0.md`

## Change Areas
### Risk-Sensitive
- M `pnpm-lock.yaml`

### AgentLoop
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-13-14-55-release-notes.md`
- ?? `.agentloop/reports/2026-06-13-14-47-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-14-52-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-14-52-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-14-52-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-13-release-0-29-0.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `ROADMAP.md`
- M `docs/launch-checklist.md`
- M `docs/npm-publishing.md`
- M `docs/release-status.md`

### Config / Package
- M `package.json`

### Other
- M `server.json`

## Diff Stats
```text
.agentloop/dogfood-log.md |  35 ++++
 CHANGELOG.md              |   5 +
 FINAL_HANDOFF.md          |  36 +++-
 ROADMAP.md                |   8 +-
 docs/launch-checklist.md  |   2 +-
 docs/npm-publishing.md    |  10 +-
 docs/release-status.md    |  51 ++---
 package.json              |   7 +-
 pnpm-lock.yaml            | 515 +++++++++++-----------------------------------
 server.json               |   4 +-
 10 files changed, 241 insertions(+), 432 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Check docs match the implemented command behavior.
- Review package and config changes for install, build, and publish impact.
- Review AgentLoop artifacts for accurate task, verification, and handoff evidence.
- Review risk-sensitive paths such as migrations, auth, security, billing, env, deployment, and lockfiles with extra care.
- Review uncategorized files for ownership and scope.

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
