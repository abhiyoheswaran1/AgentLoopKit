# Accept redacted task show output flag

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
Agents and maintainers use task show to paste task contracts into handoffs, but task show rejects the common --redact-paths flag even though task bodies can contain local absolute paths. This creates inconsistency with task list and task doctor and makes shareable task evidence easier to leak.

## Desired Outcome
agentloop task show accepts --redact-paths in human and JSON modes, redacts local repo roots from displayed task content when requested, and preserves default task show behavior without changing task state.

## Constraints
- Keep `task show` read-only; it must not create, update, or clear `.agentloop/state.json`.
- Preserve default human and JSON output for scripts unless `--redact-paths` is explicitly passed.
- Do not change task path validation, task status parsing, archive behavior, or task list/doctor output.
- Do not touch package versions, lockfiles, release metadata, publishing workflows, or changelog files.

## Non-Goals
- Redacting arbitrary secrets inside task bodies.
- Changing stored task contract Markdown.
- Adding release readiness, publication, or version-cut behavior.

## Assumptions
- `redactLocalRoots` is the existing local-root redaction primitive used by adjacent commands.
- Task contract paths are already repo-relative, but task bodies may contain absolute local paths.

## Likely Files or Areas
- `src/cli/commands/task.ts`
- `tests/task-state.test.ts`
- `docs/cli-reference.md`
- `docs/task-contracts.md`
- `docs/status.md`
- `README.md`

## Files or Areas Not to Touch
- `package.json`
- `pnpm-lock.yaml`
- `CHANGELOG.md`
- `.github/workflows/`
- Release, registry, or Marketplace publication files

## Acceptance Criteria
- `agentloop task show --help` includes `--redact-paths`.
- Human `agentloop task show <path> --redact-paths` redacts the current repo root from task contract content.
- JSON `agentloop task show <path> --json --redact-paths` redacts the current repo root from `task.content`.
- Default human and JSON `task show` output preserve raw task contract content for local scripts.
- `task show` remains read-only and does not mutate active task state.
- Task-path validation and JSON error behavior remain unchanged.
- Public docs list `task show` among shareable redaction-capable commands.

## Verification Commands
- `npm test -- tests/task-state.test.ts -t "task show"`
- `npx prettier --check src/cli/commands/task.ts tests/task-state.test.ts docs/cli-reference.md docs/task-contracts.md docs/status.md README.md`
- `git diff --name-only -- package.json pnpm-lock.yaml CHANGELOG.md .github/workflows`
- `npm test -- tests/task-state.test.ts`
- `npm run build`
- `npm run dogfood`

## Post-Verification Gates
- `node dist/cli/index.js handoff --task .agentloop/tasks/2026-06-17-accept-redacted-task-show-output-flag-2.md --write-run --redact-paths`
- `node dist/cli/index.js ship --redact-paths`
- `node dist/cli/index.js prepare-pr --stdout --redact-paths`
- `npm run dogfood:strict`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the scoped edits in `src/cli/commands/task.ts`, `tests/task-state.test.ts`, and public docs. No generated task contracts or user state need migration because the flag only affects display output.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
