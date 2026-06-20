# Make doctor pre-init safe for copy-paste trials

- Created date: 2026-06-20
- Task type: feature
- Status: done

## Problem Statement
Real-repo trials showed that agentloop doctor gives useful pre-init guidance, but its non-zero exit before initialization can stop copy-paste trial scripts before users see the rest of the loop.

## Desired Outcome
AgentLoopKit exposes a local, explicit way to run doctor as an advisory preflight during onboarding/trials without weakening strict doctor checks, and the decision is backed by internal persona research and verification evidence.

## Constraints
- Use product-panel, personas, backlog, and latest research as internal decision support only
- Keep the change local-only, token-free, telemetry-free, and non-mutating unless the user runs existing explicit commands
- Do not change default strict doctor exit semantics unless tests prove the product benefit and compatibility tradeoff
- Do not cut a release, bump versions, tag, publish, or change release channels

## Non-Goals
- Do not add remote services, GitHub API calls, token reads, posting, telemetry, policy-pack expansion, or scoring changes
- Do not mutate sibling repositories

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/doctor.ts
- src/core/doctor.ts
- tests/doctor.test.ts
- docs/real-repo-trials.md
- README.md
- .agentloop/research/

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Internal simulated research records the selected refinement and non-decisions
- The selected doctor/onboarding refinement is implemented with red-green tests when behavior changes
- Default strict doctor behavior remains compatible, or any changed default is explicitly documented and tested
- Real-repo trial guidance shows the safer copy-paste command path

## Verification Commands
- npx pnpm@10.12.1 vitest run tests/doctor.test.ts
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
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the doctor CLI/core/test/doc changes plus the internal research, backlog, decision, and plan files. No external channel rollback is needed because the task does not release or publish.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
