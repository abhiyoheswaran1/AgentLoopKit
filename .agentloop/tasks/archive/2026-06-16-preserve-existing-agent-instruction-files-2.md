# Preserve existing agent instruction files

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
agentloop install-agent can rewrite an existing .agentloop/agents/<agent>.md file and lose local agent-specific edits.

## Desired Outcome
install-agent preserves existing agent instruction files by default, still updates missing AGENTS.md references, and reports created versus skipped files in human and JSON output.

## Constraints
- Preserve existing `.agentloop/agents/<agent>.md` files by default.
- Keep existing `AGENTS.md` content and marker append behavior.
- Keep path safety checks for `.agentloop/agents/` and `AGENTS.md`.
- Report created versus skipped agent-instruction files in JSON and human output.

## Non-Goals
- Do not add a template merge system.
- Do not add network calls, external agent config discovery, or third-party setup writes.
- Do not change `init` template behavior.
- Do not cut or publish a release.

## Assumptions
- Agent instruction files may be edited by maintainers after installation.
- Re-running `install-agent` should be safe in existing repos.
- Users who want newer template text can inspect package templates and copy changes manually.

## Likely Files or Areas
- src/core/agent-installation.ts
- src/cli/commands/install-agent.ts
- tests/agent-installation.test.ts
- docs/cli-reference.md
- README.md
- CHANGELOG.md
- DECISIONS.md
- .agentloop/backlog.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- package.json version
- release workflows
- external agent config files outside this repo
- npm/GitHub release metadata

## Acceptance Criteria
- Existing `.agentloop/agents/<agent>.md` content is preserved when `agentloop install-agent <agent>` reruns.
- Missing `.agentloop/agents/<agent>.md` files are still created from bundled templates.
- `AGENTS.md` still gets the missing AgentLoopKit marker block without replacing existing content.
- JSON output includes whether the agent instruction file was `created` or `skipped`.
- Human output clearly says when an existing agent instruction file was skipped.
- `install-agent all --json` reports created versus skipped status per bundled agent.

## Verification Commands
- npm test -- tests/agent-installation.test.ts
- npm test -- tests/agent-installation.test.ts tests/cli-docs-drift.test.ts
- npm run check:public-docs
- npm run typecheck
- npm run lint
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- `install-agent` is a setup writer. Keep the change conservative and avoid touching unrelated init or template flows.

## Rollback Notes
Revert the install-agent preservation logic, output-shape additions, tests, and docs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
