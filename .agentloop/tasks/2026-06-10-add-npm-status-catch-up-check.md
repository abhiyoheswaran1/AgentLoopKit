# Add npm status catch-up check

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement
Maintainers need a safe command that checks whether npm has caught up to the current local package version without publishing, reading credentials, or changing release metadata.

## Desired Outcome
agentloop npm-status compares package.json with npm registry metadata, prints clear catch-up guidance, supports JSON output, and can fail only when explicitly asked to expect the current version.

## Constraints
- Run npm view only when the user explicitly invokes npm-status without a captured registry JSON file.
- Never publish, tag, read npm tokens, read env files, or change package metadata.
- Keep implementation local-first and dependency-free beyond existing execa.

## Non-Goals
- Do not automate npm publishing.
- Do not create GitHub releases or tags.
- Do not add cloud, telemetry, or a release dashboard.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/npm-status.ts
- src/cli/commands/npm-status.ts
- src/cli/index.ts
- src/core/completions.ts
- tests/npm-status.test.ts
- tests/completion.test.ts
- README.md
- docs/npm-publishing.md
- docs/release-status.md

## Files or Areas Not to Touch
- .github/workflows
- package.json
- CHANGELOG.md

## Acceptance Criteria
- agentloop npm-status reports local package, npm latest, registry versions, status, recommendation, and safety note.
- agentloop npm-status --json returns machine-readable status.
- agentloop npm-status --expect-current exits non-zero when npm latest does not equal the local version.
- Tests prove registry parsing, catch-up detection, strict failure, and completion output.

## Verification Commands
- npx pnpm@10.12.1 test tests/npm-status.test.ts tests/completion.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build
- npx pnpm@10.12.1 check:links
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert npm-status command, core module, tests, docs, and AgentLoop artifacts.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
