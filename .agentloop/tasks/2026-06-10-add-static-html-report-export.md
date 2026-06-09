# Add static HTML report export

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement

AgentLoopKit has task contracts, verification reports, and handoff summaries, but no single local artifact that turns the current evidence into a shareable review page.

## Desired Outcome

Add a deterministic local static HTML report command that summarizes task, verification, handoff, changed files, and review focus without network calls or LLM usage.

## Constraints

- Keep the feature local-only, deterministic, dependency-light, and safe for npm distribution.
- Do not read environment file contents or execute verification commands from the report command.
- Escape all user-controlled Markdown-derived and git-derived text before rendering HTML.

## Non-Goals

- Do not build a hosted dashboard, browser app, telemetry, login, or database.
- Do not make HTML reports replace Markdown verification or handoff artifacts.

## Assumptions

- A static HTML report improves launch demos and team review without expanding into SaaS.

## Likely Files or Areas

- src/cli/index.ts
- src/cli/commands/report.ts
- src/core/html-report.ts
- tests/html-report.test.ts

## Files or Areas Not to Touch

- .env
- node_modules

## Acceptance Criteria

- agentloop report writes a local .html file under .agentloop/reports by default.
- agentloop report --json prints machine-readable output with the report path.
- The generated HTML includes task context, verification status, changed files, change areas or review focus, and safety copy.
- HTML escaping is covered by Vitest.

## Verification Commands

- npx pnpm@10.12.1 test tests/html-report.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Remove the report command, html-report core module, tests, and related docs updates.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
