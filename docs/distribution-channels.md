# Distribution Channels

This page is for maintainers planning releases. Keep the README focused on user install and usage.

## Current Channels

| Channel | Status | User command |
| --- | --- | --- |
| npm / npx | Primary channel | `npx agentloopkit init` |
| GitHub Releases | Public release assets | Download `agentloopkit-<version>.tgz` from GitHub |
| GitHub Action | Repo action metadata | `uses: abhiyoheswaran1/AgentLoopKit@v0.26.1` |
| Docker / GHCR | Release workflow prepared | `docker run --rm -v "$PWD:/workspace" ghcr.io/abhiyoheswaran1/agentloopkit:0.26.1 doctor` |
| Homebrew | Formula prepared | `brew install abhiyoheswaran1/agentloopkit/agentloopkit` after the tap repo is published |
| MCP Registry | Metadata and workflow prepared | `npx --yes agentloopkit@0.26.1 mcp-server` |

## Release Rule

Use npm and GitHub Releases as the source of truth for each public version.

For each release:

1. Prepare `package.json`, `server.json`, `CHANGELOG.md`, docs, and release notes.
2. Run the full local verification set.
3. Build and pack the package.
4. Replace the Homebrew formula checksum with the packed tarball SHA-256.
5. Push the release commit and tag.
6. Publish the GitHub release with the packed tarball.
7. Let `.github/workflows/publish.yml` publish to npm through trusted publishing.
8. Let `.github/workflows/docker.yml` publish the GHCR image from the GitHub release.
9. Let `.github/workflows/publish-mcp.yml` submit MCP Registry metadata after npm publishes.
10. Verify npm with `agentloop npm-status --expect-current`.

Do not put temporary publish failures, local auth state, or registry repair notes in the README.

## GitHub Action

The root `action.yml` is a thin composite wrapper around the npm package:

```yaml
- uses: abhiyoheswaran1/AgentLoopKit@v0.26.1
  with:
    command: check-gates --strict
    agentloopkit-version: 0.26.1
```

The action does not upload artifacts or comment on pull requests. Workflow authors decide which command to run and whether to upload generated AgentLoopKit files.

## Docker / GHCR

The Docker image installs the packed npm tarball globally and runs `agentloop`.

Local smoke test:

```bash
docker build -t agentloopkit:test .
docker run --rm -v "$PWD:/workspace" agentloopkit:test version
```

Release image:

```bash
docker run --rm -v "$PWD:/workspace" ghcr.io/abhiyoheswaran1/agentloopkit:0.26.1 doctor
```

The image does not bundle project dependencies. Users still install their own repo dependencies before running verification commands that require them.

## Homebrew

The formula lives at `packaging/homebrew/agentloopkit.rb`.

Before publishing the tap:

1. Build and pack the exact release.
2. Compute the SHA-256 for `agentloopkit-<version>.tgz`.
3. Update the formula `url`, `sha256`, and versioned tests.
4. Copy the formula into the tap repo at `Formula/agentloopkit.rb`.
5. Run:

```bash
brew audit --strict --online Formula/agentloopkit.rb
brew install --build-from-source Formula/agentloopkit.rb
agentloop version
```

The formula installs the release tarball with Homebrew's npm install helper and symlinks `agentloop` and `agentloopkit`. It has no postinstall hook.

## MCP Registry

AgentLoopKit includes a read-only MCP server:

```bash
npx --yes agentloopkit@0.26.1 mcp-server
```

Registry metadata lives in `server.json`, and the npm package declares `mcpName`. The MCP publish workflow runs after the npm publish workflow succeeds so the registry entry points at a package version that exists.

See [mcp.md](mcp.md).

## Planned Channels

| Priority | Channel | Why it matters | Decision |
| --- | --- | --- | --- |
| P2 | VS Code / Open VSX extension | Helps editor-first users run the loop without leaving the IDE | Later, only after editor UX is scoped |
| P2 | Scoop / WinGet | Better Windows install path for CLI users | Later, after Windows smoke tests and release checksums |

## Product Panel Notes

- Abhi: Keep npm as the wedge. New channels should reduce install friction without changing the product.
- Maya: Reuse the built CLI and release tarball. Avoid separate implementations per channel.
- Elias: Each channel needs one copy-paste install path and one verification path.
- Nora: Lead with `npx`; users should not choose a channel before they understand the tool.
- Samir: No install scripts, hidden network calls, credential access, telemetry, or opaque binaries.
- Lina: CI, GitHub Action, Docker, and MCP matter more than editor extensions right now.
- Tom: Mark a channel supported only when maintainers can verify it from a clean machine.
- Rachel: GitHub Action and Docker are the strongest small-team adoption paths after npm.

## Non-Goals

- No cloud dashboard.
- No hosted service.
- No login.
- No billing.
- No telemetry.
- No installer that runs arbitrary commands during install.
