# AgentLoopKit Ship Report

Make agent-assisted work reviewable, verifiable, and merge-ready.

- Generated: `2026-06-25-11-02`
- Review readiness score: `92`/100
- Task: `Release AgentLoopKit 0.43.0` (`in-progress`) - `.agentloop/tasks/2026-06-25-release-agentloopkit-0-43-0.md`
- Verification: `pass` - `.agentloop/reports/2026-06-25-10-36-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-25-11-02-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `83 non-evidence changed files is broad for one review; 328 AgentLoop evidence file(s) also present (411 total). Non-evidence review areas: Source 36, Documentation 19, Tests 14, AgentLoop 12, Config / Package 1, Other 1.`
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

- Evidence map: `411` changed file(s); `83` covered, `0` unexplained; verification `fresh`; `0` risk-sensitive.


## Task Risk Notes

- Release work publishes public artifacts; verify package contents and registry state before claims.
- GitHub Marketplace publication may still require owner-side approval; report exact proof status.

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
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/assets/readme/agentloopkit-context-contract.gif`
- M `docs/assets/readme/agentloopkit-context-contract.tape`
- M `docs/cli-reference.md`
- M `docs/context.md`
- M `docs/getting-started.md`
- M `docs/launch-checklist.md`
- M `docs/mcp.md`
- M `docs/npm-publishing.md`
- M `docs/release-status.md`
- M `docs/research.md`
- M `docs/template-migrations.md`
- M `docs/upgrading-existing-repos.md`
- M `package.json`
- M `server.json`
- M `src/cli/commands/context.ts`
- M `src/cli/commands/doctor.ts`
- M `src/cli/commands/guard.ts`
- M `src/cli/commands/runs.ts`
- M `src/cli/commands/start.ts`
- M `src/core/agent-start.ts`
- M `src/core/artifacts.ts`
- M `src/core/context-contract.ts`
- M `src/core/doctor.ts`
- M `src/core/evidence-map.ts`
- M `src/core/guard.ts`
- M `src/core/markdown-format.ts`
- M `src/core/mcp-tools.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/review-context.ts`
- M `src/core/runs.ts`
- M `src/core/safety.ts`
- M `src/core/upgrade-harness.ts`
- M `src/core/verification-report-sections.ts`
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
- M `tests/guard.test.ts`
- M `tests/init.test.ts`
- M `tests/markdown-format.test.ts`
- M `tests/mcp-server.test.ts`
- M `tests/mcp-tools.test.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/review-context.test.ts`
- M `tests/runs.test.ts`
- M `tests/safety.test.ts`
- M `tests/ship.test.ts`
- M `tests/upgrade-harness.test.ts`
- ?? `docs/start-usefulness-demo.md`
- ?? `docs/superpowers/plans/2026-06-24-agent-readiness-matrix.md`
- ?? `docs/superpowers/plans/2026-06-24-agentloop-start-usefulness-proof.md`
- ?? `src/core/agent-readiness.ts`
- ?? `src/core/run-artifacts.ts`
- ?? `src/core/run-types.ts`
- ?? `src/core/safe-markdown-file.ts`
- AgentLoop evidence: `328` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
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
 CHANGELOG.md                                       |  14 +
 FINAL_HANDOFF.md                                   |  44 +-
 README.md                                          |  39 +-
 ROADMAP.md                                         |  10 +-
 .../readme/agentloopkit-context-contract.gif       | Bin 1364155 -> 1832001 bytes
 .../readme/agentloopkit-context-contract.tape      |   5 +
 docs/cli-reference.md                              |  35 +-
 docs/context.md                                    |  33 +-
 docs/getting-started.md                            |   7 +-
 docs/launch-checklist.md                           |   2 +-
 docs/mcp.md                                        |  25 +-
 docs/npm-publishing.md                             |  10 +-
 docs/release-status.md                             |  68 +--
 docs/research.md                                   |  27 +-
 docs/template-migrations.md                        |   9 +-
 docs/upgrading-existing-repos.md                   |   7 +-
 package.json                                       |   2 +-
 server.json                                        |   4 +-
 src/cli/commands/context.ts                        |  35 +-
 src/cli/commands/doctor.ts                         |  66 +++
 src/cli/commands/guard.ts                          |  30 +-
 src/cli/commands/runs.ts                           | 115 +++-
 src/cli/commands/start.ts                          |   5 +-
 src/core/agent-start.ts                            | 107 +++-
 src/core/artifacts.ts                              |  50 +-
 src/core/context-contract.ts                       | 257 +++++++--
 src/core/doctor.ts                                 |  51 +-
 src/core/evidence-map.ts                           |  98 +++-
 src/core/guard.ts                                  |  47 ++
 src/core/markdown-format.ts                        |  22 +-
 src/core/mcp-tools.ts                              | 213 +++++--
 src/core/prepare-pr.ts                             |   2 +-
 src/core/review-context.ts                         |  28 +-
 src/core/runs.ts                                   | 392 ++++++++++---
 src/core/safety.ts                                 |  15 +-
 src/core/upgrade-harness.ts                        |  10 +-
 src/core/verification-report-sections.ts           |  99 +++-
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
 tests/agent-start.test.ts                          |  58 +-
 tests/context-contract.test.ts                     | 399 ++++++++++++-
 tests/doctor.test.ts                               | 300 ++++++++++
 tests/guard.test.ts                                | 173 +++++-
 tests/init.test.ts                                 |  27 +
 tests/markdown-format.test.ts                      |  18 +-
 tests/mcp-server.test.ts                           |  83 ++-
 tests/mcp-tools.test.ts                            | 248 ++++++++-
 tests/prepare-pr.test.ts                           |  95 +++-
 tests/review-context.test.ts                       |  79 ++-
 tests/runs.test.ts                                 | 619 ++++++++++++++++++++-
 tests/safety.test.ts                               |  33 ++
 tests/ship.test.ts                                 |   4 +-
 tests/upgrade-harness.test.ts                      |  77 ++-
 76 files changed, 3898 insertions(+), 407 deletions(-)
docs/start-usefulness-demo.md | untracked
docs/superpowers/plans/2026-06-24-agent-readiness-matrix.md | untracked
docs/superpowers/plans/2026-06-24-agentloop-start-usefulness-proof.md | untracked
src/core/agent-readiness.ts | untracked
src/core/run-artifacts.ts | untracked
src/core/run-types.ts | untracked
src/core/safe-markdown-file.ts | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Release AgentLoopKit 0.43.0`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `412 changed file(s) detected (83 non-evidence, 329 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
