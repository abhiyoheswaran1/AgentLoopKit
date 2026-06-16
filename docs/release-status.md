# Release Status

Last checked: June 16, 2026.

## Current State

- Current public release: `v0.34.0`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.34.0>
- Release asset: `agentloopkit-0.34.0.tgz`
- Release asset SHA-256: `773d544a9165751d012eab2a6f98056cc1fa0e131fd9e61bd34ff02bb34c6894`
- Release tag `v0.34.0` points at commit `1407b92551652298341af0d831f7eb9205f4b267`
- npm latest: `0.34.0`
- CI run: `27600457996`, success
- CLI Smoke run: `27600458025`, success
- Publish workflow run: `27600706290`, success
- Docker workflow run: `27600706317`, success
- MCP Registry workflow run: `27601007699`, success
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`. The public registry tag list includes `latest`, `0.34`, and `0.34.0`.

The MCP Registry public API lists `io.github.abhiyoheswaran1/agentloopkit` version `0.34.0` as latest, with npm package `agentloopkit@0.34.0`.

## Latest Release Highlights

Released in `0.34.0`:

- `agentloop install-agent` preserves existing `.agentloop/agents/<agent>.md` instructions instead of overwriting local edits.
- Same-minute generated evidence artifacts now get collision-safe suffixes instead of replacing prior reports.
- `agentloop release-proof --only <channel>` can check one public channel at a time for npm, GitHub Release, GHCR, or MCP Registry.
- Public Markdown output and local artifact handling were hardened for safer review logs.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.34.0 version
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

Local release gate for `0.34.0`:

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

- `npm view agentloopkit version versions --json`: latest `0.34.0`
- `node dist/cli/index.js npm-status --agentloopkit --expect-current`: latest matches local package version
- `npm run smoke:published -- --version 0.34.0`: passed
- `npx --yes agentloopkit@0.34.0 version`: `0.34.0`
- GitHub release asset digest: `773d544a9165751d012eab2a6f98056cc1fa0e131fd9e61bd34ff02bb34c6894`
- `node dist/cli/index.js release-proof --strict --redact-paths`: npm, GitHub Release, GHCR, and MCP Registry passed
- GHCR tag list includes `latest`, `0.34`, and `0.34.0`
- MCP Registry search marks `0.34.0` as latest

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm run check:links`
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes pnpm@10.12.1 audit --audit-level high`
- `npx --yes projscan doctor --format markdown`
