# Release Status

Last checked: June 12, 2026.

## Current State

- Current GitHub release: `v0.28.1`
- Current GitHub release asset: `agentloopkit-0.28.1.tgz`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.28.1>
- Tarball SHA-256: `88add27b0cabb4f833866748398e078496d5770151f558dde8a093d464965ac6`
- CI run: `27410702770` passed for the `0.28.1` release commit
- CLI Smoke run: `27410702781` passed on Ubuntu, macOS, and Windows
- Publish workflow run: `27410709613` passed and published `agentloopkit@0.28.1` through npm trusted publishing
- Docker workflow run: `27410709578` passed and published the GHCR image for `0.28.1`
- GHCR image manifest: `ghcr.io/abhiyoheswaran1/agentloopkit:0.28.1` digest `sha256:d1a4c66e70d98cf6a18a261f513fce273b9c92727017c7ba910da391cfc11ea8`
- MCP Registry workflow run: `27410894807` passed and published registry metadata for `io.github.abhiyoheswaran1/agentloopkit`
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`
- npm latest: `0.28.1`
- Release tag `v0.28.1` points at commit `fd2c733`

## Latest Release Highlights

Released in `0.28.1`:

- repeatable local dogfood gates: `npm run dogfood` and `npm run dogfood:strict`
- official AgentLoopKit logo assets under `docs/logo/`
- refreshed README launch screenshots using the official mark
- README, contributor, and agent guidance for the dogfood gate
- stale release-guidance smoke coverage in public harness docs
- archived shipped internal task contracts and refreshed release evidence

These changes are recorded in `CHANGELOG.md` under `## 0.28.1`.

There is no active release candidate after `0.28.1`.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.28.1 version
```

GitHub release tarballs remain useful for provenance checks and rollback, but normal users should use npm or npx.

## Next Publish

Use the GitHub Actions publish workflow for the next release after release metadata is prepared:

- No next release is planned yet; batch current unreleased work instead of cutting a version for every small improvement.
- `package.json` and `CHANGELOG.md` must agree on the next version.
- `CHANGELOG.md` must have no real entries left under `## Unreleased`.
- `agentloop npm-status --agentloopkit --expect-current` should pass before the version bump, or the version gap must be explained in release notes.
- Do not publish stale intermediate versions from current `main`.

After each publish:

- update this page with the new npm proof;
- update `docs/npm-publishing.md`, `docs/launch-checklist.md`, and `FINAL_HANDOFF.md`;
- run `agentloop npm-status --agentloopkit --expect-current`;
- verify `npx --yes agentloopkit@<version> version`.

## Verification Evidence

Local release checks for `0.28.1`:

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npx pnpm@10.12.1 check:links`
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npm run build`
- `npm run smoke:release`
- `node scripts/smoke-cli.mjs`
- `node dist/cli/index.js artifacts --json`
- `npx projscan doctor --format markdown`
- `npm publish --access public --dry-run`
- focused task doctor, MCP, and distribution artifact tests
- MCP Registry description length validation through successful registry workflow

Latest release-status documentation checks also passed:

- `npm view agentloopkit version versions --json`
- direct temp install smoke for `agentloopkit@0.28.1`
- `npm run smoke:published -- --version 0.28.1`
- `npx --no-install agentloop version`
- `npx --no-install agentloopkit version`
- `npx --no-install agentloop init --dry-run`
- `node dist/cli/index.js npm-status --agentloopkit --expect-current`
- `npx pnpm@10.12.1 check:links`
- `git diff --check`
- `node scripts/prepublish-check.mjs`
- `npx projscan doctor --format markdown`
- AgentLoop verification with Vitest, lint, typecheck, and build
- live SchemaStore catalog check for `agentloop.config.json`
- GitHub release asset digest matched the local tarball SHA-256
