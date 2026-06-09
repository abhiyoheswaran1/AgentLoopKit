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

Manual fallback:

```bash
npm login
npm publish --access public
```

Trusted publishing creates provenance from GitHub Actions. Local fallback publishes do not create GitHub Actions provenance.

This machine is not logged in to npm until `npm whoami` succeeds.

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
