# Release Status

Last checked: June 12, 2026.

## Current State

- Current public release: `v0.28.3`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.28.3>
- Release asset: `agentloopkit-0.28.3.tgz`
- Release asset SHA-256: `e40d2f6434dd3d509f01588194469d9203bded2c583789484884699e128b718e`
- Release tag `v0.28.3` points at commit `f4cd47050ef190487350431cf1adff8b0788c809`
- npm latest: `0.28.3`
- CI run: `27423798870` passed for the release commit
- CLI Smoke run: `27423798891` passed on Ubuntu, macOS, and Windows
- Publish workflow run: `27423870384` passed and published `agentloopkit@0.28.3` through npm trusted publishing
- Docker workflow run: `27423870325` passed and published the GHCR image for `0.28.3`
- MCP Registry workflow run: `27424136328` passed and published registry metadata for `io.github.abhiyoheswaran1/agentloopkit`
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

Docker is not installed in the local maintainer shell, and the current GitHub token lacks `read:packages`, so this page records the successful Docker workflow as GHCR proof instead of a locally pulled image digest.

## Latest Release Highlights

Released in `0.28.3`:

- `agentloop ship` keeps archived latest-run task evidence after normal task cleanup
- `agentloop prepare-pr` keeps archived task titles, acceptance criteria, risk notes, and rollback notes after cleanup
- `agentloop prepare-pr` reuses fresh archived-task ship evidence instead of writing duplicate ship runs
- subprocess-heavy `ship` and `prepare-pr` integration tests now have explicit timeout budgets for release-hook stability

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.28.3 version
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

Local release gate for `0.28.3`:

- `npm run lint`
- `npm run typecheck`
- `npm test`: 51 files, 441 tests
- `npm run check:links`
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npm run build`
- `npm run smoke:release`
- `node scripts/smoke-cli.mjs`
- `node dist/cli/index.js artifacts --json`
- `npx --yes projscan doctor --format markdown`: A 100/100
- `npm run dogfood:strict`
- `npm publish --access public --dry-run`
- `npm pack --pack-destination /tmp --silent`

Post-publish checks:

- `npm view agentloopkit version versions --json`: latest `0.28.3`
- `node dist/cli/index.js npm-status --agentloopkit --expect-current --json`: status `current`
- `npm run smoke:published -- --version 0.28.3`: passed
- `npx --yes agentloopkit@0.28.3 version`: reported `0.28.3` through the published-package smoke
- GitHub release asset digest matched the local tarball SHA-256
- CI, CLI Smoke, Publish, Docker, and MCP Registry workflows passed

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm test`: 51 files, 441 tests
- `npm run check:links`: 1314 Markdown files checked
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes projscan doctor --format markdown`: A 100/100
