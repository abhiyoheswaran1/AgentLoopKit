# AgentLoopKit Ship Report

Make agent-assisted work reviewable, verifiable, and merge-ready.

- Generated: `2026-06-24-19-18`
- Review readiness score: `92`/100
- Task: `Optimize AgentLoop Start run ledger listing` (`in-progress`) - `.agentloop/tasks/2026-06-24-optimize-agentloop-start-run-ledger-listing.md`
- Verification: `pass` - `.agentloop/reports/2026-06-24-19-15-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-24-19-18-pr-summary-2.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `52 non-evidence changed files is broad for one review; 35 AgentLoop evidence file(s) also present (87 total). Non-evidence review areas: Source 22, AgentLoop 12, Documentation 12, Tests 6.`
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

- Large non-evidence change set; consider splitting before review.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Evidence Map

- Evidence map: `87` changed file(s); `52` covered, `0` unexplained; verification `fresh`; `0` risk-sensitive.

## Inherited Dirty Work

- Task started with `48` dirty non-evidence file(s); current non-evidence changed files: `52` (net `+4`).

## Task Risk Notes

- Starts from a broad dirty unreleased batch; keep this task scoped to run-ledger performance and preserve existing evidence.
- Pre-existing dirty non-evidence files before task creation: 48 total; examples: `.agentloop/README.md`, `.agentloop/agents/claude-code.md`, `.agentloop/agents/codex.md`, `.agentloop/agents/cursor.md`, `.agentloop/agents/gemini-cli.md`. Confirm they belong to this task before implementation.

## Changed Files

- M `.agentloop/README.md`
- M `.agentloop/agents/claude-code.md`
- M `.agentloop/agents/codex.md`
- M `.agentloop/agents/cursor.md`
- M `.agentloop/agents/gemini-cli.md`
- M `.agentloop/agents/generic.md`
- M `.agentloop/agents/github-copilot-cli.md`
- M `.agentloop/agents/opencode.md`
- M `.agentloop/harness/commands.md`
- M `.agentloop/loops/research.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `README.md`
- M `docs/assets/readme/agentloopkit-context-contract.gif`
- M `docs/assets/readme/agentloopkit-context-contract.tape`
- M `docs/cli-reference.md`
- M `docs/context.md`
- M `docs/getting-started.md`
- M `docs/mcp.md`
- M `docs/research.md`
- M `docs/template-migrations.md`
- M `src/cli/commands/doctor.ts`
- M `src/core/agent-start.ts`
- M `src/core/context-contract.ts`
- M `src/core/doctor.ts`
- M `src/core/evidence-map.ts`
- M `src/core/runs.ts`
- M `src/core/upgrade-harness.ts`
- M `src/templates/agents/claude-code.md`
- M `src/templates/agents/codex.md`
- M `src/templates/agents/cursor.md`
- M `src/templates/agents/gemini-cli.md`
- M `src/templates/agents/generic.md`
- M `src/templates/agents/github-copilot-cli.md`
- M `src/templates/agents/opencode.md`
- M `src/templates/harness/commands.md`
- M `src/templates/loops/research.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- M `tests/agent-start.test.ts`
- M `tests/context-contract.test.ts`
- M `tests/doctor.test.ts`
- M `tests/init.test.ts`
- M `tests/runs.test.ts`
- M `tests/upgrade-harness.test.ts`
- ?? `docs/start-usefulness-demo.md`
- ?? `docs/superpowers/plans/2026-06-24-agent-readiness-matrix.md`
- ?? `docs/superpowers/plans/2026-06-24-agentloop-start-usefulness-proof.md`
- ?? `src/core/agent-readiness.ts`
- ?? `src/core/run-artifacts.ts`
- ?? `src/core/run-types.ts`
- AgentLoop evidence: `35` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
.agentloop/README.md                               |   5 +
 .agentloop/agents/claude-code.md                   |   2 +
 .agentloop/agents/codex.md                         |   2 +
 .agentloop/agents/cursor.md                        |   2 +
 .agentloop/agents/gemini-cli.md                    |   2 +
 .agentloop/agents/generic.md                       |   2 +
 .agentloop/agents/github-copilot-cli.md            |   2 +
 .agentloop/agents/opencode.md                      |   2 +
 .agentloop/harness/commands.md                     |   4 +-
 .agentloop/loops/research.md                       |  14 +-
 AGENTLOOP.md                                       |   2 +-
 AGENTS.md                                          |   4 +-
 README.md                                          |  22 +-
 .../readme/agentloopkit-context-contract.gif       | Bin 1364155 -> 1832001 bytes
 .../readme/agentloopkit-context-contract.tape      |   5 +
 docs/cli-reference.md                              |  14 +-
 docs/context.md                                    |  14 +-
 docs/getting-started.md                            |   2 +-
 docs/mcp.md                                        |  13 +-
 docs/research.md                                   |  26 +-
 docs/template-migrations.md                        |   2 +
 src/cli/commands/doctor.ts                         |  66 +++++
 src/core/agent-start.ts                            |  97 +++++++-
 src/core/context-contract.ts                       |   5 +-
 src/core/doctor.ts                                 |  51 +++-
 src/core/evidence-map.ts                           |  42 +++-
 src/core/runs.ts                                   | 231 ++++++++++++------
 src/core/upgrade-harness.ts                        |   4 +-
 src/templates/agents/claude-code.md                |   3 +-
 src/templates/agents/codex.md                      |   3 +-
 src/templates/agents/cursor.md                     |   3 +-
 src/templates/agents/gemini-cli.md                 |   3 +-
 src/templates/agents/generic.md                    |   3 +-
 src/templates/agents/github-copilot-cli.md         |   3 +-
 src/templates/agents/opencode.md                   |   3 +-
 src/templates/harness/commands.md                  |   4 +-
 src/templates/loops/research.md                    |  14 +-
 src/templates/root/AGENTLOOP.md                    |   2 +-
 src/templates/root/AGENTS.md                       |   4 +-
 src/templates/root/agentloop-directory-readme.md   |   5 +-
 tests/agent-start.test.ts                          |  15 ++
 tests/context-contract.test.ts                     | 138 ++++++++++-
 tests/doctor.test.ts                               | 267 +++++++++++++++++++++
 tests/init.test.ts                                 |  27 +++
 tests/runs.test.ts                                 | 258 +++++++++++++++++++-
 tests/upgrade-harness.test.ts                      |  52 ++++
 46 files changed, 1322 insertions(+), 122 deletions(-)
docs/start-usefulness-demo.md | untracked
docs/superpowers/plans/2026-06-24-agent-readiness-matrix.md | untracked
docs/superpowers/plans/2026-06-24-agentloop-start-usefulness-proof.md | untracked
src/core/agent-readiness.ts | untracked
src/core/run-artifacts.ts | untracked
src/core/run-types.ts | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Optimize AgentLoop Start run ledger listing`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `95 changed file(s) detected (52 non-evidence, 43 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
