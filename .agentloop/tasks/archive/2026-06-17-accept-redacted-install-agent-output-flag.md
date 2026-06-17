# Accept redacted install-agent output flag

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
install-agent writes repo-local agent instruction files and reports absolute local paths in human and JSON output, but it does not accept --redact-paths before users paste setup output into public logs.

## Desired Outcome
install-agent accepts --redact-paths in human and JSON modes, redacts local absolute roots in output only, and preserves the real file write locations and default output.

## Constraints
- Keep install-agent file writes, path validation, unsupported-agent behavior, and default output unchanged.
- Use existing redaction helpers and Markdown-safe inline formatting patterns.
- Do not add network calls, telemetry, secret reads, release actions, or broad scans.

## Non-Goals
- Do not change generated agent instruction file contents or AGENTS.md template blocks.
- Do not add force-overwrite behavior or new agent types.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/install-agent.ts
- tests/agent-installation.test.ts
- README.md
- docs/cli-reference.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- install-agent --help documents --redact-paths.
- install-agent <agent> --redact-paths redacts the local root in human output while writing files to the real repo paths.
- install-agent <agent> --json --redact-paths and install-agent all --json --redact-paths redact path fields in JSON output while default JSON remains raw.
- Unsupported agent errors remain parseable and do not write files.

## Verification Commands
- npm test -- tests/agent-installation.test.ts
- npm run check:public-docs
- npx prettier --check src/cli/commands/install-agent.ts tests/agent-installation.test.ts README.md docs/cli-reference.md

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Presentation-only redaction must not change actual output paths or generated files.

## Rollback Notes
Remove the install-agent --redact-paths option, output redaction, tests, and docs additions.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
