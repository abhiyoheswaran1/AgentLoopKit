# AgentLoopKit Ship Report

Make agent-assisted work reviewable, verifiable, and merge-ready.

- Generated: `2026-06-22-15-23`
- Review readiness score: `96`/100
- Task: `Build AgentLoop Context Contract v1` (`in-progress`) - `.agentloop/tasks/2026-06-22-build-agentloop-context-contract-v1.md`
- Verification: `pass` - `.agentloop/reports/2026-06-22-14-55-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-22-15-23-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `23 non-evidence changed files is reviewable but not small; 13 AgentLoop evidence file(s) also present (36 total).`
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

- Medium-sized non-evidence change set; check scope carefully.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Evidence Map

- Evidence map: `36` changed file(s); `23` covered, `0` unexplained; verification `fresh`; `0` risk-sensitive.

## Inherited Dirty Work

- Task started with `1` dirty non-evidence file(s); current non-evidence changed files: `23` (net `+22`).

## Task Risk Notes

- Pre-existing dirty non-evidence files before task creation: 1 total; examples: `.agentloop/research/interview-cycle-196.md`. Confirm they belong to this task before implementation.

## Changed Files

- M `README.md`
- M `docs/cli-reference.md`
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
- M `tests/cli-docs-drift.test.ts`
- M `tests/mcp-server.test.ts`
- M `tests/mcp-tools.test.ts`
- ?? `.agentloop/research/interview-cycle-196.md`
- ?? `docs/context.md`
- ?? `docs/superpowers/plans/2026-06-22-agentloop-context-contract-v1.md`
- ?? `src/cli/commands/context.ts`
- ?? `src/core/context-contract.ts`
- ?? `tests/context-contract.test.ts`
- AgentLoop evidence: `13` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
README.md                                  | 38 ++++++++++--
 docs/cli-reference.md                      | 30 +++++++++
 docs/mcp.md                                |  6 +-
 src/cli/index.ts                           |  2 +
 src/core/completions.ts                    |  1 +
 src/core/mcp-tools.ts                      | 98 ++++++++++++++++++++++++++++++
 src/mcp/server.ts                          |  2 +-
 src/templates/agents/claude-code.md        |  1 +
 src/templates/agents/codex.md              |  1 +
 src/templates/agents/cursor.md             |  1 +
 src/templates/agents/gemini-cli.md         |  1 +
 src/templates/agents/generic.md            |  1 +
 src/templates/agents/github-copilot-cli.md |  1 +
 src/templates/agents/opencode.md           |  1 +
 tests/cli-docs-drift.test.ts               |  1 +
 tests/mcp-server.test.ts                   | 38 ++++++++++++
 tests/mcp-tools.test.ts                    |  3 +
 17 files changed, 220 insertions(+), 6 deletions(-)
.agentloop/research/interview-cycle-196.md | untracked
docs/context.md | untracked
docs/superpowers/plans/2026-06-22-agentloop-context-contract-v1.md | untracked
src/cli/commands/context.ts | untracked
src/core/context-contract.ts | untracked
tests/context-contract.test.ts | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Build AgentLoop Context Contract v1`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `37 changed file(s) detected (23 non-evidence, 14 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
