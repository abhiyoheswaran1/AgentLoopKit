# Ask for AgentLoopKit evidence in GitHub templates

- Created date: 2026-06-09
- Task type: docs
- Status: completed

## Problem Statement
GitHub issue and PR templates exist, but they do not ask contributors to include AgentLoopKit status, verification, or handoff evidence. Contributors may miss the repo's main review discipline.

## Desired Outcome
Issue and PR templates should make AgentLoopKit evidence easy to provide without adding process-heavy wording.

## Constraints
- Keep templates short.
- Do not claim real adoption.
- Do not require AgentLoopKit output for every issue when it is not relevant.
- Do not add dependencies or workflow changes.

## Non-Goals
- No GitHub label automation.
- No issue forms migration.
- No bot or SaaS workflow.

## Assumptions
- Maintainers benefit when contributors paste `agentloop status` and verification evidence in PRs and bug reports.

## Likely Files or Areas
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch
- Source code.
- npm publish workflow.
- CI workflow.

## Acceptance Criteria
- Bug reports ask for `agentloop status` when available.
- Feature requests ask for the affected command/template/policy area.
- PR template asks for task contract, status output, verification report, and summary/handoff evidence.
- Template copy stays concise and public-safe.

## Verification Commands
- `git diff --check`
- `npx pnpm@10.12.1 test`
- `npx projscan doctor --format markdown`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the GitHub template edits and remove this task/product-cycle entry.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
