# Release Status

Last checked: June 25, 2026.

## Current State

- GitHub release `v0.43.0` is public.
- npm latest is `agentloopkit@0.43.0`.
- GHCR and MCP Registry are live for `0.43.0`.
- GitHub Marketplace listing is pending owner UI publication for the composite Action.
- Release tag `v0.43.0` points at the published release commit.
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.43.0>
- Release asset: `agentloopkit-0.43.0.tgz`
- Release asset SHA-256: `73a3398543146ce97e391345df2a41f9b2323a08880309964ff1eaac8427455e`
- Release commit: `22e8b89520da84bf5eaa617ec9e2ce6f9367c678`
- Post-release smoke-fix commit: `8db2805c3ac154f8ff83bae00f47cb3f74bde846`
- CI run for release commit: `28160014887` passed.
- CI run for the smoke-fix commit: `28160682228` passed.
- CLI Smoke run for release commit: `28160015187` failed because the stale-artifact smoke fixture omitted required run metadata. The product behavior was correct; the fixture was fixed in post-release smoke-fix commit `8db2805c`.
- CLI Smoke run for the smoke-fix commit: `28160682240` passed on Linux, macOS, and Windows.
- Publish workflow run: `28160043176` passed.
- Docker workflow run: `28160043174` passed.
- MCP Registry workflow run: `28160527170` passed.
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`; `agentloop release-proof --redact-paths` confirmed the `0.43.0` image.

The MCP Registry metadata points at npm package `agentloopkit@0.43.0`.

GitHub Marketplace publication is still not live. The public listing URL <https://github.com/marketplace/actions/agentloopkit> returned 404 during post-release proof on June 25, 2026.

## Latest Release Highlights

Released in `0.43.0`:

- `agentloop context handles` lists available source handles, reasons, and exact expansion commands.
- `agentloop start` now shows a usefulness proof with estimated context avoided, broad files avoided, stale proof, scope drift, source handles, verification freshness, and the next safe command.
- `agentloop doctor` reports the Agent Readiness Matrix for Start guidance, context handles, broad-read avoidance, MCP guidance, and installed agent instructions.
- `agentloop guard --json --compact` returns bounded evidence-map data and handle expansion guidance for large dirty repos.
- Review context, context packs, MCP payloads, and run-ledger lookups avoid broad evidence dumps by default and point agents to source handles.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
tmp=$(mktemp -d)
(cd "$tmp" && npx --yes agentloopkit@0.43.0 version)
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

Local release gate for `0.43.0`:

- Release-flow component commands passed on release commit `22e8b895`: prepublish check, lint, typecheck, full tests, build, public-doc hygiene, link check, dogfood, and release smoke.
- `agentloop release-check --strict --redact-paths`: passed on release commit `22e8b895`
- `npx --yes projscan doctor --format markdown`: A/90 with the known reviewed `prepublishOnly` advisory
- `npm test -- tests/artifacts.test.ts`: passed after the post-release smoke-fixture fix, 37 tests

Post-publish checks:

- `npm view agentloopkit version versions --json`: latest is `0.43.0`, and the versions list contains `0.43.0`
- `agentloop npm-status --agentloopkit --expect-current`: passed; npm latest matches local package version
- `npm run smoke:published -- --version 0.43.0`: passed
- clean temporary published-package version check: `0.43.0`
- GitHub release asset digest: `sha256:73a3398543146ce97e391345df2a41f9b2323a08880309964ff1eaac8427455e`
- `agentloop release-proof --redact-paths`: passed for npm, GitHub Release, GHCR, and MCP Registry; warned for GitHub Marketplace
- `node dist/cli/index.js release-proof --strict --only github-marketplace --redact-paths`: expected to fail while Marketplace publication remains deferred
- GHCR image tag `0.43.0`: confirmed
- MCP Registry metadata points at `agentloopkit@0.43.0`: confirmed

Latest release-status documentation and proof commands on post-release `main`:

- `npm run check:public-docs`
- `npm run check:links`
- `npm test -- tests/public-docs-hygiene.test.ts tests/package-metadata.test.ts`
- `npx --no-install tsx src/cli/index.ts npm-status --agentloopkit --expect-current`
- `npx --no-install tsx src/cli/index.ts release-proof --redact-paths`
- `npx --no-install tsx src/cli/index.ts release-proof --strict --only github-marketplace --redact-paths` (expected failure while Marketplace publication remains deferred)
- `git diff --check`
- `npx --yes projscan doctor --format markdown`
