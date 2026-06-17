# Add built CLI smoke coverage for task-command verification gates

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
verify --task-commands and --post-verification-gates are covered by source tests, but the built CLI smoke flow does not exercise the packaged command path that runs task-contract commands, writes a report, then runs post-verification gates.

## Desired Outcome
The built CLI smoke script proves agentloop verify can run task contract verification commands with --only-task-commands, execute explicit post-verification gates, write a run, and report the expected JSON status through the packaged CLI.

## Constraints
- Keep the fixture commands local to the temporary smoke repository and implemented as small Node scripts.
- Do not run release, publish, network, token, gh, or registry commands.
- Keep changes scoped to built CLI smoke coverage and its guard test.
- Do not change verify behavior, public docs, dependencies, release artifacts, or package versions.

## Non-Goals
- Release prep, Marketplace work, or changing verification semantics.
- Adding new verification flags or task contract fields.

## Assumptions
- Existing verification unit tests remain the authority for edge cases, failure modes, and JSON shape details.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- src/core/verification.ts
- src/cli/commands/verify.ts

## Acceptance Criteria
- A failing guard test is added before implementation to prove the smoke script lacks task-command post-verification gate coverage.
- scripts/smoke-cli.mjs creates local task-command and post-gate scripts inside the temporary smoke repo.
- The smoke flow creates or uses a task contract containing a verification command and post-verification gate, then runs agentloop verify --task ... --task-commands --only-task-commands --post-verification-gates --write-run --json.
- The smoke assertion verifies overallStatus pass, taskCommands requested/found, postVerificationGates requested/found with a passing result, and a written run id.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "CLI smoke script covers task-command post-verification gates"
- npm test -- tests/distribution-artifacts.test.ts
- npm run typecheck
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- npm run dogfood
- npx --yes agentflight verify -- npm test -- tests/distribution-artifacts.test.ts
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Low: smoke script changes add another packaged CLI verification path and can become brittle if JSON field names change intentionally.

## Rollback Notes
Revert the smoke-cli and distribution-artifacts test changes; no persistent runtime state or dependency changes are expected.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
