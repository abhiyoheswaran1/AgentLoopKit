# Release AgentLoopKit 0.43.0

- Created date: 2026-06-25
- Task type: release
- Status: in-progress

## Problem Statement
The unreleased Start, Context, Guard, Doctor, MCP, run-ledger, docs, and hardening work is approved for public release.

## Desired Outcome
AgentLoopKit 0.43.0 is versioned, verified, committed, tagged, pushed, published through usual channels, and backed by release proof.

## Constraints
- Do not include parked release-channel tasks that still need maintainer approval.
- Keep public docs factual and avoid claiming unreleased or unverified channels.

## Non-Goals
- Do not implement new product features during release prep.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- package-lock.json
- CHANGELOG.md
- changelog.md
- README.md
- docs
- .agentloop

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Version and changelog reflect 0.43.0.
- Public docs hygiene, links, tests, typecheck, lint, build, dogfood, ship, prepare-pr, and release checks pass.
- Main and v0.43.0 tag are pushed.
- npm, GitHub Release, GHCR, GitHub Marketplace, and MCP release proof are checked or documented with exact status.

## Verification Commands
- npm run maintenance:check
- npm test
- npm run typecheck
- npm run lint
- npm run build
- agentloop release-check --redact-paths

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release work publishes public artifacts; verify package contents and registry state before claims.
- GitHub Marketplace publication may still require owner-side approval; report exact proof status.

## Rollback Notes
If a channel fails after tag push, prefer a patch release for code defects; for a bad package publish, deprecate/yank only with maintainer approval.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
