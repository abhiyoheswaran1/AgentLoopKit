# Add built CLI smoke coverage for install-agent preservation

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
install-agent preserves existing agent instruction files in source tests and docs, but the built CLI smoke script only checks first-time nested install output. Distribution smoke does not yet prove the packaged CLI preserves maintainer-edited agent guidance on rerun.

## Desired Outcome
The built CLI smoke script proves a rerun of agentloop install-agent codex skips an existing .agentloop/agents/codex.md file while preserving its contents and still reporting the skipped status through JSON output.

## Constraints
- Keep changes scoped to built CLI smoke coverage and its guard test.
- Do not change install-agent behavior, agent templates, dependencies, release artifacts, package versions, or public docs.
- Do not overwrite real repo agent instruction files; use only the temporary smoke repository.

## Non-Goals
- Publishing, release prep, or Marketplace work.
- Changing the install-agent command semantics or agent template content.
- Adding a force overwrite mode.

## Assumptions
- Existing agent-installation tests remain the authority for edge cases, symlink guards, unsupported agents, and human output formatting.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- src/templates/agents

## Acceptance Criteria
- A failing guard test is added before implementation to prove the smoke script lacks install-agent preservation coverage.
- scripts/smoke-cli.mjs reruns agentloop install-agent codex --json after the nested install-agent smoke creates the codex guide.
- The smoke assertion verifies agentFileStatus is skipped and the existing .agentloop/agents/codex.md content is preserved.
- The smoke assertion verifies AGENTS.md still references the agent instructions after the rerun.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "CLI smoke script covers install-agent preservation"
- npm test -- tests/distribution-artifacts.test.ts
- npm run typecheck
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- npm run dogfood
- npx --yes agentflight verify -- npm test -- tests/distribution-artifacts.test.ts
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Low: smoke script changes can increase distribution smoke runtime or brittleness if they rely on exact install-agent JSON details.

## Rollback Notes
Revert the smoke-cli and distribution-artifacts test changes; no persistent runtime state or dependency changes are expected.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
