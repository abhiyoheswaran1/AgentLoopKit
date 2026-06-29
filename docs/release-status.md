# Release Status

Last checked: June 29, 2026.

## Current State

- GitHub release `v0.47.0` is public.
- npm latest is `agentloopkit@0.47.0`.
- GHCR and MCP Registry are live for `0.47.0`.
- GitHub Marketplace listing is pending owner UI publication for the composite Action.
- Release tag `v0.47.0` points at the published release commit.
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.47.0>
- Release asset: `agentloopkit-0.47.0.tgz`
- Release asset SHA-256: to be recorded after the GitHub release asset is published.
- Release commit: to be recorded after the release commit is tagged.
- CI run for release commit: to be recorded after CI finishes.
- CLI Smoke run for release commit: to be recorded after CI finishes.
- Publish workflow run: to be recorded after trusted publishing finishes.
- Docker workflow run: to be recorded after GHCR publishing finishes.
- MCP Registry workflow run: to be recorded after MCP Registry publishing finishes.
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`; `agentloop release-proof --redact-paths` confirmed the `0.47.0` image.

The MCP Registry metadata points at npm package `agentloopkit@0.47.0`.

GitHub Marketplace publication is still not live. The public listing URL <https://github.com/marketplace/actions/agentloopkit> returned 404 during post-release proof on June 28, 2026.

## Latest Release Highlights

Released in `0.47.0`:

- `agentloop loop scorecard` gives a read-only pre-flight decision for autonomous loop continuation.
- Scorecards expose readiness, scope, guardrail, token-budget, and context-handle signals in Markdown and JSON.
- Blocked loops reject further manual ticks until a human reviews the loop report.
- Scorecards report `ready` when gates pass, even if no further iteration budget remains.
- Generated harness guidance and docs cover scorecard-driven loop control.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
tmp=$(mktemp -d)
(cd "$tmp" && npx --yes agentloopkit@0.47.0 version)
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

Local release gate for `0.47.0`:

- `npm run maintenance:check`: passed before release metadata preparation.
- `npm run test:unit`: passed with 221 tests.
- `npm run test:integration`: passed with 267 tests.
- `npm run dogfood:strict`: passed.
- `npx --yes projscan doctor --format markdown`: A/90 with the known reviewed `prepublishOnly` advisory.
- `agentloop verify --task-commands --only-task-commands --progress --write-run --redact-paths`: passed.
- `agentloop check-gates --strict --redact-paths`: passed before release metadata preparation.
- `node dist/cli/index.js release-check --strict --redact-paths`: pending final release gate after metadata update.
- AgentFlight status: ready for review with five verification checks passed.

Post-publish checks:

- `npm view agentloopkit version versions --json`: latest is `0.47.0`, and the versions list contains `0.47.0`
- `agentloop npm-status --agentloopkit --expect-current`: passed; npm latest matches local package version
- `npm run smoke:published -- --version 0.47.0`: passed
- clean temporary published-package version check: `0.47.0`
- GitHub release asset digest: to be recorded after release asset publication
- `agentloop release-proof --redact-paths`: passed for npm, GitHub Release, GHCR, and MCP Registry; warned for GitHub Marketplace
- `node dist/cli/index.js release-proof --strict --only github-marketplace --redact-paths`: expected to fail while Marketplace publication remains deferred
- GHCR image tag `0.47.0`: confirmed
- MCP Registry metadata points at `agentloopkit@0.47.0`: confirmed

Latest release-status documentation and proof commands on post-release `main`:

- `npm run check:public-docs`
- `npm run check:links`
- `npm test -- tests/public-docs-hygiene.test.ts tests/package-metadata.test.ts`
- `npx --no-install tsx src/cli/index.ts npm-status --agentloopkit --expect-current`
- `npx --no-install tsx src/cli/index.ts release-proof --redact-paths`
- `npx --no-install tsx src/cli/index.ts release-proof --strict --only github-marketplace --redact-paths` (expected failure while Marketplace publication remains deferred)
- `git diff --check`
- `npx --yes projscan doctor --format markdown`
