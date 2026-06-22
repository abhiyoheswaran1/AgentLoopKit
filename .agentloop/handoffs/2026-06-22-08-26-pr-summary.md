# PR Summary

- Generated: 2026-06-22-08-26
- Task context: `Stabilize unreleased batch and run real repo trials`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `DECISIONS.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/assets/readme/README.md`
- M `docs/assets/readme/agentloopkit-cli.gif`
- M `docs/assets/readme/agentloopkit-cli.tape`
- M `docs/cli-reference.md`
- M `src/cli/index.ts`
- M `src/core/agentloop-evidence.ts`
- M `src/core/artifact-paths.ts`
- M `src/core/completions.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/project-detection.ts`
- M `src/core/review-context.ts`
- M `src/core/ship.ts`
- M `tests/cli-docs-drift.test.ts`
- M `tests/doctor.test.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/project-detection.test.ts`
- M `tests/review-context.test.ts`
- M `tests/ship.test.ts`
- ?? `.agentloop/research/real-repo-usefulness-trials-2026-06-22.md`
- ?? `docs/assets/readme/agentloopkit-context-budget.png`
- ?? `docs/assets/readme/context-budget.html`
- ?? `docs/evidence-map.md`
- ?? `docs/guard.md`
- ?? `docs/superpowers/plans/2026-06-21-agentloop-guard.md`
- ?? `docs/superpowers/plans/2026-06-21-evidence-map.md`
- ?? `docs/superpowers/specs/2026-06-21-agentloop-guard-design.md`
- ?? `docs/superpowers/specs/2026-06-21-evidence-map-design.md`
- ?? `src/cli/commands/explain-diff.ts`
- ?? `src/cli/commands/guard.ts`
- ?? `src/cli/commands/resume-pack.ts`
- ?? `src/core/context-budget.ts`
- ?? `src/core/evidence-map.ts`
- ?? `src/core/guard.ts`
- ?? `src/core/resume-pack.ts`
- ?? `tests/cli-explain-diff.test.ts`
- ?? `tests/evidence-map.test.ts`
- ?? `tests/guard.test.ts`
- ?? `tests/resume-pack.test.ts`
- AgentLoop evidence: `52` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Change Areas
### Source
- M `src/cli/index.ts`
- M `src/core/agentloop-evidence.ts`
- M `src/core/artifact-paths.ts`
- M `src/core/completions.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/project-detection.ts`
- M `src/core/review-context.ts`
- M `src/core/ship.ts`
- ?? `src/cli/commands/explain-diff.ts`
- ?? `src/cli/commands/guard.ts`
- ?? `src/cli/commands/resume-pack.ts`
- ?? `src/core/context-budget.ts`
- ?? `src/core/evidence-map.ts`
- ?? `src/core/guard.ts`
- ?? `src/core/resume-pack.ts`

### Tests
- M `tests/cli-docs-drift.test.ts`
- M `tests/doctor.test.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/project-detection.test.ts`
- M `tests/review-context.test.ts`
- M `tests/ship.test.ts`
- ?? `tests/cli-explain-diff.test.ts`
- ?? `tests/evidence-map.test.ts`
- ?? `tests/guard.test.ts`
- ?? `tests/resume-pack.test.ts`

### AgentLoop
- ?? `.agentloop/research/real-repo-usefulness-trials-2026-06-22.md`

### Documentation
- M `DECISIONS.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/assets/readme/README.md`
- M `docs/assets/readme/agentloopkit-cli.gif`
- M `docs/assets/readme/agentloopkit-cli.tape`
- M `docs/cli-reference.md`
- ?? `docs/assets/readme/agentloopkit-context-budget.png`
- ?? `docs/assets/readme/context-budget.html`
- ?? `docs/evidence-map.md`
- ?? `docs/guard.md`
- ?? `docs/superpowers/plans/2026-06-21-agentloop-guard.md`
- ?? `docs/superpowers/plans/2026-06-21-evidence-map.md`
- ?? `docs/superpowers/specs/2026-06-21-agentloop-guard-design.md`
- ?? `docs/superpowers/specs/2026-06-21-evidence-map-design.md`

### AgentLoop Evidence
- AgentLoop evidence: `52` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stats
```text
DECISIONS.md                             |  16 +++++++
 README.md                                |  20 +++++++-
 ROADMAP.md                               |   3 ++
 docs/assets/readme/README.md             |   1 +
 docs/assets/readme/agentloopkit-cli.gif  | Bin 1471375 -> 2441225 bytes
 docs/assets/readme/agentloopkit-cli.tape |  20 +++++++-
 docs/cli-reference.md                    |  56 ++++++++++++++++++++--
 src/cli/index.ts                         |   6 +++
 src/core/agentloop-evidence.ts           |   7 ++-
 src/core/artifact-paths.ts               |   2 +
 src/core/completions.ts                  |   1 +
 src/core/prepare-pr.ts                   |  24 +++++++++-
 src/core/project-detection.ts            |  79 ++++++++++++++++++++++++++++++-
 src/core/review-context.ts               |  28 ++++++++++-
 src/core/ship.ts                         |  32 ++++++++++++-
 tests/cli-docs-drift.test.ts             |   1 +
 tests/doctor.test.ts                     |  28 +++++++++++
 tests/prepare-pr.test.ts                 |  11 +++++
 tests/project-detection.test.ts          |  36 ++++++++++++++
 tests/review-context.test.ts             |  57 ++++++++++++++++++++++
 tests/ship.test.ts                       |  67 +++++++++++++++++++++++++-
 21 files changed, 482 insertions(+), 13 deletions(-)
.agentloop/research/real-repo-usefulness-trials-2026-06-22.md | untracked
docs/assets/readme/agentloopkit-context-budget.png | untracked
docs/assets/readme/context-budget.html | untracked
docs/evidence-map.md | untracked
docs/guard.md | untracked
docs/superpowers/plans/2026-06-21-agentloop-guard.md | untracked
docs/superpowers/plans/2026-06-21-evidence-map.md | untracked
docs/superpowers/specs/2026-06-21-agentloop-guard-design.md | untracked
docs/superpowers/specs/2026-06-21-evidence-map-design.md | untracked
src/cli/commands/explain-diff.ts | untracked
src/cli/commands/guard.ts | untracked
src/cli/commands/resume-pack.ts | untracked
src/core/context-budget.ts | untracked
src/core/evidence-map.ts | untracked
src/core/guard.ts | untracked
src/core/resume-pack.ts | untracked
tests/cli-explain-diff.test.ts | untracked
tests/evidence-map.test.ts | untracked
tests/guard.test.ts | untracked
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
- test: `npx pnpm@10.12.1 test`
- lint: `npx pnpm@10.12.1 lint`
- typecheck: `npx pnpm@10.12.1 typecheck`
- build: `npx pnpm@10.12.1 build`

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
