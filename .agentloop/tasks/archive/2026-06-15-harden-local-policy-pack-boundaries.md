# Harden local policy pack boundaries

- Created date: 2026-06-15
- Task type: security-review
- Status: done

## Problem Statement
Local policy packs are intended to stay inside the repository, but policy files listed by a valid local pack manifest could be symlinked to files outside the pack's `policies/` directory and still be read.

## Desired Outcome
Policy pack listing, reading, and applying reject local pack policy files that resolve outside the pack's `policies/` directory or repository, preserving the local-only policy-pack boundary.

## Constraints
- Keep policy packs local and file-based.
- Do not add remote policy fetching, policy enforcement, overwrite behavior, or network calls.
- Check filesystem boundaries before reading policy contents.

## Non-Goals
- No release, package version change, or publish workflow change.
- No new bundled policy pack.
- No organization governance engine.
- No remote policy pack registry.

## Assumptions
- `resolvesInsidePath` resolves existing symlinks through the filesystem before comparing path boundaries.
- Existing bundled packs and ordinary repo-local packs should keep working.

## Likely Files or Areas
- src/core/policy-packs.ts
- tests/policy-packs.test.ts
- docs/policies.md
- docs/policy-examples.md
- .agentloop/backlog.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- `package.json` version
- GitHub release workflows
- npm publish metadata
- Policy-pack overwrite behavior

## Acceptance Criteria
- Configured local policy pack paths are checked after filesystem resolution before manifest or policy contents are read.
- Local pack policy files that resolve outside the pack policies directory or repository are rejected before policy contents are read.
- Bundled packs and normal repo-local packs still work.
- No remote fetch, policy enforcement engine, overwrite flag, release, publish, tag, token read, env-file read, or package version change is added.

## Verification Commands
- npm test -- tests/policy-packs.test.ts
- npm run typecheck
- npm run lint
- npm run check:public-docs
- npm run check:links

## Post-Verification Gates
- npx --yes agentflight verify -- npm test -- tests/policy-packs.test.ts
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Over-broad path checks could break bundled packs or normal repo-local packs.
- Over-narrow path checks could still allow symlinked policy files to read outside content.
- Keep machine-readable policy-pack output shape stable.

## Rollback Notes
- Revert `src/core/policy-packs.ts` and the policy-pack symlink test.
- Rerun `npm test -- tests/policy-packs.test.ts` after rollback.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
