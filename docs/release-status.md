# Release Status

Last checked: June 24, 2026.

## Current State

- GitHub release `v0.41.0` is public.
- npm latest is `agentloopkit@0.41.0`.
- GHCR and MCP Registry are live for `0.41.0`.
- GitHub Marketplace listing is pending owner UI publication for the composite Action.
- Release tag `v0.41.0` points at the published release commit.
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.41.0>
- Release asset: `agentloopkit-0.41.0.tgz`
- Release asset SHA-256: `fc4d2ebb8fc4c73a26da8e245133c9761753a96eefd4051fef8a5178332832ad`
- CI run: `28080114443`
- CLI Smoke run: `28080114448`
- Publish workflow run: `28080142680`
- Docker workflow run: `28080142721`
- MCP Registry workflow run: `28080541615`
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`; `agentloop release-proof --redact-paths` confirms the `0.41.0` image.

The MCP Registry metadata points at npm package `agentloopkit@0.41.0`.

GitHub Marketplace publication is still not live. The public listing URL <https://github.com/marketplace/actions/agentloopkit> returned 404 during post-release proof on June 24, 2026.

## Latest Release Highlights

Released in `0.41.0`:

- `agentloop start` gives software agents a compact repo preflight before broad reads.
- Start reports the active task, preflight state, read-first handles, risk summary, next safe command, verification freshness, and estimated context avoided.
- MCP exposes the same Start briefing through `agentloop_start`.
- Generated agent instructions route Codex, Claude Code, Cursor, OpenCode, Gemini CLI, GitHub Copilot CLI, and generic agents to `agentloop start`.
- README and docs center the Start preflight workflow and regenerated terminal demo GIF.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
tmp=$(mktemp -d)
(cd "$tmp" && npx --yes agentloopkit@0.41.0 version)
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

Local release gate for `0.41.0`:

- `npm run release-flow`: passed on commit `a96c79af`
- `node dist/cli/index.js release-check --strict --redact-paths`: passed from a clean tree on commit `a96c79af`
- `npx --yes projscan doctor --format markdown`: A/90 with the known reviewed `prepublishOnly` advisory

Post-publish checks:

- `npm view agentloopkit version versions --json`: latest `0.41.0`
- `node dist/cli/index.js npm-status --agentloopkit --expect-current`: latest matches local package version
- `npm run smoke:published -- --version 0.41.0`: passed
- `npx --yes agentloopkit@0.41.0 version`: `0.41.0` from a clean temporary directory
- GitHub release asset digest: `fc4d2ebb8fc4c73a26da8e245133c9761753a96eefd4051fef8a5178332832ad`
- `node dist/cli/index.js release-proof --redact-paths`: npm, GitHub Release, GHCR, and MCP Registry passed; GitHub Marketplace warned
- `node dist/cli/index.js release-proof --strict --only github-marketplace --redact-paths`: expected to fail while Marketplace publication remains deferred
- GHCR image tag `0.41.0`: confirmed by release proof
- MCP Registry metadata points at `agentloopkit@0.41.0`: confirmed by release proof

Latest release-status documentation and proof commands on post-release `main`:

- `npm run check:public-docs`
- `npm run check:links`
- `npm test -- tests/public-docs-hygiene.test.ts tests/package-metadata.test.ts`
- `npx --no-install tsx src/cli/index.ts npm-status --agentloopkit --expect-current`
- `npx --no-install tsx src/cli/index.ts release-proof --redact-paths`
- `npx --no-install tsx src/cli/index.ts release-proof --strict --only github-marketplace --redact-paths` (expected failure while Marketplace publication remains deferred)
- `git diff --check`
- `npx --yes projscan doctor --format markdown`
