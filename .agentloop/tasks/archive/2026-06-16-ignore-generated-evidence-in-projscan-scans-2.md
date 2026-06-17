# Ignore generated evidence in ProjScan scans

- Created date: 2026-06-16
- Task type: feature
- Status: done

## Problem Statement
ProjScan dogfood scans currently count thousands of generated AgentLoop and AgentFlight evidence files, which makes repository structure output noisy and hides the source/docs/tests signal agents need during implementation.

## Desired Outcome
Repo-local ProjScan config ignores generated evidence directories while preserving AgentLoop harness, policy, backlog, current task, source, docs, and test files for repo-risk context.

## Constraints
- Keep AgentLoop harness, policies, backlog, and current task contracts visible to ProjScan.
- Do not ignore all .agentloop content.

## Non-Goals
- No ProjScan package changes.
- No release, version, publish, or dependency changes.

## Assumptions
- ProjScan top-level `ignore` replaces its default ignore list, so this repo config must include the default noise patterns plus the generated-evidence patterns.

## Likely Files or Areas
- `.projscanrc.json`
- `.agentloop/harness/autonomous-dogfooding.md`
- `tests/autonomous-dogfood.test.ts`

## Files or Areas Not to Touch
- ProjScan package source or npm dependency metadata.
- Release-channel docs, package versions, tags, or publish workflows.

## Acceptance Criteria
- .projscanrc.json ignores generated AgentLoop and AgentFlight evidence directories while preserving source and harness visibility.
- Focused tests lock the ProjScan ignore config.

## Verification Commands
- npm test -- tests/autonomous-dogfood.test.ts

## Post-Verification Gates
- npx --yes agentflight verify -- npm test -- tests/autonomous-dogfood.test.ts
- npx --yes projscan doctor --format markdown
- npx --yes agentflight doctor

## Implementation Plan
- Add a focused failing test for `.projscanrc.json` ignore behavior.
- Add repo-local ProjScan config with default ignore patterns plus generated AgentLoop/AgentFlight evidence paths.
- Document why only generated evidence paths are ignored.
- Verify focused tests and dogfood companion checks.

## Risk Notes
- Low-risk local config/docs/test change. Main risk is hiding useful AgentLoop context from ProjScan, so avoid broad `.agentloop/**` and `.agentflight/**` ignores.

## Rollback Notes
Remove `.projscanrc.json` and revert the harness/test documentation changes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
