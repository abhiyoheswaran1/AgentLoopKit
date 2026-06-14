# Release Status

Last checked: June 14, 2026.

## Current State

- Current public release: `v0.32.0`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.32.0>
- Release asset: `agentloopkit-0.32.0.tgz`
- Release asset SHA-256: `04384dba7fc8cb719ee8670694aa317ddda315f14f2729d16b29e5a8d6d67943`
- Release tag `v0.32.0` points at commit `93890cebfa0c97b729a9b7dad65209705608d1e3`
- npm latest: `0.32.0`
- CI run: `27498958901`, success
- CLI Smoke run: `27498958900`, success
- Publish workflow run: `27498962164`, success
- Docker workflow run: `27498962166`, success
- MCP Registry workflow run: `27499084983`, success
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`. The public registry tag list includes `0.32.0` and `0.32`.

The MCP Registry public API lists `io.github.abhiyoheswaran1/agentloopkit` version `0.32.0` as latest, with npm package `agentloopkit@0.32.0`.

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
- `node dist/cli/index.js npm-status --agentloopkit --expect-current`: latest matches local package version
- `npm run smoke:published -- --version 0.32.0`: passed
- `npx --yes agentloopkit@0.32.0 version`: `0.32.0`
- GitHub release asset digest: `04384dba7fc8cb719ee8670694aa317ddda315f14f2729d16b29e5a8d6d67943`
- GHCR tag list includes `0.32.0` and `0.32`
- MCP Registry search marks `0.32.0` as latest

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm run check:links`: 1825 Markdown files checked
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes pnpm@10.12.1 audit --audit-level high`
- `npx --yes projscan doctor --format markdown`: A 100/100
