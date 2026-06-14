# Windows Package Manager Design

AgentLoopKit is available on Windows through npm, GitHub Releases, the GitHub Action, Docker/GHCR, and the MCP server. Scoop and WinGet stay planned until their manifests are tested from a released tarball.

## Decision

Defer public Scoop and WinGet install claims.

Do not claim `scoop install agentloopkit` until a Scoop bucket manifest installs the released CLI, runs `agentloop version`, and can be updated without changing package contents.

Do not claim `winget install agentloopkit` until a WinGet manifest installs a released artifact, passes local validation, and can be submitted through the normal WinGet community package process.

## Scoop Shape

A future Scoop manifest should point at the GitHub release tarball or a Windows-specific archive produced by the release workflow.

Requirements:

- use the same public version as npm
- verify the release checksum
- expose `agentloop` and `agentloopkit`
- avoid postinstall scripts that run project commands
- document that npm/npx remains the primary path

## WinGet Shape

A future WinGet manifest should use the same release version and checksum proof as GitHub Releases.

Requirements:

- stable package identifier
- installer URL from the GitHub release
- checksum from the release artifact
- no hidden network calls
- no credential access

## Validation Gates

Build these only after:

- release checksums are generated and recorded for each release;
- Windows CLI Smoke stays green across several releases;
- users ask for non-npm Windows installs;
- maintainers can update manifests without manual guesswork.

Until then, keep Windows docs focused on npm/npx:

```powershell
npx agentloopkit init
```
