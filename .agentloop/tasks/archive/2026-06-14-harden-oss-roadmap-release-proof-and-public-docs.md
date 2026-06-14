# Harden OSS roadmap release proof and public docs

- Created date: 2026-06-14
- Task type: feature
- Status: done

## Problem Statement
The near-term OSS roadmap has live release channels, policy packs, SchemaStore support, and optional GitHub metadata, but maintainers still need a single local proof report and stronger public-doc guardrails so release evidence stays trustworthy without adding cloud features.

## Desired Outcome
AgentLoopKit gains a read-only release-proof flow, clearer user-facing docs, stronger hygiene checks, and documented simulated research decisions while keeping the package local-first and npm-ready.

## Constraints
- Do not add Pro, SaaS, login, billing, telemetry, AI API calls, or destructive automation.
- Do not cut a release until the user explicitly approves.
- Release proof must not publish, tag, upload, read npm tokens, read .env contents, or require credentials.

## Non-Goals
- Do not implement VS Code/Open VSX, Scoop, WinGet, or Homebrew work in this batch.
- Do not make GitHub metadata mandatory or token-based.
- Do not expand policy packs into a project-management system.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/index.ts
- src/cli/commands
- src/core
- tests
- scripts/public-docs-hygiene.mjs
- docs
- README.md
- .agentloop/research

## Files or Areas Not to Touch
- .env
- node_modules

## Acceptance Criteria
- A read-only release-proof helper reports local version, git tag/release evidence, npm status, GHCR proof, MCP proof, and gaps with JSON and Markdown-friendly output.
- Public docs hygiene catches internal release chatter, unsupported channel promises, fake adoption/testimonial language, and premature Pro/SaaS claims.
- SchemaStore, GitHub metadata, and policy-pack docs remain user-facing, optional, read-only, and bounded.
- A simulated product research cycle and backlog update record the decisions without being used as public user evidence.
- Bug/security pass runs after implementation and any failures are fixed before completion.

## Verification Commands
- npm run test:unit
- npm run test:integration
- npm run check:public-docs
- npm run check:links
- npm run build

## Post-Verification Gates
- npm run dogfood:strict
- node dist/cli/index.js ship --redact-paths
- node dist/cli/index.js prepare-pr --stdout --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release-proof may call public registries; keep this explicit, timeout-bounded, and credential-free.
- Public docs hygiene must avoid blocking legitimate release notes or internal-only AgentLoop artifacts.

## Rollback Notes
Remove the release-proof command, tests, docs, and hygiene additions; keep existing release-check/npm-status behavior unchanged.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
