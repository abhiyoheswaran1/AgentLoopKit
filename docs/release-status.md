# Release Status

Last checked: June 12, 2026.

## Current State

- Current public release: `v0.28.4`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.28.4>
- Release asset: `agentloopkit-0.28.4.tgz`
- Release asset SHA-256: `9550589fcb6400d5d3972c2f308d60d7d25df0d85d70033f293d0ad709435a6f`
- Release tag `v0.28.4` points at commit `5bb4b21d6d736874deade7ac5933860a7b4e231e`
- npm latest: `0.28.4`
- CI run: `27435878819` passed for the release commit
- CLI Smoke run: `27435878785` passed on Ubuntu, macOS, and Windows
- Publish workflow run: `27436246020` passed and published `agentloopkit@0.28.4` through npm trusted publishing
- Docker workflow run: `27436246026` passed and published the GHCR image for `0.28.4`
- MCP Registry workflow run: `27436462226` passed and published registry metadata for `io.github.abhiyoheswaran1/agentloopkit`
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

Docker is not installed in the local maintainer shell, and the current GitHub token lacks `read:packages`, so this page records the successful Docker workflow as GHCR proof instead of a locally pulled image digest.

## Latest Release Highlights

Released in `0.28.4`:

- `agentloop verify --progress` prints bounded command progress for long verification runs
- `agentloop runs --latest` and `agentloop runs --limit <count>` make run-ledger inspection quieter
- `agentloop create-task --include-config-commands` copies configured verification commands into task contracts
- verification reports explain exact duplicate command skips in Markdown and JSON
- archived-task evidence reuse keeps run summaries and status guidance aligned after cleanup
- Vitest uses a 90 second timeout budget for subprocess-heavy CLI integration tests

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.28.4 version
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

Local release gate for `0.28.4`:

- `npm run lint`
- `npm run typecheck`
- `npm test`: 51 files, 455 tests
- `npm run check:links`
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npm run build`
- `npm run smoke:release`
- `node dist/cli/index.js release-check --strict`
- `npx --yes projscan doctor --format markdown`: A 100/100

Post-publish checks:

- `npm view agentloopkit version versions --json`: latest `0.28.4`
- `node dist/cli/index.js npm-status --agentloopkit --expect-current --json`: status `current`
- `npm run smoke:published -- --version 0.28.4`: passed
- `npx --yes agentloopkit@0.28.4 version`: reported `0.28.4` through the published-package smoke
- GitHub release asset digest matched the local tarball SHA-256
- CI, CLI Smoke, Publish, Docker, and MCP Registry workflows passed

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm test`: 51 files, 455 tests
- `npm run check:links`: 1397 Markdown files checked
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes projscan doctor --format markdown`: A 100/100
