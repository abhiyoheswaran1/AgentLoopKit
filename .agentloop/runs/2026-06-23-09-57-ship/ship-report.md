# AgentLoopKit Ship Report

Make agent-assisted work reviewable, verifiable, and merge-ready.

- Generated: `2026-06-23-09-57`
- Review readiness score: `92`/100
- Task: `Release AgentLoopKit 0.40.0` (`in-progress`) - `.agentloop/tasks/2026-06-23-release-agentloopkit-0-40-0.md`
- Verification: `pass` - `.agentloop/reports/2026-06-23-09-39-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-23-09-57-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `36 non-evidence changed files is broad for one review; 55 AgentLoop evidence file(s) also present (91 total). Non-evidence review areas: Documentation 15, Source 13, Tests 5, AgentLoop 1, Config / Package 1, Other 1.`
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

- Evidence map: `91` changed file(s); `34` covered, `2` unexplained; verification `fresh`; `0` risk-sensitive.

## Inherited Dirty Work

- Task started with `26` dirty non-evidence file(s); current non-evidence changed files: `36` (net `+10`).

## Task Risk Notes

- Release workflows publish public artifacts. Verify channels from current command output before claiming success.
- Pre-existing dirty non-evidence files before task creation: 26 total; examples: `README.md`, `docs/assets/readme/README.md`, `docs/cli-reference.md`, `docs/mcp.md`, `src/cli/index.ts`. Confirm they belong to this task before implementation.

## Changed Files

- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/assets/readme/README.md`
- M `docs/cli-reference.md`
- M `docs/launch-checklist.md`
- M `docs/mcp.md`
- M `docs/npm-publishing.md`
- M `docs/release-checklist-example.md`
- M `docs/release-status.md`
- M `package.json`
- M `server.json`
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
- M `tests/package-scripts.test.ts`
- ?? `.agentloop/research/interview-cycle-196.md`
- ?? `docs/assets/readme/agentloopkit-context-contract.gif`
- ?? `docs/assets/readme/agentloopkit-context-contract.tape`
- ?? `docs/context.md`
- ?? `docs/superpowers/plans/2026-06-22-agentloop-context-contract-v1.md`
- ?? `src/cli/commands/context.ts`
- ?? `src/core/context-contract.ts`
- ?? `tests/context-contract.test.ts`
- AgentLoop evidence: `55` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
CHANGELOG.md                               |  9 +++
 FINAL_HANDOFF.md                           | 64 +++++++++++--------
 README.md                                  | 48 ++++++++++++---
 ROADMAP.md                                 | 11 ++--
 docs/assets/readme/README.md               |  5 +-
 docs/cli-reference.md                      | 32 +++++++++-
 docs/launch-checklist.md                   |  4 +-
 docs/mcp.md                                |  6 +-
 docs/npm-publishing.md                     | 12 ++--
 docs/release-checklist-example.md          |  3 +-
 docs/release-status.md                     | 72 +++++++++++-----------
 package.json                               |  4 +-
 server.json                                |  4 +-
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
 tests/package-scripts.test.ts              |  5 +-
 28 files changed, 337 insertions(+), 94 deletions(-)
.agentloop/research/interview-cycle-196.md | untracked
docs/assets/readme/agentloopkit-context-contract.gif | untracked
docs/assets/readme/agentloopkit-context-contract.tape | untracked
docs/context.md | untracked
docs/superpowers/plans/2026-06-22-agentloop-context-contract-v1.md | untracked
src/cli/commands/context.ts | untracked
src/core/context-contract.ts | untracked
tests/context-contract.test.ts | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Release AgentLoopKit 0.40.0`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `92 changed file(s) detected (36 non-evidence, 56 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
