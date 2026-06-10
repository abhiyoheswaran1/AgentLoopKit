# Release Status

Last checked: June 10, 2026.

## Current State

- Current GitHub release: `v0.23.0`
- Current GitHub release asset: `agentloopkit-0.23.0.tgz`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.23.0>
- Tarball SHA-256: `b96f356db5b5b2f94a0f284590f3d272afe20fe87b6668e10c599164be72b27f`
- npm latest: `0.1.1`
- npm versions: `0.1.0`, `0.1.1`

## Use The Current CLI Today

npm still serves `0.1.1`. Until npm catches up, run the current GitHub release tarball directly:

```bash
npx --yes --package https://github.com/abhiyoheswaran1/AgentLoopKit/releases/download/v0.23.0/agentloopkit-0.23.0.tgz agentloop version
npx --yes --package https://github.com/abhiyoheswaran1/AgentLoopKit/releases/download/v0.23.0/agentloopkit-0.23.0.tgz agentloop init
```

This is a temporary fallback. npm remains the intended main distribution path.

## Publish Blocker

The GitHub Publish workflow for `v0.23.0` (run `27253066701`) passed package checks, then npm rejected `npm publish --access public` with authorization `E404`.

Local `npm whoami` currently returns `E401`, so local publish is blocked from this shell.

## Next Publish

Publish `agentloopkit@0.23.0` to npm after one of these is true:

- npm trusted publishing is configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`.
- local browser or OTP authentication succeeds and `npm whoami` returns the package owner.

Do not publish stale intermediate versions from current `main`. If an old version must be published, use its matching GitHub tag or release tarball.

After npm reports `0.23.0` or newer:

- remove the temporary GitHub tarball fallback from README;
- update this page with the new npm proof;
- update `docs/npm-publishing.md`, `docs/launch-checklist.md`, and `FINAL_HANDOFF.md`;
- resume normal sequential semver.

## Verification Evidence

Local release-candidate checks for `0.23.0` passed:

- lint
- typecheck
- Vitest
- Markdown link checks
- build
- projscan
- `npm publish --access public --dry-run`
- packed-tarball smoke testing
- packed-tarball PowerShell completion smoke testing

Latest release-status documentation checks also passed:

- `npx pnpm@10.12.1 check:links`
- `git diff --check`
- `node scripts/prepublish-check.mjs`
- `npx projscan doctor --format markdown`
- AgentLoop verification with Vitest, lint, typecheck, and build
