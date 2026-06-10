# Distribution Channels

This page is for maintainers planning releases. The README should stay user-facing and should not include release incident history, npm authentication state, or internal backlog notes.

## Current Channels

| Channel | Status | User command |
| --- | --- | --- |
| npm / npx | Live | `npx agentloopkit init` |
| GitHub Releases | Live | Download release assets from GitHub |

## Release Rule

Use npm and GitHub Releases as the source of truth for each public version.

For future releases:

1. Prepare `package.json`, `CHANGELOG.md`, docs, and release notes.
2. Run the full local verification set.
3. Push the release commit and tag.
4. Publish the GitHub release.
5. Let `.github/workflows/publish.yml` publish to npm through trusted publishing.
6. Verify npm with `agentloop npm-status --expect-current`.

Do not put temporary publish failures, local auth state, or registry repair notes in the README.

## Planned Channels

| Priority | Channel | Why it matters | First useful task | Prerequisite | Decision |
| --- | --- | --- | --- | --- | --- |
| P0 | npm / npx automation | Primary install path for Node users and agents | Verify trusted publishing on the next release and document the exact GitHub-release flow | npm trusted publisher connection | Do next |
| P1 | Homebrew tap | Good install path for macOS and Linux CLI users | Create a tap formula that installs the npm package or release tarball without adding postinstall behavior | Stable release asset and checksum | Later |
| P1 | Docker / GHCR image | Useful in CI where teams want a pinned container | Publish a minimal image that runs `agentloop` and contains no project dependencies by default | Container workflow and image hardening checklist | Later |
| P1 | GitHub Action | Makes `agentloop verify`, `handoff`, and `check-gates` easier in CI | Build a small composite action wrapping npm install plus chosen `agentloop` command | npm release available | Later |
| P2 | MCP Registry | Lets MCP clients discover AgentLoopKit capabilities | Build a real read-only MCP server first, then register it | `agentloop mcp-server` or separate MCP package | Blocked |
| P2 | VS Code / Open VSX extension | Helps editor-first users run the loop without leaving the IDE | Design editor UX around existing CLI commands | Clear editor workflow and maintenance owner | Later |
| P2 | Scoop / WinGet | Better Windows install path for CLI users | Add manifests after release assets are stable | Windows smoke test and release checksums | Later |

## Product Panel Notes

- Abhi: Keep npm as the wedge. Add new channels only when they reduce install friction.
- Maya: Avoid separate implementations per channel. Reuse the built CLI and release tarball.
- Elias: Each channel needs one copy-paste install path and one uninstall path.
- Nora: Do not make users choose a channel before they understand the tool. README should lead with `npx`.
- Samir: No install scripts, hidden network calls, credential access, telemetry, or opaque binaries.
- Lina: CI, GitHub Action, and Docker matter more than editor extensions for agentic work.
- Tom: Do not list a channel as supported until a maintainer can verify it from a clean machine.
- Rachel: GitHub Action and Docker are the strongest small-team adoption paths after npm.

## Non-Goals

- No cloud dashboard.
- No hosted service.
- No login.
- No billing.
- No telemetry.
- No installer that runs arbitrary commands during install.
- No MCP Registry submission before AgentLoopKit exposes a real MCP server.
