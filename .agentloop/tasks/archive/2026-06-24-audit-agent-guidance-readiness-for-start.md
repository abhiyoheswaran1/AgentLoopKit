# Audit agent guidance readiness for Start

- Created date: 2026-06-24
- Task type: feature
- Status: done

## Problem Statement
Existing AgentLoopKit repos can have harness guidance that passes review-readiness checks but does not teach software agents to run agentloop start before broad reads or expand source handles with agentloop context show.

## Desired Outcome
doctor and upgrade-harness identify missing Start/Context guidance, provide copyable snippets, and public docs explain the agent readiness check without changing release state.

## Constraints
- Keep `doctor` and `upgrade-harness` read-only.
- Do not overwrite existing repo guidance from upgrade diagnostics.
- Do not add provider-token billing claims.

## Non-Goals
- No release, version tag, publish, registry upload, or package-version bump.
- No proxying, prompt rewriting, provider traffic interception, telemetry, or external API calls.

## Assumptions
- Generated harness template changes should bump the template generation and migration guidance.

## Likely Files or Areas
- src/core/upgrade-harness.ts
- src/core/doctor.ts
- tests/upgrade-harness.test.ts
- tests/doctor.test.ts
- README.md
- docs/cli-reference.md
- docs/getting-started.md
- docs/upgrading-existing-repos.md
- docs/template-migrations.md
- docs/context.md
- docs/mcp.md
- src/templates/root/AGENTS.md
- src/templates/root/AGENTLOOP.md
- src/templates/root/agentloop-directory-readme.md
- src/templates/harness/commands.md
- src/core/constants.ts
- src/core/context-contract.ts
- src/core/evidence-map.ts
- src/core/evidence.ts
- tests/init.test.ts
- tests/agent-start.test.ts
- tests/context-contract.test.ts
- CHANGELOG.md
- changelog.md
- DECISIONS.md
- docs/superpowers/plans/2026-06-24-agent-guidance-readiness.md
- docs/superpowers/plans/2026-06-24-agentloop-start-truth-consistency.md
- docs/superpowers/specs/2026-06-24-agent-guidance-readiness-design.md
- docs/superpowers/specs/2026-06-24-agentloop-start-truth-consistency-design.md
- AGENTS.md
- AGENTLOOP.md
- .agentloop/README.md
- .agentloop/harness/commands.md
- .agentloop/manifest.json

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- upgrade-harness reports missing agent-start guidance for old harness files
- doctor recommends upgrade-harness when generated guidance lacks Start/Context entrypoint
- copyable guidance includes agentloop start and agentloop context show source-handle expansion
- README and CLI docs explain agent guidance readiness without provider-token billing claims

## Verification Commands
- npm run test:unit -- tests/upgrade-harness.test.ts tests/doctor.test.ts tests/init.test.ts
- npm run typecheck
- npm run check:public-docs
- npm run dogfood

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Touches upgrade diagnostics and public docs for existing repos; keep changes read-only and advisory.
- Pre-existing dirty non-evidence files before task creation: 13 total; examples: `CHANGELOG.md`, `DECISIONS.md`, `README.md`, `docs/cli-reference.md`, `docs/context.md`. Confirm they belong to this task before implementation.
- This task continues the same pre-release batch after the completed Start truth-consistency task, so prior changed Start/Context source, docs, tests, and design evidence are inherited release-scope files.

## Rollback Notes
Revert upgrade-harness topic additions, doctor copy, and docs updates.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
