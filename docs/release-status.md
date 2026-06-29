# Release Status

Last checked: June 29, 2026.

## Current State

- GitHub release `v0.47.1` is public.
- npm latest is `agentloopkit@0.47.1`.
- GHCR and MCP Registry are live for `0.47.1`.
- GitHub Marketplace listing is pending owner UI publication for the composite Action.
- Release tag `v0.47.1` points at the published release commit.
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.47.1>
- Release asset: `agentloopkit-0.47.1.tgz`
- Release asset SHA-256: recorded after GitHub Release asset upload.
- Release commit: recorded after tagging.
- CI run for release commit: recorded after CI completes.
- CLI Smoke run for release commit: recorded after CI completes.
- Publish workflow run: recorded after npm trusted publishing completes.
- Docker workflow run: recorded after GHCR publish completes.
- MCP Registry workflow run: recorded after MCP Registry publish completes.
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`; `agentloop release-proof --redact-paths` confirms the release image after publish.

The MCP Registry metadata points at the current npm package after publish.

GitHub Marketplace publication is still not live. The public listing URL <https://github.com/marketplace/actions/agentloopkit> returned 404 during post-release proof on June 29, 2026.

## Latest Release Highlights

Released in `0.47.1`:

- `agentloop ready` uses a neutral context-budget receipt when the repo has no changed-file context to compact.
- Release-channel docs now separate repository-ref GitHub Action usage from GitHub Marketplace listing proof.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
tmp=$(mktemp -d)
(cd "$tmp" && npx --yes agentloopkit@0.47.1 version)
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

Local release gate for `0.47.1`:

- `npm run maintenance:check`: passed before release metadata preparation.
- `npm run test:unit`: passed with 222 tests.
- `npm run dogfood:strict`: passed.
- `npx --yes projscan doctor --format markdown`: A/90 with the known reviewed `prepublishOnly` advisory.
- `agentloop verify --task-commands --only-task-commands --progress --write-run --redact-paths`: passed.
- `agentloop check-gates --strict --redact-paths`: passed before release metadata preparation.
- `npx --no-install tsx src/cli/index.ts release-check --strict --redact-paths`: run before tagging.
- AgentFlight status: checked by dogfood.

Post-publish checks:

- `npm view agentloopkit version versions --json`: recorded after publish
- `agentloop npm-status --agentloopkit --expect-current`: recorded after publish
- `npm run smoke:published -- --version 0.47.1`: recorded after publish
- clean temporary published-package version check: recorded after publish
- GitHub release asset digest: recorded after asset upload
- `agentloop release-proof --redact-paths`: recorded after release workflows finish
- `node dist/cli/index.js release-proof --strict --only github-marketplace --redact-paths`: expected to fail while Marketplace publication remains deferred
- GHCR image tag `0.47.1`: recorded after GHCR publish
- MCP Registry metadata points at `agentloopkit@0.47.1`: recorded after MCP Registry publish

Latest release-status documentation and proof commands on post-release `main`:

- `npm run check:public-docs`
- `npm run check:links`
- `npm test -- tests/public-docs-hygiene.test.ts tests/package-metadata.test.ts`
- `npx --no-install tsx src/cli/index.ts npm-status --agentloopkit --expect-current`
- `npx --no-install tsx src/cli/index.ts release-proof --redact-paths`
- `npx --no-install tsx src/cli/index.ts release-proof --strict --only github-marketplace --redact-paths` (expected failure while Marketplace publication remains deferred)
- `git diff --check`
- `npx --yes projscan doctor --format markdown`
