# Release AgentLoopKit 0.46.0

## Summary

AgentLoopKit 0.46.0 is versioned, verified, published, and backed by post-release channel proof.

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
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`
- M `docs/loop-contracts.md`

### Config / Package
- M `package.json`

### Other
- M `server.json`

### AgentLoop Evidence
- AgentLoop evidence: `26` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-28-12-29-ship-report.md`

## Evidence Map

- Evidence map: `51` changed file(s); `25` covered, `0` unexplained; verification `fresh`; `0` risk-sensitive.

## Acceptance Criteria

- package.json and server.json report 0.46.0.
- CHANGELOG.md has a 0.46.0 section with guarded loop runner and README demo changes.
- Release docs describe 0.46.0 channel state without claiming unavailable channels.
- npm, GitHub Release, GHCR, and MCP Registry publish proof is recorded after release workflows complete.

## Verification Evidence

- Overall status: pass (`.agentloop/reports/2026-06-28-12-08-verification-report.md`)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Public channel publishing can lag after workflows; record gaps honestly and rerun proof before claiming availability.
- Pre-existing dirty non-evidence files before task creation: 21 total; examples: `.agentloop/README.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `AGENTLOOP.md`, `AGENTS.md`. Confirm they belong to this task before implementation.

## Rollback Notes

If 0.46.0 publishing fails, fix forward with 0.46.1 or rerun failed workflows; do not overwrite tags or publish stale artifacts.

## Verification Report Not Run

- test: `npx pnpm@10.12.1 test`
- lint: `npx pnpm@10.12.1 lint`
- typecheck: `npx pnpm@10.12.1 typecheck`
- build: `npx pnpm@10.12.1 build`
