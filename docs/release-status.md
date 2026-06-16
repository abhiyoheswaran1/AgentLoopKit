# Release Status

Last checked: June 16, 2026.

## Current State

- Current public release: `v0.34.1`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.34.1>
- Release asset: `agentloopkit-0.34.1.tgz`
- Release asset SHA-256: `11daa22364e8aea2672fb831c8698d79cc665ee64db85f0e8ccf6bab90c3954f`
- Release tag `v0.34.1` points at commit `c2f1ea76b77d12a2a865b01c98ecc248eac22afa`
- npm latest: `0.34.1`
- CI run: `27604875208`, success
- CLI Smoke run: `27604875139`, success
- Publish workflow run: `27605153012`, success
- Docker workflow run: `27605153434`, success
- MCP Registry workflow run: `27605495676`, success
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`. The public registry tag list includes `latest`, `0.34`, and `0.34.1`.

The MCP Registry public API lists `io.github.abhiyoheswaran1/agentloopkit` version `0.34.1` as latest, with npm package `agentloopkit@0.34.1`.

## Latest Release Highlights

Released in `0.34.1`:

- `agentloop release-check` explains whether commits after the current version tag affect package release contents or only repo-local evidence/docs.
- JSON release-check output includes `releaseDelta` fields for agents and CI.
- Strict release-flow behavior remains conservative: release metadata still has to be prepared before publishing.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.34.1 version
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

Local release gate for `0.34.1`:

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

- `npm view agentloopkit version versions --json`: latest `0.34.1`
- `node dist/cli/index.js npm-status --agentloopkit --expect-current`: latest matches local package version
- `npm run smoke:published -- --version 0.34.1`: passed
- `npx --yes agentloopkit@0.34.1 version`: `0.34.1`
- GitHub release asset digest: `11daa22364e8aea2672fb831c8698d79cc665ee64db85f0e8ccf6bab90c3954f`
- `node dist/cli/index.js release-proof --strict --redact-paths`: npm, GitHub Release, GHCR, and MCP Registry passed
- GHCR tag list includes `latest`, `0.34`, and `0.34.1`
- MCP Registry search marks `0.34.1` as latest

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm run check:links`
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes pnpm@10.12.1 audit --audit-level high`
- `npx --yes projscan doctor --format markdown`
