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
- [x] GitHub release `v0.5.0` is published with npm-pending notes.
- [x] GitHub release `v0.6.0` is published with npm-pending notes.
- [x] GitHub release `v0.7.0` is published with npm-pending notes.
- [x] GitHub release `v0.8.0` is published with npm-pending notes.
- [x] GitHub release `v0.9.0` is published with npm-pending notes.
- [x] GitHub release `v0.10.0` is published with npm-pending notes.
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
- [x] Package `agentloopkit@0.5.0` is prepared on `main`.
- [x] Publish workflow for `v0.5.0` passed checks and failed at npm authorization.
- [ ] Package `agentloopkit@0.5.0` is published.
- [ ] Local `agentloopkit@0.5.0` publish completes browser/OTP authentication, or GitHub trusted publishing completes.
- [x] Package `agentloopkit@0.6.0` is prepared on `main`.
- [x] Publish workflow for `v0.6.0` passed checks and failed at npm authorization.
- [x] Try local `npm publish --access public` for `0.6.0`; package checks passed, npm required browser/OTP authentication.
- [ ] Package `agentloopkit@0.6.0` is published.
- [ ] Local `agentloopkit@0.6.0` publish completes browser/OTP authentication, or GitHub trusted publishing completes.
- [x] Package `agentloopkit@0.7.0` is prepared on `main`.
- [x] Publish workflow for `v0.7.0` passed checks and failed at npm authorization.
- [x] Try local `npm publish --access public` for `0.7.0`; package checks passed, npm required browser/OTP authentication.
- [ ] Package `agentloopkit@0.7.0` is published.
- [ ] Local `agentloopkit@0.7.0` publish completes browser/OTP authentication, or GitHub trusted publishing completes.
- [x] Package `agentloopkit@0.8.0` is prepared on `main`.
- [x] Publish workflow for `v0.8.0` passed checks and failed at npm authorization.
- [x] Try local `npm publish --access public` for `0.8.0`; package checks passed, npm required browser/OTP authentication.
- [ ] Package `agentloopkit@0.8.0` is published.
- [ ] Local `agentloopkit@0.8.0` publish completes browser/OTP authentication, or GitHub trusted publishing completes.
- [x] Package `agentloopkit@0.9.0` is prepared on `main`.
- [x] Publish workflow for `v0.9.0` passed checks and failed at npm authorization.
- [ ] Package `agentloopkit@0.9.0` is published.
- [ ] Local `agentloopkit@0.9.0` publish completes browser/OTP authentication, or GitHub trusted publishing completes.
- [x] Package `agentloopkit@0.10.0` is prepared on `main`.
- [x] Publish workflow for `v0.10.0` passed checks and failed at npm authorization.
- [ ] Package `agentloopkit@0.10.0` is published.
- [ ] Local `agentloopkit@0.10.0` publish completes browser/OTP authentication, or GitHub trusted publishing completes.
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
pnpm check:links
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
npx --yes --package ./agentloopkit-0.5.0.tgz agentloop task list --json
npx --yes --package ./agentloopkit-0.6.0.tgz agentloop task show .agentloop/tasks/smoke-task.md --json
npx --yes --package ./agentloopkit-0.7.0.tgz agentloop doctor --json
npx --yes --package ./agentloopkit-0.8.0.tgz agentloop doctor --json
npx --yes --package ./agentloopkit-0.9.0.tgz agentloop task status .agentloop/tasks/smoke-task.md done --json
npx --yes --package ./agentloopkit-0.10.0.tgz agentloop completion zsh
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
- GitHub release `v0.5.0` is public.
- GitHub release `v0.6.0` is public with attached `agentloopkit-0.6.0.tgz`.
- GitHub release `v0.7.0` is public with attached `agentloopkit-0.7.0.tgz`.
- GitHub release `v0.8.0` is public with attached `agentloopkit-0.8.0.tgz`.
- GitHub release `v0.9.0` is public with attached `agentloopkit-0.9.0.tgz`.
- GitHub release `v0.10.0` is public with attached `agentloopkit-0.10.0.tgz`.
- npm still reports `agentloopkit@0.1.1` as latest.
- `agentloopkit@0.2.1` passed release-candidate checks and the GitHub Publish workflow's prepublish checks, but npm rejected the publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- `agentloopkit@0.3.0` is now prepared on `main` after the handoff command, create-task flag, latest artifact selection, and create-task alias work.
- Local `npm publish --access public` for `0.3.0` passed `prepublishOnly`, then npm stopped at `EOTP`.
- GitHub Publish workflow for `v0.3.0` passed package checks and failed at npm authorization with `E404`.
- `agentloopkit@0.4.0` is now prepared on `main` for the active task lifecycle command.
- GitHub Publish workflow for `v0.4.0` passed package checks and failed at npm authorization with `E404`.
- `agentloopkit@0.5.0` is now prepared on `main` for the task-list command.
- GitHub Publish workflow for `v0.5.0` passed package checks and failed at npm authorization with `E404`.
- Local `npm publish --access public` for `0.5.0` passed `prepublishOnly`, then npm stopped at `EOTP`.
- `agentloopkit@0.6.0` is now prepared on `main` for the task-show command.
- GitHub Publish workflow for `v0.6.0` passed package checks and `prepublishOnly`, then npm rejected the final publish with `E404`.
- Local `npm publish --access public` for `0.6.0` passed `prepublishOnly`, then npm stopped at `EOTP`.
- `agentloopkit@0.7.0` is now prepared on `main` for monorepo doctor awareness.
- GitHub Publish workflow for `v0.7.0` passed package checks and failed at npm authorization with `E404`.
- Local `npm publish --access public` for `0.7.0` passed `prepublishOnly`, then npm stopped at `EOTP`.
- `agentloopkit@0.8.0` is now prepared on `main` for monorepo guidance and Markdown link checking.
- GitHub Publish workflow for `v0.8.0` passed package checks and failed at npm authorization with `E404`.
- Local `npm publish --access public` for `0.8.0` passed `prepublishOnly`, then npm stopped at `EOTP`.
- Publish `0.8.0` to npm only after npm trusted publishing is configured or local browser authentication succeeds.
- `agentloopkit@0.9.0` is now prepared on `main` for task status transitions.
- GitHub Publish workflow for `v0.9.0` passed package checks and failed at npm authorization with `E404`.
- npm latest remains `0.1.1`; registry versions are `0.1.0` and `0.1.1`.
- Publish `0.9.0` to npm only after npm trusted publishing is configured or local browser authentication succeeds.
- `agentloopkit@0.10.0` is now prepared on `main` for shell completions.
- GitHub Publish workflow for `v0.10.0` passed package checks and failed at npm authorization with `E404`.
- Publish `0.10.0` to npm only after npm trusted publishing is configured or local browser authentication succeeds.
