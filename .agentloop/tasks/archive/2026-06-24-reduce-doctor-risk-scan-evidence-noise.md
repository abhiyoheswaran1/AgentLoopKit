# Reduce Doctor risk-scan evidence noise

- Created date: 2026-06-24
- Task type: bugfix
- Status: done

## Problem Statement
Doctor risk-file scanning currently counts local AgentLoopKit and AgentFlight evidence ledgers as auth/security risk files, which creates noisy warnings in dogfood repos and can obscure the actionable readiness output.

## Desired Outcome
Doctor still reports real auth, security, deployment, lockfile, and package risk files, but ignores local evidence ledgers and generated AgentLoop/AgentFlight session artifacts that are not application code.

## Constraints
- Keep risk scanning bounded and path-based; do not read file contents.
- Preserve real risk warnings for source, workflow, dependency, and lockfile paths.

## Non-Goals
- Do not remove risk-file scanning or lower strict-mode behavior for real risk files.
- Do not mutate AgentLoop or AgentFlight evidence files.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/doctor.ts
- src/cli/commands/doctor.ts
- tests/doctor.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- doctor no longer reports .agentflight evidence/session files or .agentloop run/report/task evidence as auth/security risk files.
- doctor still reports real auth/security/deployment/lockfile/package risk files outside local evidence directories.
- JSON output keeps stable diagnostic fields while reducing false-positive risk examples.
- CLI docs explain that risk scanning ignores local AgentLoopKit/AgentFlight evidence ledgers.

## Verification Commands
- npm run test:unit -- tests/doctor.test.ts
- npm run typecheck
- npm run build
- npm run dogfood
- npm run lint

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Risk scan output is user-facing setup guidance; avoid hiding real app risk files.
- Pre-existing dirty non-evidence files are part of the unreleased batch; keep this task scoped to Doctor risk classification.
- Pre-existing dirty non-evidence files before task creation: 71 total; examples: `.agentloop/README.md`, `.agentloop/agents/claude-code.md`, `.agentloop/agents/codex.md`, `.agentloop/agents/cursor.md`, `.agentloop/agents/gemini-cli.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert doctor risk-scan filter, docs, and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
