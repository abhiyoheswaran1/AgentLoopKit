# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-14-00-18`
- Review readiness score: `92`/100
- Task: `Improve adoption polish and release workflow` (`proposed`) - `.agentloop/tasks/2026-06-13-improve-adoption-polish-and-release-workflow.md`
- Verification: `pass` - `.agentloop/reports/2026-06-14-00-13-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-14-00-18-pr-summary-2.md`
- Gates: `warn`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `25 changed files is reviewable but not small.`
- `Verification evidence`: `100`/100 (weight `25`) - `Latest verification report passed.`
- `Evidence freshness`: `100`/100 (weight `15`) - `Verification evidence matches current task timing.`
- `Policy and gate compliance`: `70`/100 (weight `15`) - `Review gates passed with warnings.`
- `Handoff readiness`: `100`/100 (weight `10`) - `Reviewer handoff evidence exists.`
- `Risk flags`: `100`/100 (weight `5`) - `No risk-sensitive files detected.`

## Strengths

- Task contract has problem, outcome, acceptance criteria, verification commands, risk notes, and rollback notes.
- Verification evidence is passing.
- Reviewer handoff exists.

## Warnings

- Medium-sized change set; check scope carefully.
- Review gates have warnings.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `CHANGELOG.md`
- M `README.md`
- M `docs/claude-code.md`
- M `docs/cli-reference.md`
- M `docs/codex.md`
- M `docs/cursor.md`
- M `docs/gemini-cli.md`
- M `docs/getting-started.md`
- M `docs/mcp.md`
- M `docs/opencode.md`
- M `docs/template-migrations.md`
- M `examples/dependency-upgrade/README.md`
- M `package.json`
- M `src/cli/commands/upgrade-harness.ts`
- M `src/core/doctor.ts`
- M `src/core/upgrade-harness.ts`
- M `tests/doctor.test.ts`
- M `tests/examples.test.ts`
- M `tests/upgrade-harness.test.ts`
- ?? `.agentloop/reports/2026-06-13-23-42-verification-report.md`
- ?? `.agentloop/reports/2026-06-14-00-13-verification-report.md`
- ?? `.agentloop/tasks/2026-06-13-improve-adoption-polish-and-release-workflow.md`
- ?? `docs/upgrading-existing-repos.md`
- ?? `examples/bugfix-pr/README.md`
- ?? `tests/package-scripts.test.ts`

## Diff Stat

```text
CHANGELOG.md                          |  7 ++-
 README.md                             | 10 +++-
 docs/claude-code.md                   |  6 +++
 docs/cli-reference.md                 | 13 +++++
 docs/codex.md                         |  6 +++
 docs/cursor.md                        |  6 +++
 docs/gemini-cli.md                    |  6 +++
 docs/getting-started.md               |  4 +-
 docs/mcp.md                           | 92 +++++++++++++++++++++++++++++++++--
 docs/opencode.md                      |  6 +++
 docs/template-migrations.md           |  3 +-
 examples/dependency-upgrade/README.md | 33 +++++++++++++
 package.json                          |  6 ++-
 src/cli/commands/upgrade-harness.ts   | 58 +++++++++++++++++-----
 src/core/doctor.ts                    | 22 +++++++++
 src/core/upgrade-harness.ts           | 61 +++++++++++++++++++++++
 tests/doctor.test.ts                  | 34 +++++++++++++
 tests/examples.test.ts                | 38 +++++++++++++++
 tests/upgrade-harness.test.ts         | 46 ++++++++++++++++--
 19 files changed, 431 insertions(+), 26 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Improve adoption polish and release workflow`
- [`pass`] `Verification report`: `Overall status: pass`
- [`warn`] `Handoff summary`: `Latest handoff does not cover the current dirty files.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `27 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
