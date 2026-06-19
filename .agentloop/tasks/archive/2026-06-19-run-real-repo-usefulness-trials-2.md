# Run real-repo usefulness trials

- Created date: 2026-06-19
- Task type: feature
- Status: done

## Problem Statement
AgentLoopKit has shipped the core local loop, but the next product decision needs local real-repo trial evidence before adding more policy packs, changing GitHub metadata scoring, or expanding release channels.

## Desired Outcome
Real-repo trial notes identify repeated review/onboarding friction, the highest-confidence product fix is implemented with tests, and evidence shows AgentLoopKit remains local-first, safe, and maintainable.

## Constraints
- Use the repo-local product panel, personas, backlog, and latest research files for prioritisation.
- Run trials locally only: no tokens, no GitHub API calls, no posting comments, no telemetry, and no remote service.
- Do not mutate sibling repositories directly; use temporary copies or dry-run flows for trial execution.
- Treat trial notes as internal decision support, not public adoption proof or testimonials.
- Keep the Marketplace and Windows package-manager tasks deferred unless the maintainer explicitly re-approves release-channel work.
- Do not cut a release, bump package versions, create tags, publish packages, or deploy.

## Non-Goals
- Do not add bundled policy packs from one trial.
- Do not make GitHub metadata required.
- Do not let imported GitHub metadata affect `ship` scoring.
- Do not add GitHub posting, token reads, telemetry, hosted services, remote policy services, or automatic release-channel changes.

## Assumptions
- Temporary copies of local sibling repositories are good enough to expose first-run, onboarding, review-evidence, and safety friction without disturbing user work.
- Repeated friction across two or more trial shapes is a stronger product signal than one-off output preference.

## Likely Files or Areas
- .agentloop/research/
- .agentloop/backlog.md
- DECISIONS.md
- docs/superpowers/plans/
- README.md
- docs/getting-started.md
- docs/real-repo-trials.md
- scripts/
- src/
- tests/

## Files or Areas Not to Touch
- package.json version fields
- release tags, GitHub releases, npm, GHCR, MCP Registry, or Marketplace publishing
- sibling repositories outside temporary trial copies

## Acceptance Criteria
- Run at least three local real-repo trials against temporary copies of existing repositories with different repo shapes.
- Record internal trial notes with commands run, useful outputs, confusing outputs, safety observations, and repeated friction.
- Ask/simulate the product panel and user personas against the trial findings, clearly marking the result as internal decision support.
- Pick the highest-confidence product improvement only after trial evidence, and keep it small.
- Implement the chosen improvement with TDD when it changes behavior.
- Run a bug pass immediately after implementation and fix issues found.
- Update backlog/decision evidence if product direction changes.

## Verification Commands
- npx pnpm@10.12.1 vitest run tests/status.test.ts tests/next.test.ts -t "placeholder"
- npm run test:quick
- npm run typecheck
- npm run lint
- npm run build
- npm run check:public-docs
- npm run check:links
- npx --yes projscan doctor --format markdown
- npx --yes agentflight doctor

## Post-Verification Gates
- npx --no-install agentloop ship --redact-paths
- npm run dogfood:strict

## Implementation Plan
- Inspect product panel, personas, roadmap, backlog, latest research, and real-repo trial checklist.
- Select at least three sibling repositories and run AgentLoopKit in temporary copies only.
- Capture trial evidence and synthesize repeated friction through user and team personas.
- Write a focused implementation plan for the selected fix.
- Use TDD for behavior changes, then run targeted and broader verification.
- Record decisions and handoff evidence.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the trial notes, backlog/decision updates, docs, and any focused code/test changes. No external release channel or sibling repository state should need rollback because trials run in temporary copies only.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
