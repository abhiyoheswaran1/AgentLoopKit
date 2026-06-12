# Add repeatable dogfood gate and official icon assets

## Summary

The repo has one repeatable dogfood command for AgentLoopKit self-checks, and README/docs/assets use the official icon with clean cropped edges.

## Changed Files

### Tests
- ?? `tests/dogfood-script.test.ts`

### AgentLoop
- M `.agentloop/dogfood-log.md`
- M `AGENTS.md`
- ?? `.agentloop/reports/2026-06-12-12-21-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-12-29-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-repeatable-dogfood-gate-and-official-icon-assets.md`

### Documentation
- M `CONTRIBUTING.md`
- M `README.md`
- M `docs/assets/readme/README.md`
- M `docs/assets/readme/agentloopkit-showcase.png`
- M `docs/assets/readme/agentloopkit-verification.png`
- M `docs/assets/readme/showcase.html`
- M `docs/assets/readme/verification.html`
- ?? `docs/logo/`

### CI / Automation
- ?? `scripts/dogfood.mjs`

### Config / Package
- M `package.json`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-12-31-ship-report.md`

## Acceptance Criteria

- A documented npm dogfood script runs the core AgentLoopKit self-check sequence without publishing or external tokens
- Automated tests cover the dogfood script command plan or behavior
- README uses the official AgentLoopKit icon from committed assets
- Official icon assets are committed in the docs asset set with any visible white edge trimmed if needed
- Public docs remain user-facing and avoid internal release chatter

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-12-21-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Dogfood command could become too slow or mutate evidence unexpectedly if not scoped carefully

## Rollback Notes

Remove the dogfood script, generated icon asset references, and docs changes

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
