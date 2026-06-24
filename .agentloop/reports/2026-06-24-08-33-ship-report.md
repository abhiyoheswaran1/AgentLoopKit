# AgentLoopKit Ship Report

Make agent-assisted work reviewable, verifiable, and merge-ready.

- Generated: `2026-06-24-08-33`
- Review readiness score: `92`/100
- Task: `Release AgentLoopKit 0.41.0` (`in-progress`) - `.agentloop/tasks/2026-06-24-release-agentloopkit-0-41-0.md`
- Verification: `pass` - `.agentloop/reports/2026-06-24-08-24-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-24-08-33-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `43 non-evidence changed files is broad for one review; 68 AgentLoop evidence file(s) also present (111 total). Non-evidence review areas: Documentation 20, Source 15, Tests 4, AgentLoop 2, Config / Package 1, Other 1.`
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

- Evidence map: `111` changed file(s); `43` covered, `0` unexplained; verification `fresh`; `0` risk-sensitive.

## Inherited Dirty Work

- Task started with `34` dirty non-evidence file(s); current non-evidence changed files: `43` (net `+9`).

## Task Risk Notes

- Release workflows publish public artifacts. Verify each channel from current command output before claiming success.
- The GitHub Marketplace listing may still require owner-side UI publication.
- Pre-existing dirty non-evidence files before task creation: 34 total; examples: `AGENTLOOP.md`, `AGENTS.md`, `DECISIONS.md`, `README.md`, `docs/assets/readme/README.md`. Confirm they belong to this task before implementation.

## Changed Files

- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/assets/readme/README.md`
- M `docs/assets/readme/agentloopkit-context-contract.gif`
- M `docs/assets/readme/agentloopkit-context-contract.tape`
- M `docs/cli-reference.md`
- M `docs/context.md`
- M `docs/getting-started.md`
- M `docs/launch-checklist.md`
- M `docs/mcp.md`
- M `docs/npm-publishing.md`
- M `docs/policy-examples.md`
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
- AgentLoop evidence: `68` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
AGENTLOOP.md                                       |   2 +-
 AGENTS.md                                          |   1 +
 CHANGELOG.md                                       |   9 +++
 DECISIONS.md                                       |  16 +++++
 FINAL_HANDOFF.md                                   |  46 +++++++++------
 README.md                                          |  47 +++++++--------
 ROADMAP.md                                         |  11 ++--
 docs/assets/readme/README.md                       |   2 +-
 .../readme/agentloopkit-context-contract.gif       | Bin 1466571 -> 1364155 bytes
 .../readme/agentloopkit-context-contract.tape      |  12 +---
 docs/cli-reference.md                              |  14 +++++
 docs/context.md                                    |  59 +++++++++++--------
 docs/getting-started.md                            |   4 +-
 docs/launch-checklist.md                           |   4 +-
 docs/mcp.md                                        |   3 +-
 docs/npm-publishing.md                             |  10 ++--
 docs/policy-examples.md                            |   2 +-
 docs/release-status.md                             |  65 ++++++++++-----------
 package.json                                       |   2 +-
 server.json                                        |   4 +-
 src/cli/index.ts                                   |   2 +
 src/core/completions.ts                            |   1 +
 src/core/mcp-tools.ts                              |  44 ++++++++++++++
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
 tests/mcp-tools.test.ts                            |  31 ++++++++++
 36 files changed, 288 insertions(+), 137 deletions(-)
docs/superpowers/plans/2026-06-23-agentloop-start-context-router.md | untracked
docs/superpowers/plans/2026-06-23-agentloop-start-preflight-polish.md | untracked
docs/superpowers/specs/2026-06-23-agentloop-start-context-router-design.md | untracked
docs/superpowers/specs/2026-06-23-agentloop-start-preflight-polish-design.md | untracked
src/cli/commands/start.ts | untracked
src/core/agent-start.ts | untracked
tests/agent-start.test.ts | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Release AgentLoopKit 0.41.0`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `113 changed file(s) detected (43 non-evidence, 70 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
