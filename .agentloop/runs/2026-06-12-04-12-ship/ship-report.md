# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-04-12`
- Review readiness score: `92`/100
- Task: `Add active task done shortcut` (`review`) - `.agentloop/tasks/2026-06-12-add-active-task-done-shortcut.md`
- Verification: `pass` - `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-04-04-verification-report.md`
- Handoff: `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/handoffs/2026-06-12-04-12-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `34 changed files is broad for one review.`
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

- M `.agentloop/backlog.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`
- M `docs/status.md`
- M `docs/task-contracts.md`
- M `scripts/smoke-cli.mjs`
- M `src/cli/commands/task.ts`
- M `src/core/completions.ts`
- M `src/core/status.ts`
- M `src/templates/agents/claude-code.md`
- M `src/templates/agents/codex.md`
- M `src/templates/agents/cursor.md`
- M `src/templates/agents/gemini-cli.md`
- M `src/templates/agents/generic.md`
- M `src/templates/agents/github-copilot-cli.md`
- M `src/templates/agents/opencode.md`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- M `src/templates/tasks/README.md`
- M `tests/completion.test.ts`
- M `tests/next.test.ts`
- M `tests/status.test.ts`
- M `tests/task-state.test.ts`
- ?? `.agentloop/reports/2026-06-12-04-04-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-04-11-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-active-task-done-shortcut.md`

## Diff Stat

```text
.agentloop/backlog.md                            |  3 +-
 .agentloop/harness/commands.md                   |  1 +
 AGENTLOOP.md                                     |  2 +-
 AGENTS.md                                        |  1 +
 CHANGELOG.md                                     |  1 +
 FINAL_HANDOFF.md                                 |  1 +
 README.md                                        |  1 +
 docs/cli-reference.md                            |  6 ++-
 docs/getting-started.md                          |  2 +
 docs/status.md                                   |  6 ++-
 docs/task-contracts.md                           |  2 +
 scripts/smoke-cli.mjs                            |  9 ++++
 src/cli/commands/task.ts                         | 49 ++++++++++++++++++++-
 src/core/completions.ts                          |  3 +-
 src/core/status.ts                               |  2 +-
 src/templates/agents/claude-code.md              |  1 +
 src/templates/agents/codex.md                    |  1 +
 src/templates/agents/cursor.md                   |  1 +
 src/templates/agents/gemini-cli.md               |  1 +
 src/templates/agents/generic.md                  |  1 +
 src/templates/agents/github-copilot-cli.md       |  1 +
 src/templates/agents/opencode.md                 |  1 +
 src/templates/harness/commands.md                |  1 +
 src/templates/root/AGENTLOOP.md                  |  2 +-
 src/templates/root/AGENTS.md                     |  1 +
 src/templates/root/agentloop-directory-readme.md |  3 +-
 src/templates/tasks/README.md                    |  2 +
 tests/completion.test.ts                         |  6 ++-
 tests/next.test.ts                               |  2 +-
 tests/status.test.ts                             |  4 +-
 tests/task-state.test.ts                         | 56 ++++++++++++++++++++++++
 31 files changed, 158 insertions(+), 15 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Add active task done shortcut`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `35 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
