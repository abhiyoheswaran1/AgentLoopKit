# AgentLoopKit Ship Report

Make agent-assisted work reviewable, verifiable, and merge-ready.

- Generated: `2026-06-23-17-19`
- Review readiness score: `92`/100
- Task: `Make AgentLoop Start a sharper repo preflight` (`in-progress`) - `.agentloop/tasks/2026-06-23-make-agentloop-start-a-sharper-repo-preflight.md`
- Verification: `pass` - `.agentloop/reports/2026-06-23-16-58-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-23-17-19-pr-summary-2.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `34 non-evidence changed files is broad for one review; 47 AgentLoop evidence file(s) also present (81 total). Non-evidence review areas: Source 15, Documentation 13, Tests 4, AgentLoop 2.`
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

- Evidence map: `81` changed file(s); `34` covered, `0` unexplained; verification `fresh`; `0` risk-sensitive.

## Inherited Dirty Work

- Task started with `32` dirty non-evidence file(s); current non-evidence changed files: `34` (net `+2`).

## Task Risk Notes

- Existing dirty changes from the previous verified Start implementation are present; keep new edits tightly scoped and preserve prior evidence rather than reverting it.
- Pre-existing dirty non-evidence files before task creation: 32 total; examples: `AGENTLOOP.md`, `AGENTS.md`, `DECISIONS.md`, `README.md`, `docs/assets/readme/README.md`. Confirm they belong to this task before implementation.

## Changed Files

- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/assets/readme/README.md`
- M `docs/assets/readme/agentloopkit-context-contract.gif`
- M `docs/assets/readme/agentloopkit-context-contract.tape`
- M `docs/cli-reference.md`
- M `docs/context.md`
- M `docs/getting-started.md`
- M `docs/mcp.md`
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `src/core/mcp-tools.ts`
- M `src/mcp/server.ts`
- M `src/templates/agents/claude-code.md`
- M `src/templates/agents/codex.md`
- M `src/templates/agents/cursor.md`
- M `src/templates/agents/gemini-cli.md`
- M `src/templates/agents/generic.md`
- M `src/templates/agents/github-copilot-cli.md`
- M `src/templates/agents/opencode.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `tests/cli-docs-drift.test.ts`
- M `tests/mcp-server.test.ts`
- M `tests/mcp-tools.test.ts`
- ?? `docs/superpowers/plans/2026-06-23-agentloop-start-context-router.md`
- ?? `docs/superpowers/plans/2026-06-23-agentloop-start-preflight-polish.md`
- ?? `docs/superpowers/specs/2026-06-23-agentloop-start-context-router-design.md`
- ?? `docs/superpowers/specs/2026-06-23-agentloop-start-preflight-polish-design.md`
- ?? `src/cli/commands/start.ts`
- ?? `src/core/agent-start.ts`
- ?? `tests/agent-start.test.ts`
- AgentLoop evidence: `47` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
AGENTLOOP.md                                       |   2 +-
 AGENTS.md                                          |   1 +
 DECISIONS.md                                       |  16 ++++++
 README.md                                          |  47 ++++++++--------
 docs/assets/readme/README.md                       |   2 +-
 .../readme/agentloopkit-context-contract.gif       | Bin 1466571 -> 1364155 bytes
 .../readme/agentloopkit-context-contract.tape      |  12 +----
 docs/cli-reference.md                              |  14 +++++
 docs/context.md                                    |  59 +++++++++++++--------
 docs/getting-started.md                            |   4 +-
 docs/mcp.md                                        |   3 +-
 src/cli/index.ts                                   |   2 +
 src/core/completions.ts                            |   1 +
 src/core/mcp-tools.ts                              |  44 +++++++++++++++
 src/mcp/server.ts                                  |   2 +-
 src/templates/agents/claude-code.md                |   2 +-
 src/templates/agents/codex.md                      |   2 +-
 src/templates/agents/cursor.md                     |   2 +-
 src/templates/agents/gemini-cli.md                 |   2 +-
 src/templates/agents/generic.md                    |   2 +-
 src/templates/agents/github-copilot-cli.md         |   2 +-
 src/templates/agents/opencode.md                   |   2 +-
 src/templates/root/AGENTLOOP.md                    |   2 +-
 src/templates/root/AGENTS.md                       |   1 +
 tests/cli-docs-drift.test.ts                       |   1 +
 tests/mcp-server.test.ts                           |  14 ++++-
 tests/mcp-tools.test.ts                            |  31 +++++++++++
 27 files changed, 201 insertions(+), 71 deletions(-)
docs/superpowers/plans/2026-06-23-agentloop-start-context-router.md | untracked
docs/superpowers/plans/2026-06-23-agentloop-start-preflight-polish.md | untracked
docs/superpowers/specs/2026-06-23-agentloop-start-context-router-design.md | untracked
docs/superpowers/specs/2026-06-23-agentloop-start-preflight-polish-design.md | untracked
src/cli/commands/start.ts | untracked
src/core/agent-start.ts | untracked
tests/agent-start.test.ts | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Make AgentLoop Start a sharper repo preflight`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `83 changed file(s) detected (34 non-evidence, 49 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
