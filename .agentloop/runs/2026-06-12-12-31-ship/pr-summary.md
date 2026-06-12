# PR Summary

- Generated: 2026-06-12-12-31
- Task context: `Add repeatable dogfood gate and official icon assets`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/dogfood-log.md`
- M `AGENTS.md`
- M `CONTRIBUTING.md`
- M `README.md`
- M `docs/assets/readme/README.md`
- M `docs/assets/readme/agentloopkit-showcase.png`
- M `docs/assets/readme/agentloopkit-verification.png`
- M `docs/assets/readme/showcase.html`
- M `docs/assets/readme/verification.html`
- M `package.json`
- ?? `.agentloop/reports/2026-06-12-12-21-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-12-29-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-repeatable-dogfood-gate-and-official-icon-assets.md`
- ?? `docs/logo/`
- ?? `scripts/dogfood.mjs`
- ?? `tests/dogfood-script.test.ts`

## Change Areas
### Tests
- ?? `tests/dogfood-script.test.ts`

### AgentLoop
- M `.agentloop/dogfood-log.md`
- M `AGENTS.md`
- ?? `.agentloop/reports/2026-06-12-12-21-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-12-29-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-repeatable-dogfood-gate-and-official-icon-assets.md`

### Documentation
- M `CONTRIBUTING.md`
- M `README.md`
- M `docs/assets/readme/README.md`
- M `docs/assets/readme/agentloopkit-showcase.png`
- M `docs/assets/readme/agentloopkit-verification.png`
- M `docs/assets/readme/showcase.html`
- M `docs/assets/readme/verification.html`
- ?? `docs/logo/`

### CI / Automation
- ?? `scripts/dogfood.mjs`

### Config / Package
- M `package.json`

## Diff Stats
```text
.agentloop/dogfood-log.md                        |  36 +++++++++++++++++++++++
 AGENTS.md                                        |   1 +
 CONTRIBUTING.md                                  |   4 +++
 README.md                                        |  20 +++++++++++++
 docs/assets/readme/README.md                     |   2 ++
 docs/assets/readme/agentloopkit-showcase.png     | Bin 527918 -> 528474 bytes
 docs/assets/readme/agentloopkit-verification.png | Bin 339754 -> 348960 bytes
 docs/assets/readme/showcase.html                 |  18 ++++--------
 docs/assets/readme/verification.html             |  25 +++++++++++++++-
 package.json                                     |   2 ++
 10 files changed, 94 insertions(+), 14 deletions(-)
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
