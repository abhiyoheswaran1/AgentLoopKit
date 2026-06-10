# Add security-review example

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
Security-conscious users need a concrete local-first example that shows how to use AgentLoopKit for a security review without claiming compliance or reading secrets.

## Desired Outcome
The repo includes a security-review example and public docs point users to it as a copyable review workflow.

## Constraints
- Keep the example deterministic and local-first.
- Do not claim real security assurance, compliance, certification, or vulnerability detection.
- Do not add dependencies, network calls, telemetry, or secret scanning.

## Non-Goals
- Do not build a policy engine or security scanner.
- Do not add cloud dashboards or hosted reporting.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- examples/security-review
- README.md
- docs/security-review.md
- docs/getting-started.md

## Files or Areas Not to Touch
- src/core
- src/cli

## Acceptance Criteria
- Example folder includes README, sample task, sample verification report, and sample PR summary.
- README and getting-started docs link to the example without presenting synthetic feedback as real user evidence.
- Docs explain the limits: AgentLoopKit records review evidence but does not prove code is secure.

## Verification Commands
- npx pnpm@10.12.1 check:links
- git diff --check
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Remove examples/security-review and revert the docs links.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
