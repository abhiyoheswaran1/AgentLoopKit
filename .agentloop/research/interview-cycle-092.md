# Interview Cycle 92

## Context

GitHub release `v0.23.0` is public with `agentloopkit-0.23.0.tgz`. The release asset digest is verified, the tarball smoke test reports `0.23.0`, and PowerShell completion renders from the release asset. The release-triggered Publish workflow passed package checks and failed at npm authorization.

## Personas interviewed

- Open Source Maintainer
- Security Reviewer
- Developer Experience Designer
- AI-Skeptical Senior Engineer

## Feedback summary

The strongest signal is release-state honesty. The project should say that GitHub `v0.23.0` is current, npm still serves `0.1.1`, and workflow `27253066701` failed only at npm authorization after checks passed.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: The release asset is verified.
- What confused them: Whether npm now has `0.23.0`.
- What they would need before using it: npm registry proof in the docs.
- What would make them recommend/star it: Clear release-status docs.
- What would make them abandon it: Stale checkboxes after release.

### Security Reviewer

- What they liked: The token value is masked in workflow logs.
- What confused them: Whether the failed publish should be retried automatically.
- What they would need before using it: A clear statement that no local publish will run while `npm whoami` fails.
- What would make them recommend/star it: Exact workflow ID and failure type.
- What would make them abandon it: A claim that dry-run means publish success.

### Developer Experience Designer

- What they liked: The README tarball command now points at the current release.
- What confused them: Checklist entries still marked `v0.23.0` as unpublished.
- What they would need before using it: The launch checklist and release-status page aligned.
- What would make them recommend/star it: Copy-paste install commands that match the release page.
- What would make them abandon it: Mixed `0.22.0` and `0.23.0` current-state instructions.

### AI-Skeptical Senior Engineer

- What they liked: The tarball was smoke tested after download.
- What confused them: The package is released on GitHub but still not npm.
- What they would need before using it: A plain explanation of the npm auth blocker.
- What would make them recommend/star it: Verified artifact hash and no overclaiming.
- What would make them abandon it: Treating a failed workflow as a successful npm publish.

## Product council debate

- Abhi: Record the state and keep moving. Do not wait on npm auth to document the GitHub release.
- Maya: Docs only. Do not touch code after the release candidate.
- Elias: Update release-status, publishing docs, launch checklist, and final handoff together.
- Nora: Keep the install command visible and current.
- Samir: Include the workflow ID and npm `E404`; do not expose token details.
- Lina: The tarball smoke matters more than release-page prose.
- Tom: Use direct language. npm did not publish.
- Rachel: This is enough for teams to evaluate the release while npm is blocked.

## Decision

Record the verified `v0.23.0` GitHub release, the failed npm publish workflow, and npm registry proof. Keep npm availability marked as blocked.

## Non-decisions

- Do not retry npm publish from an unauthenticated shell.
- Do not change package code.
- Do not create another release for docs-only status updates.

## Resulting tasks

- Update release-status docs.
- Update npm publishing docs.
- Update launch checklist.
- Update final handoff and dogfood log.
- Run link and whitespace checks.

## Success criteria

- Docs say GitHub `v0.23.0` is public.
- Docs say npm latest remains `0.1.1`.
- Docs record Publish workflow `27253066701` as failed at npm publish with `E404`.
- No docs claim npm `0.23.0` is published.
