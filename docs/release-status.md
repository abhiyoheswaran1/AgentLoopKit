# Release Status

Last checked: June 21, 2026.

## Current State

- Current public release: `v0.38.0`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.38.0>
- Release asset: `agentloopkit-0.38.0.tgz`
- Release asset SHA-256: `e14e41ac1aba0a4e7d04291b058f32081e3196920aaf226c6f8eacad129e51f5`
- Release tag `v0.38.0` points at commit `4b8b2b18`.
- npm latest: `0.38.0`
- CI run: `27906736138`
- CLI Smoke run: `27907171309` after post-release smoke-fixture alignment on `main`
- Publish workflow run: `27906747820`
- Docker workflow run: `27906747802`
- MCP Registry workflow run: `27906960454`
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`; `agentloop release-proof --redact-paths` confirms the `0.38.0` image.

The MCP Registry metadata points at npm package `agentloopkit@0.38.0`.

GitHub Marketplace publication is still not live. The public listing URL <https://github.com/marketplace/actions/agentloopkit> returned 404 during post-release proof on June 21, 2026.

Post-release note: the release commit CLI Smoke run `27906736133` failed because the repository smoke script still expected the older archived-task label. The published package smoke passed, and commit `bfd33dfe` updated the smoke fixture on `main`; CLI Smoke run `27907171309` passed after that docs/test-only alignment.

## Latest Release Highlights

Released in `0.38.0`:

- Loop guidance is now surfaced in `status`, `next`, and `create-task` for typed task contracts.
- Local research task workflows, product-positioning guards, dirty-work warnings, and clearer review evidence labels are included.
- Maintainer and release evidence checks now have stronger redaction, task-risk, and verification-report details.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
tmp=$(mktemp -d)
(cd "$tmp" && npx --yes agentloopkit@0.38.0 version)
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

Local release gate for `0.38.0`:

- `npx --no-install tsx src/cli/index.ts verify --task-commands --progress --redact-paths`
- `npm run dogfood:strict`
- `npx --no-install tsx src/cli/index.ts release-check --strict --redact-paths`

Post-release repository smoke alignment:

- `npm test -- tests/distribution-artifacts.test.ts -t "CLI smoke script covers artifacts archived task fallback"`
- `node scripts/smoke-cli.mjs`

Post-publish checks:

- `npm view agentloopkit version versions --json`: latest `0.38.0`
- `npx --no-install agentloop npm-status --agentloopkit --expect-current`: latest matches local package version
- `npm run smoke:published -- --version 0.38.0`: passed
- `npx --yes agentloopkit@0.38.0 version`: `0.38.0` from a clean temporary directory
- GitHub release asset digest: `e14e41ac1aba0a4e7d04291b058f32081e3196920aaf226c6f8eacad129e51f5`
- `npx --no-install agentloop release-proof --redact-paths`: npm, GitHub Release, GHCR, and MCP Registry passed; GitHub Marketplace warned
- `npx --no-install agentloop release-proof --strict --only github-marketplace --redact-paths`: failed because the Marketplace URL returned 404
- GHCR image tag `0.38.0` is confirmed by release proof
- MCP Registry metadata points at `agentloopkit@0.38.0`

Latest release-status documentation and proof commands on post-release `main`:

- `npm run check:public-docs`
- `npm run check:links`
- `npm test -- tests/public-docs-hygiene.test.ts tests/package-metadata.test.ts`
- `npx --no-install tsx src/cli/index.ts npm-status --agentloopkit --expect-current`
- `npx --no-install tsx src/cli/index.ts release-proof --redact-paths`
- `npx --no-install tsx src/cli/index.ts release-proof --strict --only github-marketplace --redact-paths` (expected failure while Marketplace publication remains deferred)
- `git diff --check`
- `npx --yes projscan doctor --format markdown`
