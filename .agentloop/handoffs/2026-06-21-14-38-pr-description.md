# Surface active task loop guidance in status

## Summary

status and next show the active or latest-open task's matching .agentloop/loops/<type\>.md guidance when that repo-local file exists, with JSON fields added additively and no command execution.

## Changed Files

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
- AgentLoop evidence: `610` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Review Readiness

- Score: 88/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-21-14-38-ship-report.md`

## Acceptance Criteria

- Human status output shows a Loop guidance line for an active task whose type has an existing loop file.
- Human next output shows the same bounded loop guidance when it is relevant to the selected active or latest-open task.
- JSON status/next output expose loop guidance additively without changing next-action selection.

## Verification Evidence

- Overall status: pass (`.agentloop/reports/2026-06-21-14-03-verification-report.md`)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Status and next output is used by agents and scripts, so keep human additions concise and JSON fields additive.
- Pre-existing dirty non-evidence files before task creation: 149 total; examples: `.agentloop/README.md`, `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/product-panel.md`. Confirm they belong to this task before implementation.

## Rollback Notes

Remove the status/next loop guidance fields and tests; task contracts and loop files remain valid.

## Verification Report Not Run

- No skipped commands were recorded.
