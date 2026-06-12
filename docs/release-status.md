# Release Status

Last checked: June 12, 2026.

## Current State

- Current GitHub release: `v0.28.0`
- Current GitHub release asset: `agentloopkit-0.28.0.tgz`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.28.0>
- Tarball SHA-256: `82049976512173bcef3edadadef3b5aead76ea29531d2d2f02deafa945dd900c`
- CI run: `27406452797` passed for the `0.28.0` release commit
- CLI Smoke run: `27406452854` passed on Ubuntu, macOS, and Windows
- Publish workflow run: `27406646825` passed and published `agentloopkit@0.28.0` through npm trusted publishing
- Docker workflow run: `27406646793` passed and published the GHCR image for `0.28.0`
- GHCR image manifest: `ghcr.io/abhiyoheswaran1/agentloopkit:0.28.0` digest `sha256:d3d4b708363f452c69a8fa701bc1909922bcc7b8ed7a066ba8e5f55664c3c410`
- MCP Registry workflow run: `27406850637` passed and published registry metadata for `io.github.abhiyoheswaran1/agentloopkit`
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`
- npm latest: `0.28.0`
- Current `main` matches the published `0.28.0` release

## Latest Release Highlights

Released in `0.28.0`:

- npm-facing README simplified and detailed command behavior moved to `docs/cli-reference.md`
- README terminal demo and showcase screenshot refreshed around the review-readiness loop
- generated first-run guidance improved with a risk-aware task example and task-linked verification
- `agentloop artifacts` added as a read-only local evidence inventory
- cross-platform CLI smoke workflow added for Ubuntu, macOS, and Windows
- local acceptance-layer commands added: `ship`, `prepare-pr`, `runs`, `show-run`, `intent`, and `maintainer-check`
- `agentloop review-context` added for non-MCP agents
- read-only MCP tools added for ship reports, run ledger details, file intent, maintainer checks, gates, artifacts, policy status, and review context
- run ledger, public JSON, and human artifact path output hardened so public evidence does not leak absolute local paths
- `agentloop status --redact-paths` and `agentloop check-gates --redact-paths` added for public logs that should hide the absolute Git root
- `agentloop ship --redact-paths` and `agentloop prepare-pr --redact-paths` added for acceptance-layer output that should hide embedded gate Git roots

These changes are recorded in `CHANGELOG.md` under `## 0.28.0`.

There is no active release candidate after `0.28.0`.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.28.0 version
```

GitHub release tarballs remain useful for provenance checks and rollback, but normal users should use npm or npx.

## Next Publish

Use the GitHub Actions publish workflow for the next release after release metadata is prepared:

- No next release is planned yet; batch current unreleased work instead of cutting a version for every small improvement.
- `package.json` and `CHANGELOG.md` must agree on the next version.
- `CHANGELOG.md` must have no real entries left under `## Unreleased`.
- `agentloop npm-status --agentloopkit --expect-current` should pass before the version bump, or the version gap must be explained in release notes.
- Do not publish stale intermediate versions from current `main`.

After each publish:

- update this page with the new npm proof;
- update `docs/npm-publishing.md`, `docs/launch-checklist.md`, and `FINAL_HANDOFF.md`;
- run `agentloop npm-status --agentloopkit --expect-current`;
- verify `npx --yes agentloopkit@<version> version`.

## Verification Evidence

Local release checks for `0.28.0`:

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npx pnpm@10.12.1 check:links`
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npm run build`
- `npm run smoke:release`
- `node scripts/smoke-cli.mjs`
- `node dist/cli/index.js artifacts --json`
- `npx projscan doctor --format markdown`
- `npm publish --access public --dry-run`
- focused task doctor, MCP, and distribution artifact tests
- MCP Registry description length validation through successful registry workflow

Latest release-status documentation checks also passed:

- `npm view agentloopkit version versions --json`
- direct temp install smoke for `agentloopkit@0.28.0`
- `npx --no-install agentloop version`
- `npx --no-install agentloopkit version`
- `npx --no-install agentloop init --dry-run`
- `node dist/cli/index.js npm-status --agentloopkit --expect-current`
- `npx pnpm@10.12.1 check:links`
- `git diff --check`
- `node scripts/prepublish-check.mjs`
- `npx projscan doctor --format markdown`
- AgentLoop verification with Vitest, lint, typecheck, and build
- live SchemaStore catalog check for `agentloop.config.json`
- GitHub release asset digest matched the local tarball SHA-256
