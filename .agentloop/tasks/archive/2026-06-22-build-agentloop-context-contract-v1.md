# Build AgentLoop Context Contract v1

- Created date: 2026-06-22
- Task type: feature
- Status: done

## Problem Statement
AgentLoopKit has guard, explain-diff, resume-pack, review-context, and research-task primitives, but users and software agents do not have one explicit context contract surface that quantifies context savings, explains source selection, and teaches agents how to retrieve source truth.

## Desired Outcome
Add a maintainable Context Contract v1 CLI surface that measures context pressure, builds auditable context packs, exposes local source handles, and lays groundwork for research and token-saving workflows without proxy behavior.

## Constraints
- Use TDD: write failing tests before production changes.
- Use existing AgentLoop primitives where possible; avoid a large new subsystem.
- Do not implement silent prompt rewriting, provider traffic interception, telemetry, external services, version bumps, tags, publishing, or release work.
- Keep context estimates clearly labeled as heuristics, not provider tokenizer or billing claims.
- Preserve redaction and do not read secret file contents.

## Non-Goals
- No Headroom-style proxy/wrapper mode.
- No safe reducers beyond wiring receipts/handles unless tests identify a narrow low-risk helper.
- No public claim of real user research from simulated personas.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/
- src/core/
- src/mcp/
- src/templates/
- tests/
- docs/
- README.md
- .agentloop/research/interview-cycle-196.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- CLI exposes `agentloop context budget`, `agentloop context pack`, and `agentloop context show` or an intentionally equivalent scoped v1 surface.
- Context pack output includes included sections, omitted sections, freshness, context-budget estimate, and source retrieval guidance.
- JSON output is suitable for software agents and includes stable source handles.
- Generated agent guidance teaches agents to use context packs before broad reads.
- Docs explain measurable context savings and research boundaries without hard billing claims.
- Focused tests, dogfood, ProjScan, and AgentFlight evidence are recorded.

## Verification Commands
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build
- npm run dogfood

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Pre-existing dirty non-evidence files before task creation: 1 total; examples: `.agentloop/research/interview-cycle-196.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert the context command, tests, docs, and generated guidance changes while keeping archived research evidence if still useful.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
