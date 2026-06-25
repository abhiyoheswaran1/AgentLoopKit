# Prove AgentLoop Start usefulness

- Created date: 2026-06-24
- Task type: feature
- Status: done

## Problem Statement
Start already briefs agents, but users need a measurable first-run proof that shows context avoided, stale proof caught, source handles, setup readiness, and research-to-decision value.

## Desired Outcome
AgentLoopKit exposes a sharper usefulness proof around Start, records repeatable demo evidence, audits agent setup readiness, and documents the workflow without release metadata.

## Constraints
- Keep the work local-first, deterministic, and read-only unless a command already writes AgentLoop evidence.
- Do not add provider proxying, prompt rewriting, telemetry, external research collection, release metadata, tags, or publishing.
- Keep token and context language as planning estimates, not billing or provider-token claims.

## Non-Goals
- No release preparation or version bump.
- No new hosted service, database, or dependency.
- No simulated research presented as real user feedback.

## Assumptions
- Existing `agentloop start`, `agentloop context`, `doctor`, and `upgrade-harness` primitives should be composed and sharpened rather than replaced.
- Public docs should center software-agent repo preflight and measurable local proof.

## Likely Files or Areas
- src/core/agent-start.ts
- src/core/context-contract.ts
- src/core/upgrade-harness.ts
- src/core/doctor.ts
- src/templates/root/AGENTS.md
- src/templates/root/AGENTLOOP.md
- src/templates/agents/*.md
- tests/agent-start.test.ts
- tests/context-contract.test.ts
- tests/doctor.test.ts
- tests/upgrade-harness.test.ts
- README.md
- docs/context.md
- docs/research.md
- docs/real-repo-trials.md
- docs/assets/readme/*
- docs/cli-reference.md
- docs/start-usefulness-demo.md
- docs/superpowers/plans/2026-06-24-agentloop-start-usefulness-proof.md
- src/templates/loops/research.md
- src/templates/root/agentloop-directory-readme.md
- .agentloop/README.md
- .agentloop/loops/research.md

## Files or Areas Not to Touch
- `package.json` version fields
- `server.json` version fields
- `CHANGELOG.md` and `changelog.md` release sections unless a non-release docs note is required
- `.github/workflows/` release publishing behavior
- npm, GitHub Release, GHCR, MCP Registry, or Marketplace publishing state

## Acceptance Criteria
- Start output shows a compact usefulness proof card with measurable impact and next action
- A repeatable demo or trial artifact shows honest context avoided metrics without billing claims
- Agent readiness checks cover Start and context handle guidance
- Research task docs explain evidence-bound research-to-decision flow

## Verification Commands
- npm run test:unit -- tests/agent-start.test.ts tests/context-contract.test.ts tests/doctor.test.ts tests/upgrade-harness.test.ts
- npm run check:public-docs
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
Revert Start usefulness proof, demo trial docs, and agent readiness docs while preserving prior v0.42.0 behavior

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
