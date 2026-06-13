# Release Status

Last checked: June 14, 2026.

## Current State

- Current public release: `v0.31.0`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.31.0>
- Release asset: `agentloopkit-0.31.0.tgz`
- Release asset SHA-256: pending release upload verification
- Release tag `v0.31.0` points at the published release commit.
- npm latest: `0.31.0`
- CI run: pending GitHub Actions verification
- CLI Smoke run: pending GitHub Actions verification
- Publish workflow run: pending npm trusted publishing verification
- Docker workflow run: pending GHCR verification
- MCP Registry workflow run: pending registry verification
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

Docker is not installed in the local maintainer shell, and the current GitHub token lacks `read:packages`, so this page records the successful Docker workflow as GHCR proof instead of a locally pulled image digest.

## Latest Release Highlights

Released in `0.31.0`:

- `agentloop upgrade-harness --details` and `--suggestions` print copyable current-loop guidance for older repos.
- `agentloop doctor` recommends `upgrade-harness` when generated guidance misses `ship`, `prepare-pr`, the run ledger, review context, or maintainer checks.
- `npm run test:unit`, `test:integration`, `test:release`, and `release-flow` separate fast development checks from the full release gate.
- Existing-repo docs explain how to update the CLI, inspect old harness files, and keep using the current acceptance loop.
- MCP docs include client setup examples for Claude Code, Cursor, Gemini CLI, OpenCode, and Codex.
- Public examples cover bugfix PR and dependency-upgrade workflows from task contract to PR preparation.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.31.0 version
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

Local release gate for `0.31.0`:

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

- `npm view agentloopkit version versions --json`: pending
- `node dist/cli/index.js npm-status --agentloopkit --expect-current --json`: pending
- `npm run smoke:published -- --version 0.31.0`: pending
- `npx --yes agentloopkit@0.31.0 version`: pending
- GitHub release asset digest: pending
- CI, CLI Smoke, Publish, Docker, and MCP Registry workflows: pending

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm run check:links`: 1763 Markdown files checked
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes pnpm@10.12.1 audit --audit-level high`
- `npx --yes projscan doctor --format markdown`: A 100/100
