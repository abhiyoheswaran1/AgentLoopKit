# Release Status

Last checked: June 10, 2026.

## Current State

- Current GitHub release: `v0.25.0`
- Current GitHub release asset: `agentloopkit-0.25.0.tgz`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.25.0>
- Tarball SHA-256: `f39669cf62ec5a455bad788223040dd0a0c65dcb86665cf6086f04a84d9ff427`
- CI run: `27279587748` passed for the `0.25.0` release commit
- Publish workflow run: `27279602386` passed and published `agentloopkit@0.25.0` through npm trusted publishing
- Manual npm publish: succeeded for `agentloopkit@0.24.0` after browser authentication
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`
- npm latest: `0.25.0`
- npm versions: `0.1.0`, `0.1.1`, `0.24.0`, `0.24.1`, `0.24.2`, `0.24.3`, `0.24.4`, `0.24.5`, `0.25.0`

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
npx --yes agentloopkit@0.25.0 version
```

GitHub release tarballs remain useful for provenance checks and rollback, but normal users should use npm or npx.

## npm Catch-Up Result

GitHub releases already exist for the intermediate AgentLoopKit versions between the npm-published `0.1.1` package and the `v0.24.0` source line. Publishing older numbers from current `main` would create npm packages that do not match their GitHub tags.

The one-time catch-up publish shipped `0.24.0`, then trusted publishing shipped `0.24.1`, `0.24.2`, `0.24.3`, `0.24.4`, `0.24.5`, and `0.25.0` from the GitHub release workflow. Future releases should continue with normal sequential semver from the current source.

## Publish History

The GitHub Publish workflow for `v0.24.0` (run `27262870591`) passed install, lint, typecheck, 121 Vitest tests, build, npm upgrade, npm version check, and `prepublishOnly`, then npm rejected `npm publish --access public` before the trusted publisher connection existed:

```text
npm error code E404
npm error 404 Not Found - PUT https://registry.npmjs.org/agentloopkit - Not found
npm error 404 The requested resource 'agentloopkit@0.24.0' could not be found or you do not have permission to access it.
```

The maintainer then completed browser authentication and published `0.24.0` manually. The next GitHub releases, `v0.24.1`, `v0.24.2`, `v0.24.3`, `v0.24.4`, `v0.24.5`, and `v0.25.0`, published successfully through trusted publishing. The npm package now reports latest `0.25.0`.

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

Local release-candidate checks for `0.25.0`:

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

Latest release-status documentation checks also passed:

- `npm view agentloopkit version versions --json`
- `npx --yes agentloopkit@0.25.0 version`
- `npx --yes --package agentloopkit@0.25.0 agentloopkit version`
- `npx --yes agentloopkit@0.25.0 init --local-only` in a clean temp Git repo
- `node dist/cli/index.js npm-status --expect-current`
- `npx pnpm@10.12.1 check:links`
- `git diff --check`
- `node scripts/prepublish-check.mjs`
- `npx projscan doctor --format markdown`
- AgentLoop verification with Vitest, lint, typecheck, and build
- GitHub release asset digest matched the local tarball SHA-256
