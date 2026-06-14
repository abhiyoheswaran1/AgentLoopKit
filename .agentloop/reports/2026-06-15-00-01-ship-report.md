# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-15-00-01`
- Review readiness score: `92`/100
- Task: `Harden OSS roadmap release proof and public docs` (`in-progress`) - `.agentloop/tasks/2026-06-14-harden-oss-roadmap-release-proof-and-public-docs.md`
- Verification: `pass` - `.agentloop/reports/2026-06-14-23-58-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-15-00-01-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `49 changed files is broad for one review.`
- `Verification evidence`: `100`/100 (weight `25`) - `Latest verification report passed.`
- `Evidence freshness`: `100`/100 (weight `15`) - `Verification evidence matches current task timing.`
- `Policy and gate compliance`: `100`/100 (weight `15`) - `Review gates passed.`
- `Handoff readiness`: `100`/100 (weight `10`) - `Reviewer handoff evidence exists.`
- `Risk flags`: `100`/100 (weight `5`) - `No risk-sensitive files detected.`

## Strengths

- Task contract has problem, outcome, acceptance criteria, verification commands, risk notes, and rollback notes.
- Verification evidence is passing.
- Review gates pass.
- Reviewer handoff exists.

## Warnings

- Large change set; consider splitting before review.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/README.md`
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/distribution-channels.md`
- M `docs/launch-checklist.md`
- M `docs/npm-publishing.md`
- M `docs/release-checklist-example.md`
- M `package.json`
- M `scripts/smoke-packed-release.mjs`
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- M `tests/cli-docs-drift.test.ts`
- M `tests/package-scripts.test.ts`
- M `tests/release-smoke.test.ts`
- ?? `.agentloop/handoffs/2026-06-14-23-55-pr-summary.md`
- ?? `.agentloop/reports/2026-06-14-23-52-verification-report.md`
- ?? `.agentloop/reports/2026-06-14-23-55-ship-report.md`
- ?? `.agentloop/reports/2026-06-14-23-58-verification-report.md`
- ?? `.agentloop/research/interview-cycle-111.md`
- ?? `.agentloop/runs/2026-06-14-23-55-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-23-55-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-23-55-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-14-23-55-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-14-23-55-ship/score.json`
- ?? `.agentloop/runs/2026-06-14-23-55-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-14-23-55-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-23-55-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-14-23-55-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-00-01-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-00-01-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-00-01-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-14-harden-oss-roadmap-release-proof-and-public-docs.md`
- ?? `docs/release-proof.md`
- ?? `docs/superpowers/plans/2026-06-14-oss-roadmap-hardening.md`
- ?? `src/cli/commands/release-proof.ts`
- ?? `src/core/release-proof.ts`
- ?? `tests/public-docs-hygiene.test.ts`
- ?? `tests/release-proof.test.ts`

## Diff Stat

```text
.agentloop/README.md                             |  1 +
 .agentloop/backlog.md                            |  3 +++
 .agentloop/dogfood-log.md                        | 24 ++++++++++++++++++++++++
 .agentloop/harness/commands.md                   |  3 +++
 AGENTLOOP.md                                     |  2 +-
 AGENTS.md                                        |  1 +
 CHANGELOG.md                                     |  3 +++
 DECISIONS.md                                     |  8 ++++++++
 README.md                                        |  5 ++++-
 docs/cli-reference.md                            | 13 ++++++++++++-
 docs/distribution-channels.md                    |  3 +++
 docs/launch-checklist.md                         |  1 +
 docs/npm-publishing.md                           |  2 ++
 docs/release-checklist-example.md                |  3 +++
 package.json                                     |  2 +-
 scripts/smoke-packed-release.mjs                 | 20 ++++++++++++++++++--
 src/cli/index.ts                                 |  2 ++
 src/core/completions.ts                          |  1 +
 src/templates/harness/commands.md                |  3 +++
 src/templates/root/AGENTLOOP.md                  |  2 +-
 src/templates/root/AGENTS.md                     |  1 +
 src/templates/root/agentloop-directory-readme.md | 12 +++++++++++-
 tests/cli-docs-drift.test.ts                     |  1 +
 tests/package-scripts.test.ts                    |  2 ++
 tests/release-smoke.test.ts                      |  2 +-
 25 files changed, 111 insertions(+), 9 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Harden OSS roadmap release proof and public docs`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `50 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
