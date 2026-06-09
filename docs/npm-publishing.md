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

## Current `0.12.0` Publishing State

As of June 9, 2026:

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
- `agentloopkit@0.12.0` is prepared on `main` after `agentloop create-task --json` was added.
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

Publish `0.12.0` to npm only after npm trusted publishing is configured or local browser authentication succeeds.

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

For `v0.12.0`, the expected successful result is latest `0.12.0` and a versions list containing `0.12.0`.

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
