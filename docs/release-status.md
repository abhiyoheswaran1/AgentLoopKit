# Release Status

Last checked: June 16, 2026.

## Current State

- Current public release: `v0.35.2`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.35.2>
- Release asset: `agentloopkit-0.35.2.tgz`
- Release asset SHA-256: `18552068caa3943c15383b3c567a33c4dbd46e638adcbb6c171c6ee18ed0fb96`
- Release tag `v0.35.2` points at commit `f3eb09b56dc6ed4a85889e96de8080674f4a2588`
- npm latest: `0.35.2`
- CI run: `27629033574`, success
- CLI Smoke run: `27629032937`, success
- Publish workflow run: `27629043182`, success
- Docker workflow run: `27629043556`, success
- MCP Registry workflow run: `27629355535`, success
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`. The public registry tag list includes `latest`, `0.35`, and `0.35.2`.

The MCP Registry public API lists `io.github.abhiyoheswaran1/agentloopkit` version `0.35.2` as latest, with npm package `agentloopkit@0.35.2`.

GitHub Marketplace publication is still not live. The public listing URL <https://github.com/marketplace/actions/agentloopkit> returned 404 during post-release proof on June 16, 2026.

## Latest Release Highlights

Released in `0.35.2`:

- The root composite GitHub Action now includes explicit `author` metadata.
- Action metadata formatting is aligned with the Marketplace-published ProjScan Action.
- Release-proof still reports GitHub Marketplace as missing because the public Marketplace URL returns 404.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.35.2 version
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

Local release gate for `0.35.2`:

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

- `npm view agentloopkit version versions --json`: latest `0.35.2`
- `node dist/cli/index.js npm-status --agentloopkit --expect-current`: latest matches local package version
- `npm run smoke:published -- --version 0.35.2`: passed
- `npx --yes agentloopkit@0.35.2 version`: `0.35.2`
- GitHub release asset digest: `18552068caa3943c15383b3c567a33c4dbd46e638adcbb6c171c6ee18ed0fb96`
- `node dist/cli/index.js release-proof --redact-paths`: npm, GitHub Release, GHCR, and MCP Registry passed; GitHub Marketplace warned
- `node dist/cli/index.js release-proof --strict --only github-marketplace --redact-paths`: failed because the Marketplace URL returned 404
- GHCR tag list includes `latest`, `0.35`, and `0.35.2`
- MCP Registry search marks `0.35.2` as latest

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm run check:links`
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes pnpm@10.12.1 audit --audit-level high`
- `npx --yes projscan doctor --format markdown`
