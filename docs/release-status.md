# Release Status

Last checked: June 12, 2026.

## Current State

- Current public release: `v0.28.7`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.28.7>
- Release asset: `agentloopkit-0.28.7.tgz`
- Release asset SHA-256: `cd2c1b019e6f2b9e5a88576548da4f81048ca24cd9a3e5edd34141b82d08d27b`
- Release tag `v0.28.7` points at commit `d7bc79d02dfa5c8b5602866fbb88436dcd60be47`
- npm latest: `0.28.7`
- CI run: `27445382568` passed for the release commit
- CLI Smoke run: `27445382562` passed on Ubuntu, macOS, and Windows
- Publish workflow run: `27445394952` passed and published `agentloopkit@0.28.7` through npm trusted publishing
- Docker workflow run: `27445394954` passed and published the GHCR image for `0.28.7`
- MCP Registry workflow run: `27445602561` passed and published registry metadata for `io.github.abhiyoheswaran1/agentloopkit`
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

Docker is not installed in the local maintainer shell, and the current GitHub token lacks `read:packages`, so this page records the successful Docker workflow as GHCR proof instead of a locally pulled image digest.

## Latest Release Highlights

Released in `0.28.7`:

- `agentloop release-notes --public` prints concise release-page Markdown.
- Public release notes keep the version, changelog items, verification status, selected git range, and install command.
- The detailed release-notes output remains the default local evidence format.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.28.7 version
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

Local release gate for `0.28.7`:

- `node scripts/prepublish-check.mjs`
- `npm test -- tests/release-notes.test.ts tests/release-smoke.test.ts tests/release-check.test.ts`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run check:links`
- `git diff --check`
- `npm run build`
- `npm run smoke:release`
- `npm run dogfood:strict`
- `node dist/cli/index.js release-check --strict`
- `npx --yes projscan doctor --format markdown`: A 100/100

Post-publish checks:

- `npm view agentloopkit version versions --json`: latest `0.28.7`
- `node dist/cli/index.js npm-status --agentloopkit --expect-current --json`: status `current`
- `npm run smoke:published -- --version 0.28.7`: passed
- `npx --yes agentloopkit@0.28.7 version`: reported `0.28.7` through the published-package smoke
- GitHub release asset digest matched the local tarball SHA-256
- CI, CLI Smoke, Publish, Docker, and MCP Registry workflows passed

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm run check:links`: 1452 Markdown files checked
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes projscan doctor --format markdown`: A 100/100
