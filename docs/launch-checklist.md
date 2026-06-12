# Launch Checklist

Use this before publishing AgentLoopKit.

For release-channel details, see [distribution-channels.md](distribution-channels.md).
For npm trusted publishing, see [npm-publishing.md](npm-publishing.md).
For a read-only registry check, see [npm-status.md](npm-status.md).

## Current Release Policy

- Current public package line: `0.28.7`.
- Active release candidate: none.
- Do not bump versions, create tags, publish npm, publish GitHub Releases, publish GHCR, or publish MCP Registry entries during active implementation.
- Cut the next version only when the maintainer asks for release prep.
- Use GitHub Releases and npm trusted publishing as the public source of truth.

## Scope Check

- [ ] The release has a clear user-facing reason.
- [ ] `CHANGELOG.md` has entries under `## Unreleased` worth shipping.
- [ ] No unrelated refactors are mixed into the release.
- [ ] No public docs contain temporary auth state, local shell failures, or unsupported install-channel claims.
- [ ] README install commands still use normal npm/npx usage.
- [ ] No package-manager, editor, or registry channel is claimed unless that channel is actually implemented and verified.

## Version Prep

- [ ] Run `agentloop npm-status --agentloopkit --expect-current` before bumping.
- [ ] Move `CHANGELOG.md` entries from `## Unreleased` into the new version section.
- [ ] Reset `## Unreleased` to `- No unreleased changes yet.`
- [ ] Bump `package.json` to the intended version.
- [ ] Update `docs/release-status.md` with the intended release.
- [ ] Update `FINAL_HANDOFF.md` if release status or launch messaging changed.

## Local Verification

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npx pnpm@10.12.1 check:links`
- [ ] `node scripts/prepublish-check.mjs`
- [ ] `git diff --check`
- [ ] `npm run build`
- [ ] `npm run smoke:release`
- [ ] `node scripts/smoke-cli.mjs`
- [ ] `node dist/cli/index.js artifacts --json`
- [ ] `npx --yes projscan doctor --format markdown`

## Package Proof

- [ ] `npm pack --pack-destination /tmp`
- [ ] Packed tarball contains `dist`, `schema`, `README.md`, `LICENSE`, and `package.json`.
- [ ] Packed CLI has the Node shebang.
- [ ] Packed `agentloop version` reports the intended version.
- [ ] Packed `agentloop init --dry-run` works in a temp git repo.
- [ ] Packed README has no stale exact package version pins.

## GitHub Release

- [ ] Release commit is pushed.
- [ ] Tag is created for the intended version.
- [ ] GitHub release notes are generated from local evidence.
- [ ] Packed tarball is attached to the GitHub release.
- [ ] Release notes include verification summary and user-facing changes.
- [ ] Release notes do not mention maintainer-only auth state unless the release is blocked.

## Automated Publishing

- [ ] `.github/workflows/publish.yml` publishes npm through trusted publishing.
- [ ] `.github/workflows/docker.yml` publishes the GHCR image after the GitHub release.
- [ ] `.github/workflows/publish-mcp.yml` publishes MCP Registry metadata after npm succeeds.
- [ ] CI is green for the release commit.

## Post-Publish Proof

- [ ] `npm view agentloopkit version`
- [ ] `npm view agentloopkit versions --json`
- [ ] `agentloop npm-status --agentloopkit --expect-current`
- [ ] `npx --yes agentloopkit@<version> version`
- [ ] `npm run smoke:published -- --version <version>`
- [ ] GitHub release asset digest matches the local tarball SHA-256.
- [ ] GHCR image can run `agentloop version`.
- [ ] MCP server can run with `npx --yes agentloopkit@<version> mcp-server`.

## Public Docs

- [ ] README still starts with what the tool does, how to install it, and how to use it.
- [ ] README screenshots and terminal demos are current.
- [ ] `docs/distribution-channels.md` lists only supported public channels as live.
- [ ] `docs/npm-publishing.md` documents current trusted publishing steps.
- [ ] `docs/release-status.md` records the new release proof.
- [ ] `ROADMAP.md` keeps future channels in roadmap language, not availability language.

## Do Not Ship

- [ ] No postinstall script.
- [ ] No telemetry.
- [ ] No hidden network calls.
- [ ] No credential or `.env` content reads.
- [ ] No cloud dependency.
- [ ] No unsupported install-channel claim.
- [ ] No public docs that say real users were interviewed unless there is real evidence.
