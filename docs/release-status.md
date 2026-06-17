# Release Status

Last checked: June 17, 2026.

## Current State

- Current public release: `v0.36.1`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.36.1>
- Release asset: `agentloopkit-0.36.1.tgz`
- Release asset SHA-256: pending public release asset verification
- Release tag `v0.36.1` points at the published release commit.
- npm latest: `0.36.1`
- CI run: pending public workflow proof
- CLI Smoke run: pending public workflow proof
- Publish workflow run: pending public workflow proof
- Docker workflow run: pending public workflow proof
- MCP Registry workflow run: pending public workflow proof
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`; `agentloop release-proof --redact-paths` confirms the `0.36.1` image.

The MCP Registry metadata points at npm package `agentloopkit@0.36.1`.

GitHub Marketplace publication is still not live. The public listing URL <https://github.com/marketplace/actions/agentloopkit> returned 404 during post-release proof on June 17, 2026.

## Latest Release Highlights

Released in `0.36.1`:

- Windows smoke fixtures and release-status report paths compare stable evidence paths across platforms.
- `doctor --redact-paths` covers Windows drive variants, current-directory variants, inferred AgentLoop artifact roots, and labeled local path roots.
- Generated agent instruction templates now include the raw AgentFlight recovery guidance.
- `agentloop status --brief --json` help copy now describes compact machine-readable output.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.36.1 version
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

Local release gate for `0.36.1`:

- `node scripts/prepublish-check.mjs`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run check:public-docs`
- `npm run check:links`
- `git diff --check`
- `npm run dogfood:strict`
- `npm run smoke:release`
- `node dist/cli/index.js release-check --strict`
- `npm run release-flow`

Post-publish checks:

- `npm view agentloopkit version versions --json`: latest `0.36.1`
- `npx --no-install agentloop npm-status --agentloopkit --expect-current`: latest matches local package version
- `npm run smoke:published -- --version 0.36.1`: pending public package proof
- `npx --yes agentloopkit@0.36.1 version`: pending public package proof
- GitHub release asset digest: pending public release asset verification
- `npx --no-install agentloop release-proof --redact-paths`: npm, GitHub Release, GHCR, and MCP Registry passed; GitHub Marketplace warned
- `npx --no-install agentloop release-proof --strict --only github-marketplace --redact-paths`: failed because the Marketplace URL returned 404
- GHCR image tag `0.36.1` is confirmed by release proof
- MCP Registry metadata points at `agentloopkit@0.36.1`

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm run check:links`
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes pnpm@10.12.1 audit --audit-level high`
- `npx --yes projscan doctor --format markdown`
