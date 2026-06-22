# Build explainable agent work evidence map

- Created date: 2026-06-21
- Task type: feature
- Status: done

## Problem Statement
AgentLoopKit has task contracts, verification, runs, file intent, policies, and handoff evidence, but users still need to mentally correlate those artifacts to understand whether a changed diff is explained, fresh, risky, and ready for review.

## Desired Outcome
Users can run a local deterministic command that maps changed files to task intent, verification freshness, risk/policy context, and exact next actions; existing review surfaces can reuse that map, and agents can generate compact resume packs without cloud services or LLM calls.

## Constraints
- Keep the implementation local-first and deterministic; do not call remote services, read tokens, post comments, publish packages, create tags, or bump versions.
- Use existing Git, task, verification, runs, change-area, redaction, and Markdown rendering helpers where possible instead of duplicating parsers.
- Keep JSON output additive and stable; human copy may improve, but existing command contracts should not regress.
- Run TDD for each behavior slice and run a bug pass after each phase before broadening the scope.
- Treat this as unreleased product work until the maintainer explicitly approves release prep.

## Non-Goals
- No hosted dashboard, database, telemetry, model call, interview automation, or GitHub API access.
- No changes to release workflows, package version, npm publishing, GitHub Marketplace state, GHCR, or MCP Registry publishing.
- No file-content reads for unexplained-file detection beyond existing task/report/run metadata and Git path/status data.

## Assumptions
- The first industry-leading slice should make agent-produced diffs explainable and reviewable rather than adding another agent wrapper.
- The command can start as changed-file/path evidence correlation and should avoid claiming semantic proof of correctness.

## Likely Files or Areas
- src/core
- src/cli/index.ts
- src/cli/commands
- tests
- docs
- README.md
- DECISIONS.md
- ROADMAP.md

## Files or Areas Not to Touch
- package.json
- package-lock.json
- pnpm-lock.yaml
- .github/workflows/publish.yml
- .github/workflows/publish-mcp.yml

## Acceptance Criteria
- A core evidence-map module returns deterministic JSON for changed files, task coverage, verification freshness, risk-sensitive areas, unexplained files, and next actions.
- A human CLI command, named explain-diff unless implementation evidence proves a better name, summarizes reviewability, covered/unexplained files, stale verification, risky areas, and exact next commands.
- Existing review surfaces can reuse the evidence map without changing release behavior or making network calls.
- A resume-pack command can generate compact tool-targeted continuation briefs for Codex, Claude, Cursor, generic agents, and human reviewers using local evidence only.
- Docs explain the feature as agent-assisted engineering evidence, not as an AI coding assistant, semantic code review, or security certification.
- Security, performance, bug, and dogfood passes are run and recorded before handoff.

## Verification Commands
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build
- npm test -- tests/evidence-map.test.ts
- npm test -- tests/cli-explain-diff.test.ts
- npm test -- tests/resume-pack.test.ts
- npm run check:public-docs
- npm run check:links
- git diff --check

## Post-Verification Gates
- npm run maintenance:check
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown
- npx --yes agentflight doctor
- npx --yes agentflight status

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Broad CLI feature may touch shared review/readiness surfaces; keep phases small and preserve existing JSON contracts.
- Evidence correlation can overclaim if phrased poorly; human copy must say covered by local evidence, not proven correct.
- Path redaction and file-content boundaries are security-sensitive; reuse existing redaction and path helpers.

## Rollback Notes
Revert the evidence-map/resume-pack source, tests, docs, and generated AgentLoop evidence for this task; no release artifacts or version metadata should exist to unwind.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
