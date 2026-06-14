# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-14-09-44`
- Review readiness score: `88`/100
- Task: `Implement roadmap adoption channels and policy packs` (`proposed`) - `.agentloop/tasks/2026-06-14-implement-roadmap-adoption-channels-and-policy-packs.md`
- Verification: `pass` - `.agentloop/reports/2026-06-14-09-33-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-14-09-44-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `30`/100 (weight `15`) - `53 changed files is broad for one review.`
- `Verification evidence`: `100`/100 (weight `25`) - `Latest verification report passed.`
- `Evidence freshness`: `100`/100 (weight `15`) - `Verification evidence matches current task timing.`
- `Policy and gate compliance`: `100`/100 (weight `15`) - `Review gates passed.`
- `Handoff readiness`: `100`/100 (weight `10`) - `Reviewer handoff evidence exists.`
- `Risk flags`: `70`/100 (weight `5`) - `Risk-sensitive files changed and risk notes are present.`

## Strengths

- Task contract has problem, outcome, acceptance criteria, verification commands, risk notes, and rollback notes.
- Verification evidence is passing.
- Review gates pass.
- Reviewer handoff exists.

## Warnings

- Large change set; consider splitting before review.
- Risk-sensitive files changed: src/templates/policy-packs/agentloop-baseline/policies/security-policy.md

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review risk-sensitive files before merge.

## Changed Files

- M `CHANGELOG.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/configuration.md`
- M `docs/designs/vscode-open-vsx-extension.md`
- M `docs/distribution-channels.md`
- M `docs/policies.md`
- M `package.json`
- M `schema/agentloop.config.schema.json`
- M `src/cli/commands/policy.ts`
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `src/core/config.ts`
- M `src/templates/root/agentloop.config.json`
- M `tests/cli-docs-drift.test.ts`
- M `tests/completion.test.ts`
- M `tests/config.test.ts`
- M `tests/package-scripts.test.ts`
- M `tests/schema.test.ts`
- ?? `.agentloop/handoffs/2026-06-14-09-42-pr-summary.md`
- ?? `.agentloop/reports/2026-06-14-09-33-verification-report.md`
- ?? `.agentloop/runs/2026-06-14-09-42-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-09-42-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-09-42-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-14-09-42-handoff/pr-summary.md`
- ?? `.agentloop/tasks/2026-06-14-implement-roadmap-adoption-channels-and-policy-packs.md`
- ?? `docs/designs/windows-package-managers.md`
- ?? `docs/github-metadata.md`
- ?? `docs/schemastore.md`
- ?? `schema/schemastore/agentloopkit.json`
- ?? `src/cli/commands/github.ts`
- ?? `src/cli/commands/schemastore.ts`
- ?? `src/core/github-metadata.ts`
- ?? `src/core/policy-packs.ts`
- ?? `src/core/schema-url.ts`
- ?? `src/core/schemastore.ts`
- ?? `src/templates/policy-packs/agentloop-baseline/manifest.json`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/database-change-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/dependency-change-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/git-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/no-destructive-actions.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/public-api-change-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/secrets-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/security-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/ui-change-policy.md`
- ?? `src/templates/policy-packs/maintainer-review/manifest.json`
- ?? `src/templates/policy-packs/maintainer-review/policies/maintainer-evidence-policy.md`
- ?? `src/templates/policy-packs/maintainer-review/policies/review-risk-policy.md`
- ?? `tests/github-metadata.test.ts`
- ?? `tests/policy-packs.test.ts`
- ?? `tests/roadmap-channels.test.ts`
- ?? `tests/schemastore.test.ts`

## Diff Stat

```text
CHANGELOG.md                              |   7 +-
 README.md                                 |   6 ++
 ROADMAP.md                                |  12 ++-
 docs/cli-reference.md                     |  38 +++++++-
 docs/configuration.md                     |  22 ++++-
 docs/designs/vscode-open-vsx-extension.md |  15 +++-
 docs/distribution-channels.md             |   8 +-
 docs/policies.md                          |  77 ++++++++++++++--
 package.json                              |   2 +-
 schema/agentloop.config.schema.json       |  31 +++++++
 src/cli/commands/policy.ts                | 142 ++++++++++++++++++++++++++++++
 src/cli/index.ts                          |   4 +
 src/core/completions.ts                   |   4 +
 src/core/config.ts                        |  27 +++++-
 src/templates/root/agentloop.config.json  |   3 +
 tests/cli-docs-drift.test.ts              |   2 +
 tests/completion.test.ts                  |   7 +-
 tests/config.test.ts                      |  29 ++++++
 tests/package-scripts.test.ts             |   3 +
 tests/schema.test.ts                      |   2 +
 20 files changed, 418 insertions(+), 23 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Implement roadmap adoption channels and policy packs`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `54 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
