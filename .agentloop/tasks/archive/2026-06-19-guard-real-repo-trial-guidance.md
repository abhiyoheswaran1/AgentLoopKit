# Guard real-repo trial guidance

- Created date: 2026-06-19
- Task type: tests
- Status: done

## Problem Statement
Real-repo trial guidance is now the roadmap gate before expanding policy packs or GitHub metadata scoring, but the recurring public-doc hygiene does not directly protect the local-first/no-public-proof safety boundaries of that checklist.

## Desired Outcome
Public-doc hygiene catches unsafe or overclaiming real-repo trial guidance, research/backlog records the decision, and no release-channel behavior changes.

## Constraints
- Keep the change local-first and read-only with respect to trial data.
- Do not add new policy packs, GitHub API calls, telemetry, scoring changes, release work, publishing, tags, or version bumps.
- Treat simulated research as internal decision support only.

## Non-Goals
- No release-channel work.
- No `ship` scoring changes.
- No policy-pack behavior changes.
- No GitHub metadata import behavior changes.
- No hosted service, dashboard, telemetry, token reads, or remote policy service.

## Assumptions
- The real-repo trial checklist is now part of public docs and should stay honest through recurring hygiene checks.
- Public-doc hygiene is the narrowest existing guard for preventing unsupported public claims.

## Likely Files or Areas
- `scripts/smoke-packed-release.mjs`
- `tests/public-docs-hygiene.test.ts`
- `.agentloop/research/interview-cycle-122.md`
- `.agentloop/backlog.md`
- `DECISIONS.md`
- `CHANGELOG.md`

## Files or Areas Not to Touch
- `package.json` version or lockfiles
- `.github/workflows/`
- release-channel docs except incidental references already in public-doc hygiene
- policy-pack templates and GitHub metadata import logic

## Acceptance Criteria
- New simulated research cycle records the prioritized decision.
- Public-doc hygiene rejects real-repo trial docs that omit the no-public-proof boundary.
- Public-doc hygiene rejects real-repo trial docs that omit local-only/no-token/no-telemetry boundaries.
- Public-doc hygiene rejects real-repo trial docs that omit missing-metadata-neutral and no-ship-scoring boundaries.

## Verification Commands
- npm test -- tests/public-docs-hygiene.test.ts --reporter=verbose
- npm run check:public-docs
- npm run typecheck
- npm run lint
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the public-doc hygiene helper/test updates and remove the research/backlog entries.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
