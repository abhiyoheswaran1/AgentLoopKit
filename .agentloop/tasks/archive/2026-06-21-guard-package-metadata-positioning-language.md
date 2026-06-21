# Guard package metadata positioning language

- Created date: 2026-06-21
- Task type: tests
- Status: done

## Problem Statement
Package metadata is a public discovery surface, but the unsupported-positioning guard currently protects docs and harness files rather than package.json description and keywords.

## Desired Outcome
Package metadata tests fail on unsupported assistant-style positioning in package description or keywords and pass for current software-agent and agent-assisted wording.

## Constraints
- Do not change package version, release behavior, publish scripts, dependencies, command behavior, JSON schemas, readiness scoring, task state behavior, tags, or publishing.

## Non-Goals
- Do not rewrite package metadata beyond what the guard requires.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- tests/package-metadata.test.ts
- scripts/smoke-packed-release.mjs
- tests/public-docs-hygiene.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Package metadata tests reject unsupported positioning phrases in description and keywords.
- Current package metadata uses software-agent and agent-assisted engineering wording without banned cheap-positioning terms.
- The public docs positioning guard remains unchanged or is reused without widening public-doc scope unexpectedly.

## Verification Commands
- npm test -- tests/package-metadata.test.ts tests/public-docs-hygiene.test.ts
- npm run typecheck
- npm run check:public-docs
- npm run check:links
- npx --no-install tsx src/cli/index.ts task doctor --redact-paths
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Pre-existing dirty non-evidence files before task creation: 137 total; examples: `.agentloop/README.md`, `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert the package metadata test guard and any package metadata wording edits; no migration or artifact cleanup required.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
