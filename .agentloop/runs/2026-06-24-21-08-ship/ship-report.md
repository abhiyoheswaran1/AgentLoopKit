# AgentLoopKit Ship Report

Make agent-assisted work reviewable, verifiable, and merge-ready.

- Generated: `2026-06-24-21-08`
- Review readiness score: `92`/100
- Task: `Avoid full run hydration in file intent lookup` (`in-progress`) - `.agentloop/tasks/2026-06-24-avoid-full-run-hydration-in-file-intent-lookup-2.md`
- Verification: `pass` - `.agentloop/reports/2026-06-24-21-05-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-24-21-08-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `62 non-evidence changed files is broad for one review; 157 AgentLoop evidence file(s) also present (219 total). Non-evidence review areas: Source 27, Documentation 14, AgentLoop 12, Tests 9.`
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

- Evidence map: `219` changed file(s); `62` covered, `0` unexplained; verification `fresh`; `0` risk-sensitive.

## Inherited Dirty Work

- Task started with `59` dirty non-evidence file(s); current non-evidence changed files: `62` (net `+3`).

## Task Risk Notes

- Changing lookup bounds may hide older evidence if the limit is too low; surface the bound so users can expand later if needed.
- Pre-existing dirty non-evidence files before task creation: 59 total; examples: `.agentloop/README.md`, `.agentloop/agents/claude-code.md`, `.agentloop/agents/codex.md`, `.agentloop/agents/cursor.md`, `.agentloop/agents/gemini-cli.md`. Confirm they belong to this task before implementation.

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
- M `docs/release-status.md`
- M `docs/research.md`
- M `docs/template-migrations.md`
- M `docs/upgrading-existing-repos.md`
- M `src/cli/commands/context.ts`
- M `src/cli/commands/doctor.ts`
- M `src/cli/commands/runs.ts`
- M `src/core/agent-start.ts`
- M `src/core/context-contract.ts`
- M `src/core/doctor.ts`
- M `src/core/evidence-map.ts`
- M `src/core/mcp-tools.ts`
- M `src/core/review-context.ts`
- M `src/core/runs.ts`
- M `src/core/upgrade-harness.ts`
- M `src/mcp/server.ts`
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
- M `tests/mcp-server.test.ts`
- M `tests/mcp-tools.test.ts`
- M `tests/review-context.test.ts`
- M `tests/runs.test.ts`
- M `tests/upgrade-harness.test.ts`
- ?? `docs/start-usefulness-demo.md`
- ?? `docs/superpowers/plans/2026-06-24-agent-readiness-matrix.md`
- ?? `docs/superpowers/plans/2026-06-24-agentloop-start-usefulness-proof.md`
- ?? `src/core/agent-readiness.ts`
- ?? `src/core/run-artifacts.ts`
- ?? `src/core/run-types.ts`
- AgentLoop evidence: `157` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
.agentloop/README.md                               |   6 +
 .agentloop/agents/claude-code.md                   |   2 +
 .agentloop/agents/codex.md                         |   2 +
 .agentloop/agents/cursor.md                        |   2 +
 .agentloop/agents/gemini-cli.md                    |   2 +
 .agentloop/agents/generic.md                       |   2 +
 .agentloop/agents/github-copilot-cli.md            |   2 +
 .agentloop/agents/opencode.md                      |   2 +
 .agentloop/harness/commands.md                     |   7 +-
 .agentloop/loops/research.md                       |  14 +-
 AGENTLOOP.md                                       |   2 +-
 AGENTS.md                                          |   6 +-
 README.md                                          |  33 +-
 .../readme/agentloopkit-context-contract.gif       | Bin 1364155 -> 1832001 bytes
 .../readme/agentloopkit-context-contract.tape      |   5 +
 docs/cli-reference.md                              |  29 +-
 docs/context.md                                    |  31 +-
 docs/getting-started.md                            |   5 +-
 docs/mcp.md                                        |  22 +-
 docs/release-status.md                             |   4 +-
 docs/research.md                                   |  27 +-
 docs/template-migrations.md                        |   7 +-
 docs/upgrading-existing-repos.md                   |   7 +-
 src/cli/commands/context.ts                        |  35 +-
 src/cli/commands/doctor.ts                         |  66 +++
 src/cli/commands/runs.ts                           | 114 ++++-
 src/core/agent-start.ts                            | 107 ++++-
 src/core/context-contract.ts                       | 226 ++++++++--
 src/core/doctor.ts                                 |  51 ++-
 src/core/evidence-map.ts                           |  98 ++++-
 src/core/mcp-tools.ts                              | 181 ++++++--
 src/core/review-context.ts                         |   6 +-
 src/core/runs.ts                                   | 364 ++++++++++++----
 src/core/upgrade-harness.ts                        |  10 +-
 src/mcp/server.ts                                  |   2 +-
 src/templates/agents/claude-code.md                |   3 +-
 src/templates/agents/codex.md                      |   3 +-
 src/templates/agents/cursor.md                     |   3 +-
 src/templates/agents/gemini-cli.md                 |   3 +-
 src/templates/agents/generic.md                    |   3 +-
 src/templates/agents/github-copilot-cli.md         |   3 +-
 src/templates/agents/opencode.md                   |   3 +-
 src/templates/harness/commands.md                  |   7 +-
 src/templates/loops/research.md                    |  14 +-
 src/templates/root/AGENTLOOP.md                    |   2 +-
 src/templates/root/AGENTS.md                       |   6 +-
 src/templates/root/agentloop-directory-readme.md   |   8 +-
 tests/agent-start.test.ts                          |  15 +
 tests/context-contract.test.ts                     | 374 +++++++++++++++-
 tests/doctor.test.ts                               | 267 ++++++++++++
 tests/init.test.ts                                 |  27 ++
 tests/mcp-server.test.ts                           |  83 +++-
 tests/mcp-tools.test.ts                            | 215 ++++++++-
 tests/review-context.test.ts                       |  19 +-
 tests/runs.test.ts                                 | 483 ++++++++++++++++++++-
 tests/upgrade-harness.test.ts                      |  77 +++-
 56 files changed, 2840 insertions(+), 257 deletions(-)
docs/start-usefulness-demo.md | untracked
docs/superpowers/plans/2026-06-24-agent-readiness-matrix.md | untracked
docs/superpowers/plans/2026-06-24-agentloop-start-usefulness-proof.md | untracked
src/core/agent-readiness.ts | untracked
src/core/run-artifacts.ts | untracked
src/core/run-types.ts | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Avoid full run hydration in file intent lookup`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `220 changed file(s) detected (62 non-evidence, 158 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
