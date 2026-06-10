# Release Handoff

## Summary

- GitHub release `v0.24.0` is current.
- npm still serves `0.1.1`.
- Public docs include temporary GitHub tarball usage.
- npm publish still needs trusted publishing setup or manual browser/OTP authentication.

## Evidence

- GitHub release: `https://github.com/OWNER/REPO/releases/tag/v0.24.0`
- GitHub asset: `agentloopkit-0.24.0.tgz`
- npm latest: `0.1.1`
- npm versions: `0.1.0`, `0.1.1`

## Verification

- `npm view agentloopkit version versions --json`: pass
- `npx pnpm@10.12.1 check:links`: pass
- `npx projscan doctor --format markdown`: pass

## Publish Status

- npm publish was not run in this example.
- Do not publish stale intermediate versions from current `main`.
- Publish the current GitHub release only after npm authentication or trusted publishing is fixed.

## Next Maintainer Action

- Configure npm trusted publishing for the repository, or complete manual browser/OTP authentication.
- Publish the current release line.
- Re-check `npm view agentloopkit version versions --json`.
- Remove temporary tarball fallback docs after npm catches up.

## Rollback

- Revert release-status documentation changes if they name the wrong release or registry state.
