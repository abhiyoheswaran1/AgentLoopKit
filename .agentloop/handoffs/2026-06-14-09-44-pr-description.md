# Implement roadmap adoption channels and policy packs

## Summary

Add local-first, tested support and documentation for the remaining roadmap batch without publishing a release until the whole batch is complete.

## Changed Files

### Risk-Sensitive
- ?? `src/templates/policy-packs/agentloop-baseline/policies/security-policy.md`

### Source
- M `src/cli/commands/policy.ts`
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `src/core/config.ts`
- M `src/templates/root/agentloop.config.json`
- ?? `src/cli/commands/github.ts`
- ?? `src/cli/commands/schemastore.ts`
- ?? `src/core/github-metadata.ts`
- ?? `src/core/policy-packs.ts`
- ?? `src/core/schema-url.ts`
- ?? `src/core/schemastore.ts`
- ?? `src/templates/policy-packs/agentloop-baseline/manifest.json`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/database-change-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/dependency-change-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/git-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/no-destructive-actions.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/public-api-change-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/secrets-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/ui-change-policy.md`
- ?? `src/templates/policy-packs/maintainer-review/manifest.json`
- ?? `src/templates/policy-packs/maintainer-review/policies/maintainer-evidence-policy.md`
- ?? `src/templates/policy-packs/maintainer-review/policies/review-risk-policy.md`

### Tests
- M `tests/cli-docs-drift.test.ts`
- M `tests/completion.test.ts`
- M `tests/config.test.ts`
- M `tests/package-scripts.test.ts`
- M `tests/schema.test.ts`
- ?? `tests/github-metadata.test.ts`
- ?? `tests/policy-packs.test.ts`
- ?? `tests/roadmap-channels.test.ts`
- ?? `tests/schemastore.test.ts`

### AgentLoop
- ?? `.agentloop/handoffs/2026-06-14-09-42-pr-summary.md`
- ?? `.agentloop/reports/2026-06-14-09-33-verification-report.md`
- ?? `.agentloop/runs/2026-06-14-09-42-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-09-42-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-09-42-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-14-09-42-handoff/pr-summary.md`
- ?? `.agentloop/tasks/2026-06-14-implement-roadmap-adoption-channels-and-policy-packs.md`

### Documentation
- M `CHANGELOG.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/configuration.md`
- M `docs/designs/vscode-open-vsx-extension.md`
- M `docs/distribution-channels.md`
- M `docs/policies.md`
- ?? `docs/designs/windows-package-managers.md`
- ?? `docs/github-metadata.md`
- ?? `docs/schemastore.md`

### Config / Package
- M `package.json`
- M `schema/agentloop.config.schema.json`
- ?? `schema/schemastore/agentloopkit.json`

## Review Readiness

- Score: 88/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-14-09-44-ship-report.md`

## Acceptance Criteria

- SchemaStore support has a generated/catalog-ready entry and docs
- Policy packs can be listed, inspected, and applied safely without overwriting local policies by default
- GitHub PR and issue metadata can be imported from explicit local JSON without tokens, API calls, or network access
- Scoop and WinGet planning assets document a real future path without claiming current availability
- VS Code/Open VSX design validation is updated with concrete decision gates and no premature extension build

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-14-09-33-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Public docs could overclaim unsupported release channels
- GitHub import must not read tokens, call GitHub APIs, or treat untrusted PR text as commands

## Rollback Notes

Revert this roadmap batch commit and keep 0.31.0 as the latest released version

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
