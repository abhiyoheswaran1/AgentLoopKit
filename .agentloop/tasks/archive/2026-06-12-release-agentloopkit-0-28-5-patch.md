# Release AgentLoopKit 0.28.5 patch

- Created date: 2026-06-12
- Task type: release
- Status: done

## Problem Statement
The safer release-check publish guidance is committed after 0.28.4 and needs a small trusted-publishing patch release.

## Desired Outcome
Release 0.28.5 with synchronized package, changelog, MCP server metadata, verification evidence, GitHub release, and npm published package smoke evidence.

## Constraints
- None recorded yet.

## Non-Goals
- Do not add new product features in this release task
- Do not publish manually from this shell
- Do not change Homebrew or other distribution channels

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- pnpm-lock.yaml
- server.json
- CHANGELOG.md
- ROADMAP.md
- FINAL_HANDOFF.md
- .agentloop/dogfood-log.md
- .agentloop/tasks/

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- package.json and server.json declare 0.28.5, with no package-lock metadata expected in this pnpm repo
- CHANGELOG.md moves the unreleased release-check guidance note under 0.28.5
- release gate, dogfood strict, ProjScan, pack, and published-package smoke pass

## Verification Commands
- npm run lint
- npm run typecheck
- npm test
- npm run check:links
- node scripts/prepublish-check.mjs
- npm run build
- npm run smoke:release
- node scripts/smoke-cli.mjs
- npx --yes projscan doctor --format markdown
- npm publish --access public --dry-run
- npm pack --pack-destination /tmp --silent

## Post-Verification Gates
- npm run dogfood:strict
- node dist/cli/index.js release-check --strict
- After publish: node dist/cli/index.js npm-status --agentloopkit --expect-current --json
- After publish: npm run smoke:published -- --version 0.28.5

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release metadata drift can publish mismatched npm or MCP registry metadata
- Publishing should happen only through the trusted GitHub release workflow

## Rollback Notes
Ship a 0.28.6 patch if 0.28.5 has a release-blocking defect

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
