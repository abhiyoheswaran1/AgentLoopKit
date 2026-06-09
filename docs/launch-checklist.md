# Launch Checklist

Use this before publishing AgentLoopKit.

## GitHub

- [ ] Repository description is set.
- [x] README includes launch visuals generated with Playwright and VHS.
- [ ] README renders cleanly on GitHub after push.
- [ ] CI is passing.
- [x] `v0.1.0` tag exists.
- [x] GitHub release notes are reviewed.
- [x] Draft release is prepared with the release tarball.
- [ ] Good-first-issue labels are created.

## npm

- [x] Package `agentloopkit@0.1.0` is published.
- [x] Package `agentloopkit@0.1.1` is prepared.
- [ ] Package `agentloopkit@0.1.1` is published.
- [ ] npm trusted publishing is configured for this repository.
- [x] `npm whoami` works for manual fallback.
- [x] `pnpm pack` contains `dist`, `schema`, README, LICENSE, and package metadata.
- [x] No `postinstall` script exists.
- [x] No telemetry, cloud calls, or credential access exist.

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm pack
npx projscan doctor --format markdown
```

## Smoke Test

```bash
npx --yes --package ./agentloopkit-0.1.0.tgz agentloop version
npx --yes --package ./agentloopkit-0.1.0.tgz agentloop init --dry-run --json
npx --yes --package ./agentloopkit-0.1.1.tgz agentloop version
```

## Publish

Preferred path:

1. Publish `agentloopkit@0.1.0` manually once.
2. Configure npm trusted publishing for future releases.
3. Publish GitHub releases.
4. Confirm the publish workflow either skips an existing version or publishes the new version.
5. Run `npx agentloopkit init --dry-run` from a separate test repo.
