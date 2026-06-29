# PR Summary

- Generated: 2026-06-28-15-13
- Task context: `Add autonomous loop scorecards`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/README.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/loop-contracts.md`
- M `src/cli/commands/loop.ts`
- M `src/core/evidence-map.ts`
- M `src/core/loop-contract.ts`
- M `src/core/upgrade-harness.ts`
- M `src/index.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- M `tests/evidence-map.test.ts`
- M `tests/loop-contract.test.ts`
- M `tests/upgrade-harness.test.ts`
- ?? `.agentloop/loops/2026-06-28-14-05-dogfood-autonomous-loop-scorecards/loop.json`
- ?? `.agentloop/loops/2026-06-28-14-22-dogfood-autonomous-loop-scorecards-guard-fix/loop.json`
- ?? `.agentloop/loops/2026-06-28-14-25-dogfood-autonomous-loop-scorecards-final/loop.json`
- ?? `docs/superpowers/plans/2026-06-28-loop-scorecard.md`
- ?? `docs/superpowers/specs/2026-06-28-loop-scorecard-design.md`
- AgentLoop evidence: `12` file(s) grouped under `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Change Areas
### Source
- M `src/cli/commands/loop.ts`
- M `src/core/evidence-map.ts`
- M `src/core/loop-contract.ts`
- M `src/core/upgrade-harness.ts`
- M `src/index.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`

### Tests
- M `tests/evidence-map.test.ts`
- M `tests/loop-contract.test.ts`
- M `tests/upgrade-harness.test.ts`

### AgentLoop
- M `.agentloop/README.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- ?? `.agentloop/loops/2026-06-28-14-05-dogfood-autonomous-loop-scorecards/loop.json`
- ?? `.agentloop/loops/2026-06-28-14-22-dogfood-autonomous-loop-scorecards-guard-fix/loop.json`
- ?? `.agentloop/loops/2026-06-28-14-25-dogfood-autonomous-loop-scorecards-final/loop.json`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/loop-contracts.md`
- ?? `docs/superpowers/plans/2026-06-28-loop-scorecard.md`
- ?? `docs/superpowers/specs/2026-06-28-loop-scorecard-design.md`

### AgentLoop Evidence
- AgentLoop evidence: `12` file(s) grouped under `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stats
```text
.agentloop/README.md                             |   2 +-
 .agentloop/harness/commands.md                   |   2 +-
 AGENTLOOP.md                                     |   2 +-
 AGENTS.md                                        |   2 +-
 CHANGELOG.md                                     |   6 +-
 DECISIONS.md                                     |  10 +
 README.md                                        |  10 +-
 docs/cli-reference.md                            |   6 +-
 docs/loop-contracts.md                           |   7 +-
 src/cli/commands/loop.ts                         |  23 ++
 src/core/evidence-map.ts                         |   4 +-
 src/core/loop-contract.ts                        | 385 ++++++++++++++++++++++-
 src/core/upgrade-harness.ts                      |   4 +-
 src/index.ts                                     |   5 +
 src/templates/harness/commands.md                |   2 +-
 src/templates/root/AGENTLOOP.md                  |   2 +-
 src/templates/root/AGENTS.md                     |   2 +-
 src/templates/root/agentloop-directory-readme.md |   3 +-
 tests/evidence-map.test.ts                       |  40 +++
 tests/loop-contract.test.ts                      | 211 ++++++++++++-
 tests/upgrade-harness.test.ts                    |   5 +
 21 files changed, 701 insertions(+), 32 deletions(-)
.agentloop/loops/2026-06-28-14-05-dogfood-autonomous-loop-scorecards/loop.json | untracked
.agentloop/loops/2026-06-28-14-22-dogfood-autonomous-loop-scorecards-guard-fix/loop.json | untracked
.agentloop/loops/2026-06-28-14-25-dogfood-autonomous-loop-scorecards-final/loop.json | untracked
docs/superpowers/plans/2026-06-28-loop-scorecard.md | untracked
docs/superpowers/specs/2026-06-28-loop-scorecard-design.md | untracked
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

## Verification Report Not Run
- No skipped commands were recorded.

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
