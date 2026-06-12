# PR Summary

- Generated: 2026-06-12-12-01
- Task context: `Clean stale 0.28.0 harness release guidance`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `scripts/smoke-packed-release.mjs`
- M `tests/release-smoke.test.ts`
- ?? `.agentloop/reports/2026-06-12-11-54-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-12-01-verify/`
- ?? `.agentloop/tasks/2026-06-12-clean-stale-0-28-0-harness-release-guidance.md`
- ?? `docs/logo/`

## Change Areas
### Tests
- M `tests/release-smoke.test.ts`

### AgentLoop
- M `AGENTLOOP.md`
- M `AGENTS.md`
- ?? `.agentloop/reports/2026-06-12-11-54-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-12-01-verify/`
- ?? `.agentloop/tasks/2026-06-12-clean-stale-0-28-0-harness-release-guidance.md`

### Documentation
- ?? `docs/logo/`

### CI / Automation
- M `scripts/smoke-packed-release.mjs`

## Diff Stats
```text
AGENTLOOP.md                     |  2 +-
 AGENTS.md                        |  2 +-
 scripts/smoke-packed-release.mjs | 35 +++++++++++++++++++++++++++++++++++
 tests/release-smoke.test.ts      | 18 ++++++++++++++++++
 4 files changed, 55 insertions(+), 2 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
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
