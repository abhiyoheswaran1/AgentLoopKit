# Release Status

Last checked: June 10, 2026.

## Current State

- Current GitHub release: `v0.24.0`
- Current GitHub release asset: `agentloopkit-0.24.0.tgz`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.24.0>
- Tarball SHA-256: `4e721a9627d94944f300a60d71a14b0e519045ac3eb51d637f7227503f2a962d`
- CI run: `27262792610` passed on commit `1f51e8b`
- Publish workflow run: `27262870591` passed package checks, then npm rejected publish with `E404`
- npm latest: `0.1.1`
- npm versions: `0.1.0`, `0.1.1`

Run the local registry check at any time:

```bash
agentloop npm-status
agentloop npm-status --expect-current
```

`--expect-current` should fail until npm latest matches `package.json`.

## Use The Current CLI Today

npm still serves `0.1.1`. Until npm catches up, run the current GitHub release tarball directly:

```bash
npx --yes --package https://github.com/abhiyoheswaran1/AgentLoopKit/releases/download/v0.24.0/agentloopkit-0.24.0.tgz agentloop version
npx --yes --package https://github.com/abhiyoheswaran1/AgentLoopKit/releases/download/v0.24.0/agentloopkit-0.24.0.tgz agentloop init
```

This is a temporary fallback. npm remains the intended main distribution path.
For a maintainer checklist that documents this state without publishing, see [release-checklist-example.md](release-checklist-example.md).

## npm Catch-Up Version

GitHub releases already exist for the intermediate AgentLoopKit versions between the npm-published `0.1.1` package and the current `v0.24.0` source line. Publishing older numbers from current `main` would create npm packages that do not match their GitHub tags.

Once npm authentication or trusted publishing works, the next npm publish should ship the current release line as `0.24.0`. Future releases should then continue with normal sequential semver from the current source.

## Publish Blocker

The GitHub Publish workflow for `v0.24.0` (run `27262870591`) passed install, lint, typecheck, 121 Vitest tests, build, npm upgrade, npm version check, and `prepublishOnly`, then npm rejected `npm publish --access public`:

```text
npm error code E404
npm error 404 Not Found - PUT https://registry.npmjs.org/agentloopkit - Not found
npm error 404 The requested resource 'agentloopkit@0.24.0' could not be found or you do not have permission to access it.
```

Local `npm whoami` currently returns `E401`, so local publish is blocked from this shell.

## Next Publish

Publish `agentloopkit@0.24.0` to npm after one of these is true:

- npm trusted publishing is configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`.
- local browser or OTP authentication succeeds and `npm whoami` returns the package owner.

Do not publish stale intermediate versions from current `main`. If an old version must be published, use its matching GitHub tag or release tarball.

After npm reports `0.24.0` or newer:

- remove the temporary GitHub tarball fallback from README;
- update this page with the new npm proof;
- update `docs/npm-publishing.md`, `docs/launch-checklist.md`, and `FINAL_HANDOFF.md`;
- run `agentloop npm-status --expect-current`;
- resume normal sequential semver.

## Verification Evidence

Local release-candidate checks for `0.24.0` passed:

- lint
- typecheck
- Vitest
- Markdown link checks
- build
- projscan
- `npm publish --access public --dry-run`
- packed-tarball smoke testing
- packed-tarball PowerShell completion smoke testing
- packed-tarball npm-status smoke testing

Latest release-status documentation checks also passed:

- `npx pnpm@10.12.1 check:links`
- `git diff --check`
- `node scripts/prepublish-check.mjs`
- `npx projscan doctor --format markdown`
- AgentLoop verification with Vitest, lint, typecheck, and build
- GitHub release asset digest matched the local tarball SHA-256
