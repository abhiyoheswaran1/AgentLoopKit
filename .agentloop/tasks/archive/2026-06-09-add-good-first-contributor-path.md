# Add good first contributor path

- Created date: 2026-06-09
- Task type: docs
- Status: done

## Problem Statement
AgentLoopKit has issue and PR templates, but a new contributor still has to infer which work is safe for a first contribution.

## Desired Outcome
Add a lightweight contributor path that helps maintainers label approachable work and helps new contributors choose safe, reviewable changes.

## Constraints
- Keep the change repo-only.
- Do not alter runtime code, package metadata, or npm release contents.
- Do not require a label-sync service.
- Keep public prose honest. Do not imply real contributor adoption.

## Non-Goals
- No hosted contributor dashboard.
- No GitHub bot.
- No automated issue triage.

## Assumptions
- Maintainers can apply labels manually or import the label map with a future tool.

## Likely Files or Areas
- `.github/ISSUE_TEMPLATE/`
- `.github/labels.yml`
- `CONTRIBUTING.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`
- `.agentloop/research/`

## Files or Areas Not to Touch
- `src/`
- `package.json`
- `dist/`
- `README.md`

## Acceptance Criteria
- Add a good-first issue template for maintainer-authored starter issues.
- Add a practical label map for repo setup.
- Update contributor docs with a first-contribution path.
- Update internal product-panel, backlog, and dogfood records.

## Verification Commands
- `git diff --check`
- `npx pnpm@10.12.1 lint`
- `npx pnpm@10.12.1 typecheck`
- `npx pnpm@10.12.1 test`
- `npx pnpm@10.12.1 build`
- `npx projscan doctor --format markdown`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert this task's docs and GitHub template files. No runtime rollback is required.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
