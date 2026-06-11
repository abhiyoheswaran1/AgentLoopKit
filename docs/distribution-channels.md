# Distribution Channels

This page is for maintainers planning releases. Keep the README focused on user install and usage.

## Current Channels

| Channel         | Status                | User command                                                                                 |
| --------------- | --------------------- | -------------------------------------------------------------------------------------------- |
| npm / npx       | Primary channel       | `npx agentloopkit init`                                                                      |
| GitHub Releases | Public release assets | Download `agentloopkit-<version>.tgz` from GitHub                                            |
| GitHub Action   | Live repo action      | `uses: abhiyoheswaran1/AgentLoopKit@v<version>`                                              |
| Docker / GHCR   | Live image            | `docker run --rm -v "$PWD:/workspace" ghcr.io/abhiyoheswaran1/agentloopkit:<version> doctor` |
| MCP Registry    | Published metadata    | `npx --yes agentloopkit@latest mcp-server`                                                   |

## Release Rule

Use npm and GitHub Releases as the source of truth for each public version.

For each release:

1. Prepare `package.json`, `server.json`, `CHANGELOG.md`, docs, and release notes.
2. Run the full local verification set.
3. Build and pack the package.
4. Push the release commit and tag.
5. Publish the GitHub release with the packed tarball.
6. Let `.github/workflows/publish.yml` publish to npm through trusted publishing.
7. Let `.github/workflows/docker.yml` publish the GHCR image from the GitHub release.
8. Let `.github/workflows/publish-mcp.yml` submit MCP Registry metadata after npm publishes.
9. Verify npm with `agentloop npm-status --agentloopkit --expect-current`.

Do not put temporary publish failures, local auth state, or registry repair notes in the README.

## GitHub Action

The root `action.yml` is a thin composite wrapper around the npm package:

```yaml
- uses: abhiyoheswaran1/AgentLoopKit@v<version>
  with:
    command: check-gates --strict
    agentloopkit-version: <version>
```

The action defaults to `agentloopkit@latest`. Set `agentloopkit-version` when a workflow needs a reviewed package version.

Keep `command` and `agentloopkit-version` static and trusted. Do not build either value from pull request text or other user input.

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
docker run --rm -v "$PWD:/workspace" ghcr.io/abhiyoheswaran1/agentloopkit:<version> doctor
```

The image does not bundle project dependencies. Users still install their own repo dependencies before running verification commands that require them.

## MCP Registry

AgentLoopKit includes a read-only MCP server:

```bash
npx --yes agentloopkit@latest mcp-server
```

Registry metadata lives in `server.json`, and the npm package declares `mcpName`. The MCP publish workflow runs after the npm publish workflow succeeds so the registry entry points at a package version that exists.

See [mcp.md](mcp.md).

## Planned Channels

| Priority | Channel                      | Why it matters                                                | Decision                                                               |
| -------- | ---------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------- |
| P2       | VS Code / Open VSX extension | Helps editor-first users run the loop without leaving the IDE | Deferred; see [extension design](designs/vscode-open-vsx-extension.md) |
| P2       | Scoop / WinGet               | Better Windows install path for CLI users                     | Later, after Windows smoke tests and release checksums                 |

## Channel Rules

- Keep npm and GitHub Releases as the source of truth for public versions.
- Mark a channel supported only after a clean release verifies it.
- Use the same npm package or release tarball across channels.
- Keep install commands copy-pasteable.
- Avoid channel-specific implementations unless the channel requires a small wrapper.
- Do not add telemetry, postinstall scripts, hidden network calls, credential reads, or opaque binaries.

## Non-Goals

- No cloud dashboard.
- No hosted service.
- No login.
- No billing.
- No telemetry.
- No installer that runs arbitrary commands during install.
