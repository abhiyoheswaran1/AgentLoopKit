# Release Status

Last checked: June 23, 2026.

## Current State

- GitHub release `v0.40.0` is public.
- npm latest is `agentloopkit@0.40.0`.
- GHCR and MCP Registry are live for `0.40.0`.
- GitHub Marketplace listing is pending owner UI publication for the composite Action.
- Release tag `v0.40.0` points at the published release commit.
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.40.0>
- Release asset: `agentloopkit-0.40.0.tgz`
- Release asset SHA-256: `b3157017f4538b9da912347a7c0af86192c6225f207d149261ca02b19cfb127b`
- CI run: `28011486152`
- CLI Smoke run: `28011486519`
- Publish workflow run: `28011534708`
- Docker workflow run: `28011535413`
- MCP Registry workflow run: `28012018829`
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`; `agentloop release-proof --redact-paths` confirms the `0.40.0` image.

The MCP Registry metadata points at npm package `agentloopkit@0.40.0`.

GitHub Marketplace publication is still not live. The public listing URL <https://github.com/marketplace/actions/agentloopkit> returned 404 during post-release proof on June 23, 2026.

## Latest Release Highlights

Released in `0.40.0`:

- `agentloop context budget` measures local context pressure with transparent estimates.
- `agentloop context pack` creates a compact, auditable continuation contract for Codex, Claude Code, Cursor, OpenCode, Gemini CLI, GitHub Copilot CLI, generic agents, and human reviewers.
- `agentloop context show <handle>` expands reversible local source handles such as `task:active`, `verification:latest`, `evidence-map:current`, and `context-budget:current`.
- MCP now exposes read-only context budget, context pack, and context show tools.
- Generated agent instructions now route agents to a context pack before broad repo reads.
- README and docs include the Context Contract workflow, an ASCII diagram, context-budget visual, and regenerated terminal demo GIF.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
tmp=$(mktemp -d)
(cd "$tmp" && npx --yes agentloopkit@0.40.0 version)
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

Local release gate for `0.40.0`:

- `npm run release-flow`: passed on commit `c8232e60`
- `node dist/cli/index.js release-check --strict --redact-paths`: passed from a clean tree on commit `c8232e60`
- `npx --yes projscan doctor --format markdown`: A/90 with the known reviewed `prepublishOnly` advisory

Post-publish checks:

- `npm view agentloopkit version versions --json`: latest `0.40.0`
- `node dist/cli/index.js npm-status --agentloopkit --expect-current`: latest matches local package version
- `npm run smoke:published -- --version 0.40.0`: passed
- `npx --yes agentloopkit@0.40.0 version`: `0.40.0` from a clean temporary directory
- GitHub release asset digest: `b3157017f4538b9da912347a7c0af86192c6225f207d149261ca02b19cfb127b`
- `node dist/cli/index.js release-proof --redact-paths`: npm, GitHub Release, GHCR, and MCP Registry passed; GitHub Marketplace warned
- `node dist/cli/index.js release-proof --strict --only github-marketplace --redact-paths`: expected to fail while Marketplace publication remains deferred
- GHCR image tag `0.40.0`: confirmed by release proof
- MCP Registry metadata points at `agentloopkit@0.40.0`: confirmed by release proof

Latest release-status documentation and proof commands on post-release `main`:

- `npm run check:public-docs`
- `npm run check:links`
- `npm test -- tests/public-docs-hygiene.test.ts tests/package-metadata.test.ts`
- `npx --no-install tsx src/cli/index.ts npm-status --agentloopkit --expect-current`
- `npx --no-install tsx src/cli/index.ts release-proof --redact-paths`
- `npx --no-install tsx src/cli/index.ts release-proof --strict --only github-marketplace --redact-paths` (expected failure while Marketplace publication remains deferred)
- `git diff --check`
- `npx --yes projscan doctor --format markdown`
