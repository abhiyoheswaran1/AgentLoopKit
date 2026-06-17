# Add built CLI smoke coverage for policy command redaction

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Source tests cover policy list/status/show --redact-paths, but the built CLI smoke script only exercises policy pack redaction. The packaged smoke should prove the base policy commands keep public-output redaction support working after build and packaging.

## Desired Outcome
The distribution guard and built CLI smoke script prove policy list --redact-paths, policy status --redact-paths, and policy show security --redact-paths work in the distributed CLI, with JSON list/status remaining output-equivalent and no absolute smoke repo paths leaking.

## Constraints
- Keep this scoped to built CLI smoke coverage and its distribution guard; do not change policy runtime behavior unless the smoke exposes a real bug.
- Use TDD: add the distribution guard first, watch it fail, then update the smoke script.
- Do not bump versions, tag, publish, or alter release-channel files.

## Non-Goals
- No policy behavior changes, policy-pack changes, release prep, version cut, registry publication, or GitHub Marketplace work.

## Assumptions
- policy list/status/show --redact-paths behavior already exists at source level; this task adds packaged smoke evidence.

## Likely Files or Areas
- tests/distribution-artifacts.test.ts
- scripts/smoke-cli.mjs

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- .github/workflows

## Acceptance Criteria
- A focused distribution-artifacts test fails before the smoke script covers policy command redaction and passes after implementation.
- scripts/smoke-cli.mjs runs policy list/status/show redacted human checks and policy list/status JSON equivalence checks against the smoke repo.
- scripts/smoke-cli.mjs logs Policy command redaction smoke passed.
- Full distribution-artifacts tests, build, smoke, dogfood strict, maintenance check, AgentFlight verification, and ProjScan doctor pass before handoff.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "policy command redaction"
- npm test -- tests/distribution-artifacts.test.ts
- npx prettier --check tests/distribution-artifacts.test.ts scripts/smoke-cli.mjs
- git diff --name-only -- package.json pnpm-lock.yaml CHANGELOG.md .github/workflows
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Remove the policy command redaction guard from tests/distribution-artifacts.test.ts and the policy command redaction smoke block from scripts/smoke-cli.mjs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
