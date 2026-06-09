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

Preferred release path:

1. Configure npm trusted publishing for this GitHub repository.
2. Publish the GitHub release.
3. Let `.github/workflows/publish.yml` run `npm publish --provenance`.

Manual fallback:

```bash
npm login
npm publish --provenance
```

Use provenance when publishing from a supported CI environment. If publishing locally, document that provenance was not used.

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
