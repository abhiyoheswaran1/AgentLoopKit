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

`prepublishOnly` runs the local changelog metadata guard, typecheck, tests, and build.

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

## Current `0.23.0` Publishing State

As of June 10, 2026:

For a compact current-state summary, see [release-status.md](release-status.md).
For a copyable maintainer handoff when GitHub is current but npm is blocked, see [release-checklist-example.md](release-checklist-example.md).
For a read-only registry catch-up check, see [npm-status.md](npm-status.md).

Short version:

- npm previously served `agentloopkit@0.1.1` while GitHub/source release candidates from `v0.2.0` through `v0.23.0` were public.
- Current source targets `0.23.0` with task-linked verification reports, failed-verification summaries, the guarded `--task` path behavior, refreshed README visuals, and PowerShell completions.
- `0.23.0` is the normal next release after `0.22.0`, not another arbitrary version jump.
- Publish older npm versions only from their matching GitHub release tarballs or tags.
- GitHub release `v0.16.0` is public with attached `agentloopkit-0.16.0.tgz`.
- GitHub release `v0.17.0` is public with attached `agentloopkit-0.17.0.tgz`.
- GitHub release `v0.18.0` is public with attached `agentloopkit-0.18.0.tgz`.
- GitHub release `v0.18.1` is public with attached `agentloopkit-0.18.1.tgz`.
- GitHub release `v0.19.0` is public with attached `agentloopkit-0.19.0.tgz`.
- GitHub release `v0.20.0` is public with attached `agentloopkit-0.20.0.tgz`.
- GitHub release `v0.21.0` is public with attached `agentloopkit-0.21.0.tgz`.
- GitHub release `v0.22.0` is public with attached `agentloopkit-0.22.0.tgz`.
- GitHub release `v0.23.0` is public with attached `agentloopkit-0.23.0.tgz`.
- GitHub release URL: `https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.23.0`.
- GitHub release tarball SHA-256: `b96f356db5b5b2f94a0f284590f3d272afe20fe87b6668e10c599164be72b27f`.
- The next npm publish should be the current GitHub release, `0.23.0`, not a backfill of old release-candidate numbers.
- Do not publish `0.16.0`, `0.17.0`, `0.18.0`, or `0.18.1` from current `main`. `main` now contains behavior that was not in those release tags.
- Local `npm publish --access public` for `0.16.0` passed `prepublishOnly`, then npm stopped with `EOTP` because browser or one-time-password authentication is required.
- GitHub Publish workflow run `27241996432` for `v0.16.0` passed install, lint, typecheck, tests, build, npm upgrade, npm version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- GitHub Publish workflow run `27243165066` for `v0.17.0` passed install, lint, typecheck, tests, build, npm upgrade, npm version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- Local `npm publish ./agentloopkit-0.17.0.tgz --access public` matched the GitHub release tarball, reached npm, and stopped with `EOTP` because the account requires browser or one-time-password authentication.
- GitHub Publish workflow run `27244098928` for `v0.18.0` passed install, lint, typecheck, tests, build, npm upgrade, npm version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- Local `npm publish ./agentloopkit-0.18.0.tgz --access public` matched the GitHub release tarball, reached npm, and failed with authorization `E404`.
- Local `npm whoami` then returned `E401`, so the local npm session needs a fresh login before another local publish attempt.
- GitHub Publish workflow run `27245167172` for `v0.18.1` passed install, lint, typecheck, tests, build, npm upgrade, npm version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- GitHub Publish workflow run `27246784493` for `v0.19.0` passed install, lint, typecheck, tests, build, npm upgrade, npm version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- GitHub Publish workflow run `27248000123` for `v0.20.0` passed install, lint, typecheck, tests, build, npm upgrade, npm version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- GitHub Publish workflow run `27249612803` for `v0.21.0` passed install, lint, typecheck, tests, build, npm upgrade, npm version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- GitHub Publish workflow run `27251450540` for `v0.22.0` passed install, lint, typecheck, tests, build, npm upgrade, npm version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- npm latest remains `agentloopkit@0.1.1`; registry versions are still `0.1.0` and `0.1.1`.
- `agentloop npm-status` should report `catch-up-needed` until npm latest equals the local package version.
- Do not publish `0.15.1` to npm now. `main` has moved past that tag.
- Do not publish `0.20.0`, `0.21.0`, or `0.22.0` from current `main`; current `main` now targets `0.23.0`.
- After the current package line lands on npm, resume normal semver publishing. Do not keep creating higher versions just because npm authorization was blocked.

