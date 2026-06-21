# Enforce agent-assisted product language

- Created date: 2026-06-21
- Task type: feature
- Status: done

## Problem Statement
Product positioning should avoid cheap assistant-style automation language. Public docs, generated guidance, CLI descriptions, and tests still contain older assistant and generated-work phrasing instead of the preferred agent-assisted reviewability language.

## Desired Outcome
Public-facing AgentLoopKit language uses agent-assisted engineering/reviewability wording, old assisted-automation phrasing is removed, and public-doc hygiene rejects banned cheap-positioning phrases.

## Constraints
- Do not change command behavior, JSON schemas, readiness scoring, task state behavior, release behavior, dependencies, tags, publishing, or package versions.
- Keep historical evidence truthful where needed, but do not keep banned marketing phrases in current public docs or generated templates.

## Non-Goals
- Do not rebrand the product or rewrite full docs beyond targeted terminology cleanup.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- README.md
- docs/cli-reference.md
- docs/getting-started.md
- docs/mcp.md
- src/cli/commands/maintainer-check.ts
- src/cli/commands/ship.ts
- src/core/ship.ts
- src/core/completions.ts
- src/core/mcp-tools.ts
- src/core/upgrade-harness.ts
- src/templates
- scripts/smoke-packed-release.mjs
- tests/public-docs-hygiene.test.ts
- tests/maintainer-check.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- No repo text contains the old assisted-automation phrase after the cleanup.
- Public docs hygiene fails on cheap assistant-style positioning phrases and passes current docs.
- CLI/help/completion tests are updated for agent-assisted wording without changing behavior.

## Verification Commands
- npm test -- tests/public-docs-hygiene.test.ts tests/maintainer-check.test.ts tests/ship.test.ts tests/completion.test.ts
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
- Pre-existing dirty non-evidence files before task creation: 114 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert terminology, guard, and test changes; no data migration or artifact cleanup required.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
