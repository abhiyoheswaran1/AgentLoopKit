# Add Docker and GHCR image

- Created date: 2026-06-10
- Task type: release
- Status: done

## Problem Statement
CI users may want a pinned container image with AgentLoopKit installed, especially when they cannot rely on local Node setup.

## Desired Outcome
AgentLoopKit publishes a minimal GHCR image that runs `agentloop` and can be pinned by tag or digest in CI.

## Constraints
- No project dependencies are bundled by default.
- No telemetry.
- No credential or env-file content reads.
- Keep the image small and boring.

## Non-Goals
- Do not build a hosted service.
- Do not run user verification commands during image build.

## Likely Files or Areas
- Dockerfile
- .github/workflows/docker.yml
- docs/distribution-channels.md
- docs/github-actions.md

## Acceptance Criteria
- Image builds from a clean checkout.
- Image runs `agentloop version`.
- GHCR publish uses GitHub Actions provenance.
- Docs show pinned tag and digest usage.

## Verification Commands
- docker build -t agentloopkit:test .
- docker run --rm agentloopkit:test agentloop version

## Rollback Notes
Delete the broken image tag from GHCR and publish a patch tag after fixing the image.
