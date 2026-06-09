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

```bash
npm login
npm publish --provenance
```

Use provenance when publishing from a supported CI environment. If publishing locally, document that provenance was not used.

## Package Contents

The npm package includes:

- `dist`
- `README.md`
- `LICENSE`
- `package.json`

The built CLI copies templates into `dist/templates`.

## npx Usage

Users run:

```bash
npx agentloopkit init
```

Do not require users to clone the repository.
