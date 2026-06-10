# Plan release channels roadmap

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
AgentLoopKit is now published on npm and has trusted publishing configured, but future distribution channels need to be captured as explicit deferred work instead of scattered chat decisions.

## Desired Outcome
Release channels are documented, backlog items are prioritised, and future agents can pick up npm automation, Homebrew, Docker/GHCR, GitHub Action, MCP Registry, VS Code/Open VSX, Scoop, and WinGet work later.

## Constraints
- Keep npm/npx as the primary channel.
- Do not build SaaS, telemetry, login, billing, or cloud backend.
- Treat MCP Registry as blocked until AgentLoopKit has a real MCP server.

## Non-Goals
- Implement every release channel in this task.
- Publish another npm or GitHub release from this task.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- .agentloop/backlog.md
- ROADMAP.md
- docs/distribution-channels.md
- docs/release-status.md
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Distribution-channel tasks are captured with priority, effort, risk, adoption impact, and decision.
- Public docs explain npm is current at 0.24.0 and trusted publishing is configured.
- MCP Registry is explicitly deferred until a real MCP server exists.

## Verification Commands
- npx pnpm@10.12.1 check:links
- npm run typecheck
- npm test
- npm run build

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the docs/backlog commit if the channel plan creates confusion or over-promises unsupported integrations.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
