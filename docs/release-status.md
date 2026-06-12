# Release Status

Last checked: June 12, 2026.

## Current State

- Current public release: `v0.28.5`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.28.5>
- Release asset: `agentloopkit-0.28.5.tgz`
- Release asset SHA-256: `89244fd07cb85c2615adf7461cbb9a71d24b83858752acc22f83752fe1e47ba7`
- Release tag `v0.28.5` points at commit `65ab0d7eb19b6d5817d86d1ba4e7224476788e5c`
- npm latest: `0.28.5`
- CI run: `27440864521` passed for the release commit
- CLI Smoke run: `27440864531` passed on Ubuntu, macOS, and Windows
- Publish workflow run: `27440882421` passed and published `agentloopkit@0.28.5` through npm trusted publishing
- Docker workflow run: `27440882387` passed and published the GHCR image for `0.28.5`
- MCP Registry workflow run: `27441104421` passed and published registry metadata for `io.github.abhiyoheswaran1/agentloopkit`
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

Docker is not installed in the local maintainer shell, and the current GitHub token lacks `read:packages`, so this page records the successful Docker workflow as GHCR proof instead of a locally pulled image digest.

## Latest Release Highlights

Released in `0.28.5`:

- `agentloop release-check` routes the ready-state next action through `agentloop npm-status` before publishing
- `agentloop check-gates --strict` passes clean committed work when task, verification, and handoff evidence exist
- clean Git context still reports `No changed files detected`, but no longer fails strict gates by itself

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.28.5 version
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

Local release gate for `0.28.5`:

- `npm run lint`
- `npm run typecheck`
- `npm test`: 51 files, 455 tests
- `npm run check:links`
- `node scripts/prepublish-check.mjs`
- `npm run build`
- `npm run smoke:release`
- `node scripts/smoke-cli.mjs`
- `npm publish --access public --dry-run`
- `npm pack --pack-destination /tmp --silent`
- `npm run dogfood:strict`
- `node dist/cli/index.js release-check --strict`
- `npx --yes projscan doctor --format markdown`: A 100/100

Post-publish checks:

- `npm view agentloopkit version versions --json`: latest `0.28.5`
- `node dist/cli/index.js npm-status --agentloopkit --expect-current --json`: status `current`
- `npm run smoke:published -- --version 0.28.5`: passed
- `npx --yes agentloopkit@0.28.5 version`: reported `0.28.5` through the published-package smoke
- GitHub release asset digest matched the local tarball SHA-256
- CI, CLI Smoke, Publish, Docker, and MCP Registry workflows passed

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm run check:links`: 1420 Markdown files checked
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes projscan doctor --format markdown`: A 100/100