Why npm should jump to the current GitHub release:

- The skipped npm numbers were used as public GitHub release candidates while npm publishing was blocked.
- The `v0.20.0` tag and release tarball contain the code that belongs to the `0.20.0` release line.
- The `0.21.0` release line contains `agentloop next` and the prepublish metadata guard.
- The `0.22.0` release line contains task-linked verification reports, failed-verification summaries, the guarded `--task` path behavior, and refreshed README visuals.
- The `0.23.0` release line contains PowerShell completion support.
- Backfilling old versions from current `main` would make npm metadata lie about what those old tags contained.
- Publishing the current GitHub release once, then returning to normal patch and minor releases, gives users the least confusing path.
- Do not keep skipping versions after npm catches up. Use normal semver from the first successful catch-up publish onward.

Post-publish smoke check:

```bash
agentloop npm-status --expect-current
```

The command exits with code `1` unless npm latest matches `package.json`. It runs `npm view` only when invoked and never publishes, reads npm tokens, reads `.env` files, or changes package metadata.

Current `main` includes a prepublish guard:

```bash
node scripts/prepublish-check.mjs
```

The guard fails while `CHANGELOG.md` has real entries under `## Unreleased`. This is intentional. It prevents `npm publish` from shipping package contents that do not match the current package version and release notes.

Before publishing from `main`, move the unreleased entries into a new version section, bump `package.json`, and reset `## Unreleased` to:

```markdown
- No unreleased changes yet.
```

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
- npm should jump from `0.1.1` to the current GitHub release for the catch-up publish because older GitHub tags are already public and current source has moved forward.
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
- GitHub release URL: `https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.18.1`.
- GitHub release tarball SHA-256: `01f38156e44610021752dadc90fe5d61f63ac210c3778274bce99b11833e972b`.
- `agentloopkit@0.19.0` passed source version, built version, lint, typecheck, Vitest, Markdown link checks, build, projscan, `npm pack`, `npm publish --access public --dry-run`, packed-tarball smoke testing, and VHS README terminal rendering.
- Local tarball SHA-256 before GitHub release: `8d78d22b8b69786bd85b43234815765e2d373d44d05789a20ce3a2d19897e900`.
- GitHub release URL: `https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.19.0`.
- GitHub release tarball SHA-256: `8d78d22b8b69786bd85b43234815765e2d373d44d05789a20ce3a2d19897e900`.
- GitHub Publish workflow run `27246784493` for `v0.19.0` passed package checks and failed at npm authorization with `E404`.
- `agentloopkit@0.20.0` passed focused release-notes tests, typecheck, lint, full Vitest, Markdown link checks, build, projscan, `npm pack`, `npm publish --access public --dry-run`, packed-tarball smoke testing, Playwright screenshot rendering, and VHS terminal rendering.
- Local tarball SHA-256 before GitHub release: `df8407c7da4440a86a544973bdd052cadb0c0d2b10b1bb67f81548b857fdc201`.
- GitHub release URL: `https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.20.0`.
- GitHub release tarball SHA-256: `df8407c7da4440a86a544973bdd052cadb0c0d2b10b1bb67f81548b857fdc201`.
- GitHub Publish workflow run `27248000123` for `v0.20.0` passed package checks and failed at npm authorization with `E404`.
- `agentloopkit@0.21.0` passed focused release-notes tests, prepublish metadata check, lint, typecheck, full Vitest, Markdown link checks, build, projscan, `npm pack`, `npm publish --access public --dry-run`, packed-tarball smoke testing, Playwright screenshot rendering, and VHS terminal rendering.
- Local tarball SHA-256 before GitHub release: `3f7c1ee4042f6dd08d2fd2cc2ecdcc039f853f95afb56be666c5497d7a3fe4d5`.
- GitHub release URL: `https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.21.0`.
- GitHub release tarball SHA-256: `3f7c1ee4042f6dd08d2fd2cc2ecdcc039f853f95afb56be666c5497d7a3fe4d5`.
- GitHub Publish workflow run `27249612803` for `v0.21.0` passed package checks and failed at npm authorization with `E404`.
- npm registry proof after the `v0.21.0` publish workflow still reports latest `0.1.1` and versions `0.1.0`, `0.1.1`.
- `agentloopkit@0.22.0` passed source version, built version, lint, typecheck, Vitest, Markdown link checks, build, projscan, `npm pack`, `npm publish --access public --dry-run`, packed-tarball smoke testing, Playwright screenshot rendering, and VHS terminal rendering.
- Local tarball SHA-256 before GitHub release: `5ad3a2b35e430d6d9fa10cad4c6023230fc7f3593a8232370c9c2a8945b6489f`.
- GitHub release URL: `https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.22.0`.
- GitHub release tarball SHA-256: `5ad3a2b35e430d6d9fa10cad4c6023230fc7f3593a8232370c9c2a8945b6489f`.
- GitHub Publish workflow run `27251450540` for `v0.22.0` passed package checks and failed at npm authorization with `E404`.
- npm registry proof after the `v0.22.0` publish workflow still reports latest `0.1.1` and versions `0.1.0`, `0.1.1`.
- `agentloopkit@0.23.0` passed source version, built version, typecheck, build, prepublish metadata check, `npm pack`, and packed-tarball smoke testing before release.
- Local tarball SHA-256 before GitHub release: `b96f356db5b5b2f94a0f284590f3d272afe20fe87b6668e10c599164be72b27f`.
- GitHub release URL: `https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.23.0`.
- GitHub release tarball SHA-256: `b96f356db5b5b2f94a0f284590f3d272afe20fe87b6668e10c599164be72b27f`.
- GitHub Publish workflow run `27253066701` for `v0.23.0` passed package checks and failed at npm authorization with `E404`.
- npm registry proof after the `v0.23.0` publish workflow still reports latest `0.1.1` and versions `0.1.0`, `0.1.1`.

Publish the current GitHub release to npm from its matching release commit after browser/OTP authentication completes. Do not backfill old npm versions with newer source.

## Temporary GitHub Tarball Usage

Until npm publishes `0.23.0`, users who need the current CLI can run the GitHub release tarball directly:

```bash
npx --yes --package https://github.com/abhiyoheswaran1/AgentLoopKit/releases/download/v0.23.0/agentloopkit-0.23.0.tgz agentloop version
npx --yes --package https://github.com/abhiyoheswaran1/AgentLoopKit/releases/download/v0.23.0/agentloopkit-0.23.0.tgz agentloop init
```

Remove this fallback from README once `npm view agentloopkit version` reports `0.23.0` or newer.

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

For old release lines such as `0.20.0`, use the matching release commit or tarball, not current `main`.

Use browser or OTP authentication locally when npm asks for it. Do not paste npm OTPs or tokens into issues, PRs, chat logs, or release notes.

Trusted publishing creates provenance from GitHub Actions. Local fallback publishes do not create GitHub Actions provenance.

Before claiming a publish completed, verify:

```bash
npm view agentloopkit version
npm view agentloopkit versions --json
```

For the `0.23.0` catch-up release, the expected successful result is latest `0.23.0` and a versions list containing `0.23.0`.

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
