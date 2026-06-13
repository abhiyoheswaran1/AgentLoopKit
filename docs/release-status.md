# Release Status

Last checked: June 13, 2026.

## Current State

- Current public release: `v0.30.0`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.30.0>
- Release asset: `agentloopkit-0.30.0.tgz`
- Release asset SHA-256: `405f3126d5f15dd8ba8e4a209b7844881680b5911590332776a42f120f49512b`
- Release tag `v0.30.0` points at commit `9c760380d6e776359923d1cda8ba81b3e95132b8`
- npm latest: `0.30.0`
- CI run: `27473628782` passed for the release commit
- CLI Smoke run: `27473628790` passed on Ubuntu, macOS, and Windows
- Publish workflow run: `27473635243` passed and published `agentloopkit@0.30.0` through npm trusted publishing
- Docker workflow run: `27473635222` passed and published the GHCR image for `0.30.0`
- MCP Registry workflow run: `27473746085` passed and published registry metadata for `io.github.abhiyoheswaran1/agentloopkit`
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

Docker is not installed in the local maintainer shell, and the current GitHub token lacks `read:packages`, so this page records the successful Docker workflow as GHCR proof instead of a locally pulled image digest.

## Latest Release Highlights

Released in `0.30.0`:

- `agentloop upgrade-harness` audits older generated guidance without overwriting user edits.
- Existing-repo docs explain how to update the CLI, inspect old harness files, and keep using the current loop.
- Getting-started and generated harness guidance promote `verify`, `ship`, `prepare-pr`, and `maintainer-check`.
- MCP docs include read-only client setup examples.
- Maintainers get `npm run test:quick` for faster local sanity checks.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.30.0 version
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

Local release gate for `0.30.0`:

- `node scripts/prepublish-check.mjs`
- `npm test -- tests/release-notes.test.ts tests/release-smoke.test.ts tests/release-check.test.ts`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run check:links`
- `git diff --check`
- `npm run build`
- `npm run smoke:release`
- `npx --yes pnpm@10.12.1 audit --audit-level high`
- `npm run dogfood:strict`
- `node dist/cli/index.js release-check --strict`
- `npx --yes projscan doctor --format markdown`: A 100/100

Post-publish checks:

- `npm view agentloopkit version versions --json`: latest `0.30.0`
- `node dist/cli/index.js npm-status --agentloopkit --expect-current --json`: status `current`
- `npm run smoke:published -- --version 0.30.0`: passed
- `npx --yes agentloopkit@0.30.0 version`: reported `0.30.0` during published-package smoke
- GitHub release asset digest matched local tarball SHA-256 `405f3126d5f15dd8ba8e4a209b7844881680b5911590332776a42f120f49512b`
- CI, CLI Smoke, Publish, Docker, and MCP Registry workflows passed

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm run check:links`: 1763 Markdown files checked
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes pnpm@10.12.1 audit --audit-level high`
- `npx --yes projscan doctor --format markdown`: A 100/100
