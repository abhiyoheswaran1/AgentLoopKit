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
- Release asset SHA-256: `1a0cdb6b1b193197d49db2402300c9443681e7b30f1899d0653f3a8499705430`
- Release commit: `c28efc05fd9d5792d66afca64efaecb534ddf32a`
- CI run for release commit: `28370886339` passed.
- CLI Smoke run for release commit: `28370886333` passed.
- Publish workflow run: `28370907414` passed.
- Docker workflow run: `28370907355` passed.
- MCP Registry workflow run: `28371454481` passed.
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`; `agentloop release-proof --redact-paths` confirmed the `0.47.1` image.

The MCP Registry metadata points at npm package `agentloopkit@0.47.1`.

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

- direct release-flow component verification: passed before tagging.
- `npm run test:unit`: passed with 222 tests.
- `npm run test:integration`: passed.
- direct full Vitest run: 74 files and 1002 tests passed.
- `npm run dogfood:strict`: passed.
- `npx --yes projscan doctor --format markdown`: A/90 with the known reviewed `prepublishOnly` advisory.
- `agentloop verify --task-commands --only-task-commands --progress --write-run --redact-paths`: passed.
- `agentloop check-gates --strict --redact-paths`: passed before release metadata preparation.
- `npx --no-install tsx src/cli/index.ts release-check --strict --redact-paths`: passed on release commit `c28efc05`.
- AgentFlight status: checked by dogfood.

Post-publish checks:

- `npm view agentloopkit version versions --json`: latest is `0.47.1`, and the versions list contains `0.47.1`
- `agentloop npm-status --agentloopkit --expect-current`: passed; npm latest matches local package version
- `npm run smoke:published -- --version 0.47.1`: passed
- clean temporary published-package version check: `0.47.1`
- GitHub release asset digest: `sha256:1a0cdb6b1b193197d49db2402300c9443681e7b30f1899d0653f3a8499705430`
- `agentloop release-proof --redact-paths`: passed for npm, GitHub Release, GHCR, and MCP Registry; warned for GitHub Marketplace
- `node dist/cli/index.js release-proof --strict --only github-marketplace --redact-paths`: expected to fail while Marketplace publication remains deferred
- GHCR image tag `0.47.1`: confirmed
- MCP Registry metadata points at `agentloopkit@0.47.1`: confirmed

Latest release-status documentation and proof commands on post-release `main`:

- `npm run check:public-docs`
- `npm run check:links`
- `npm test -- tests/public-docs-hygiene.test.ts tests/package-metadata.test.ts`
- `npx --no-install tsx src/cli/index.ts npm-status --agentloopkit --expect-current`
- `npx --no-install tsx src/cli/index.ts release-proof --redact-paths`
- `npx --no-install tsx src/cli/index.ts release-proof --strict --only github-marketplace --redact-paths` (expected failure while Marketplace publication remains deferred)
- `git diff --check`
- `npx --yes projscan doctor --format markdown`
