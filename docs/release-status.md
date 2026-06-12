# Release Status

Last checked: June 12, 2026.

## Current State

- Current public release: `v0.28.2`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.28.2>
- Release asset: `agentloopkit-0.28.2.tgz`
- Release asset SHA-256: `ea34d7a9d3edefea9ba7edd447cf3e1ec85dd8b94a8d638c7906182f61705b09`
- Release tag `v0.28.2` points at commit `fda3195d9ef816ca53084170eb84ce82c342c950`
- npm latest: `0.28.2`
- CI run: `27417101095` passed for the release commit
- CLI Smoke run: `27417101070` passed on Ubuntu, macOS, and Windows
- Publish workflow run: `27417122044` passed and published `agentloopkit@0.28.2` through npm trusted publishing
- Docker workflow run: `27417122089` passed and published the GHCR image for `0.28.2`
- MCP Registry workflow run: `27417334613` passed and published registry metadata for `io.github.abhiyoheswaran1/agentloopkit`
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

Docker is not installed in the local maintainer shell, and the current GitHub token lacks `read:packages`, so this page records the successful Docker workflow as GHCR proof instead of a locally pulled image digest.

## Latest Release Highlights

Released in `0.28.2`:

- `agentloop verify --task <path> --task-commands --only-task-commands` for focused task-contract verification
- JSON option errors when the focused shortcut is missing `--task` or `--task-commands`
- configured `test`, `lint`, `typecheck`, and `build` commands are recorded as not run when the focused shortcut is used
- README and verification docs now show explicit task paths when running task contract commands
- MCP Registry package metadata in `server.json` now matches `package.json`

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.28.2 version
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

Local release gate for `0.28.2`:

- `npm run lint`
- `npm run typecheck`
- `npm test`: 51 files, 436 tests
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

- `npm view agentloopkit version versions --json`: latest `0.28.2`
- `node dist/cli/index.js npm-status --agentloopkit --expect-current --json`: status `current`
- `npm run smoke:published -- --version 0.28.2`: passed
- `npx --yes agentloopkit@0.28.2 version`: reported `0.28.2` through the published-package smoke
- GitHub release asset digest matched the local tarball SHA-256
- CI, CLI Smoke, Publish, Docker, and MCP Registry workflows passed

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm test -- tests/verification.test.ts tests/distribution-artifacts.test.ts`: 46 tests
- `npm run check:links`: 1263 Markdown files checked
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes projscan doctor --format markdown`: A 100/100
