# Refresh roadmap for v0.23.0

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
ROADMAP.md still says shipped shell completions cover only bash, zsh, and fish, and its npm blocker section stops at v0.22.0 even though v0.23.0 is now public for PowerShell completions.

## Desired Outcome
ROADMAP.md accurately reflects v0.23.0, PowerShell completions, the current npm blocker, and the next useful local-first work.

## Constraints
- Do not claim npm 0.23.0 is published.
- Do not add new product scope beyond roadmap wording.
- Keep wording concise and public-safe; no synthetic-user claims.

## Non-Goals
- Do not change package code or release metadata.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- ROADMAP.md
- .agentloop/backlog.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- ROADMAP shipped section includes PowerShell completions.
- Current blocker section says GitHub releases reach v0.23.0 and npm still serves 0.1.1.
- Near-term roadmap names external npm auth/trusted publishing as the blocker without implying the repo can fix it alone.

## Verification Commands
- npx pnpm@10.12.1 check:links
- git diff --check

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert roadmap, backlog, dogfood, and AgentLoop evidence files.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
