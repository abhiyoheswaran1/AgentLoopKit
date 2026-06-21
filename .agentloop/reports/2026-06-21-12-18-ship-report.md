# AgentLoopKit Ship Report

Make agent-assisted work reviewable, verifiable, and merge-ready.

- Generated: `2026-06-21-12-18`
- Review readiness score: `88`/100
- Task: `Accept redact-paths on task lifecycle commands` (`in-progress`) - `.agentloop/tasks/2026-06-21-accept-redact-paths-on-task-lifecycle-commands.md`
- Verification: `pass` - `.agentloop/reports/2026-06-21-11-59-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-21-12-18-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `30`/100 (weight `15`) - `140 non-evidence changed files is broad for one review; 552 AgentLoop evidence file(s) also present (692 total). Non-evidence review areas: AgentLoop 50, Source 45, Tests 24, Documentation 16, CI / Automation 3, Config / Package 1, Risk-Sensitive 1.`
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

- Large non-evidence change set; consider splitting before review.
- Risk-sensitive files changed: examples/security-review/README.md

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review risk-sensitive files before merge.

## Inherited Dirty Work

- Task started with `139` dirty non-evidence file(s); current non-evidence changed files: `140` (net `+1`).

## Task Risk Notes

- Mutating task lifecycle commands must continue to write the same files and only redact display output.
- Pre-existing dirty non-evidence files before task creation: 139 total; examples: `.agentloop/README.md`, `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`. Confirm they belong to this task before implementation.

## Changed Files

- M `.agentloop/README.md`
- M `.agentloop/backlog.md`
- M `.agentloop/harness/autonomous-dogfooding.md`
- M `.agentloop/harness/commands.md`
- M `.agentloop/tasks/README.md`
- M `.agentloop/user-personas.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`
- M `docs/html-reports.md`
- M `docs/maintenance-guards.md`
- M `docs/mcp.md`
- M `docs/philosophy.md`
- M `docs/policies.md`
- M `docs/policy-examples.md`
- M `docs/pr-summaries.md`
- M `docs/status.md`
- M `docs/task-contracts.md`
- M `docs/verification-reports.md`
- M `examples/security-review/README.md`
- M `package.json`
- M `scripts/dogfood.mjs`
- M `scripts/maintenance-check.mjs`
- M `scripts/smoke-packed-release.mjs`
- M `src/cli/commands/create-task.ts`
- M `src/cli/commands/maintainer-check.ts`
- M `src/cli/commands/next.ts`
- M `src/cli/commands/ship.ts`
- M `src/cli/commands/task.ts`
- M `src/cli/index.ts`
- M `src/core/agent-installation.ts`
- M `src/core/artifacts.ts`
- M `src/core/change-areas.ts`
- M `src/core/check-gates.ts`
- M `src/core/completions.ts`
- M `src/core/constants.ts`
- M `src/core/git.ts`
- M `src/core/html-report.ts`
- M `src/core/maintainer-check.ts`
- M `src/core/mcp-tools.ts`
- M `src/core/pr-summary.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/readiness-score.ts`
- M `src/core/redaction.ts`
- M `src/core/release-check.ts`
- M `src/core/review-context.ts`
- M `src/core/ship.ts`
- M `src/core/status.ts`
- M `src/core/task-contract.ts`
- M `src/core/task-state.ts`
- M `src/core/upgrade-harness.ts`
- M `src/core/verification.ts`
- M `src/templates/agents/claude-code.md`
- M `src/templates/agents/codex.md`
- M `src/templates/agents/cursor.md`
- M `src/templates/agents/gemini-cli.md`
- M `src/templates/agents/generic.md`
- M `src/templates/agents/github-copilot-cli.md`
- M `src/templates/agents/opencode.md`
- M `src/templates/handoffs/verification-report.md`
- M `src/templates/harness/commands.md`
- M `src/templates/policy-packs/maintainer-review/manifest.json`
- M `src/templates/policy-packs/maintainer-review/policies/maintainer-evidence-policy.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- M `src/templates/tasks/README.md`
- M `tests/agent-installation.test.ts`
- M `tests/artifacts.test.ts`
- M `tests/autonomous-dogfood.test.ts`
- M `tests/check-gates.test.ts`
- M `tests/create-task.test.ts`
- M `tests/dogfood-script.test.ts`
- M `tests/html-report.test.ts`
- M `tests/init.test.ts`
- M `tests/maintainer-check.test.ts`
- M `tests/maintenance-check-script.test.ts`
- M `tests/next.test.ts`
- M `tests/package-metadata.test.ts`
- M `tests/package-scripts.test.ts`
- M `tests/pr-summary.test.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/public-docs-hygiene.test.ts`
- M `tests/readiness-score.test.ts`
- M `tests/redaction.test.ts`
- M `tests/release-check.test.ts`
- M `tests/review-context.test.ts`
- M `tests/ship.test.ts`
- M `tests/status.test.ts`
- M `tests/task-state.test.ts`
- M `tests/verification.test.ts`
- ?? `.agentloop/research/interview-cycle-153.md`
- ?? `.agentloop/research/interview-cycle-154.md`
- ?? `.agentloop/research/interview-cycle-155.md`
- ?? `.agentloop/research/interview-cycle-156.md`
- ?? `.agentloop/research/interview-cycle-157.md`
- ?? `.agentloop/research/interview-cycle-158.md`
- ?? `.agentloop/research/interview-cycle-159.md`
- ?? `.agentloop/research/interview-cycle-160.md`
- ?? `.agentloop/research/interview-cycle-161.md`
- ?? `.agentloop/research/interview-cycle-162.md`
- ?? `.agentloop/research/interview-cycle-163.md`
- ?? `.agentloop/research/interview-cycle-164.md`
- ?? `.agentloop/research/interview-cycle-165.md`
- ?? `.agentloop/research/interview-cycle-166.md`
- ?? `.agentloop/research/interview-cycle-167.md`
- ?? `.agentloop/research/interview-cycle-168.md`
- ?? `.agentloop/research/interview-cycle-169.md`
- ?? `.agentloop/research/interview-cycle-170.md`
- ?? `.agentloop/research/interview-cycle-171.md`
- ?? `.agentloop/research/interview-cycle-172.md`
- ?? `.agentloop/research/interview-cycle-173.md`
- ?? `.agentloop/research/interview-cycle-174.md`
- ?? `.agentloop/research/interview-cycle-175.md`
- ?? `.agentloop/research/interview-cycle-176.md`
- ?? `.agentloop/research/interview-cycle-177.md`
- ?? `.agentloop/research/interview-cycle-178.md`
- ?? `.agentloop/research/interview-cycle-179.md`
- ?? `.agentloop/research/interview-cycle-180.md`
- ?? `.agentloop/research/interview-cycle-181.md`
- ?? `.agentloop/research/interview-cycle-182.md`
- ?? `.agentloop/research/interview-cycle-183.md`
- ?? `.agentloop/research/interview-cycle-184.md`
- ?? `.agentloop/research/interview-cycle-185.md`
- ?? `.agentloop/research/interview-cycle-186.md`
- ?? `.agentloop/research/interview-cycle-187.md`
- ?? `.agentloop/research/interview-cycle-188.md`
- ?? `.agentloop/research/interview-cycle-189.md`
- ?? `.agentloop/research/interview-cycle-190.md`
- ?? `.agentloop/research/interview-cycle-191.md`
- ?? `.agentloop/research/interview-cycle-192.md`
- ?? `.agentloop/research/interview-cycle-193.md`
- ?? `.agentloop/research/interview-cycle-194.md`
- ?? `src/core/markdown-sections.ts`
- ?? `src/core/verification-report-sections.ts`
- AgentLoop evidence: `552` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
.agentloop/README.md                               |   2 +-
 .agentloop/backlog.md                              | 219 ++++++++++++-
 .../handoffs/2026-06-12-06-13-pr-description.md    |   2 +-
 .../handoffs/2026-06-12-10-59-release-notes.md     |   2 +-
 .agentloop/harness/autonomous-dogfooding.md        |  11 +-
 .agentloop/harness/commands.md                     |   4 +-
 .agentloop/tasks/README.md                         |   6 +-
 ...26-06-12-expose-maintainer-check-through-mcp.md |   2 +-
 .agentloop/user-personas.md                        |   4 +-
 AGENTLOOP.md                                       |   8 +-
 AGENTS.md                                          |   8 +-
 CHANGELOG.md                                       |  48 ++-
 DECISIONS.md                                       | 256 ++++++++++++++-
 FINAL_HANDOFF.md                                   |   2 +-
 README.md                                          |  24 +-
 docs/cli-reference.md                              |  54 ++--
 docs/getting-started.md                            |   4 +-
 docs/html-reports.md                               |   2 +
 docs/maintenance-guards.md                         |  16 +-
 docs/mcp.md                                        |   4 +-
 docs/philosophy.md                                 |   2 +-
 docs/policies.md                                   |   4 +-
 docs/policy-examples.md                            |   2 +-
 docs/pr-summaries.md                               |   3 +
 docs/status.md                                     |   7 +-
 docs/task-contracts.md                             |   7 +-
 docs/verification-reports.md                       |   4 +-
 examples/security-review/README.md                 |   2 +-
 package.json                                       |  10 +-
 scripts/dogfood.mjs                                |  18 +-
 scripts/maintenance-check.mjs                      |   8 +-
 scripts/smoke-packed-release.mjs                   |  32 ++
 src/cli/commands/create-task.ts                    | 125 +++++++-
 src/cli/commands/maintainer-check.ts               |   2 +-
 src/cli/commands/next.ts                           |   8 +-
 src/cli/commands/ship.ts                           |   2 +-
 src/cli/commands/task.ts                           | 163 +++++++---
 src/cli/index.ts                                   |   2 +-
 src/core/agent-installation.ts                     |   2 +-
 src/core/artifacts.ts                              |  35 ++-
 src/core/change-areas.ts                           |   7 +
 src/core/check-gates.ts                            |  45 ++-
 src/core/completions.ts                            |   2 +-
 src/core/constants.ts                              |   2 +-
 src/core/git.ts                                    |  19 ++
 src/core/html-report.ts                            |   4 +-
 src/core/maintainer-check.ts                       | 101 +++---
 src/core/mcp-tools.ts                              |   4 +-
 src/core/pr-summary.ts                             |  26 +-
 src/core/prepare-pr.ts                             |  53 ++--
 src/core/readiness-score.ts                        |  26 +-
 src/core/redaction.ts                              |  17 +-
 src/core/release-check.ts                          |  29 +-
 src/core/review-context.ts                         |  65 +++-
 src/core/ship.ts                                   |  52 +++-
 src/core/status.ts                                 |  36 ++-
 src/core/task-contract.ts                          |  80 ++++-
 src/core/task-state.ts                             |  83 ++---
 src/core/upgrade-harness.ts                        |   2 +-
 src/core/verification.ts                           |  29 +-
 src/templates/agents/claude-code.md                |   2 +-
 src/templates/agents/codex.md                      |   2 +-
 src/templates/agents/cursor.md                     |   2 +-
 src/templates/agents/gemini-cli.md                 |   2 +-
 src/templates/agents/generic.md                    |   4 +-
 src/templates/agents/github-copilot-cli.md         |   2 +-
 src/templates/agents/opencode.md                   |   2 +-
 src/templates/handoffs/verification-report.md      |   2 +-
 src/templates/harness/commands.md                  |   3 +-
 .../policy-packs/maintainer-review/manifest.json   |   2 +-
 .../policies/maintainer-evidence-policy.md         |   2 +-
 src/templates/root/AGENTLOOP.md                    |   8 +-
 src/templates/root/AGENTS.md                       |   6 +-
 src/templates/root/agentloop-directory-readme.md   |   4 +-
 src/templates/tasks/README.md                      |   2 +
 tests/agent-installation.test.ts                   |   8 +-
 tests/artifacts.test.ts                            |  41 ++-
 tests/autonomous-dogfood.test.ts                   |  32 ++
 tests/check-gates.test.ts                          |  75 +++++
 tests/create-task.test.ts                          | 343 +++++++++++++++++++++
 tests/dogfood-script.test.ts                       |  29 +-
 tests/html-report.test.ts                          |  28 ++
 tests/init.test.ts                                 |  27 ++
 tests/maintainer-check.test.ts                     |  93 +++++-
 tests/maintenance-check-script.test.ts             |  34 +-
 tests/next.test.ts                                 |  28 ++
 tests/package-metadata.test.ts                     |  49 +++
 tests/package-scripts.test.ts                      |   1 +
 tests/pr-summary.test.ts                           |  75 +++++
 tests/prepare-pr.test.ts                           |  60 +++-
 tests/public-docs-hygiene.test.ts                  |  22 ++
 tests/readiness-score.test.ts                      | 149 +++++++++
 tests/redaction.test.ts                            |  14 +
 tests/release-check.test.ts                        |  25 ++
 tests/review-context.test.ts                       | 191 ++++++++++++
 tests/ship.test.ts                                 | 104 ++++++-
 tests/status.test.ts                               | 114 +++++++
 tests/task-state.test.ts                           | 128 +++++++-
 tests/verification.test.ts                         |  66 +++-
 99 files changed, 3170 insertions(+), 409 deletions(-)
