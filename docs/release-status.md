# Release Status

Last checked: June 14, 2026.

## Current State

- Current public release: `v0.32.0`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.32.0>
- Release asset: `agentloopkit-0.32.0.tgz`
- Release asset SHA-256: pending until the release tarball is attached
- Release tag `v0.32.0` points at the published release commit
- npm latest: `0.32.0`
- CI run: pending until release workflows complete
- CLI Smoke run: pending until release workflows complete
- Publish workflow run: pending until npm trusted publishing completes
- Docker workflow run: pending until GHCR publishing completes
- MCP Registry workflow run: pending until registry publishing completes
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

Docker is not installed in the local maintainer shell, and the current GitHub token lacks `read:packages`, so this page records the successful Docker workflow as GHCR proof instead of a locally pulled image digest.

## Latest Release Highlights

Released in `0.32.0`:

- `agentloop schemastore` prints a ready-to-submit SchemaStore catalog entry without writing files or calling APIs.
- `agentloop policy packs`, `policy pack show`, and `policy pack apply` add safe bundled and repo-local policy pack workflows.
- Bundled `agentloop-baseline` and `maintainer-review` policy packs copy missing policy files without overwriting local edits.
- `agentloop github import` imports explicit local issue and PR JSON into `.agentloop/github/context.json` without tokens, API calls, or env-file reads.
- Docs now cover SchemaStore support, GitHub metadata import, Windows package-manager planning, and editor-extension validation gates.
- Fast test coverage now includes SchemaStore, policy packs, GitHub metadata, roadmap-channel checks, and CLI docs drift.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.32.0 version
```

GitHub release tarballs remain useful for provenance checks and rollback, but normal users should use npm or npx.

## Next Publish

Use the GitHub Actions publish workflow for the next release after release metadata is prepared:

- `package.json`, `server.json`, and `CHANGELOG.md` must agree on the next version.
- `CHANGELOG.md` must have no real entries left under `## Unreleased`.
- `agentloop npm-status --agentloopkit --expect-current` should pass before the version bump, or the version gap must be explained in release notes.
- Do not publish stale intermediate versions from current `main`.

After each publish:

- update this page with the new npm proof;
- update `docs/npm-publishing.md`, `docs/launch-checklist.md`, and `FINAL_HANDOFF.md`;
- run `agentloop npm-status --agentloopkit --expect-current`;
- run `npm run smoke:published -- --version <version>`;
- verify `npx --yes agentloopkit@<version> version`.

## Verification Evidence

Local release gate for `0.32.0`:

- `node scripts/prepublish-check.mjs`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run check:public-docs`
- `npm run check:links`
- `git diff --check`
- `npm run dogfood:strict`
- `npm run smoke:release`
- `node dist/cli/index.js release-check --strict`
- `npm run release-flow`

Post-publish checks:

- `npm view agentloopkit version versions --json`: latest `0.32.0`
- `node dist/cli/index.js npm-status --agentloopkit --expect-current --json`: status `current`
- `npm run smoke:published -- --version 0.32.0`: pending until npm publish completes
- `npx --yes agentloopkit@0.32.0 version`: pending until npm publish completes
- GitHub release asset digest: pending until the release tarball is attached
- CI, CLI Smoke, Publish, Docker, and MCP Registry workflows: pending until GitHub Actions complete

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm run check:links`: 1763 Markdown files checked
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes pnpm@10.12.1 audit --audit-level high`
- `npx --yes projscan doctor --format markdown`: A 100/100
