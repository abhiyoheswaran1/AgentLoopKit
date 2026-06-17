# Maintainer Check Evidence Churn Plan

## Goal

Keep `agentloop maintainer-check` reviewable during long autonomous sessions by separating AgentLoop evidence churn from the broad changed-file warning.

## Scope

- Change only the `changed-file-count` status and message calculation.
- Keep all other maintainer-check risk checks on the full changed-file list.
- Document the behavior in the CLI reference.

## Tests First

- Add coverage where more than 25 dirty files are AgentLoop evidence artifacts and `changed-file-count` still passes.
- Add coverage where more than 25 dirty files are non-evidence files and `changed-file-count` warns even with evidence files present.

## Verification

- `npm test -- tests/maintainer-check.test.ts`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run dogfood:strict`
