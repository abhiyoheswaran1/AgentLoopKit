# Release Status

Last checked: June 10, 2026.

## Current State

- Current GitHub release: `v0.26.1`
- Current GitHub release asset: `agentloopkit-0.26.1.tgz`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.26.1>
- Tarball SHA-256: `cf836155a2cdfaf8eff818202aa651fc32b3b39a49256f25d0925ffbadad5cc6`
- CI run: `27283261603` passed for the `0.26.1` release commit
- Publish workflow run: `27283286721` passed and published `agentloopkit@0.26.1` through npm trusted publishing
- Docker workflow run: `27283287182` passed and published the GHCR image for `0.26.1`
- MCP Registry workflow run: `27283372191` passed and published registry metadata for `io.github.abhiyoheswaran1/agentloopkit`
- Homebrew tap: <https://github.com/abhiyoheswaran1/homebrew-agentloopkit> with formula `0.26.1`
- Manual npm publish: succeeded for `agentloopkit@0.24.0` after browser authentication
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`
- npm latest: `0.26.1`
- npm versions: `0.1.0`, `0.1.1`, `0.24.0`, `0.24.1`, `0.24.2`, `0.24.3`, `0.24.4`, `0.24.5`, `0.25.0`, `0.26.0`, `0.26.1`

Run the local registry check at any time:

```bash
agentloop npm-status
agentloop npm-status --expect-current
```

`--expect-current` should pass when `package.json` matches npm latest.

## Use The Current CLI Today

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.26.1 version
```

GitHub release tarballs remain useful for provenance checks and rollback, but normal users should use npm or npx.

## npm Catch-Up Result

GitHub releases already exist for the intermediate AgentLoopKit versions between the npm-published `0.1.1` package and the `v0.24.0` source line. Publishing older numbers from current `main` would create npm packages that do not match their GitHub tags.

The one-time catch-up publish shipped `0.24.0`, then trusted publishing shipped `0.24.1`, `0.24.2`, `0.24.3`, `0.24.4`, `0.24.5`, `0.25.0`, `0.26.0`, and `0.26.1` from the GitHub release workflow. Future releases should continue with normal sequential semver from the current source.

## Publish History

The GitHub Publish workflow for `v0.24.0` (run `27262870591`) passed install, lint, typecheck, 121 Vitest tests, build, npm upgrade, npm version check, and `prepublishOnly`, then npm rejected `npm publish --access public` before the trusted publisher connection existed:

```text
npm error code E404
npm error 404 Not Found - PUT https://registry.npmjs.org/agentloopkit - Not found
npm error 404 The requested resource 'agentloopkit@0.24.0' could not be found or you do not have permission to access it.
```

The maintainer then completed browser authentication and published `0.24.0` manually. The next GitHub releases through `v0.26.1` published successfully through trusted publishing. The npm package now reports latest `0.26.1`.

## Next Publish

Use the GitHub Actions publish workflow for the next release after release metadata is prepared:

- npm trusted publishing is configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`.
- `.github/workflows/publish.yml` has `id-token: write`.
- `package.json` and `CHANGELOG.md` agree on the next version.
- `agentloop npm-status --expect-current` passes before bumping, or the version gap is explained in release notes.

Do not publish stale intermediate versions from current `main`. If an old version must be reproduced, use its matching GitHub tag or release tarball.

After each publish:

- update this page with the new npm proof;
- update `docs/npm-publishing.md`, `docs/launch-checklist.md`, and `FINAL_HANDOFF.md`;
- run `agentloop npm-status --expect-current`;
- verify `npx --yes agentloopkit@<version> version`.

## Verification Evidence

Local release-candidate checks for `0.26.1`:

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
- packed README inspection for current pinned-version examples
- packed `agentloop init --local-only` smoke check
- focused MCP and distribution artifact tests
- MCP Registry description length validation through successful registry workflow

Latest release-status documentation checks also passed:

- `npm view agentloopkit version versions --json`
- `npx --yes agentloopkit@0.26.1 version`
- `npx --yes agentloopkit@0.26.1 init --dry-run` in a clean temp Git repo
- `node dist/cli/index.js npm-status --expect-current`
- `npx pnpm@10.12.1 check:links`
- `git diff --check`
- `node scripts/prepublish-check.mjs`
- `npx projscan doctor --format markdown`
- AgentLoop verification with Vitest, lint, typecheck, and build
- GitHub release asset digest matched the local tarball SHA-256
- Homebrew tap install, `agentloop version`, `agentloopkit version`, and `brew test`
