# PR Summary

- Generated: 2026-06-21-21-37
- Task context: `Build explainable agent work evidence map`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `DECISIONS.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `src/cli/index.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/review-context.ts`
- M `src/core/ship.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/review-context.test.ts`
- M `tests/ship.test.ts`
- ?? `docs/evidence-map.md`
- ?? `docs/superpowers/plans/2026-06-21-evidence-map.md`
- ?? `docs/superpowers/specs/2026-06-21-evidence-map-design.md`
- ?? `src/cli/commands/explain-diff.ts`
- ?? `src/cli/commands/resume-pack.ts`
- ?? `src/core/evidence-map.ts`
- ?? `src/core/resume-pack.ts`
- ?? `tests/cli-explain-diff.test.ts`
- ?? `tests/evidence-map.test.ts`
- ?? `tests/resume-pack.test.ts`
- AgentLoop evidence: `6` file(s) grouped under `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`.
- Full paths remain in JSON output and run-ledger evidence.

## Change Areas
### Source
- M `src/cli/index.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/review-context.ts`
- M `src/core/ship.ts`
- ?? `src/cli/commands/explain-diff.ts`
- ?? `src/cli/commands/resume-pack.ts`
- ?? `src/core/evidence-map.ts`
- ?? `src/core/resume-pack.ts`

### Tests
- M `tests/prepare-pr.test.ts`
- M `tests/review-context.test.ts`
- M `tests/ship.test.ts`
- ?? `tests/cli-explain-diff.test.ts`
- ?? `tests/evidence-map.test.ts`
- ?? `tests/resume-pack.test.ts`

### Documentation
- M `DECISIONS.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- ?? `docs/evidence-map.md`
- ?? `docs/superpowers/plans/2026-06-21-evidence-map.md`
- ?? `docs/superpowers/specs/2026-06-21-evidence-map-design.md`

### AgentLoop Evidence
- AgentLoop evidence: `6` file(s) grouped under `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stats
```text
DECISIONS.md                 |  8 ++++++
 README.md                    | 11 ++++++--
 ROADMAP.md                   |  2 ++
 docs/cli-reference.md        | 30 ++++++++++++++++++--
 src/cli/index.ts             |  4 +++
 src/core/prepare-pr.ts       | 24 +++++++++++++++-
 src/core/review-context.ts   | 14 ++++++++-
 src/core/ship.ts             | 32 +++++++++++++++++++--
 tests/prepare-pr.test.ts     | 11 ++++++++
 tests/review-context.test.ts | 39 ++++++++++++++++++++++++++
 tests/ship.test.ts           | 67 +++++++++++++++++++++++++++++++++++++++++++-
 11 files changed, 233 insertions(+), 9 deletions(-)
docs/evidence-map.md | untracked
docs/superpowers/plans/2026-06-21-evidence-map.md | untracked
docs/superpowers/specs/2026-06-21-evidence-map-design.md | untracked
src/cli/commands/explain-diff.ts | untracked
src/cli/commands/resume-pack.ts | untracked
src/core/evidence-map.ts | untracked
src/core/resume-pack.ts | untracked
tests/cli-explain-diff.test.ts | untracked
tests/evidence-map.test.ts | untracked
tests/resume-pack.test.ts | untracked
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
