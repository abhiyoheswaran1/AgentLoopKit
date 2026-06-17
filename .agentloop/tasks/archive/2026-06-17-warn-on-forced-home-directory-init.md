# Warn on forced home-directory init

- Created date: 2026-06-17
- Task type: bugfix
- Status: done

## Problem Statement
Forced AgentLoopKit init from a user's home directory is allowed with --force, but the successful human and JSON output does not clearly warn that the target is the home folder. Dogfood already showed home-directory init can surprise users even when technically intentional.

## Desired Outcome
agentloop init keeps refusing home-directory targets unless --force is passed, but successful forced init and forced dry-run output include an explicit home-directory warning in human output and additive JSON warning metadata.

## Constraints
- Preserve normal project init behavior.
- Preserve the existing non-force home-directory refusal and next-command guidance.
- Keep JSON additive; do not remove or rename existing InitResult fields.
- No release, version bump, publish, Marketplace, Scoop, WinGet, token, env-file, or network behavior.

## Non-Goals
- Do not make dry-run write files.
- Do not change project detection or generated template contents.
- Do not add prompts or interactive confirmation.

## Assumptions
- Home-directory detection should use the existing realpath-based comparison.

## Likely Files or Areas
- src/core/init.ts
- src/cli/commands/init.ts
- tests/init.test.ts
- docs/cli-reference.md
- docs/getting-started.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Forced init from a home-directory target returns success and includes a home-directory warning in JSON output.
- Forced dry-run from a home-directory target returns success, writes no files, and includes the warning in human output.
- Non-force init and dry-run from a home-directory target still refuse with the existing setup error.
- Normal non-home init output is unchanged except for any additive JSON warning field being absent or empty.

## Verification Commands
- npm test -- tests/init.test.ts -t "home directory"
- npm test -- tests/init.test.ts
- npm run typecheck

## Post-Verification Gates
- npm run dogfood
- npx --yes agentflight verify -- npm test -- tests/init.test.ts
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changing init output can affect smoke tests and docs expectations; keep fields additive and behavior focused.

## Rollback Notes
Revert the init result warning field, CLI rendering, tests, and docs for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
