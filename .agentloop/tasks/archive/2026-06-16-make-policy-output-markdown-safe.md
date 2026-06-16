# Make policy output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement

The policy commands print repo-local policy pack names, titles, sources, paths, and apply results into human output. Values containing line breaks can split Markdown when agents paste policy evidence into handoffs or review comments.

## Desired Outcome

Human policy command output renders dynamic policy pack and apply-result values on one Markdown line while JSON output, policy discovery, symlink safety, file copying, skip behavior, and exit codes remain unchanged.

## Constraints

- Keep the change limited to human-readable `policy` command output.
- Preserve JSON output shape and raw dynamic values.
- Preserve policy discovery, status calculation, pack reading, symlink safety, file copying, skip behavior, and exit codes.
- Keep the implementation deterministic and local-only.
- Keep public docs user-facing and free of internal release chatter.

## Non-Goals

- No changes to policy-pack manifest validation.
- No changes to bundled policy-pack content.
- No changes to apply semantics or overwrite safety.
- No release, version bump, registry publish, or GitHub release.
- No network calls, telemetry, GitHub API calls, or destructive automation.

## Assumptions

- Agents paste `policy list`, `policy status`, `policy packs`, `policy pack show`, and `policy pack apply` output into review evidence.
- Repo-local policy pack metadata and policy filenames can contain unusual whitespace.
- Machine consumers need JSON output to keep raw values unchanged.

## Likely Files or Areas

- `src/cli/commands/policy.ts`
- `tests/policy.test.ts`
- `tests/policy-packs.test.ts`
- `docs/cli-reference.md`
- `CHANGELOG.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch

- `package.json` version field
- Release workflows
- Built `dist/` output unless a build command regenerates it
- Bundled policy templates unless a failing test proves they must change

## Acceptance Criteria

- Human `policy list` and `policy status` output renders dynamic policy titles, statuses, and paths on one Markdown line.
- Human `policy packs`, `policy pack show`, and `policy pack apply` output renders dynamic pack names, titles, sources, paths, policy filenames, created files, and skipped files on one Markdown line.
- JSON output keeps raw dynamic values unchanged.
- Policy discovery, pack reading, apply skip/create behavior, symlink safety, and exit behavior remain unchanged.
- Regression tests fail before the fix and pass after it.
- Public docs mention the human-vs-JSON behavior without internal development notes.

## Verification Commands

- npm test -- tests/policy.test.ts tests/policy-packs.test.ts
- npm test -- tests/policy.test.ts tests/policy-packs.test.ts tests/cli-docs-drift.test.ts
- npm run typecheck
- npm run lint
- npm run check:public-docs
- npm run check:links
- npm run build
- npm test

## Post-Verification Gates

- npx --no-install tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-16-make-policy-output-markdown-safe.md --task-commands --only-task-commands --write-run --redact-paths --progress
- npx --no-install tsx src/cli/index.ts handoff --write-run --redact-paths
- npx --no-install tsx src/cli/index.ts ship --redact-paths
- npm run dogfood:strict

## Implementation Plan

- Inspect relevant files before editing.
- Add failing tests for newline-containing policy titles/paths and local policy-pack apply output.
- Switch `policy` human rendering to the single-line inline-code helper.
- Update CLI docs, changelog, backlog, and dogfood log.
- Run focused checks, full local gates, AgentLoop evidence, AgentFlight, and ProjScan.

## Risk Notes

- Low risk if the change stays at the formatter boundary.
- Watch for accidental changes to JSON shape or policy-pack apply behavior.
- Watch for accidentally broadening manifest validation or policy-copy semantics.

## Rollback Notes

Revert the formatter import and the policy command regression tests.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
