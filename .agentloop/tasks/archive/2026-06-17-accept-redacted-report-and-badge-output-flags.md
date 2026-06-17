# Accept redacted report and badge output flags

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
report and badge are local reviewer evidence commands, but they do not accept --redact-paths and can print absolute local output/source paths when users copy command output into public logs.

## Desired Outcome
report and badge accept --redact-paths in human and JSON modes, redact local roots in returned paths and human confirmations, and keep the real write locations unchanged.

## Constraints
- Keep report and badge local-only; do not add network calls, telemetry, token reads, or release behavior.
- Do not change HTML report contents, SVG badge contents, artifact discovery, output-path validation, or default write paths.
- Default output and JSON must remain backward-compatible unless --redact-paths is passed.
- Do not touch release, version, publish, registry, Marketplace, Scoop, or WinGet flows.

## Non-Goals
- No release prep, version bump, tag, or publication.
- No report content redaction beyond CLI/JSON path fields and human confirmation output.
- No badge SVG content changes.

## Assumptions
- The real artifact write path must stay raw on disk; redaction is presentation-only.

## Likely Files or Areas
- src/cli/commands/report.ts
- src/cli/commands/badge.ts
- tests/html-report.test.ts
- tests/badge.test.ts
- README.md
- docs/cli-reference.md
- docs/html-reports.md

## Files or Areas Not to Touch
- package.json
- package-lock.json
- .github/workflows

## Acceptance Criteria
- report --help and badge --help document --redact-paths.
- report --json --redact-paths and badge --json --redact-paths redact the local repo root in output path fields while still writing to the requested raw path.
- human report and badge output redact local roots when --redact-paths is passed.

## Verification Commands
- npm test -- tests/html-report.test.ts tests/badge.test.ts
- npm run check:public-docs
- npx prettier --check src/cli/commands/report.ts src/cli/commands/badge.ts tests/html-report.test.ts tests/badge.test.ts README.md docs/cli-reference.md docs/html-reports.md

## Post-Verification Gates
- npx --no-install tsx src/cli/index.ts ship --redact-paths
- npx --no-install tsx src/cli/index.ts prepare-pr --write --redact-paths
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Presentation-only path redaction must not misreport where artifacts were written or break scripts that omit the flag.

## Rollback Notes
Remove the report/badge redact-paths options, output redaction, tests, and docs additions.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
