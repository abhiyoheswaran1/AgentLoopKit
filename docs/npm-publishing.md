# npm Publishing

Package name: `agentloopkit`

CLI binaries:

- `agentloop`
- `agentloopkit`

For release channels beyond npm and GitHub Releases, see [distribution-channels.md](distribution-channels.md).
For a compact current-state summary, see [release-status.md](release-status.md).

## Current State

As of June 17, 2026:

- npm latest is `agentloopkit@0.36.1`.
- GitHub release `v0.36.1` is public with attached `agentloopkit-0.36.1.tgz`.
- npm trusted publishing is configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`.
- GitHub releases publish npm through trusted publishing.
- GHCR and MCP Registry publishing run from GitHub release workflows after npm succeeds.
- Release tag `v0.36.1` points at the published release commit.
- GitHub Marketplace publication remains deferred until maintainer approval for the owner-only listing step.

The `0.36.1` release completed through GitHub release automation, npm trusted publishing, Docker/GHCR, and MCP Registry. The GitHub Marketplace URL still returned 404 during post-release proof.

## Release Rule

Use npm and GitHub Releases as the source of truth for each public version.

Do not publish stale intermediate versions from current `main`. If an old version must be reproduced, use its matching GitHub tag or release tarball.

Before a new public release:

1. Confirm the current package is available:

   ```bash
   agentloop npm-status --agentloopkit --expect-current
   ```

2. Move `CHANGELOG.md` entries from `## Unreleased` into the new version section.
3. Bump `package.json` to the intended version.
4. Run the full local release gate.
5. Push the release commit and tag.
6. Publish the GitHub release with the packed tarball and select **Publish this Action to the GitHub Marketplace** in the GitHub release UI.
7. Let `.github/workflows/publish.yml` publish to npm through OIDC.
8. Let Docker, MCP Registry, and related release workflows run from the GitHub release.
9. Verify npm and the GitHub Marketplace listing again.
10. Run the published-package smoke from clean temporary directories:

   ```bash
   npm run smoke:published -- --version <version>
   ```

## Prepublish Checks

Run these before publishing:

```bash
npm run release-flow
```

`release-flow` runs the local metadata guard, lint, typecheck, full tests, build, public-doc hygiene, link checking, strict dogfood gate, packed-package smoke, and strict `agentloop release-check`.

`prepublishOnly` runs the local changelog metadata guard, typecheck, tests, and build.

The packed-package smoke check builds the CLI, packs the package into a temporary directory, runs the packed binary in isolated temp repositories, checks path guards and home-directory refusal, and verifies packaged public docs for stale package pins. It does not publish, create tags, call GitHub APIs, read npm tokens, or read `.env` files.

After a GitHub release has published to npm, run:

```bash
npm run smoke:published -- --version <version>
```

That check verifies the public npm package with `npm view`, `npx agentloopkit@<version> version`, `npx agentloopkit@<version> init --dry-run --json`, and both installed bin aliases from clean temporary directories. It does not publish, create tags, call GitHub APIs, read npm tokens, or read `.env` files.

Current `main` also includes a prepublish guard:

```bash
node scripts/prepublish-check.mjs
```

The guard fails while `CHANGELOG.md` has real entries under `## Unreleased`. This prevents `npm publish` from shipping package contents that do not match release metadata.

Before publishing from `main`, reset `## Unreleased` to:

```markdown
- No unreleased changes yet.
```

## Trusted Publishing

Trusted publisher settings:

- Organization/user: `abhiyoheswaran1`
- Repository: `AgentLoopKit`
- Workflow filename: `publish.yml`
- Environment name: leave blank unless a GitHub environment is added
- Allowed action: `npm publish`

npm trusted publishing requires npm CLI `11.5.1` or newer and Node.js `22.14.0` or newer. The publish workflow uses Node.js 24 and updates npm before publishing.

If the trusted publisher connection must be recreated on npmjs.com:

1. Open `https://www.npmjs.com/package/agentloopkit`.
2. Go to package settings.
3. Open Trusted publishing.
4. Choose GitHub Actions.
5. Enter the owner, repository, workflow filename, and allowed action above.
6. Save the trusted publisher.
7. Publish a GitHub release or rerun the GitHub Actions `Publish` workflow for the intended version.

Reference: [npm trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/).

The publish workflow can also be run manually from GitHub Actions after npm trusted publishing is configured. It checks whether the current `package.json` version already exists and skips publishing when npm already has that version.

## Manual Fallback

Use manual npm publishing only if trusted publishing is unavailable and the maintainer explicitly approves it:

```bash
npm login
npm whoami
npm publish --access public
```

Use browser or OTP authentication locally when npm asks for it. Do not paste npm OTPs or tokens into issues, PRs, chat logs, or release notes.

Trusted publishing creates provenance from GitHub Actions. Local fallback publishes do not create GitHub Actions provenance.

## Post-Publish Verification

Before claiming a publish completed, verify:

```bash
npm view agentloopkit version
npm view agentloopkit versions --json
agentloop npm-status --agentloopkit --expect-current
agentloop release-proof
npx --yes agentloopkit@<version> version
```

The expected successful result is npm latest matching `package.json` and a versions list containing that release.

After each publish:

- update [release-status.md](release-status.md) with the new npm proof;
- update `CHANGELOG.md`, `docs/launch-checklist.md`, and `FINAL_HANDOFF.md` as needed;
- verify the GitHub release asset and npm package install;
- run `agentloop release-proof` after GitHub Release, GitHub Marketplace, GHCR, and MCP Registry workflows finish;
- keep README install commands focused on normal npm/npx usage.

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
