# Release Status

Last checked: June 22, 2026.

## Current State

- Current public release: `v0.39.0`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.39.0>
- Release asset: `agentloopkit-0.39.0.tgz`
- Release asset SHA-256: `28fbc79f0d107f5b2707da2bdb0a1ecc0bd7b9d75a9aa17c9e3d53b1cb2f35da`
- Release tag `v0.39.0` points at commit `748d91a7`.
- npm latest: `0.39.0`
- CI run: `27943684306`
- CLI Smoke run: `27943684358`
- Publish workflow run: `27943702972`
- Docker workflow run: `27943702983`
- MCP Registry workflow run: `27944147934`
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`; `agentloop release-proof --redact-paths` confirms the `0.39.0` image.

The MCP Registry metadata points at npm package `agentloopkit@0.39.0`.

GitHub Marketplace publication is still not live. The public listing URL <https://github.com/marketplace/actions/agentloopkit> returned 404 during post-release proof on June 22, 2026.

## Latest Release Highlights

Released in `0.39.0`:

- `agentloop guard` checks local drift, proof debt, baselines, stale verification, watch mode, reports, and context-budget pressure.
- `agentloop explain-diff` maps changed files to task scope, recent run evidence, verification freshness, and risk areas.
- `agentloop resume-pack` gives Codex, Claude, Cursor, generic agents, and human reviewers compact continuation briefs.
- Context-budget estimates now appear in Guard, resume packs, and review context.
- README visuals now include the context-budget workflow and an updated terminal demo.
- `doctor` detects nested package-manifest monorepos such as `apps/*/package.json` and `functions/package.json`.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
tmp=$(mktemp -d)
(cd "$tmp" && npx --yes agentloopkit@0.39.0 version)
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

Local release gate for `0.39.0`:

- `npm run release-flow`: passed on commit `748d91a7`
- `npx vitest run --reporter=verbose --maxWorkers=1`: 69 test files and 893 tests passed during the release debugging pass
- `npx --no-install tsx src/cli/index.ts verify --no-test --progress --write-run --redact-paths`: passed for lint, typecheck, and build
- `npx --no-install tsx src/cli/index.ts release-check --strict --redact-paths`: passed from a clean tree
- `npx --yes projscan doctor --format markdown`: A/90 with the known reviewed `prepublishOnly` advisory

Post-publish checks:

- `npm view agentloopkit version versions --json`: latest `0.39.0`
- `npx --no-install agentloop npm-status --agentloopkit --expect-current`: latest matches local package version
- `npm run smoke:published -- --version 0.39.0`: passed
- `npx --yes agentloopkit@0.39.0 version`: `0.39.0` from a clean temporary directory
- GitHub release asset digest: `28fbc79f0d107f5b2707da2bdb0a1ecc0bd7b9d75a9aa17c9e3d53b1cb2f35da`
- `npx --no-install agentloop release-proof --redact-paths`: npm, GitHub Release, GHCR, and MCP Registry passed; GitHub Marketplace warned
- `npx --no-install agentloop release-proof --strict --only github-marketplace --redact-paths`: failed because the Marketplace URL returned 404
- GHCR image tag `0.39.0` is confirmed by release proof
- MCP Registry metadata points at `agentloopkit@0.39.0`

Latest release-status documentation and proof commands on post-release `main`:

- `npm run check:public-docs`
- `npm run check:links`
- `npm test -- tests/public-docs-hygiene.test.ts tests/package-metadata.test.ts`
- `npx --no-install tsx src/cli/index.ts npm-status --agentloopkit --expect-current`
- `npx --no-install tsx src/cli/index.ts release-proof --redact-paths`
- `npx --no-install tsx src/cli/index.ts release-proof --strict --only github-marketplace --redact-paths` (expected failure while Marketplace publication remains deferred)
- `git diff --check`
- `npx --yes projscan doctor --format markdown`
