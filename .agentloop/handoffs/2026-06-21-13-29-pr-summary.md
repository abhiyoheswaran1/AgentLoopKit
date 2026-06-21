# PR Summary

- Generated: 2026-06-21-13-29
- Task context: `Surface task loop guidance after create-task`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/README.md`
- M `.agentloop/backlog.md`
- M `.agentloop/harness/autonomous-dogfooding.md`
- M `.agentloop/harness/commands.md`
- M `.agentloop/product-panel.md`
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
- M `scripts/dogfood-start.mjs`
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
- M `tests/completion.test.ts`
- M `tests/create-task.test.ts`
- M `tests/dogfood-script.test.ts`
- M `tests/dogfood-start-script.test.ts`
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
- ?? `.agentloop/loops/research.md`
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
- ?? `.agentloop/research/interview-cycle-195.md`
- ?? `docs/research.md`
- ?? `src/core/markdown-sections.ts`
- ?? `src/core/verification-report-sections.ts`
- ?? `src/templates/loops/research.md`
- ?? `tests/product-positioning.test.ts`
- AgentLoop evidence: `593` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Change Areas
### Risk-Sensitive
- M `examples/security-review/README.md`

### Source
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
- ?? `src/core/markdown-sections.ts`
- ?? `src/core/verification-report-sections.ts`
- ?? `src/templates/loops/research.md`

### Tests
- M `tests/agent-installation.test.ts`
- M `tests/artifacts.test.ts`
- M `tests/autonomous-dogfood.test.ts`
- M `tests/check-gates.test.ts`
- M `tests/completion.test.ts`
- M `tests/create-task.test.ts`
- M `tests/dogfood-script.test.ts`
- M `tests/dogfood-start-script.test.ts`
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
- ?? `tests/product-positioning.test.ts`

### AgentLoop
- M `.agentloop/README.md`
- M `.agentloop/backlog.md`
- M `.agentloop/harness/autonomous-dogfooding.md`
- M `.agentloop/harness/commands.md`
- M `.agentloop/product-panel.md`
- M `.agentloop/tasks/README.md`
- M `.agentloop/user-personas.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- ?? `.agentloop/loops/research.md`
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
- ?? `.agentloop/research/interview-cycle-195.md`

### Documentation
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
- ?? `docs/research.md`

### CI / Automation
- M `scripts/dogfood-start.mjs`
- M `scripts/dogfood.mjs`
- M `scripts/maintenance-check.mjs`
- M `scripts/smoke-packed-release.mjs`

### Config / Package
- M `package.json`

