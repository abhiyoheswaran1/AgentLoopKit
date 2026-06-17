# Prepare AgentLoopKit 0.36.1 patch release

- Created date: 2026-06-17
- Task type: release
- Status: done

## Problem Statement
AgentLoopKit v0.36.0 is public, but `main` contains verified post-release fixes and documentation/template improvements that are not in that release. The maintainer explicitly approved a patch release for v0.36.1.

## Desired Outcome
Prepare, verify, publish, and prove AgentLoopKit v0.36.1 from the current `main` branch. The release should include the post-v0.36.0 path redaction fixes, Windows smoke fixture/report normalization, status help copy clarification, and AgentFlight recovery guidance mirrored into generated agent templates.

## Constraints
- Release exactly v0.36.1; do not cut another release today without a new maintainer approval.
- Keep GitHub Marketplace publication deferred unless the public listing verifies from current output.
- Do not change dependencies unless release verification identifies a concrete blocker.
- Do not claim npm, GitHub Release, GHCR, MCP Registry, or Marketplace availability without fresh proof.
- Preserve unrelated local work and avoid destructive git or filesystem commands.

## Non-Goals
- No new feature implementation beyond release metadata and proof documentation.
- No GitHub Marketplace publication attempt or claim.
- No version beyond v0.36.1.

## Assumptions
- The latest `main` commit is the intended patch-release source.
- Existing release automation remains the source of truth for npm, GitHub Release, GHCR, and MCP Registry publishing.

## Likely Files or Areas
- `package.json`
- `server.json`
- `CHANGELOG.md`
- `docs/release-status.md`
- `docs/npm-publishing.md`
- `docs/launch-checklist.md`
- `FINAL_HANDOFF.md`
- `.agentloop/reports/`
- `.agentloop/handoffs/`
- `.agentloop/runs/`

## Files or Areas Not to Touch
- Dependency lockfiles unless verification requires it.
- Marketplace listing assets or owner-side Marketplace publication settings.
- Unrelated deferred task contracts.

## Acceptance Criteria
- `package.json` and `server.json` report version `0.36.1`.
- Changelog contains a dated v0.36.1 section with the patch fixes and no unreleased release blockers.
- Release prep verification passes before publishing.
- v0.36.1 is tagged and published through the usual release channels.
- Post-release proof records npm, GitHub Release, GHCR, and MCP Registry status, plus explicit Marketplace deferred/unknown status if it remains unverified.
- Release proof docs and AgentLoop evidence are committed and pushed.

## Verification Commands
- `npm run release-flow`
- `npm run maintenance:check`
- `npx --yes projscan doctor --format markdown`
- `npx --no-install agentloop npm-status --agentloopkit --expect-current`
- `npm run smoke:published -- --version 0.36.1`

## Post-Verification Gates
- `npx --no-install agentloop ship --redact-paths`
- `npx --no-install agentloop check-gates --strict --redact-paths`
- `npx --no-install agentloop release-proof --redact-paths`

## Implementation Plan
- Inspect release metadata, changelog, public docs, previous v0.36.0 proof, and release workflow scripts.
- Update patch-release metadata and changelog for v0.36.1.
- Run release prep verification and fix any concrete blockers.
- Commit release prep, tag v0.36.1, push, and publish through the configured GitHub release flow.
- Wait for release workflows, run registry/channel proof, and perform a published smoke install.
- Update release proof docs, run final gates, commit/push evidence, and close/archive this task.

## Risk Notes
- Release automation touches public registries; verify each channel from fresh command output.
- npm/GHCR/MCP propagation may lag; wait or record exact observed status.
- Marketplace availability is owner-side and should remain deferred unless verified.

## Rollback Notes
If v0.36.1 publishes with a critical regression, patch forward with v0.36.2 after maintainer approval. If publication partially fails before public availability, delete or supersede the draft GitHub Release/tag only after confirming no package was published.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
