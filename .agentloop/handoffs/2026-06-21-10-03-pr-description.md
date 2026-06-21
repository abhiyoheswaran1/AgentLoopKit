# Show gate evidence source in review context

## Summary

Human review-context output includes a concise task-evidence source label for the gate snapshot, aligned with check-gates/status language, while JSON output and gate decisions remain unchanged.

## Changed Files

### Source
- M `src/cli/commands/create-task.ts`
- M `src/cli/commands/next.ts`
- M `src/cli/commands/task.ts`
- M `src/core/artifacts.ts`
- M `src/core/change-areas.ts`
- M `src/core/check-gates.ts`
- M `src/core/git.ts`
- M `src/core/html-report.ts`
- M `src/core/maintainer-check.ts`
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
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/tasks/README.md`
- ?? `src/core/markdown-sections.ts`
- ?? `src/core/verification-report-sections.ts`

### Tests
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
- M `tests/package-scripts.test.ts`
- M `tests/pr-summary.test.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/readiness-score.test.ts`
- M `tests/redaction.test.ts`
- M `tests/release-check.test.ts`
- M `tests/review-context.test.ts`
- M `tests/ship.test.ts`
- M `tests/status.test.ts`
- M `tests/task-state.test.ts`
- M `tests/verification.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/harness/autonomous-dogfooding.md`
- M `.agentloop/harness/commands.md`
- M `.agentloop/tasks/README.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
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

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/html-reports.md`
- M `docs/maintenance-guards.md`
- M `docs/pr-summaries.md`
- M `docs/status.md`
- M `docs/task-contracts.md`
- M `docs/verification-reports.md`

### CI / Automation
- M `scripts/dogfood.mjs`
- M `scripts/maintenance-check.mjs`

### Config / Package
- M `package.json`

### AgentLoop Evidence
- AgentLoop evidence: `466` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Review Readiness

- Score: 92/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-21-10-03-ship-report.md`

## Acceptance Criteria

- review-context human output names active, latest open, archived, or missing task-evidence source when gate data is available.
- review-context JSON remains backward-compatible and tests cover archived/no-active behavior.

## Verification Evidence

- Overall status: pass (`.agentloop/reports/2026-06-21-09-59-verification-report.md`)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Pre-existing dirty non-evidence files before task creation: 112 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes

Revert the review-context rendering/test/docs changes; no migrations or data cleanup required.

## Verification Report Not Run

- test: `npx pnpm@10.12.1 test`
- lint: `npx pnpm@10.12.1 lint`
- typecheck: `npx pnpm@10.12.1 typecheck`
- build: `npx pnpm@10.12.1 build`
