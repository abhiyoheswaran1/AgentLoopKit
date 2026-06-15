# Release Status

Last checked: June 15, 2026.

## Current State

- Current public release: `v0.33.0`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.33.0>
- Release asset: `agentloopkit-0.33.0.tgz`
- Release asset SHA-256: `63d5486600cd212a2b521d34639358726e4e91225f0f099abf3387e8891baee7`
- Release tag `v0.33.0` points at commit `bc39e81085186f64fe0cf0a92a6c2da4dcf0cc70`
- npm latest: `0.33.0`
- CI run: `27526213991`, success
- CLI Smoke run: `27526213989`, success
- Publish workflow run: `27526226093`, success
- Docker workflow run: `27526226088`, success
- MCP Registry workflow run: `27526361078`, success
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`. The public registry tag list includes `latest`, `0.33`, and `0.33.0`.

The MCP Registry public API lists `io.github.abhiyoheswaran1/agentloopkit` version `0.33.0` as latest, with npm package `agentloopkit@0.33.0`.

## Latest Release Highlights

Released in `0.33.0`:

- `agentloop release-proof` checks npm, GitHub Release, GHCR, and MCP Registry evidence for the local package version.
- Local GitHub metadata summaries appear in `review-context`, `prepare-pr`, and `maintainer-check`.
- Public-doc hygiene now blocks fake adoption language, premature Pro/SaaS upgrade copy, and internal planning copy.
- Organization policy-pack workflow examples document repo-local team review rules.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.33.0 version
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

Local release gate for `0.33.0`:

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

- `npm view agentloopkit version versions --json`: latest `0.33.0`
- `node dist/cli/index.js npm-status --agentloopkit --expect-current`: latest matches local package version
- `npm run smoke:published -- --version 0.33.0`: passed
- `npx --yes agentloopkit@0.33.0 version`: `0.33.0`
- GitHub release asset digest: `63d5486600cd212a2b521d34639358726e4e91225f0f099abf3387e8891baee7`
- GHCR tag list includes `latest`, `0.33`, and `0.33.0`
- MCP Registry search marks `0.33.0` as latest

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm run check:links`: 1833 Markdown files checked
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes pnpm@10.12.1 audit --audit-level high`
- `npx --yes projscan doctor --format markdown`: A 100/100
