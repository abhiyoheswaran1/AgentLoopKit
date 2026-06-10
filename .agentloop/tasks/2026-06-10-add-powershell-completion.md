# Add PowerShell shell completion

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement
AgentLoopKit shell completions support bash, zsh, and fish, but Windows and PowerShell users still get an unsupported-shell error.

## Desired Outcome
The completion command prints an inspectable PowerShell completion script for agentloop and agentloopkit without writing profile files.

## Constraints
- No shell profile mutation.
- No runtime dependencies.
- Keep scripts static and transparent.

## Non-Goals
- Do not install completion scripts automatically.
- Do not add a daemon or dynamic shell integration.

## Assumptions
- PowerShell users can pipe the generated script into a profile themselves after inspection.

## Likely Files or Areas
- src/core/completions.ts
- src/cli/commands/completion.ts
- tests/completion.test.ts
- README.md
- docs/getting-started.md

## Files or Areas Not to Touch
- package-lock.json

## Acceptance Criteria
- agentloop completion powershell prints a PowerShell Register-ArgumentCompleter script.
- agentloop completion pwsh works as an alias.
- Completion choices include top-level commands, task subcommands, policy subcommands, task statuses, agent names, and shell names.
- Unsupported shell errors still name all supported shells.

## Verification Commands
- npx pnpm@10.12.1 test tests/completion.test.ts
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
Revert completion support changes, docs, tests, and generated product-cycle files.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
