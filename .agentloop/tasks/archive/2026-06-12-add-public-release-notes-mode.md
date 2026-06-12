# Add public release notes mode

- Created date: 2026-06-12
- Task type: feature
- Status: done

## Problem Statement
Dogfooding 0.28.6 showed the default release-notes artifact is useful as local evidence but too noisy for a public GitHub release page.

## Desired Outcome
Maintainers can run agentloop release-notes --public to print concise public-facing Markdown while the existing detailed evidence format remains the default.

## Constraints
- Keep the command local-only and deterministic.
- Do not call GitHub, npm, MCP Registry, or external APIs.

## Non-Goals
- Do not change the default detailed release-notes output.
- Do not post release notes to GitHub.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/release-notes.ts
- src/cli/commands/release-notes.ts
- tests/release-notes.test.ts
- docs/cli-reference.md
- docs/release-notes.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- release-notes --public outputs a concise public Markdown format with package, version, user-facing changelog items, verification summary, and install command.
- release-notes --public omits detailed changed-file inventory, working-tree file list, and local AgentLoop evidence sections.
- release-notes --public --json returns the public Markdown and a format indicator.
- Existing release-notes output remains unchanged without --public.

## Verification Commands
- npm test -- tests/release-notes.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Public mode could hide evidence that maintainers still need locally; keep detailed mode as default.

## Rollback Notes
Remove the --public CLI option and public renderer if it causes confusion.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
