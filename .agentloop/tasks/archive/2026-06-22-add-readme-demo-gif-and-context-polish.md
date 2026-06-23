# Add README demo GIF and public Context Contract polish

- Created date: 2026-06-22
- Task type: docs
- Status: done

## Problem Statement
The Context Contract feature has public docs and an ASCII diagram, but the README still lacks the demo GIF and sharper user-facing proof needed before release.

## Desired Outcome
Add a local demo GIF and tighten README/docs messaging so users and software agents understand the context-pack workflow, measurable heuristic savings, receipts, and source handles before release.

## Constraints
- Do not release, version-bump, tag, publish, or change package metadata.
- Keep token-saving claims framed as transparent heuristic estimates, not provider-tokenizer or billing claims.
- Do not claim simulated research as real user evidence.
- Keep edits focused on public docs, demo assets, and evidence for this polish task.

## Non-Goals
- No new product behavior unless a docs/demo bug requires a narrow fix.
- No external hosted media or telemetry.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- README.md
- docs/context.md
- docs/cli-reference.md
- docs/mcp.md
- docs/assets
- .agentloop/tasks

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- README includes a rendered demo GIF asset near the Context Contract workflow.
- README and context docs explain how to use the context commands, what the savings number means, and how to expand source handles.
- Public docs avoid hard billing claims and obvious AI-marketing slop.
- Docs/link hygiene and relevant tests pass.

## Verification Commands
- npm run check:public-docs
- npm run check:links
- npx pnpm@10.12.1 vitest run tests/public-docs-hygiene.test.ts tests/product-positioning.test.ts tests/cli-docs-drift.test.ts
- npx pnpm@10.12.1 lint
- npm run dogfood

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- This task starts with the unreleased Context Contract dirty set already present; only add docs/demo polish on top.
- Pre-existing dirty non-evidence files before task creation: 23 total; examples: `README.md`, `docs/cli-reference.md`, `docs/mcp.md`, `src/cli/index.ts`, `src/core/completions.ts`. Confirm they belong to this task before implementation.

## Rollback Notes
Remove the demo asset and revert README/docs polish while keeping the Context Contract implementation intact.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
