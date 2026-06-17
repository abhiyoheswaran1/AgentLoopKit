# Add built CLI smoke coverage for task show redaction

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
agentloop task show now accepts --redact-paths, but the built CLI smoke script does not prove packaged task-show redaction in human and JSON modes. This leaves a small distribution-safety gap for the shareable task-contract workflow.

## Desired Outcome
The built CLI smoke script exercises task show --redact-paths and task show --json --redact-paths against a task body containing the local smoke repo root, asserts the root is replaced with [git-root], and distribution-artifacts tests guard the smoke coverage without release, version, or publishing changes.

## Constraints
- Keep this as smoke-test hardening only; do not change `task show` runtime behavior unless the smoke pass exposes a bug.
- Use the existing smoke fixture repo and built CLI script patterns.
- Do not add network calls, publishing, release prep, package version changes, lockfile changes, or workflow changes.

## Non-Goals
- Adding another redaction command surface.
- Refactoring the full smoke script.
- Changing task parsing, task state, or redaction semantics.
- Cutting or preparing a release.

## Assumptions
- The source-level `task show --redact-paths` behavior is already covered by `tests/task-state.test.ts`.
- Built CLI smoke coverage should prove the packaged command accepts the flag and redacts local smoke-repo roots in task contract content.

## Likely Files or Areas
- `scripts/smoke-cli.mjs`
- `tests/distribution-artifacts.test.ts`

## Files or Areas Not to Touch
- `package.json`
- `pnpm-lock.yaml`
- `CHANGELOG.md`
- `.github/workflows/`
- Release, registry, Marketplace, GHCR, or MCP publishing files

## Acceptance Criteria
- `scripts/smoke-cli.mjs` creates or updates a smoke task body containing the absolute smoke repo root.
- The built smoke script runs human `task show <task> --redact-paths` and asserts `[git-root]` appears while the absolute smoke repo path does not.
- The built smoke script runs JSON `task show <task> --json --redact-paths` and asserts `task.content` is redacted while the JSON payload does not leak the absolute smoke repo path.
- The smoke script preserves existing task-list and task-doctor smoke behavior.
- `tests/distribution-artifacts.test.ts` guards the new built smoke coverage.

## Verification Commands
- `npm test -- tests/distribution-artifacts.test.ts -t "task show redaction"`
- `npx prettier --check scripts/smoke-cli.mjs tests/distribution-artifacts.test.ts`
- `git diff --name-only -- package.json pnpm-lock.yaml CHANGELOG.md .github/workflows`
- `npm run build`
- `node scripts/smoke-cli.mjs`
- `npm test -- tests/distribution-artifacts.test.ts`

## Post-Verification Gates
- `npm run dogfood:strict`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the smoke-script and distribution-artifact test edits. No user data or task-state migration is required because this task only adds local smoke assertions.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
