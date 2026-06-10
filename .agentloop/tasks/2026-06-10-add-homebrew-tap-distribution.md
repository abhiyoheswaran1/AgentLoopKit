# Add Homebrew tap distribution

- Created date: 2026-06-10
- Task type: release
- Status: done

Superseded on 2026-06-10: maintainer rejected Homebrew tap distribution because a tap is not Homebrew Core. Do not treat this task as active release-channel guidance.

## Problem Statement

macOS and Linux CLI users often prefer Homebrew, but AgentLoopKit only supports npm/npx and GitHub release tarballs today.

## Desired Outcome

Maintainers can publish and verify a Homebrew tap formula for AgentLoopKit without adding install-time scripts or hidden behavior.

## Constraints

- Reuse the published npm package or GitHub release asset.
- Pin checksums.
- Keep install behavior transparent.
- Do not add telemetry, postinstall scripts, or credential access.

## Non-Goals

- Do not replace npm as the primary channel.
- Do not create a custom installer.

## Likely Files or Areas

- docs/distribution-channels.md
- docs/launch-checklist.md
- .agentloop/backlog.md
- A future Homebrew tap repository

## Acceptance Criteria

- Formula install path is documented.
- Formula uses a reproducible source and checksum.
- Formula is copied into the Homebrew tap after the release tarball checksum is final.
- Clean-machine install and `agentloop version` are verified.

## Verification Commands

- brew audit --strict <formula>
- brew install <tap>/agentloopkit
- agentloop version

## Rollback Notes

Remove or deprecate the formula if checksum, install, or runtime verification fails.
