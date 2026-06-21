# Add local research task workflow

- Created date: 2026-06-21
- Task type: feature
- Status: done

## Problem Statement
AgentLoopKit can structure local work, but users cannot explicitly create a research task type even though product and engineering teams need reviewable research plans, findings, constraints, and handoffs. The product must keep the boundary clear: it supports local research workflow evidence, not automated interviews or fake user proof.

## Desired Outcome
create-task supports a research task type, generated loop guidance includes a research workflow, docs explain how to use it for local research evidence, and tests/completions/docs cover the new type without changing release behavior.

## Constraints
- Do not add network calls, AI APIs, telemetry, interview automation, claims of real user feedback, release behavior, dependencies, package version, tags, or publishing.

## Non-Goals
- Do not build a survey tool, CRM, user panel, transcription workflow, or hosted research repository.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/constants.ts
- src/core/task-contract.ts
- src/templates/loops/research.md
- .agentloop/loops/research.md
- src/templates/tasks/README.md
- docs/task-contracts.md
- docs/cli-reference.md
- README.md
- tests/create-task.test.ts
- tests/completion.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- create-task --type research works non-interactively and writes Task type: research.
- Shell completions include research among task types.
- Generated task guidance and public docs explain research as local planning/findings evidence, not automated user interviews or proof of adoption.

## Verification Commands
- npm test -- tests/create-task.test.ts tests/completion.test.ts tests/init.test.ts
- npm run typecheck
- npm run check:public-docs
- npm run check:links
- npx --no-install tsx src/cli/index.ts task doctor --redact-paths
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Research wording must not imply real user feedback, interviews, testimonials, adoption, or automated user research unless users provide that evidence themselves.
- Pre-existing dirty non-evidence files before task creation: 140 total; examples: `.agentloop/README.md`, `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Remove the research task type, loop template, docs, and tests; no data migration required.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
