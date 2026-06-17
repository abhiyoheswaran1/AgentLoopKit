# Validate local policy pack manifest names

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Local organization policy-pack manifests can declare empty metadata or a name that differs from the configured pack name, which makes policy pack discovery confusing and weakens the local pack safety contract.

## Desired Outcome
Local policy-pack manifests fail fast when required fields are empty or when the manifest name does not match the configured pack name, while bundled pack behavior and no-overwrite apply semantics stay unchanged.

## Constraints
- Keep policy packs repo-local and file-based.
- Do not add remote policy-pack fetches, enforcement engines, telemetry, API calls, token reads, release steps, dependency changes, or overwrite behavior.
- Preserve bundled policy-pack behavior except for stricter manifest metadata validation.
- Keep errors bounded to policy-pack commands and tests.

## Non-Goals
- No new policy-pack command surface.
- No policy merge or overwrite mode.
- No public release, version bump, tag, npm publish, GitHub Release, GHCR, Marketplace, or MCP Registry work.

## Assumptions
- Configured local policy-pack names are the user-facing identifiers users type into `agentloop policy pack show/apply`.
- A local pack whose manifest name differs from the configured name is more likely a configuration mistake than an intended alias.

## Likely Files or Areas
- `src/core/policy-packs.ts`
- `tests/policy-packs.test.ts`
- `docs/policies.md`
- `docs/configuration.md`

## Files or Areas Not to Touch
- Package versions, release metadata, lockfiles, distribution manifests, publish workflows, and registry documentation.

## Acceptance Criteria
- Local policy-pack manifests with empty `name`, `title`, or `description` fail with `PolicyPackManifestError`.
- Configured local policy packs fail when `manifest.name` does not match the configured `policies.packs[].name` case-insensitively.
- Bundled policy packs still list/read/apply as before when their manifests are valid.
- Policy-pack apply still writes missing files only and skips existing files.
- Docs explain required local manifest fields and the configured-name match.

## Verification Commands
- `npm test -- tests/policy-packs.test.ts`
- `npm test -- tests/policy-packs.test.ts tests/config.test.ts tests/maintenance-check-script.test.ts tests/public-docs-hygiene.test.ts tests/cli-docs-drift.test.ts`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm test`

## Post-Verification Gates
- `npm run dogfood:strict`

## Implementation Plan
- Add failing tests around empty manifest metadata and configured-name mismatch.
- Add manifest-field validation in the policy-pack core reader and pass configured local names through local-pack loading.
- Update policy-pack docs with the stricter manifest contract.
- Run focused tests, then a broader bug pass and AgentLoop evidence commands.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the changes to `src/core/policy-packs.ts`, `tests/policy-packs.test.ts`, and docs. Existing valid local packs continue to work; invalid local packs can be fixed by aligning `manifest.name` with `agentloop.config.json`.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
