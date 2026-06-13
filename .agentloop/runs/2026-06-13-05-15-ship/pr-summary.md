# PR Summary

- Generated: 2026-06-13-05-15
- Task context: `Add dogfood JSON summary`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `package.json`
- M `scripts/dogfood.mjs`
- M `tests/dogfood-script.test.ts`
- ?? `.agentloop/reports/2026-06-13-05-10-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-05-10-verify/`
- ?? `.agentloop/tasks/2026-06-13-add-dogfood-json-summary.md`

## Change Areas
### Tests
- M `tests/dogfood-script.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-13-05-10-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-05-10-verify/`
- ?? `.agentloop/tasks/2026-06-13-add-dogfood-json-summary.md`

### Documentation
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`

### CI / Automation
- M `scripts/dogfood.mjs`

### Config / Package
- M `package.json`

## Diff Stats
```text
.agentloop/backlog.md        |   1 +
 .agentloop/dogfood-log.md    |  26 +++++++
 CHANGELOG.md                 |   1 +
 README.md                    |   9 +++
 docs/cli-reference.md        |  13 ++++
 package.json                 |   2 +
 scripts/dogfood.mjs          | 175 +++++++++++++++++++++++++++++++++++++------
 tests/dogfood-script.test.ts | 123 ++++++++++++++++++++++++++++++
 8 files changed, 327 insertions(+), 23 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Check tests cover the changed behavior.
- Check docs match the implemented command behavior.
- Review CI or automation changes for permissions and secret handling.
- Review package and config changes for install, build, and publish impact.
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
