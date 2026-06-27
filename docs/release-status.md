# Release Status

Last checked: June 27, 2026.

## Current State

- GitHub release `v0.44.0` is public.
- npm latest is `agentloopkit@0.44.0`.
- GHCR and MCP Registry are live for `0.44.0`.
- GitHub Marketplace listing is pending owner UI publication for the composite Action.
- Release tag `v0.44.0` points at the published release commit.
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.44.0>
- Release asset: `agentloopkit-0.44.0.tgz`
- Release asset SHA-256: `992e05ab92e0d9a8959711ea37213aeafd3acee98be9303e171297d98daa5dd8`
- Release commit: `48de68057f43d812e7bc915431b050ff0dd0218d`
- CI run for release commit: `28291542013` passed.
- CLI Smoke run for release commit: `28291542044` passed on Linux, macOS, and Windows.
- Publish workflow run: `28291545472` passed.
- Docker workflow run: `28291545468` passed.
- MCP Registry workflow run: `28291775156` passed.
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`; `agentloop release-proof --redact-paths` confirmed the `0.44.0` image.

The MCP Registry metadata points at npm package `agentloopkit@0.44.0`.

GitHub Marketplace publication is still not live. The public listing URL <https://github.com/marketplace/actions/agentloopkit> returned 404 during post-release proof on June 27, 2026.

## Latest Release Highlights

Released in `0.44.0`:

- `agentloopkit create-task --from-projscan` consumes Baseframe ProjScan assessment artifacts and creates native AgentLoopKit tasks from the same normalized source as the emitted JSON contract.
- AgentLoopKit emits `.baseframe/evidence/<task-id>/agentloopkit-task.json` with scope, review-first files, acceptance criteria, verification gates, risks, and source-assessment metadata for AgentFlight.
- `agentloopkit check-gates --task <task-id> --from-agentflight` reconciles AgentFlight verification results, missing or failed gates, incomplete proof, proof gaps, and scope drift without auto-completing the task.
- The package exports Baseframe v1 schemas, types, `createTaskFromProjScan`, and `evaluateAgentFlightResult`.
- Baseframe integration docs and regression fixtures cover ProjScan import, manifest preservation, AgentFlight gate mapping, standalone compatibility, and safe writes.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
tmp=$(mktemp -d)
(cd "$tmp" && npx --yes agentloopkit@0.44.0 version)
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

Local release gate for `0.44.0`:

- `npm run release-flow`: passed locally, including prepublish check, lint, typecheck, full tests, build, public-doc hygiene, link check, dogfood, and release smoke.
- `npx --yes projscan doctor --format markdown`: A/90 with the known reviewed `prepublishOnly` advisory.
- `agentloop verify --progress`: passed and wrote `.agentloop/reports/2026-06-27-15-56-verification-report.md`
- `npm run dogfood:strict`: passed with the known stale AgentFlight session warning surfaced in output.
- `node dist/cli/index.js release-check --strict --redact-paths`: passed before tagging on release commit `48de6805`.

Post-publish checks:

- `npm view agentloopkit version versions --json`: latest is `0.44.0`, and the versions list contains `0.44.0`
- `agentloop npm-status --agentloopkit --expect-current`: passed; npm latest matches local package version
- `npm run smoke:published -- --version 0.44.0`: passed
- clean temporary published-package version check: `0.44.0`
- GitHub release asset digest: `sha256:992e05ab92e0d9a8959711ea37213aeafd3acee98be9303e171297d98daa5dd8`
- `agentloop release-proof --redact-paths`: passed for npm, GitHub Release, GHCR, and MCP Registry; warned for GitHub Marketplace
- `node dist/cli/index.js release-proof --strict --only github-marketplace --redact-paths`: expected to fail while Marketplace publication remains deferred
- GHCR image tag `0.44.0`: confirmed
- MCP Registry metadata points at `agentloopkit@0.44.0`: confirmed

Latest release-status documentation and proof commands on post-release `main`:

- `npm run check:public-docs`
- `npm run check:links`
- `npm test -- tests/public-docs-hygiene.test.ts tests/package-metadata.test.ts`
- `npx --no-install tsx src/cli/index.ts npm-status --agentloopkit --expect-current`
- `npx --no-install tsx src/cli/index.ts release-proof --redact-paths`
- `npx --no-install tsx src/cli/index.ts release-proof --strict --only github-marketplace --redact-paths` (expected failure while Marketplace publication remains deferred)
- `git diff --check`
- `npx --yes projscan doctor --format markdown`
