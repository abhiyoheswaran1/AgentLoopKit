# Make create-task output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement

create-task prints generated task paths and post-verification warning commands into human output. Configured paths or command strings with line breaks can split Markdown when agents paste the output into handoffs or CI logs.

## Desired Outcome

Human create-task output renders generated paths and warning command values on one Markdown line while JSON output, task contract content, active-task state, warning detection, exit codes, and file writes remain unchanged.

## Constraints

- Keep the change limited to human-readable `create-task` CLI output.
- Preserve JSON output shape and raw dynamic values.
- Preserve task contract content, active-task state, warning detection, exit codes, and file writes.
- Keep the implementation deterministic and local-only.
- Keep public docs user-facing and free of internal release chatter.

## Non-Goals

- No changes to task contract generation or templates.
- No changes to post-verification warning detection semantics.
- No release, version bump, registry publish, or GitHub release.
- No network calls, telemetry, GitHub API calls, or destructive automation.

## Assumptions

- Agents paste `create-task` human output into handoffs, CI logs, issues, and PR comments.
- `--out` paths and verification command strings can contain unusual whitespace.
- Machine consumers need JSON output to keep raw values unchanged.

## Likely Files or Areas

- `src/cli/commands/create-task.ts`
- `tests/create-task.test.ts`
- `docs/cli-reference.md`
- `CHANGELOG.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch

- `package.json` version field
- Release workflows
- Built `dist/` output unless a build command regenerates it
- Task templates unless needed to fix a verified regression

## Acceptance Criteria

- Human `create-task` output renders generated absolute task paths, active task paths, and post-verification warning command values on one Markdown line.
- JSON output keeps raw dynamic values unchanged.
- Task contract content, active-task state, warning detection, exit behavior, and file writes remain unchanged.
- Regression tests fail before the fix and pass after it.
- Public docs mention the human-vs-JSON behavior without internal development notes.

## Verification Commands

- npm test -- tests/create-task.test.ts
- npm test -- tests/create-task.test.ts tests/cli-docs-drift.test.ts
- npm run typecheck
- npm run lint
- npm run check:public-docs
- npm run check:links
- npm run build
- npm test

## Post-Verification Gates

- npx --no-install tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-16-make-create-task-output-markdown-safe.md --task-commands --only-task-commands --write-run --redact-paths --progress
- npx --no-install tsx src/cli/index.ts ship --redact-paths
- npx --no-install tsx src/cli/index.ts handoff --write-run --redact-paths
- npm run dogfood:strict

## Implementation Plan

- Inspect relevant files before editing.
- Add failing tests for newline-containing task paths and warning commands in human output.
- Switch `create-task` human rendering to the single-line inline-code helper.
- Update CLI docs, changelog, backlog, and dogfood log.
- Run focused checks, full local gates, AgentLoop evidence, AgentFlight, and ProjScan.

## Risk Notes

- Low risk if the change stays at the formatter boundary.
- Watch for accidental changes to JSON shape or task contract file content.
- Watch for warning-command test inputs that bypass existing gate detection.

## Rollback Notes

Revert the formatter import and the create-task regression tests.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
