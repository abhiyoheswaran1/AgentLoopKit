# Add built CLI smoke coverage for template and completion commands

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Source tests cover list-templates and completion rendering, but the built distribution smoke does not prove the packaged CLI can list bundled templates or print key completion scripts beyond the targeted bash/fish checks already added for specific regressions.

## Desired Outcome
The built CLI smoke script exercises list-templates human/JSON output and completion zsh, PowerShell, pwsh alias, and unsupported-shell failure behavior without mutating shell profile files or release state.

## Constraints
- Do not change command behavior unless the smoke exposes a real bug.
- Do not bump versions, tag, publish, or touch release channels.
- Keep coverage local-only and deterministic; no network calls, shell profile writes, or filesystem cleanup automation.

## Non-Goals
- No new completion values beyond the existing command surface.
- No release prep, package-manager manifest work, or Marketplace work.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- tests/distribution-artifacts.test.ts
- scripts/smoke-cli.mjs

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- .github/workflows

## Acceptance Criteria
- A focused distribution-artifacts guard fails before smoke coverage is added and passes after.
- scripts/smoke-cli.mjs runs list-templates in human and JSON modes and asserts bundled template metadata is present.
- scripts/smoke-cli.mjs runs completion zsh, completion powershell, completion pwsh, and an unsupported-shell failure path against the built CLI.
- The smoke script logs Template and completion command smoke passed.
- Focused tests, full distribution-artifacts tests, build, smoke, AgentFlight verification, ProjScan doctor, dogfood strict, and maintenance check pass before handoff.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "template and completion commands"
- npm test -- tests/distribution-artifacts.test.ts
- npx prettier --check tests/distribution-artifacts.test.ts scripts/smoke-cli.mjs
- git diff --name-only -- package.json pnpm-lock.yaml CHANGELOG.md .github/workflows
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- npx --yes agentflight verify -- npm test -- tests/distribution-artifacts.test.ts -t "template and completion commands"
- npx --yes agentflight verify -- node scripts/smoke-cli.mjs
- npx --yes projscan doctor --format markdown
- npm run dogfood:strict
- npm run maintenance:check

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Low: smoke/test coverage only, but the smoke script is large and order-sensitive.

## Rollback Notes
Remove the new distribution-artifacts guard and the template/completion smoke block from scripts/smoke-cli.mjs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
