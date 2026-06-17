# Release Status

Last checked: June 17, 2026.

## Current State

- Current public release: `v0.36.0`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.36.0>
- Release asset: `agentloopkit-0.36.0.tgz`
- Release asset SHA-256: `aed9e11a648fb8facf6ddc37c6cc2c3ef8d1b8ac342909fc061c9f7f169d6376`
- Release tag `v0.36.0` points at commit `7e45b7f50c59b2e0e933a921c2dff62c0b389305`
- Current `main` commit `ac75bfa7de8c14d65b0bb0409a9a056713b36b42` contains unreleased post-release CI portability and redaction fixes. Do not cut a second release on June 17, 2026.
- npm latest: `0.36.0`
- CI run: `27702176995`, success
- CLI Smoke run: `27702177015`, success
- Publish workflow run: `27700012706`, success
- Docker workflow run: `27700012558`, success
- MCP Registry workflow run: `27700534371`, success
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`; `agentloop release-proof --redact-paths` confirms the `0.36.0` image.

The MCP Registry metadata points at npm package `agentloopkit@0.36.0`.

GitHub Marketplace publication is still not live. The public listing URL <https://github.com/marketplace/actions/agentloopkit> returned 404 during post-release proof on June 17, 2026.

## Latest Release Highlights

Released in `0.36.0`:

- Stale or missing `.agentloop/state.json` pointers are detected in status, next-action, task doctor, and review-context surfaces.
- AgentFlight placeholder handling and latest archived task evidence fallback are stronger.
- Release, review, maintenance, redaction, and built CLI smoke coverage are broader.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.36.0 version
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

Local release gate for `0.36.0`:

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

- `npm view agentloopkit version versions --json`: latest `0.36.0`
- `npx --no-install agentloop npm-status --agentloopkit --expect-current`: latest matches local package version
- `npm run smoke:published -- --version 0.36.0`: passed
- `npx --yes agentloopkit@0.36.0 version`: `0.36.0` from a clean temporary directory
- GitHub release asset digest: `aed9e11a648fb8facf6ddc37c6cc2c3ef8d1b8ac342909fc061c9f7f169d6376`
- `npx --no-install agentloop release-proof --redact-paths`: npm, GitHub Release, GHCR, and MCP Registry passed; GitHub Marketplace warned
- `npx --no-install agentloop release-proof --strict --only github-marketplace --redact-paths`: failed because the Marketplace URL returned 404
- GHCR image tag `0.36.0` is confirmed by release proof
- MCP Registry metadata points at `agentloopkit@0.36.0`

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm run check:links`
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes pnpm@10.12.1 audit --audit-level high`
- `npx --yes projscan doctor --format markdown`
