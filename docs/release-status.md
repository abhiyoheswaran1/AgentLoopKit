# Release Status

Last checked: June 10, 2026.

## Current State

- Current GitHub release: `v0.27.0`
- Current GitHub release asset: `agentloopkit-0.27.0.tgz`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.27.0>
- Tarball SHA-256: `7ff6cb0b2079da83b6cc1cad2b59485337338167388ce1deae01f0752f98f3e0`
- CI run: `27300845808` passed for the `0.27.0` release commit
- Publish workflow run: `27300950330` passed and published `agentloopkit@0.27.0` through npm trusted publishing
- Docker workflow run: `27300951486` passed and published the GHCR image for `0.27.0`
- MCP Registry workflow run: `27301046893` passed and published registry metadata for `io.github.abhiyoheswaran1/agentloopkit`
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`
- npm latest: `0.27.0`
- Current `main` is accumulating unreleased work for the planned `0.28.0` batch

Do not publish or bump versions until the maintainer asks for release prep.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.27.0 version
```

GitHub release tarballs remain useful for provenance checks and rollback, but normal users should use npm or npx.

## Next Publish

Use the GitHub Actions publish workflow for the next release after release metadata is prepared:

- The next planned release is `0.28.0`; batch current unreleased work instead of cutting a version for every small improvement.
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

Local release-candidate checks for `0.27.0`:

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npx pnpm@10.12.1 check:links`
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npm run build`
- `npm run smoke:release`
- `npx projscan doctor --format markdown`
- `npm publish --access public --dry-run`
- focused task doctor, MCP, and distribution artifact tests
- MCP Registry description length validation through successful registry workflow

Latest release-status documentation checks also passed:

- `npm view agentloopkit version versions --json`
- direct temp install smoke for `agentloopkit@0.27.0`
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
