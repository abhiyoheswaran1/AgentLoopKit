# Add built CLI smoke coverage for release-notes redaction

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Source tests cover agentloop release-notes --redact-paths, but the built CLI smoke script does not exercise release-notes redaction after packaging/build, leaving a distribution-level regression gap for shareable release-note evidence.

## Desired Outcome
The built CLI smoke script runs release-notes --write --json --redact-paths in the temporary smoke repository, verifies JSON and written Markdown redact the local root, and the distribution guard test locks that smoke coverage.

## Constraints
- Keep changes scoped to built smoke coverage and its guard test.
- Do not create tags, publish packages, cut releases, call registries, call GitHub APIs, upload files, read tokens, or change package versions.
- Preserve existing release-notes behavior and JSON shape; only add smoke assertions for the implemented path.
- Use TDD: add a focused failing distribution guard before editing the smoke script.

## Non-Goals
- Do not modify release-note generation semantics, changelog parsing, git ref behavior, output-path validation, or docs beyond what the smoke guard requires.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md

## Acceptance Criteria
- tests/distribution-artifacts.test.ts contains a focused guard proving scripts/smoke-cli.mjs covers release-notes redaction.
- scripts/smoke-cli.mjs runs release-notes --write --out <absolute smoke path> --json --redact-paths and asserts writtenPath, packageName, Markdown, and written file content use [git-root] instead of the absolute smoke repo path.
- node scripts/smoke-cli.mjs prints Release-notes redaction smoke passed.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "release-notes redaction"
- npm test -- tests/distribution-artifacts.test.ts
- npx prettier --check scripts/smoke-cli.mjs tests/distribution-artifacts.test.ts
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- npm run dogfood:strict
- npm run maintenance:check

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release-notes is release-adjacent; this task must remain local smoke coverage and avoid release mutation.

## Rollback Notes
Remove the release-notes redaction block from scripts/smoke-cli.mjs and the focused guard from tests/distribution-artifacts.test.ts.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
