# Release Status

Last checked: June 16, 2026.

## Current State

- Current public release: `v0.35.2`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.35.2>
- Release asset: `agentloopkit-0.35.2.tgz`
- Release asset SHA-256: pending post-publish proof
- Release tag `v0.35.2` points at commit `pending post-publish proof`
- npm latest: pending post-publish proof
- CI run: pending
- CLI Smoke run: pending
- Publish workflow run: pending
- Docker workflow run: pending
- MCP Registry workflow run: pending
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`. The public registry tag list should include `latest`, `0.35`, and `0.35.2` after post-publish proof.

The MCP Registry public API should list `io.github.abhiyoheswaran1/agentloopkit` version `0.35.2` as latest, with npm package `agentloopkit@0.35.2`, after post-publish proof.

GitHub Marketplace publication is the purpose of the `0.35.2` patch release. The public listing URL <https://github.com/marketplace/actions/agentloopkit> must load before claiming the listing is live.

## Latest Release Highlights

Prepared in `0.35.2`:

- The root composite GitHub Action now includes explicit `author` metadata.
- Action metadata formatting is aligned with the Marketplace-published ProjScan Action.
- The release exists to make GitHub re-evaluate the Action metadata for Marketplace publication.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.35.2 version
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

Local release gate for `0.35.2`:

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

- Pending after the `0.35.2` release workflows finish.

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm run check:links`
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes pnpm@10.12.1 audit --audit-level high`
- `npx --yes projscan doctor --format markdown`
