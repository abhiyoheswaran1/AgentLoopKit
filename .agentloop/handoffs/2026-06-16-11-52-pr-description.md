# Maintain near-term roadmap health

## Summary

The repository has current evidence and any small concrete gaps fixed for the six near-term roadmap health items.

## Changed Files

### Tests
- M `tests/autonomous-dogfood.test.ts`
- M `tests/dogfood-script.test.ts`
- M `tests/package-scripts.test.ts`
- ?? `tests/maintenance-check-script.test.ts`

### AgentLoop
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-16-11-40-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-16-11-40-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-11-41-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-11-49-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-16-11-49-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-11-49-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-11-39-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-11-40-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-11-41-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-11-47-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-11-49-ship-report-2.md`
- ?? `.agentloop/reports/2026-06-16-11-49-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-11-51-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-11-40-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-11-40-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-11-40-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-11-40-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-11-40-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-11-40-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-11-40-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-11-40-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-11-40-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-11-41-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-11-41-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-11-41-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-11-41-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-11-41-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-11-41-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-11-49-ship-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-11-49-ship-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-11-49-ship-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-11-49-ship-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-11-49-ship-2/score.json`
- ?? `.agentloop/runs/2026-06-16-11-49-ship-2/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-11-49-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-11-49-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-11-49-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-11-49-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-11-49-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-11-49-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-11-49-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-11-49-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-11-49-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-11-51-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-11-51-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-11-51-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-maintain-near-term-roadmap-health.md`

### Documentation
- M `CHANGELOG.md`
- M `README.md`
- M `docs/maintenance-guards.md`

### CI / Automation
- M `scripts/dogfood.mjs`
- ?? `scripts/maintenance-check.mjs`

### Config / Package
- M `package.json`

## Review Readiness

- Score: 92/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-16-11-52-ship-report.md`

## Acceptance Criteria

- Release pipeline documentation and proof commands remain current
- README and public docs stay user-facing
- GHCR and MCP Registry proof remains current
- SchemaStore guidance is current when schema URL or shape has not changed
- Policy packs remain local, small, safe, and no-overwrite
- GitHub metadata import remains explicit, read-only, optional, and documented

## Verification Evidence

- Overall status: pass (`.agentloop/reports/2026-06-16-11-51-verification-report.md`)



## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.
- `maintenance:check` runs live release proof and `npx` tool checks, so it can fail on network or registry availability.
- The maintenance gate must not publish, tag, upload, post comments, or pass token-like environment variables to child processes.

## Rollback Notes

Revert `scripts/maintenance-check.mjs`, restore the previous `maintenance:check` package script, revert the ProjScan dogfood argument-order change, and remove the associated tests/docs/changelog entries.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
