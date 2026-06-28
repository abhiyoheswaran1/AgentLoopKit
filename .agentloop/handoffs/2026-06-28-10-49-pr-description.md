# Add guarded loop runner

## Summary

Add an agent-neutral loop run command that executes only explicitly allowed local runner commands, records evidence, enforces token and iteration guardrails, and keeps AgentLoopKit in control of readiness decisions.

## Changed Files

### Source
- M `src/cli/commands/loop.ts`
- M `src/core/loop-contract.ts`
- M `src/core/upgrade-harness.ts`
- M `src/index.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- ?? `src/core/loop-runner.ts`

### Tests
- M `tests/loop-contract.test.ts`

### AgentLoop
- M `.agentloop/README.md`
- M `.agentloop/harness/autonomous-dogfooding.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- ?? `.agentloop/loops/2026-06-28-10-21-dogfood-guarded-loop-runner/loop.json`

### Documentation
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`
- M `docs/loop-contracts.md`

### AgentLoop Evidence
- AgentLoop evidence: `6` file(s) grouped under `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-28-10-49-ship-report.md`

## Evidence Map

- Evidence map: `27` changed file(s); `21` covered, `0` unexplained; verification `fresh`; `0` risk-sensitive.

## Acceptance Criteria

- A configured safe runner can be executed with agentloop loop run and records one iteration with command, exit code, changed files, token receipt, and decision.
- Loop run rejects unconfigured commands, shell metacharacters, protected commands, exceeded max iterations, and terminal loop statuses.
- Self-dogfood presets include logical guardrails for this repository without executing publishing or destructive operations.
- Docs explain runner guardrails and make clear AgentLoopKit controls loops while external runners do the work.

## Verification Evidence

- Overall status: pass (`.agentloop/reports/2026-06-28-10-24-verification-report.md`)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Running external commands from a CLI is high risk unless config is explicit, parsed without shell expansion, and protected commands are blocked.

## Rollback Notes

Remove loop run command, runner config parsing, docs, and tests; existing create/tick/status/report behavior should remain unchanged.

## Verification Report Not Run

- test: `npx pnpm@10.12.1 test`
- build: `npx pnpm@10.12.1 build`
