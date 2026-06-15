# Strengthen public docs trust hygiene

- Created date: 2026-06-15
- Task type: tests
- Status: done

## Problem Statement
Public docs hygiene catches Homebrew, some internal release chatter, and a few fake adoption claims, but unsupported marketplace/package-manager claims and stronger testimonial language can still slip into README or normal docs.

## Desired Outcome
The public-doc hygiene gate rejects unsupported marketplace/package-manager availability claims and broader fake adoption/testimonial language while still allowing deferred design docs to describe future channels safely.

## Constraints
- Keep the guard read-only.
- Do not add release, publish, tag, upload, token, or env-file behavior.
- Keep public docs user-facing and avoid naming inactive install channels in normal guidance.

## Non-Goals
- No release or package version change.
- No new distribution channel.
- No README marketing rewrite.
- No removal of deferred design docs for future channels.

## Assumptions
- `docs/designs/vscode-open-vsx-extension.md` and `docs/designs/windows-package-managers.md` may discuss deferred channels when they frame them as future validation gates.
- Normal README, docs, examples, and GitHub templates should not claim unsupported channel availability or fake adoption proof.

## Likely Files or Areas
- `scripts/smoke-packed-release.mjs`
- `tests/public-docs-hygiene.test.ts`
- `docs/maintenance-guards.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch
- `package.json` version
- `CHANGELOG.md`
- GitHub release workflows
- npm publish metadata

## Acceptance Criteria
- Public docs hygiene rejects claims such as trusted by thousands, used by production teams, case studies show, testimonials, VS Code Marketplace availability, Open VSX availability, Scoop install, and WinGet install in normal public docs.
- Deferred design docs can continue to discuss VS Code/Open VSX/Scoop/WinGet as future or non-goal channels without tripping availability-claim checks.
- The check remains read-only and does not publish, tag, upload, read tokens, read env contents, or mutate docs.

## Verification Commands
- npm test -- tests/public-docs-hygiene.test.ts
- npm run check:public-docs
- npm run typecheck
- npm run lint

## Post-Verification Gates
- npx --yes agentflight verify -- npm test -- tests/public-docs-hygiene.test.ts
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Over-broad patterns could block legitimate deferred design docs.
- Over-narrow patterns could let unsupported availability claims leak into README or npm docs.
- Public docs should not repeat the exact blocked marketing phrases just to explain the guard.

## Rollback Notes
- Revert the changes to `scripts/smoke-packed-release.mjs`, `tests/public-docs-hygiene.test.ts`, and `docs/maintenance-guards.md`.
- Rerun `npm test -- tests/public-docs-hygiene.test.ts` and `npm run check:public-docs` after rollback.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
