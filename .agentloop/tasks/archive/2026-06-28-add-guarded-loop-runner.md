# Add guarded loop runner

- Created date: 2026-06-28
- Task type: feature
- Status: done

## Problem Statement
AgentLoopKit can record loop iterations, but it cannot yet run a bounded external iteration through a configured runner while enforcing local guardrails.

## Desired Outcome
Add an agent-neutral loop run command that executes only explicitly allowed local runner commands, records evidence, enforces token and iteration guardrails, and keeps AgentLoopKit in control of readiness decisions.

## Constraints
- Do not make AgentLoopKit a coding agent.
- Runner execution must be opt-in, locally configured, allowlisted, non-shell by default, and bounded by timeout, iteration, and token guardrails.
- Do not publish, tag, version bump, or change release channels.
- Do not reference external inspiration in public docs.

## Non-Goals
- No hosted service, telemetry, or long-running daemon.
- No automatic publishing or destructive git operations.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/loop-contract.ts
- src/core/loop-runner.ts
- src/cli/commands/loop.ts
- src/index.ts
- tests/loop-contract.test.ts
- AGENTLOOP.md
- AGENTS.md
- CHANGELOG.md
- .agentloop/README.md
- .agentloop/harness
- docs/loop-contracts.md
- docs/cli-reference.md
- docs/getting-started.md
- README.md
- src/templates/root/AGENTS.md
- src/templates/root/AGENTLOOP.md
- src/templates/harness/commands.md

## Files or Areas Not to Touch
- package.json version field
- server.json version field

## Acceptance Criteria
- A configured safe runner can be executed with agentloop loop run and records one iteration with command, exit code, changed files, token receipt, and decision.
- Loop run rejects unconfigured commands, shell metacharacters, protected commands, exceeded max iterations, and terminal loop statuses.
- Self-dogfood presets include logical guardrails for this repository without executing publishing or destructive operations.
- Docs explain runner guardrails and make clear AgentLoopKit controls loops while external runners do the work.

## Verification Commands
- npx vitest run tests/loop-contract.test.ts
- npm run typecheck
- npm run lint
- npm run check:public-docs

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Running external commands from a CLI is high risk unless config is explicit, parsed without shell expansion, and protected commands are blocked.

## Rollback Notes
Remove loop run command, runner config parsing, docs, and tests; existing create/tick/status/report behavior should remain unchanged.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
