# Add local evidence badges

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement

AgentLoopKit can write Markdown reports and a local HTML evidence page, but it cannot produce a small local badge artifact that CI or README-like docs can display without using a remote badge service.

## Desired Outcome

Add a deterministic agentloop badge command that writes local SVG badges from existing verification or gate evidence.

## Constraints

- Keep badges local-only, deterministic, dependency-free, and safe for npm distribution.
- Do not run configured project verification commands from the badge command.
- Escape badge label and message text before writing SVG.

## Non-Goals

- Do not add hosted badge endpoints, telemetry, browser UI, dashboard, or external image services.
- Do not make badges authoritative proof beyond the underlying verification or gate evidence.

## Assumptions

- Local SVG badges improve CI artifacts, README demos, and quick review without expanding product scope.

## Likely Files or Areas

- src/core/badge.ts
- src/cli/commands/badge.ts
- src/cli/index.ts
- src/core/completions.ts
- tests/badge.test.ts

## Files or Areas Not to Touch

- .env
- node_modules

## Acceptance Criteria

- agentloop badge writes a verification SVG badge under .agentloop/reports by default.
- agentloop badge --source gates writes a gate-status SVG badge without running project verification commands.
- agentloop badge --json prints the written path, source, status, label, and message without embedding large file contents.
- SVG escaping and status color mapping are covered by Vitest.

## Verification Commands

- npx pnpm@10.12.1 test tests/badge.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Remove badge command, badge core module, tests, and docs/template updates.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
