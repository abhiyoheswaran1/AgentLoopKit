# Release Status

Last checked: June 10, 2026.

## Current State

- Current GitHub release: `v0.24.1`
- Current GitHub release asset: `agentloopkit-0.24.1.tgz`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.24.1>
- Tarball SHA-256: pending until release asset is packed
- CI run: pending for the `0.24.1` release commit
- Publish workflow run: `27262870591` passed package checks before npm trusted publishing was configured, then npm rejected publish with `E404`
- Manual npm publish: succeeded for `agentloopkit@0.24.0` after browser authentication
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`
- npm latest: pending `0.24.1` release
- npm versions: `0.1.0`, `0.1.1`, `0.24.0`

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
npx --yes agentloopkit@0.24.1 version
```

GitHub release tarballs remain useful for provenance checks and rollback, but normal users should use npm or npx.

## npm Catch-Up Result

GitHub releases already exist for the intermediate AgentLoopKit versions between the npm-published `0.1.1` package and the current `v0.24.0` source line. Publishing older numbers from current `main` would create npm packages that do not match their GitHub tags.

The one-time catch-up publish shipped `0.24.0`. Future releases should continue with normal sequential semver from the current source.

## Publish History

The GitHub Publish workflow for `v0.24.0` (run `27262870591`) passed install, lint, typecheck, 121 Vitest tests, build, npm upgrade, npm version check, and `prepublishOnly`, then npm rejected `npm publish --access public` before the trusted publisher connection existed:

```text
npm error code E404
npm error 404 Not Found - PUT https://registry.npmjs.org/agentloopkit - Not found
npm error 404 The requested resource 'agentloopkit@0.24.0' could not be found or you do not have permission to access it.
```

The maintainer then completed browser authentication and published `0.24.0` manually. The npm package now reports latest `0.24.0`.

## Next Publish

Use the GitHub Actions publish workflow for the next release after release metadata is prepared:

- npm trusted publishing is configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`.
- `.github/workflows/publish.yml` has `id-token: write`.
- `package.json` and `CHANGELOG.md` agree on the next version.
- `agentloop npm-status --expect-current` passes before bumping, or the version gap is explained in release notes.

Do not publish stale intermediate versions from current `main`. If an old version must be reproduced, use its matching GitHub tag or release tarball.

After the next publish:

- update this page with the new npm proof;
- update `docs/npm-publishing.md`, `docs/launch-checklist.md`, and `FINAL_HANDOFF.md`;
- run `agentloop npm-status --expect-current`;
- verify `npx --yes agentloopkit@<version> version`.

## Verification Evidence

Local release-candidate checks for `0.24.1`:

- pending final release verification

Latest release-status documentation checks also passed:

- `npm view agentloopkit version versions --json`
- `npx --yes agentloopkit@0.24.1 version`
- `node dist/cli/index.js npm-status --expect-current`
- `npx pnpm@10.12.1 check:links`
- `git diff --check`
- `node scripts/prepublish-check.mjs`
- `npx projscan doctor --format markdown`
- AgentLoop verification with Vitest, lint, typecheck, and build
- GitHub release asset digest matched the local tarball SHA-256
