# Release Status

Last checked: June 12, 2026.

## Current State

- Current public release: `v0.28.6`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.28.6>
- Release asset: `agentloopkit-0.28.6.tgz`
- Release asset SHA-256: `2f91b2c0adc5d44f5f32f09eb40f4e0ce028c07400c6fb76fe075070ec65b573`
- Release tag `v0.28.6` points at commit `445806d9af40c614d3d79d9e6efcf096fb2823a6`
- npm latest: `0.28.6`
- CI run: `27442870785` passed for the release commit
- CLI Smoke run: `27442870779` passed on Ubuntu, macOS, and Windows
- Publish workflow run: `27442925865` passed and published `agentloopkit@0.28.6` through npm trusted publishing
- Docker workflow run: `27442925900` passed and published the GHCR image for `0.28.6`
- MCP Registry workflow run: `27443148213` passed and published registry metadata for `io.github.abhiyoheswaran1/agentloopkit`
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

Docker is not installed in the local maintainer shell, and the current GitHub token lacks `read:packages`, so this page records the successful Docker workflow as GHCR proof instead of a locally pulled image digest.

## Latest Release Highlights

Released in `0.28.6`:

- `agentloop release-check` warns when the latest generated release notes do not mention the local package version
- `agentloop release-check --strict` fails stale release-note evidence before a maintainer cuts a release
- release notes for `0.28.6` were generated from a clean `v0.28.5..HEAD` range

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.28.6 version
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

Local release gate for `0.28.6`:

- `node scripts/prepublish-check.mjs`
- `npm test -- tests/release-check.test.ts tests/release-smoke.test.ts`
- `npm run typecheck`
- `npm run build`
- `npm run smoke:release`
- `npm run dogfood:strict`
- `node dist/cli/index.js release-check --strict`
- `npx --yes projscan doctor --format markdown`: A 100/100

Post-publish checks:

- `npm view agentloopkit version versions --json`: latest `0.28.6`
- `node dist/cli/index.js npm-status --agentloopkit --expect-current --json`: status `current`
- `npm run smoke:published -- --version 0.28.6`: passed
- `npx --yes agentloopkit@0.28.6 version`: reported `0.28.6` through the published-package smoke
- GitHub release asset digest matched the local tarball SHA-256
- CI, CLI Smoke, Publish, Docker, and MCP Registry workflows passed

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm run check:links`: 1439 Markdown files checked
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes projscan doctor --format markdown`: A 100/100