### AgentLoop Evidence
- AgentLoop evidence: `593` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stats
```text
.agentloop/README.md                               |   2 +-
 .agentloop/backlog.md                              | 225 +++++++++-
 .../handoffs/2026-06-12-06-13-pr-description.md    |   2 +-
 .../handoffs/2026-06-12-10-59-release-notes.md     |   2 +-
 .agentloop/harness/autonomous-dogfooding.md        |  11 +-
 .agentloop/harness/commands.md                     |   4 +-
 .agentloop/product-panel.md                        |  10 +-
 .agentloop/tasks/README.md                         |  10 +-
 ...26-06-12-expose-maintainer-check-through-mcp.md |   2 +-
 .agentloop/user-personas.md                        |   8 +-
 AGENTLOOP.md                                       |   8 +-
 AGENTS.md                                          |   8 +-
 CHANGELOG.md                                       |  51 ++-
 DECISIONS.md                                       | 274 +++++++++++-
 FINAL_HANDOFF.md                                   |   2 +-
 README.md                                          |  25 +-
 docs/cli-reference.md                              |  58 +--
 docs/getting-started.md                            |   4 +-
 docs/html-reports.md                               |   2 +
 docs/maintenance-guards.md                         |  16 +-
 docs/mcp.md                                        |   4 +-
 docs/philosophy.md                                 |   2 +-
 docs/policies.md                                   |   4 +-
 docs/policy-examples.md                            |   2 +-
 docs/pr-summaries.md                               |   3 +
 docs/status.md                                     |   7 +-
 docs/task-contracts.md                             |  13 +-
 docs/verification-reports.md                       |   4 +-
 examples/security-review/README.md                 |   2 +-
 package.json                                       |  10 +-
 scripts/dogfood-start.mjs                          |   1 +
 scripts/dogfood.mjs                                |  18 +-
 scripts/maintenance-check.mjs                      |   8 +-
 scripts/smoke-packed-release.mjs                   |  32 ++
 src/cli/commands/create-task.ts                    | 158 ++++++-
 src/cli/commands/maintainer-check.ts               |   2 +-
 src/cli/commands/next.ts                           |   8 +-
 src/cli/commands/ship.ts                           |   2 +-
 src/cli/commands/task.ts                           | 163 +++++--
 src/cli/index.ts                                   |   2 +-
 src/core/agent-installation.ts                     |   2 +-
 src/core/artifacts.ts                              |  35 +-
 src/core/change-areas.ts                           |   7 +
 src/core/check-gates.ts                            |  45 +-
 src/core/completions.ts                            |   2 +-
 src/core/constants.ts                              |   3 +-
 src/core/git.ts                                    |  19 +
 src/core/html-report.ts                            |   4 +-
 src/core/maintainer-check.ts                       | 101 +++--
 src/core/mcp-tools.ts                              |   4 +-
 src/core/pr-summary.ts                             |  26 +-
 src/core/prepare-pr.ts                             |  53 +--
 src/core/readiness-score.ts                        |  26 +-
 src/core/redaction.ts                              |  17 +-
 src/core/release-check.ts                          |  29 +-
 src/core/review-context.ts                         |  65 ++-
 src/core/ship.ts                                   |  52 ++-
 src/core/status.ts                                 |  36 +-
 src/core/task-contract.ts                          |  81 +++-
 src/core/task-state.ts                             |  83 +---
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
 src/templates/tasks/README.md                      |   7 +-
 tests/agent-installation.test.ts                   |   8 +-
 tests/artifacts.test.ts                            |  41 +-
 tests/autonomous-dogfood.test.ts                   |  32 ++
 tests/check-gates.test.ts                          |  75 ++++
 tests/completion.test.ts                           |   3 +
 tests/create-task.test.ts                          | 472 +++++++++++++++++++++
 tests/dogfood-script.test.ts                       |  29 +-
 tests/dogfood-start-script.test.ts                 |   2 +-
 tests/html-report.test.ts                          |  28 ++
 tests/init.test.ts                                 |  33 ++
 tests/maintainer-check.test.ts                     |  93 +++-
 tests/maintenance-check-script.test.ts             |  34 +-
 tests/next.test.ts                                 |  28 ++
 tests/package-metadata.test.ts                     |  49 +++
 tests/package-scripts.test.ts                      |   2 +
 tests/pr-summary.test.ts                           |  75 ++++
 tests/prepare-pr.test.ts                           |  60 ++-
 tests/public-docs-hygiene.test.ts                  |  22 +
 tests/readiness-score.test.ts                      | 149 +++++++
 tests/redaction.test.ts                            |  14 +
 tests/release-check.test.ts                        |  25 ++
 tests/review-context.test.ts                       | 191 +++++++++
 tests/ship.test.ts                                 | 104 ++++-
 tests/status.test.ts                               | 114 +++++
 tests/task-state.test.ts                           | 128 +++++-
 tests/verification.test.ts                         |  66 ++-
 103 files changed, 3394 insertions(+), 423 deletions(-)
.agentloop/loops/research.md | untracked
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
.agentloop/research/interview-cycle-195.md | untracked
docs/research.md | untracked
src/core/markdown-sections.ts | untracked
src/core/verification-report-sections.ts | untracked
src/templates/loops/research.md | untracked
tests/product-positioning.test.ts | untracked
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Review source changes for behavior and public API impact.
- Check tests cover the changed behavior.
- Check docs match the implemented command behavior.
- Review CI or automation changes for permissions and secret handling.
- Review package and config changes for install, build, and publish impact.
- Review AgentLoop artifacts for accurate task, verification, and handoff evidence.
- Review risk-sensitive paths such as migrations, auth, security, billing, env, deployment, and lockfiles with extra care.

## Verification Performed
- Overall status: pass

## Verification Report Not Run
- No skipped commands were recorded.

## Risks
- Re-check protected files such as migrations, secrets, auth, billing, deployment, and public APIs before merge.

## Rollback Notes
- Revert the changed files or revert the merge commit if this lands as a PR.

## Reviewer Checklist
- [ ] Acceptance criteria match the task contract.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk areas have been reviewed.
- [ ] Rollback plan is clear.

## Follow-Ups
- Capture any deferred work in ROADMAP.md or a new task contract.
