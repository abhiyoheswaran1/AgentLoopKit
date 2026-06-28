# Release Status

Last checked: June 28, 2026.

## Current State

- GitHub release `v0.46.0` is public.
- npm latest is `agentloopkit@0.46.0`.
- GHCR and MCP Registry are live for `0.46.0`.
- GitHub Marketplace listing is pending owner UI publication for the composite Action.
- Release tag `v0.46.0` points at the published release commit.
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.46.0>
- Release asset: `agentloopkit-0.46.0.tgz`
- Release asset SHA-256: `48d9fe95b5a63bd611512a53294437579932901980c038323194874715493ff4`
- Release commit: `37717f743f77afaad05b829528e70083c65c819c`
- CI run for release commit: `28319409663` passed.
- CLI Smoke run for release commit: `28319409670` passed.
- Publish workflow run: `28319419421` passed.
- Docker workflow run: `28319419422` passed.
- MCP Registry workflow run: `28319659684` passed.
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`; `agentloop release-proof --redact-paths` confirmed the `0.46.0` image.

The MCP Registry metadata points at npm package `agentloopkit@0.46.0`.

GitHub Marketplace publication is still not live. The public listing URL <https://github.com/marketplace/actions/agentloopkit> returned 404 during post-release proof on June 28, 2026.

## Latest Release Highlights

Released in `0.46.0`:

- `agentloop loop run` executes one configured local runner iteration without shell execution.
- `agentloop loop create --runner-command ...` stores explicit runner configuration on the loop contract.
- Runner guardrails block protected publish, destructive, and git state-changing command families.
- Runner evidence records exit code, bounded output, changed files, token receipts, and normal loop stop decisions.
- README, CLI reference, loop-contract docs, generated harness guidance, and dogfood guidance cover the guarded runner workflow and richer demos.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
tmp=$(mktemp -d)
(cd "$tmp" && npx --yes agentloopkit@0.46.0 version)
```

GitHub release tarballs remain useful for provenance checks and rollback, but normal users should use npm or npx.

## Next Publish

Use the GitHub Actions publish workflow for the next release after release metadata is prepared:

- `package.json`, `server.json`, and `CHANGELOG.md` must agree on the next version.
- `CHANGELOG.md` must have no real entries left under `## Unreleased`.
- `agentloop npm-status --agentloopkit --expect-current` should pass before the version bump, or the version gap must be explained in release notes.
- Do not publish stale intermediate versions from current `main`.

After each publish:

- update this page with the new npm proof;
- update `docs/npm-publishing.md`, `docs/launch-checklist.md`, and `FINAL_HANDOFF.md`;
- run `agentloop npm-status --agentloopkit --expect-current`;
- run `npm run smoke:published -- --version <version>`;
- verify `npx --yes agentloopkit@<version> version`.

## Verification Evidence

Local release gate for `0.46.0`:

- `npm run release-flow`: passed locally, including prepublish check, lint, typecheck, full tests, build, public-doc hygiene, link check, dogfood, and release smoke.
- AgentLoop-captured `npm run release-flow`: passed and wrote `.agentloop/reports/2026-06-28-12-08-verification-report.md`.
- `npm run dogfood:strict`: passed.
- `npx --yes projscan doctor --format markdown`: A/90 with the known reviewed `prepublishOnly` advisory.
- `agentloop verify --task-commands --only-task-commands --progress --write-run --redact-paths`: passed.
- `agentloop ready --strict --redact-paths`: passed.
- `agentloop check-gates --strict --redact-paths`: passed before commit.
- `node dist/cli/index.js release-check --strict --redact-paths`: passed before tagging on release commit `37717f74`.
- AgentFlight session `af-20260627-230629-add-agentloopkit-loop-contracts-and-readiness-gates`: ready for review with five verification checks passed.

Post-publish checks:

- `npm view agentloopkit version versions --json`: latest is `0.46.0`, and the versions list contains `0.46.0`
- `agentloop npm-status --agentloopkit --expect-current`: passed; npm latest matches local package version
- `npm run smoke:published -- --version 0.46.0`: passed
- clean temporary published-package version check: `0.46.0`
- GitHub release asset digest: `sha256:48d9fe95b5a63bd611512a53294437579932901980c038323194874715493ff4`
- `agentloop release-proof --redact-paths`: passed for npm, GitHub Release, GHCR, and MCP Registry; warned for GitHub Marketplace
- `node dist/cli/index.js release-proof --strict --only github-marketplace --redact-paths`: expected to fail while Marketplace publication remains deferred
- GHCR image tag `0.46.0`: confirmed
- MCP Registry metadata points at `agentloopkit@0.46.0`: confirmed

Latest release-status documentation and proof commands on post-release `main`:

- `npm run check:public-docs`
- `npm run check:links`
- `npm test -- tests/public-docs-hygiene.test.ts tests/package-metadata.test.ts`
- `npx --no-install tsx src/cli/index.ts npm-status --agentloopkit --expect-current`
- `npx --no-install tsx src/cli/index.ts release-proof --redact-paths`
- `npx --no-install tsx src/cli/index.ts release-proof --strict --only github-marketplace --redact-paths` (expected failure while Marketplace publication remains deferred)
- `git diff --check`
- `npx --yes projscan doctor --format markdown`
