# Launch Checklist

Use this before publishing AgentLoopKit.

## GitHub

- [ ] Repository description is set.
- [ ] README renders cleanly.
- [ ] CI is passing.
- [ ] `v0.1.0` tag exists.
- [ ] GitHub release notes are reviewed.
- [ ] Draft release is published when npm is ready.
- [ ] Good-first-issue labels are created.

## npm

- [ ] Package name `agentloopkit` is available.
- [ ] npm trusted publishing is configured for this repository.
- [ ] `npm whoami` works for manual fallback.
- [ ] `pnpm pack` contains `dist`, `schema`, README, LICENSE, and package metadata.
- [ ] No `postinstall` script exists.
- [ ] No telemetry, cloud calls, or credential access exist.

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
```

## Publish

Preferred path:

1. Configure npm trusted publishing.
2. Publish the GitHub release.
3. Confirm the publish workflow completes.
4. Run `npx agentloopkit init --dry-run` from a separate test repo.
