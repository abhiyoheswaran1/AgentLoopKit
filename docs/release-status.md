# Release Status

Last checked: June 14, 2026.

## Current State

- Current public release: `v0.32.1`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.32.1>
- Release asset: `agentloopkit-0.32.1.tgz`
- Release asset SHA-256: `d2219319f29f0adbba2d4736b2ef494838ab0aac72d64756e5a9bf1737cf756a`
- Release tag `v0.32.1` points at commit `0e53496a1a5704959e8f92a573bf09401c34b6ef`
- npm latest: `0.32.1`
- CI run: `27501492254`, success
- CLI Smoke run: `27501492259`, success
- Publish workflow run: `27501495780`, success
- Docker workflow run: `27501495776`, success
- MCP Registry workflow run: `27501633646`, success
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`. The public registry tag list includes `latest`, `0.32`, and `0.32.1`.

The MCP Registry public API lists `io.github.abhiyoheswaran1/agentloopkit` version `0.32.1` as latest, with npm package `agentloopkit@0.32.1`.

## Latest Release Highlights

Released in `0.32.1`:

- Release-status docs now record verified `0.32.0` npm, GitHub release, GHCR, and MCP Registry proof.
- AgentLoop dogfood evidence now records the `0.32.0` release gate, post-publish proof, and archived release task.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.32.1 version
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

Local release gate for `0.32.1`:

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

- `npm view agentloopkit version versions --json`: latest `0.32.1`
- `node dist/cli/index.js npm-status --agentloopkit --expect-current`: latest matches local package version
- `npm run smoke:published -- --version 0.32.1`: passed
- `npx --yes agentloopkit@0.32.1 version`: `0.32.1`
- GitHub release asset digest: `d2219319f29f0adbba2d4736b2ef494838ab0aac72d64756e5a9bf1737cf756a`
- GHCR tag list includes `latest`, `0.32`, and `0.32.1`
- MCP Registry search marks `0.32.1` as latest

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm run check:links`: 1833 Markdown files checked
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes pnpm@10.12.1 audit --audit-level high`
- `npx --yes projscan doctor --format markdown`: A 100/100
