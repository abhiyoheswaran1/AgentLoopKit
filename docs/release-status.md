# Release Status

Last checked: June 14, 2026.

## Current State

- Current public release: `v0.32.1`
- Release URL: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.32.1>
- Release asset: `agentloopkit-0.32.1.tgz`
- Release asset SHA-256: pending until the release tarball is attached
- Release tag `v0.32.1` points at the published release commit
- npm latest: `0.32.1`
- CI run: pending until release workflows complete
- CLI Smoke run: pending until release workflows complete
- Publish workflow run: pending until npm trusted publishing completes
- Docker workflow run: pending until GHCR publishing completes
- MCP Registry workflow run: pending until registry publishing completes
- npm trusted publishing: configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`

GHCR publishes `ghcr.io/abhiyoheswaran1/agentloopkit`. The public registry tag list should include `0.32.1` and `0.32` after release workflows finish.

The MCP Registry public API should list `io.github.abhiyoheswaran1/agentloopkit` version `0.32.1` as latest after registry publishing finishes.

## Latest Release Highlights

Released in `0.32.1`:

- Release-status docs now record verified `0.32.0` npm, GitHub release, GHCR, and MCP Registry proof.
- AgentLoop dogfood evidence now records the `0.32.0` release gate, post-publish proof, and archived release task.

## Use The Current CLI

npm is the primary install path:

```bash
npx agentloopkit init
npx --yes agentloopkit@0.32.1 version
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

Local release gate for `0.32.1`:

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

- `npm view agentloopkit version versions --json`: pending until npm publish completes
- `node dist/cli/index.js npm-status --agentloopkit --expect-current`: pending until npm publish completes
- `npm run smoke:published -- --version 0.32.1`: pending until npm publish completes
- `npx --yes agentloopkit@0.32.1 version`: pending until npm publish completes
- GitHub release asset digest: pending until the release tarball is attached
- GHCR tag list: pending until the Docker workflow completes
- MCP Registry search: pending until registry publishing completes

Latest release-status documentation checks:

- `npm run dogfood:strict`
- `npm run check:links`: 1825 Markdown files checked
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npx --yes pnpm@10.12.1 audit --audit-level high`
- `npx --yes projscan doctor --format markdown`: A 100/100
