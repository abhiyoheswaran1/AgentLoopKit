# npm Publishing

Package name: `agentloopkit`

CLI binary:

- `agentloop`
- `agentloopkit`

## Prepublish Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm pack
```

`prepublishOnly` runs typecheck, tests, and build.

## Versioning

Update `package.json` and `CHANGELOG.md` before publishing.

```bash
pnpm version patch
```

## Publish

First publish:

```bash
npm login
npm whoami
npm publish --access public
```

The first publish creates the npm package. That step may require an OTP, depending on the npm account's security settings.

## Current `0.18.1` Publishing State

As of June 10, 2026:

Short version:

- npm previously served `agentloopkit@0.1.1` while GitHub release candidates from `v0.2.0` through `v0.15.1` were public.
- GitHub release `v0.16.0` is public with attached `agentloopkit-0.16.0.tgz`.
- GitHub release `v0.17.0` is public with attached `agentloopkit-0.17.0.tgz`.
- GitHub release `v0.18.0` is public with attached `agentloopkit-0.18.0.tgz`.
- `0.18.1` is the current catch-up release line for current source after adding policy customization guidance on top of `agentloop policy status`.
- Do not publish `0.16.0` or `0.17.0` from current `main`. `main` now contains behavior that was not in those release tags.
- Local `npm publish --access public` for `0.16.0` passed `prepublishOnly`, then npm stopped with `EOTP` because browser or one-time-password authentication is required.
- GitHub Publish workflow run `27241996432` for `v0.16.0` passed install, lint, typecheck, tests, build, npm upgrade, npm version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- GitHub Publish workflow run `27243165066` for `v0.17.0` passed install, lint, typecheck, tests, build, npm upgrade, npm version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- Local `npm publish ./agentloopkit-0.17.0.tgz --access public` matched the GitHub release tarball, reached npm, and stopped with `EOTP` because the account requires browser or one-time-password authentication.
- GitHub Publish workflow run `27244098928` for `v0.18.0` passed install, lint, typecheck, tests, build, npm upgrade, npm version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- Local `npm publish ./agentloopkit-0.18.0.tgz --access public` matched the GitHub release tarball, reached npm, and failed with authorization `E404`.
- Local `npm whoami` then returned `E401`, so the local npm session needs a fresh login before another local publish attempt.
- npm latest remains `agentloopkit@0.1.1` until that authentication completes.
- Do not publish `0.15.1` to npm now. `main` has moved past that tag.
- After the current package line lands on npm, resume normal semver publishing. Do not keep creating higher versions just because npm authorization was blocked.

Why npm should jump to `0.18.1`:

- The skipped npm numbers were used as public GitHub release candidates while npm publishing was blocked.
- Current `main` contains code that belongs to the `0.18.1` release line, including policy customization guidance in bundled templates.
- Backfilling old versions from current `main` would make npm metadata lie about what those old tags contained.
- Publishing `0.18.1` once, then returning to `0.18.2`, `0.19.0`, and later semver releases, gives users the least confusing path.

Historical publishing log:

- GitHub release `v0.2.0` is public.
- GitHub release `v0.2.1` is public.
- GitHub release `v0.3.0` is public with a tarball asset.
- GitHub release `v0.4.0` is public with a tarball asset.
- GitHub release `v0.5.0` is public with a tarball asset.
- GitHub release `v0.6.0` is public with a tarball asset.
- GitHub release `v0.7.0` is public with a tarball asset.
- GitHub release `v0.8.0` is public with a tarball asset.
- GitHub release `v0.9.0` is public with a tarball asset.
- GitHub release `v0.10.0` is public with a tarball asset.
- GitHub release `v0.11.0` is public with a tarball asset.
- GitHub release `v0.12.0` is public with a tarball asset.
- GitHub release `v0.13.0` is public with a tarball asset.
- GitHub release `v0.14.0` is public with a tarball asset.
- `agentloopkit@0.14.0` is prepared on `main` after `agentloop check-gates --strict` was added.
- GitHub release `v0.15.0` is public with a tarball asset.
- GitHub release `v0.15.1` is public with a tarball asset.
- npm latest is still `agentloopkit@0.1.1`.
- `agentloopkit@0.2.0` passed local preflight, `npm publish --dry-run`, tarball smoke testing, and the GitHub publish workflow's install, lint, typecheck, test, and build steps.
- GitHub Actions reached `npm publish`, then npm rejected the workflow because the package does not have a matching trusted publisher configuration.
- A local `npm publish --access public` retry also reached npm browser authentication, then failed at npm's auth completion endpoint.
- `agentloopkit@0.2.1` passed local lint, typecheck, Vitest, build, projscan, pack, dry-run publish, and tarball smoke tests.
- The `v0.2.1` GitHub Publish workflow passed install, lint, typecheck, tests, build, and `prepublishOnly`, then npm rejected `npm publish` with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- `agentloopkit@0.3.0` is prepared on `main` after the `agentloop handoff` command, create-task flag fixes, and latest artifact selection were added.
- A local `npm publish --access public` attempt for `0.3.0` passed typecheck, Vitest, and build through `prepublishOnly`, then npm stopped at `EOTP` because the account requires browser or one-time-password authentication.
- GitHub Publish workflow run `27215993837` for `v0.3.0` passed install, lint, typecheck, tests, build, npm upgrade, version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- Stale manual GitHub Publish workflow run `27215293502` targeted an older `0.3.0` commit and was cancelled after the `v0.3.0` release workflow ran.
- GitHub Publish workflow run `27217477927` for `v0.4.0` passed install, lint, typecheck, tests, build, npm upgrade, version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- `agentloopkit@0.5.0` is prepared on `main` after the `agentloop task list` command and generated agent guidance updates.
- GitHub Publish workflow run `27218845454` for `v0.5.0` passed install, lint, typecheck, tests, build, npm upgrade, version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- A local `npm publish --access public` attempt for `0.5.0` passed typecheck, Vitest, and build through `prepublishOnly`, then npm stopped at `EOTP` because the account requires browser or one-time-password authentication.
- `agentloopkit@0.6.0` is prepared on `main` after the `agentloop task show` command, generated agent guidance updates, and refreshed README visuals.
- GitHub Publish workflow run `27220705510` for `v0.6.0` passed install, lint, typecheck, tests, build, npm upgrade, version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- A local `npm publish --access public` attempt for `0.6.0` passed typecheck, Vitest, and build through `prepublishOnly`, then npm stopped at `EOTP` because the account requires browser or one-time-password authentication.
- `agentloopkit@0.7.0` is prepared on `main` after monorepo doctor awareness was added.
- GitHub Publish workflow run `27221868983` for `v0.7.0` passed install, lint, typecheck, tests, build, npm upgrade, version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- A local `npm publish --access public` attempt for `0.7.0` passed typecheck, Vitest, and build through `prepublishOnly`, then npm stopped at `EOTP` because the account requires browser or one-time-password authentication.
- `agentloopkit@0.8.0` is prepared on `main` after monorepo guidance, actionable doctor warnings, and Markdown link checking were added.
- GitHub Publish workflow run `27223669061` for `v0.8.0` passed install, lint, typecheck, tests, build, npm upgrade, version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- A local `npm publish --access public` attempt for `0.8.0` passed typecheck, Vitest, and build through `prepublishOnly`, then npm stopped at `EOTP` because the account requires browser or one-time-password authentication.
- `agentloopkit@0.9.0` is prepared on `main` after task status transitions were added.
- GitHub Publish workflow run `27225348061` for `v0.9.0` passed install, lint, typecheck, tests, build, npm upgrade, version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- `agentloopkit@0.10.0` is prepared on `main` after shell completions were added.
- GitHub Publish workflow run `27226815977` for `v0.10.0` passed install, lint, typecheck, tests, build, npm upgrade, version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- npm registry proof after the `v0.10.0` release still reports latest `0.1.1` and versions `0.1.0`, `0.1.1`.
- `agentloopkit@0.11.0` is prepared on `main` after task archiving was added.
- GitHub Publish workflow run `27228991068` for `v0.11.0` passed install, lint, typecheck, tests, build, npm upgrade, version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- npm registry proof after the `v0.11.0` release still reports latest `0.1.1` and versions `0.1.0`, `0.1.1`.
- `agentloopkit@0.12.0` is prepared on `main` after `create-task --json` was added and README assets were refreshed.
- GitHub Publish workflow run `27231031745` for `v0.12.0` passed install, lint, typecheck, tests, build, npm upgrade, version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- npm registry proof after the `v0.12.0` release still reports latest `0.1.1` and versions `0.1.0`, `0.1.1`.
- `agentloopkit@0.13.0` is prepared on `main` after `check-gates`, refreshed README assets, and the 70-test suite update.
- Local `0.13.0` release-candidate checks passed: source version, built version, Playwright screenshot render, VHS terminal render, lint, typecheck, Vitest, Markdown link check, build, projscan, pack, `npm publish --access public --dry-run`, and packed-tarball smoke testing.
- npm registry proof before the `v0.13.0` GitHub release still reports latest `0.1.1` and versions `0.1.0`, `0.1.1`.
- GitHub release `v0.13.0` is public with attached `agentloopkit-0.13.0.tgz`.
- GitHub Publish workflow run `27232852066` for `v0.13.0` passed install, lint, typecheck, tests, build, npm upgrade, npm version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- Local `npm publish --access public` for `0.13.0` passed `prepublishOnly`, then npm stopped with `EOTP` because the account requires browser or one-time-password authentication.
- npm registry proof after the `v0.13.0` release still reports latest `0.1.1` and versions `0.1.0`, `0.1.1`.
- `agentloopkit@0.14.0` is prepared on `main` after `check-gates --strict`, refreshed README asset sources, and the 71-test suite update.
- GitHub release `v0.14.0` is public with attached `agentloopkit-0.14.0.tgz`.
- GitHub Publish workflow run `27234726013` for `v0.14.0` passed install, lint, typecheck, tests, build, npm upgrade, npm version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- npm registry proof after the `v0.14.0` release still reports latest `0.1.1` and versions `0.1.0`, `0.1.1`.
- `agentloopkit@0.15.0` is prepared on `main` after CI context was added to verification reports.
- GitHub release `v0.15.0` is public with attached `agentloopkit-0.15.0.tgz`.
- GitHub release URL: `https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.15.0`.
- Tarball SHA-256: `e92f28382d16cccbebd027bbbcb5324f60de088e49bb611482b1e205f673f965`.
- GitHub Publish workflow run `27237034367` for `v0.15.0` passed install, lint, typecheck, tests, build, npm upgrade, npm version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- npm registry proof after the `v0.15.0` release still reports latest `0.1.1` and versions `0.1.0`, `0.1.1`.
- `agentloopkit@0.15.1` was prepared on `main` after doctor risk-file detail reporting and the GitHub raw config schema URL were added.
- GitHub release `v0.15.1` is public with attached `agentloopkit-0.15.1.tgz`.
- GitHub release URL: `https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.15.1`.
- Tarball SHA-256: `56b3ac5b212d24c2214e73a59c5e5fd08fe9f62a0e17956ec5c07cbad7672490`.
- GitHub Publish workflow run `27239176000` for `v0.15.1` passed install, lint, typecheck, tests, build, npm upgrade, npm version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- npm registry proof after the `v0.15.1` release still reports latest `0.1.1` and versions `0.1.0`, `0.1.1`.
- npm should jump from `0.1.1` to the current prepared release for the catch-up publish because older GitHub tags are already public and current source has moved forward.
- `agentloopkit@0.16.0` passed source version, built version, lint, typecheck, Vitest, Markdown link checks, build, projscan, `npm pack --dry-run`, `npm publish --access public --dry-run`, and packed-tarball smoke testing.
- Local `npm publish --access public` for `0.16.0` reached npm publish and stopped at `EOTP`.
- GitHub release URL: `https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.16.0`.
- GitHub release tarball SHA-256: `687dac923ee3976e4975641a20844ece4ce41c2123794423c46cd72091f8cb18`.
- `agentloopkit@0.17.0` passed source version, built version, lint, typecheck, Vitest, Markdown link checks, build, projscan, `npm pack`, `npm publish --access public --dry-run`, packed-tarball smoke testing, and CI.
- GitHub release URL: `https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.17.0`.
- GitHub release tarball SHA-256: `8b7bb6ae9307e79cf97e20e405a1cef6a4aefcc48466d865758cc87f3439d49c`.
- `agentloopkit@0.18.0` passed source version, built version, lint, typecheck, Vitest, Markdown link checks, build, projscan, `npm pack`, `npm publish --access public --dry-run`, packed-tarball smoke testing, and CI.
- GitHub release URL: `https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.18.0`.
- GitHub release tarball SHA-256: `7c3b6b7f12c34e57b9bfd70bb4491abd566b37b86bf0c642d9d517a7dcdb4d26`.
- `agentloopkit@0.18.1` passed source version, built version, lint, typecheck, Vitest, Markdown link checks, build, projscan, `npm pack`, `npm publish --access public --dry-run`, packed-tarball smoke testing, and VHS README terminal rendering.
- `agentloopkit@0.18.1` tarball SHA-256 before GitHub release: `01f38156e44610021752dadc90fe5d61f63ac210c3778274bce99b11833e972b`.

Publish the current prepared release to npm from its matching release commit after browser/OTP authentication completes. Do not backfill old npm versions with newer source.

Preferred release path after the first publish:

1. Configure npm trusted publishing for this GitHub repository.
2. Publish the GitHub release.
3. Let `.github/workflows/publish.yml` run `npm publish` through OIDC.

Trusted publisher settings:

- Organization/user: `abhiyoheswaran1`
- Repository: `AgentLoopKit`
- Workflow filename: `publish.yml`
- Environment name: leave blank unless a GitHub environment is added
- Allowed action: `npm publish`

npm trusted publishing requires npm CLI `11.5.1` or newer and Node.js `22.14.0` or newer. The publish workflow uses Node.js 24 and updates npm before publishing.

Configure this on npmjs.com:

1. Open `https://www.npmjs.com/package/agentloopkit`.
2. Go to package settings.
3. Open Trusted publishing.
4. Choose GitHub Actions.
5. Enter the owner, repository, workflow filename, and allowed action above.
6. Save the trusted publisher.
7. Rerun the GitHub Actions `Publish` workflow for the intended version.

Reference: [npm trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/).

The publish workflow can also be run manually from GitHub Actions after npm trusted publishing is configured. It checks whether the current `package.json` version already exists and skips publishing when npm already has that version.

If GitHub Actions reaches `npm publish` and npm returns `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`, check npm package permissions and trusted publisher settings. That error means npm did not authorize the workflow to publish the package.

Manual fallback:

```bash
npm login
npm publish --access public
```

Use browser or OTP authentication locally when npm asks for it. Do not paste npm OTPs or tokens into issues, PRs, chat logs, or release notes.

Trusted publishing creates provenance from GitHub Actions. Local fallback publishes do not create GitHub Actions provenance.

Before claiming a publish completed, verify:

```bash
npm view agentloopkit version
npm view agentloopkit versions --json
```

For the current `0.18.1` catch-up release, the expected successful result is latest `0.18.1` and a versions list containing `0.18.1`.

## Package Contents

The npm package includes:

- `dist`
- `schema`
- `README.md`
- `LICENSE`
- `package.json`

The built CLI copies templates into `dist/templates` and the config schema into `dist/schema`.

## npx Usage

Users run:

```bash
npx agentloopkit init
```

Do not require users to clone the repository.
