# Accept redacted task doctor flag

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Agents can safely pass --redact-paths to status, next, review, gate, and artifact commands, but task doctor rejects the flag even though it is commonly run in the same shareable evidence flow.

## Desired Outcome
agentloop task doctor accepts --redact-paths in human and JSON modes without changing task-doctor diagnostics, read-only behavior, or JSON data shape.

## Constraints
- Keep `task doctor` read-only.
- Do not change diagnostic IDs, severity, evidence selection, exit codes, JSON data shape, or task-state mutation behavior.
- Treat `--redact-paths` as a consistency flag for shareable command flows; task-doctor paths should remain repo-relative.
- No dependency, release, publish, tag, Marketplace, Scoop, WinGet, or registry work.

## Non-Goals
- No new redaction engine for task-doctor internals.
- No broad redaction changes across unrelated commands.
- No task doctor diagnostic semantic changes.

## Assumptions
- Task-doctor output already uses repo-relative paths, so accepting `--redact-paths` should be a no-op for current output.
- Agents benefit from being able to pass `--redact-paths` uniformly to shareable AgentLoop review commands.

## Likely Files or Areas
- `src/cli/commands/task.ts`
- `tests/task-state.test.ts`
- `docs/cli-reference.md`
- `docs/status.md`

## Files or Areas Not to Touch
- Release metadata, package versions, lockfiles, publish workflows, distribution manifests, and unrelated task-state diagnostics.

## Acceptance Criteria
- `agentloop task doctor --redact-paths` exits successfully and prints the same human diagnostics as `agentloop task doctor`.
- `agentloop task doctor --json --redact-paths` exits successfully and keeps the existing JSON `taskDoctor` shape.
- `task doctor --help` documents `--redact-paths`.
- Public docs mention that `task doctor --redact-paths` is accepted for consistency while paths remain repo-relative.

## Verification Commands
- `npm test -- tests/task-state.test.ts -t "redact-paths"`
- `npm test -- tests/task-state.test.ts tests/cli-docs-drift.test.ts`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm test`

## Post-Verification Gates
- `npm run dogfood:strict`

## Implementation Plan
- Add failing CLI tests that prove `task doctor --redact-paths` is currently rejected.
- Add the commander option to the `task doctor` subcommand and keep the printer behavior unchanged.
- Update CLI/status docs with the accepted flag and no-op redaction note.
- Run focused tests, full verification, AgentLoop evidence, and strict dogfood.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the task command option, the new tests, and the docs updates. Existing `agentloop task doctor` and `agentloop task doctor --json` behavior remains the fallback.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