.agentloop/research/interview-cycle-153.md | untracked
.agentloop/research/interview-cycle-154.md | untracked
.agentloop/research/interview-cycle-155.md | untracked
.agentloop/research/interview-cycle-156.md | untracked
.agentloop/research/interview-cycle-157.md | untracked
.agentloop/research/interview-cycle-158.md | untracked
.agentloop/research/interview-cycle-159.md | untracked
.agentloop/research/interview-cycle-160.md | untracked
.agentloop/research/interview-cycle-161.md | untracked
.agentloop/research/interview-cycle-162.md | untracked
.agentloop/research/interview-cycle-163.md | untracked
.agentloop/research/interview-cycle-164.md | untracked
.agentloop/research/interview-cycle-165.md | untracked
.agentloop/research/interview-cycle-166.md | untracked
.agentloop/research/interview-cycle-167.md | untracked
.agentloop/research/interview-cycle-168.md | untracked
.agentloop/research/interview-cycle-169.md | untracked
.agentloop/research/interview-cycle-170.md | untracked
.agentloop/research/interview-cycle-171.md | untracked
.agentloop/research/interview-cycle-172.md | untracked
.agentloop/research/interview-cycle-173.md | untracked
.agentloop/research/interview-cycle-174.md | untracked
.agentloop/research/interview-cycle-175.md | untracked
.agentloop/research/interview-cycle-176.md | untracked
.agentloop/research/interview-cycle-177.md | untracked
.agentloop/research/interview-cycle-178.md | untracked
.agentloop/research/interview-cycle-179.md | untracked
.agentloop/research/interview-cycle-180.md | untracked
.agentloop/research/interview-cycle-181.md | untracked
.agentloop/research/interview-cycle-182.md | untracked
.agentloop/research/interview-cycle-183.md | untracked
.agentloop/research/interview-cycle-184.md | untracked
.agentloop/research/interview-cycle-185.md | untracked
.agentloop/research/interview-cycle-186.md | untracked
.agentloop/research/interview-cycle-187.md | untracked
.agentloop/research/interview-cycle-188.md | untracked
.agentloop/research/interview-cycle-189.md | untracked
.agentloop/research/interview-cycle-190.md | untracked
.agentloop/research/interview-cycle-191.md | untracked
.agentloop/research/interview-cycle-192.md | untracked
.agentloop/research/interview-cycle-193.md | untracked
.agentloop/research/interview-cycle-194.md | untracked
src/core/markdown-sections.ts | untracked
src/core/verification-report-sections.ts | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Accept redact-paths on task lifecycle commands`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `693 changed file(s) detected (140 non-evidence, 553 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
