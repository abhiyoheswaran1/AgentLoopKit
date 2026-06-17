# Accept redacted run ledger output flag

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
Reviewer-facing run ledger commands are local evidence surfaces, but runs, show-run, and intent reject the common --redact-paths option used by other pasteable AgentLoopKit outputs.

## Desired Outcome
runs, show-run, and intent accept --redact-paths in human and JSON modes while preserving read-only behavior and existing run-ledger semantics.

## Constraints
- Keep the commands read-only and do not mutate run ledger entries.
- Do not change run schema, run IDs, intent matching, exit codes, or JSON shape beyond accepting the option.
- Do not touch release, version, publish, registry, or Marketplace flows.
- Do not add dependencies or hidden network calls.

## Non-Goals
- No release prep, version bump, tag, or publication.
- No broad command-surface redaction sweep beyond the run-ledger family.

## Assumptions
- Run ledger paths are already display-safe; this task primarily aligns option compatibility for reviewer-facing output.

## Likely Files or Areas
- src/cli/commands/runs.ts
- tests/runs.test.ts
- README.md
- docs/cli-reference.md

## Files or Areas Not to Touch
- package.json
- package-lock.json
- .github/workflows

## Acceptance Criteria
- runs --help, show-run --help, and intent --help document --redact-paths.
- runs, show-run, and intent accept --redact-paths in human and JSON output without mutating local evidence.
- Focused run-ledger tests prove the flag behavior and existing run-ledger tests remain green.

## Verification Commands
- npm test -- tests/runs.test.ts
- npm run check:public-docs
- npx prettier --check src/cli/commands/runs.ts tests/runs.test.ts README.md docs/cli-reference.md

## Post-Verification Gates
- npx --no-install tsx src/cli/index.ts ship --redact-paths
- npx --no-install tsx src/cli/index.ts prepare-pr --write --redact-paths
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Public CLI option addition must be documented and tested, but should remain backward-compatible.

## Rollback Notes
Remove the new options, tests, and docs additions for the run-ledger command family.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
