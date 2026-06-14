# PR Summary

- Generated: 2026-06-14-14-48
- Task context: `Release AgentLoopKit 0.32.0`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/dogfood-log.md`
- D `.agentloop/tasks/2026-06-14-release-agentloopkit-0-32-0.md`
- M `FINAL_HANDOFF.md`
- M `ROADMAP.md`
- M `docs/npm-publishing.md`
- M `docs/release-status.md`
- ?? `.agentloop/tasks/archive/2026-06-14-release-agentloopkit-0-32-0.md`

## Change Areas
### AgentLoop
- M `.agentloop/dogfood-log.md`
- D `.agentloop/tasks/2026-06-14-release-agentloopkit-0-32-0.md`
- ?? `.agentloop/tasks/archive/2026-06-14-release-agentloopkit-0-32-0.md`

### Documentation
- M `FINAL_HANDOFF.md`
- M `ROADMAP.md`
- M `docs/npm-publishing.md`
- M `docs/release-status.md`

## Diff Stats
```text
.agentloop/dogfood-log.md                          | 28 +++++++++++
 .../2026-06-14-release-agentloopkit-0-32-0.md      | 58 ----------------------
 FINAL_HANDOFF.md                                   | 22 ++++----
 ROADMAP.md                                         |  2 +-
 docs/npm-publishing.md                             |  2 +-
 docs/release-status.md                             | 31 ++++++------
 6 files changed, 60 insertions(+), 83 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
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
