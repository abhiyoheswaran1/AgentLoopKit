# Release Status

Last checked: June 16, 2026.

## Current State

- Prepared release candidate: `v0.34.1`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.34.1>
- Release asset: `agentloopkit-0.34.1.tgz`
- Release asset SHA-256: pending post-release proof
- Release tag `v0.34.1` points at the release commit
- npm latest: pending post-release proof; latest completed public release before this release prep is `0.34.0`
- CI run: pending release commit CI
- CLI Smoke run: pending release commit smoke
- Publish workflow run: pending GitHub release
- Docker workflow run: pending GitHub release
- MCP Registry workflow run: pending GitHub release
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`. The public registry tag list should include `latest`, `0.34`, and `0.34.1` after release automation completes.

The MCP Registry public API should list `io.github.abhiyoheswaran1/agentloopkit` version `0.34.1` as latest, with npm package `agentloopkit@0.34.1`, after release automation completes.

## Release Candidate Highlights

Prepared for `0.34.1`:

- `agentloop release-check` explains whether commits after the current version tag affect package release contents or only repo-local evidence/docs.
- JSON release-check output includes `releaseDelta` fields for agents and CI.
- Strict release-flow behavior remains conservative: release metadata still has to be prepared before publishing.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.34.1 version
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

Local release gate for `0.34.1`:

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

- `npm view agentloopkit version versions --json`: pending post-release proof
- `node dist/cli/index.js npm-status --agentloopkit --expect-current`: pending post-release proof
- `npm run smoke:published -- --version 0.34.1`: pending post-release proof
- `npx --yes agentloopkit@0.34.1 version`: pending post-release proof
- GitHub release asset digest: pending post-release proof
- `node dist/cli/index.js release-proof --strict --redact-paths`: pending post-release proof
- GHCR tag list includes `latest`, `0.34`, and `0.34.1`: pending post-release proof
- MCP Registry search marks `0.34.1` as latest: pending post-release proof

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm run check:links`
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes pnpm@10.12.1 audit --audit-level high`
- `npx --yes projscan doctor --format markdown`
