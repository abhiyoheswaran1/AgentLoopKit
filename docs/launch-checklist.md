# Launch Checklist

Use this before publishing AgentLoopKit.

## GitHub

- [ ] Repository description is set.
- [x] README includes launch visuals generated with Playwright and VHS.
- [ ] README renders cleanly on GitHub after push.
- [ ] CI is passing.
- [x] `v0.1.0` tag exists.
- [x] `v0.1.1` tag exists.
- [x] GitHub release notes are reviewed for `v0.1.1`.
- [x] GitHub release `v0.1.1` is published.
- [x] GitHub release `v0.2.0` is published.
- [x] GitHub release `v0.2.1` is published with npm-pending notes.
- [x] GitHub release `v0.3.0` is published with npm-pending notes.
- [x] GitHub release `v0.4.0` is published with npm-pending notes.
- [x] Good-first-issue labels are created.

## npm

- [x] Package `agentloopkit@0.1.0` is published.
- [x] Package `agentloopkit@0.1.1` is published.
- [x] Package `agentloopkit@0.2.0` is prepared.
- [ ] Package `agentloopkit@0.2.0` is published.
- [x] Package `agentloopkit@0.2.1` is prepared.
- [ ] Package `agentloopkit@0.2.1` is published.
- [x] Publish workflow for `v0.2.1` passed checks and failed at npm authorization.
- [x] Package `agentloopkit@0.3.0` is prepared on `main`.
- [x] Publish workflow for `v0.3.0` passed checks and failed at npm authorization.
- [ ] Package `agentloopkit@0.3.0` is published.
- [ ] Local `agentloopkit@0.3.0` publish completes browser/OTP authentication, or GitHub trusted publishing completes.
- [x] Package `agentloopkit@0.4.0` is prepared on `main`.
- [x] Publish workflow for `v0.4.0` passed checks and failed at npm authorization.
- [ ] Package `agentloopkit@0.4.0` is published.
- [ ] Local `agentloopkit@0.4.0` publish completes browser/OTP authentication, or GitHub trusted publishing completes.
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
npx --yes --package ./agentloopkit-0.2.0.tgz agentloop status --json
npx --yes --package ./agentloopkit-0.2.1.tgz agentloop version
npx --yes --package ./agentloopkit-0.2.1.tgz agentloop status --json
npx --yes --package ./agentloopkit-0.4.0.tgz agentloop version
```

## Publish

Preferred path:

1. Publish `agentloopkit@0.1.0` manually once.
2. Configure npm trusted publishing for future releases:
   - Owner: `abhiyoheswaran1`
   - Repository: `AgentLoopKit`
   - Workflow filename: `publish.yml`
   - Allowed action: `npm publish`
3. Publish GitHub releases, or rerun the manual Publish workflow for an existing release.
4. Confirm the publish workflow either skips an existing version or publishes the new version.
5. Run `npx agentloopkit init --dry-run` from a separate test repo.

Current recovery note:

- GitHub release `v0.2.0` is public.
- GitHub release `v0.2.1` is public.
- GitHub release `v0.3.0` is public.
- GitHub release `v0.4.0` is public.
- npm still reports `agentloopkit@0.1.1` as latest.
- `agentloopkit@0.2.1` passed release-candidate checks and the GitHub Publish workflow's prepublish checks, but npm rejected the publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- `agentloopkit@0.3.0` is now prepared on `main` after the handoff command, create-task flag, latest artifact selection, and create-task alias work.
- Local `npm publish --access public` for `0.3.0` passed `prepublishOnly`, then npm stopped at `EOTP`.
- GitHub Publish workflow for `v0.3.0` passed package checks and failed at npm authorization with `E404`.
- `agentloopkit@0.4.0` is now prepared on `main` for the active task lifecycle command.
- GitHub Publish workflow for `v0.4.0` passed package checks and failed at npm authorization with `E404`.
- Publish `0.4.0` only after npm trusted publishing is configured or local browser authentication succeeds.
