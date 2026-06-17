# Accept redacted policy output flag

- Created date: 2026-06-17
- Task type: bugfix
- Status: done

## Problem Statement

Agents following shareable-output habits can pass redact-paths to policy commands, but policy status currently rejects that common flag even though policy paths are already repo-relative.

## Desired Outcome

Policy inspection commands accept the redact-paths flag for consistency without changing JSON or human policy output.

## Constraints

- Keep policy command output content unchanged; the flag is compatibility-only because policy paths are repo-relative.
- Preserve existing JSON shapes for policy list, show, status, packs, pack show, and pack apply.
- Do not change policy discovery, policy-pack safety, or policy application behavior.

## Non-Goals

- Do not add policy enforcement, remote policy packs, path rewriting, or secret scanning.
- Do not add release, publish, or Marketplace behavior.

## Assumptions

- `--redact-paths` should be accepted where agents commonly use shareable CLI output, even when the command already avoids absolute paths.
- JSON policy output should remain raw and stable for scripts.

## Likely Files or Areas

- `src/cli/commands/policy.ts`
- `tests/policy.test.ts`
- `tests/policy-packs.test.ts`
- `docs/policies.md`
- `docs/cli-reference.md`

## Files or Areas Not to Touch

- Policy-pack core read/apply logic unless tests expose a direct bug.
- Package versions, changelog release sections, publish workflows, and release-channel docs.

## Acceptance Criteria

- `agentloop policy list --redact-paths`, `policy status --redact-paths`, and `policy show <policy> --redact-paths` succeed.
- Policy pack subcommands accept `--redact-paths` without changing output shape.
- JSON output for the same policy commands remains unchanged when `--redact-paths` is supplied.
- Docs mention the flag is accepted for policy output consistency while policy paths remain repo-relative.

## Verification Commands

- npm test -- tests/policy.test.ts tests/policy-packs.test.ts
- npx --no-install tsx src/cli/index.ts policy status --redact-paths
- npm run check:public-docs
- npx prettier --check src/cli/commands/policy.ts tests/policy.test.ts tests/policy-packs.test.ts docs/policies.md docs/cli-reference.md .agentloop/tasks/2026-06-17-accept-redacted-policy-output-flag-2.md

## Post-Verification Gates

- npm run dogfood:strict
- npx --no-install tsx src/cli/index.ts ship --redact-paths
- npx --no-install tsx src/cli/index.ts prepare-pr --write --redact-paths

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the policy command option additions, regression tests, and docs updates.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
