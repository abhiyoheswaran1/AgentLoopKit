# Add deterministic release notes command

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement
AgentLoopKit can generate PR handoffs, CI summaries, reports, and badges, but maintainers still write release notes by hand after verified local releases.

## Desired Outcome
Add a local deterministic release-notes command that summarizes package version, git range, changelog context, changed files, verification evidence, and npm/GitHub release next steps without calling external APIs.

## Constraints
- No GitHub API, npm API, LLM, telemetry, network calls, or secret reads.
- Do not publish releases or mutate git tags.
- Keep output deterministic and useful when no tags exist.

## Non-Goals
- Do not build a changelog generator, semantic-release replacement, SaaS, or release automation bot.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/release-notes.ts
- src/cli/commands/release-notes.ts
- tests/release-notes.test.ts
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop release-notes prints Markdown release notes from local package, git, task, verification, and changelog evidence.
- agentloop release-notes --json returns machine-readable output.
- agentloop release-notes --write writes .agentloop/handoffs/YYYY-MM-DD-HH-mm-release-notes.md.
- The command handles repos with no previous version tag by using available git context and stating the limitation honestly.

## Verification Commands
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 check:links
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Remove release-notes command, core module, tests, docs, and generated release-note artifacts.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
