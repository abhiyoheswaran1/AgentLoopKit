# Implement roadmap adoption channels and policy packs

- Created date: 2026-06-14
- Task type: feature
- Status: done

## Problem Statement
The roadmap still has adoption and ecosystem items after 0.31.0: SchemaStore support, organization policy packs, GitHub metadata import, Windows install polish, and editor integration validation.

## Desired Outcome
Add local-first, tested support and documentation for the remaining roadmap batch without publishing a release until the whole batch is complete.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- SchemaStore support has a generated/catalog-ready entry and docs
- Policy packs can be listed, inspected, and applied safely without overwriting local policies by default
- GitHub PR and issue metadata can be imported from explicit local JSON without tokens, API calls, or network access
- Scoop and WinGet planning assets document a real future path without claiming current availability
- VS Code/Open VSX design validation is updated with concrete decision gates and no premature extension build

## Verification Commands
- npm run test:quick
- npm run lint
- npm run typecheck
- npm run build
- npm run check:public-docs
- npm run check:links
- npm test

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Public docs could overclaim unsupported release channels
- GitHub import must not read tokens, call GitHub APIs, or treat untrusted PR text as commands

## Rollback Notes
Revert this roadmap batch commit and keep 0.31.0 as the latest released version

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
