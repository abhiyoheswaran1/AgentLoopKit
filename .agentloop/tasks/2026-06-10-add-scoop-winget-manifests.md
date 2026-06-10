# Add Scoop and WinGet manifests

- Created date: 2026-06-10
- Task type: release
- Status: proposed

## Problem Statement
Windows CLI users may prefer Scoop or WinGet over npm, but AgentLoopKit has not verified native Windows package-manager installs.

## Desired Outcome
AgentLoopKit has verified Scoop and WinGet manifests for the CLI after Windows smoke tests and stable release checksums exist.

## Constraints
- Reuse release assets.
- Pin checksums.
- Verify on Windows.
- Do not add install-time scripts that mutate user profiles.

## Non-Goals
- Do not replace npm.
- Do not add a desktop app.

## Likely Files or Areas
- docs/distribution-channels.md
- docs/launch-checklist.md
- Future Scoop bucket or WinGet manifest repository

## Acceptance Criteria
- Windows install path is documented.
- `agentloop version` and `agentloop init --dry-run` pass after install.
- Manifest submission instructions are recorded.

## Verification Commands
- agentloop version
- agentloop init --dry-run

## Rollback Notes
Withdraw or supersede manifests if checksums, install paths, or binary behavior are wrong.
