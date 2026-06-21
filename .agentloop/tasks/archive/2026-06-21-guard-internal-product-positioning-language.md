# Guard internal product positioning language

- Created date: 2026-06-21
- Task type: docs
- Status: done

## Problem Statement
Internal product direction files still contain cheap AI/coding-agent style wording even though current product positioning should use agent-assisted engineering language.

## Desired Outcome
Internal product panel and persona files use agent-assisted engineering wording, and a focused regression test prevents unsupported positioning phrases from returning in live product-direction files.

## Constraints
- Do not edit archived task evidence, release notes, version metadata, dependencies, tags, publishing, or public release channels.
- Keep the guard scoped to live internal product-direction files, not all historical AgentLoop evidence.

## Non-Goals
- Do not rewrite archived task contracts or old research artifacts.
- Do not change CLI behavior or public docs semantics.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- .agentloop/product-panel.md
- .agentloop/user-personas.md
- tests/product-positioning.test.ts
- package.json
- tests/package-scripts.test.ts
- CHANGELOG.md
- DECISIONS.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Live internal product-direction files avoid unsupported AI/coding-agent style positioning and use agent-assisted engineering language instead.
- A focused test fails when unsupported positioning appears in .agentloop/product-panel.md, .agentloop/user-personas.md, or .agentloop/backlog.md.

## Verification Commands
- npm test -- tests/product-positioning.test.ts tests/package-scripts.test.ts
- npm run typecheck
- npm run check:public-docs
- npx --no-install tsx src/cli/index.ts task doctor --redact-paths
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Avoid editing archived evidence because old task contracts are historical records.
- Pre-existing dirty non-evidence files before task creation: 147 total; examples: `.agentloop/README.md`, `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Remove the focused product-positioning test and restore the prior internal wording if the guard proves too broad.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
