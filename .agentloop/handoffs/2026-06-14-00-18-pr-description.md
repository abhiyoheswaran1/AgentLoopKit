# Improve adoption polish and release workflow

## Summary

Implement the requested adoption-polish batch with tests, docs, bug pass, release-flow support, dogfood evidence, and a version cut only after the release gate passes.

## Changed Files

### Source
- M `src/cli/commands/upgrade-harness.ts`
- M `src/core/doctor.ts`
- M `src/core/upgrade-harness.ts`

### Tests
- M `tests/doctor.test.ts`
- M `tests/examples.test.ts`
- M `tests/upgrade-harness.test.ts`
- ?? `tests/package-scripts.test.ts`

### AgentLoop
- ?? `.agentloop/reports/2026-06-13-23-42-verification-report.md`
- ?? `.agentloop/reports/2026-06-14-00-13-verification-report.md`
- ?? `.agentloop/tasks/2026-06-13-improve-adoption-polish-and-release-workflow.md`

### Documentation
- M `CHANGELOG.md`
- M `README.md`
- M `docs/claude-code.md`
- M `docs/cli-reference.md`
- M `docs/codex.md`
- M `docs/cursor.md`
- M `docs/gemini-cli.md`
- M `docs/getting-started.md`
- M `docs/mcp.md`
- M `docs/opencode.md`
- M `docs/template-migrations.md`
- M `examples/dependency-upgrade/README.md`
- ?? `docs/upgrading-existing-repos.md`
- ?? `examples/bugfix-pr/README.md`

### Config / Package
- M `package.json`

## Review Readiness

- Score: 92/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-14-00-18-ship-report.md`

## Acceptance Criteria

- upgrade-harness supports a detailed suggestions/details mode with copyable guidance for stale harness files.
- doctor recommends upgrade-harness when current-loop guidance is missing or stale.
- normal development tests are split from full/release tests without weakening the release gate.
- docs/upgrading-existing-repos.md exists and explains safe older-repo upgrade workflows.
- MCP client setup docs are clearer and avoid unverified config path claims.
- A release-flow command or script runs the exact release gate we use.
- Public examples cover bugfix PR and dependency upgrade PR using task -\> verify -\> ship -\> prepare-pr.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-14-00-13-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Release docs or README could accidentally include internal-only status or unsupported channel claims.
- MCP setup docs can become inaccurate if they include unverified client-specific paths.

## Rollback Notes

Revert the adoption-polish commits and keep 0.30.0 as the latest stable release.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
