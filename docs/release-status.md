# Release Status

Last checked: June 13, 2026.

## Current State

- Current public release: `v0.29.0`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.29.0>
- Release asset: `agentloopkit-0.29.0.tgz`
- Release asset SHA-256: pending local pack verification
- Release tag `v0.29.0` points at the published release commit
- npm latest: `0.29.0`
- CI run: pending release workflow verification
- CLI Smoke run: pending release workflow verification
- Publish workflow run: pending release workflow verification
- Docker workflow run: pending release workflow verification
- MCP Registry workflow run: pending release workflow verification
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

Docker is not installed in the local maintainer shell, and the current GitHub token lacks `read:packages`, so this page records the successful Docker workflow as GHCR proof instead of a locally pulled image digest.

## Latest Release Highlights

Released in `0.29.0`:

- `agentloop artifacts` now includes run ledger evidence.
- `agentloop artifacts --type run` and `agentloop artifacts --latest` help agents discover recent run evidence.
- Redacted release, doctor, maintainer, review-context, and next-action outputs are safer to paste into public logs.
- pnpm now resolves release tooling to patched `esbuild@0.28.1`.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.29.0 version
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

Local release gate for `0.29.0`:

- `node scripts/prepublish-check.mjs`
- `npm test -- tests/release-notes.test.ts tests/release-smoke.test.ts tests/release-check.test.ts`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run check:links`
- `git diff --check`
- `npm run build`
- `npm run smoke:release`
- `npx --yes pnpm@10.12.1 audit --audit-level high`
- `npm run dogfood:strict`
- `node dist/cli/index.js release-check --strict`
- `npx --yes projscan doctor --format markdown`: A 100/100

Post-publish checks:

- `npm view agentloopkit version versions --json`: pending post-publish verification
- `node dist/cli/index.js npm-status --agentloopkit --expect-current --json`: pending post-publish verification
- `npm run smoke:published -- --version 0.29.0`: pending post-publish verification
- `npx --yes agentloopkit@0.29.0 version`: pending post-publish verification
- GitHub release asset digest: pending local pack verification
- CI, CLI Smoke, Publish, Docker, and MCP Registry workflows: pending release workflow verification

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm run check:links`: 1452 Markdown files checked
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes pnpm@10.12.1 audit --audit-level high`
- `npx --yes projscan doctor --format markdown`: A 100/100
