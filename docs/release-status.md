# Release Status

Last checked: June 28, 2026.

## Current State

- GitHub release `v0.45.0` is public.
- npm latest is `agentloopkit@0.45.0`.
- GHCR and MCP Registry are live for `0.45.0`.
- GitHub Marketplace listing is pending owner UI publication for the composite Action.
- Release tag `v0.45.0` points at the published release commit.
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.45.0>
- Release asset: `agentloopkit-0.45.0.tgz`
- Release asset SHA-256: `ff8799881c9dfdfacdaeeb3afffee78a52c525dc1d4f8ba46d4ac3679c88b65d`
- Release commit: `0295e8f98791ddeebe93f539814a6f4f24e8115d`
- CI run for release commit: `28306178626` passed.
- CLI Smoke run for release commit: `28306178629` passed.
- Publish workflow run: `28306191128` passed.
- Docker workflow run: `28306191124` passed.
- MCP Registry workflow run: `28306420875` passed after npm propagation.
- MCP Registry workflow run `28306395281` failed before npm propagation made `0.45.0` visible, then the manual rerun above passed.
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`; `agentloop release-proof --redact-paths` confirmed the `0.45.0` image.

The MCP Registry metadata points at npm package `agentloopkit@0.45.0`.

GitHub Marketplace publication is still not live. The public listing URL <https://github.com/marketplace/actions/agentloopkit> returned 404 during post-release proof on June 28, 2026.

## Latest Release Highlights

Released in `0.45.0`:

- `agentloop loop create`, `agentloop loop tick`, `agentloop loop status`, and `agentloop loop report` record local loop contracts with goals, budgets, stop conditions, token receipts, iteration decisions, and native task links without executing a coding agent.
- `agentloop ready` evaluates task, acceptance, verification, scope, forbidden-file, and context-budget gates in a read-only local check.
- Token receipts show estimated broad context, compact context, AgentLoopKit overhead, and net context reduction.
- `agentloop context show --since <digest>` can acknowledge unchanged source handles without repeating local evidence content.
- Package exports now include loop contracts, readiness evaluation, and token receipt helpers.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
tmp=$(mktemp -d)
(cd "$tmp" && npx --yes agentloopkit@0.45.0 version)
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

Local release gate for `0.45.0`:

- `npm run release-flow`: passed locally, including prepublish check, lint, typecheck, full tests, build, public-doc hygiene, link check, dogfood, and release smoke.
- `npx --yes projscan doctor --format markdown`: A/90 with the known reviewed `prepublishOnly` advisory.
- `agentloop verify --task-commands --only-task-commands --progress --write-run --redact-paths`: passed and wrote `.agentloop/reports/2026-06-28-01-56-verification-report.md`.
- `agentloop check-gates --strict --redact-paths`: passed before commit.
- `node dist/cli/index.js release-check --strict --redact-paths`: passed before tagging on release commit `0295e8f9`.
- AgentFlight session `af-20260627-230629-add-agentloopkit-loop-contracts-and-readiness-gates`: ready for review with five verification checks passed.

Post-publish checks:

- `npm view agentloopkit version versions --json`: latest is `0.45.0`, and the versions list contains `0.45.0`
- `agentloop npm-status --agentloopkit --expect-current`: passed; npm latest matches local package version
- `npm run smoke:published -- --version 0.45.0`: passed
- clean temporary published-package version check: `0.45.0`
- GitHub release asset digest: `sha256:ff8799881c9dfdfacdaeeb3afffee78a52c525dc1d4f8ba46d4ac3679c88b65d`
- `agentloop release-proof --redact-paths`: passed for npm, GitHub Release, GHCR, and MCP Registry; warned for GitHub Marketplace
- `node dist/cli/index.js release-proof --strict --only github-marketplace --redact-paths`: expected to fail while Marketplace publication remains deferred
- GHCR image tag `0.45.0`: confirmed
- MCP Registry metadata points at `agentloopkit@0.45.0`: confirmed

Latest release-status documentation and proof commands on post-release `main`:

- `npm run check:public-docs`
- `npm run check:links`
- `npm test -- tests/public-docs-hygiene.test.ts tests/package-metadata.test.ts`
- `npx --no-install tsx src/cli/index.ts npm-status --agentloopkit --expect-current`
- `npx --no-install tsx src/cli/index.ts release-proof --redact-paths`
- `npx --no-install tsx src/cli/index.ts release-proof --strict --only github-marketplace --redact-paths` (expected failure while Marketplace publication remains deferred)
- `git diff --check`
- `npx --yes projscan doctor --format markdown`
