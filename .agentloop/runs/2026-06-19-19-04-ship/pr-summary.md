# PR Summary

- Generated: 2026-06-19-19-04
- Task context: `Guard real-repo trial guidance`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/harness/autonomous-dogfooding.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/contributor-playbook.md`
- M `docs/getting-started.md`
- M `docs/npm-publishing.md`
- M `docs/status.md`
- M `scripts/smoke-packed-release.mjs`
- M `src/core/artifacts.ts`
- M `src/core/task-state.ts`
- M `tests/public-docs-hygiene.test.ts`
- M `tests/task-state.test.ts`
- ?? `.agentloop/research/interview-cycle-122.md`
- ?? `docs/real-repo-trials.md`
- ?? `docs/superpowers/plans/2026-06-19-approved-research-improvement-batch.md`
- ?? `docs/superpowers/plans/2026-06-19-real-repo-trial-guidance-guard.md`
- ?? `src/core/artifact-paths.ts`
- AgentLoop evidence: `21` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Change Areas
### Source
- M `src/core/artifacts.ts`
- M `src/core/task-state.ts`
- ?? `src/core/artifact-paths.ts`

### Tests
- M `tests/public-docs-hygiene.test.ts`
- M `tests/task-state.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/harness/autonomous-dogfooding.md`
- ?? `.agentloop/research/interview-cycle-122.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/contributor-playbook.md`
- M `docs/getting-started.md`
- M `docs/npm-publishing.md`
- M `docs/status.md`
- ?? `docs/real-repo-trials.md`
- ?? `docs/superpowers/plans/2026-06-19-approved-research-improvement-batch.md`
- ?? `docs/superpowers/plans/2026-06-19-real-repo-trial-guidance-guard.md`

### CI / Automation
- M `scripts/smoke-packed-release.mjs`

### AgentLoop Evidence
- AgentLoop evidence: `21` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stats
```text
.agentloop/backlog.md                       |  16 ++++
 .agentloop/harness/autonomous-dogfooding.md |   2 +-
 CHANGELOG.md                                |   7 +-
 DECISIONS.md                                |  18 +++++
 README.md                                   |  15 ++++
 ROADMAP.md                                  |   1 +
 docs/contributor-playbook.md                |   2 +
 docs/getting-started.md                     |  15 ++++
 docs/npm-publishing.md                      |   2 +
 docs/status.md                              |   2 +-
 scripts/smoke-packed-release.mjs            |  39 ++++++++++
 src/core/artifacts.ts                       | 111 ++++++----------------------
 src/core/task-state.ts                      |   7 +-
 tests/public-docs-hygiene.test.ts           |  64 ++++++++++++++++
 tests/task-state.test.ts                    |   4 +
 15 files changed, 209 insertions(+), 96 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Review source changes for behavior and public API impact.
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
