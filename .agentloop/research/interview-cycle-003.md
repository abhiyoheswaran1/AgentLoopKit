# Interview Cycle 3

## Context

Cycles 1 and 2 improved first-run orientation and agent compatibility. This cycle focuses on open-source launch readiness and publishing trust.

## Personas interviewed

- Open Source Maintainer
- Security Reviewer
- Startup CTO
- Future Commercial Buyer
- Open Source Contributor

## Feedback summary

The repo looks launchable, but npm publishing should be trustworthy and repeatable. A release-triggered publish workflow with provenance is useful, provided docs state that npm trusted publishing must be configured and no publish happens automatically from local work.

## Raw simulated feedback

### Open Source Maintainer

- Liked: README, CI, examples, issue templates.
- Confused: exact npm release flow.
- Needs before using it: package safety and publish docs.
- Would recommend/star: if the project looks safe to run with npx.
- Would abandon: if publish path looks improvised.

### Security Reviewer

- Liked: no postinstall, no telemetry, no env reading.
- Confused: whether provenance is supported.
- Needs before using it: clear npm trusted publishing guidance.
- Would recommend/star: if supply-chain posture is boring and transparent.
- Would abandon: if hidden scripts or broad credential access appear.

### Startup CTO

- Liked: team consistency without SaaS.
- Confused: release maturity.
- Needs before using it: CI and release checklist.
- Would recommend/star: if the repo feels maintained.
- Would abandon: if commands fail in CI.

### Future Commercial Buyer

- Liked: audit-friendly artifacts.
- Confused: no team dashboard, but accepts that it is not MVP.
- Needs before using it: repeatable package release.
- Would recommend/star: if open-source core earns trust first.
- Would abandon: if future commercial goals distort the free tool.

### Open Source Contributor

- Liked: clear structure and tests.
- Confused: where to contribute first.
- Needs before using it: contribution flow and good first issue path.
- Would recommend/star: if local setup is easy.
- Would abandon: if maintenance expectations are unclear.

## Product council debate

- Abhi: "Add trusted publishing workflow, but do not publish automatically here."
- Maya: "Keep the workflow short: install, checks, build, publish."
- Elias: "Docs should tell maintainers what to configure on npm."
- Nora: "Make launch steps copy-pasteable."
- Samir: "Use OIDC provenance. Do not store npm tokens if trusted publishing is available."
- Lina: "This helps users trust npx usage."
- Tom: "Publishing docs are practical, not hype."
- Rachel: "Good future buyer signal without building paid features."

## Decision

Add `.github/workflows/publish.yml` and update npm publishing docs.

## Non-decisions

- Do not publish to npm from this machine.
- Do not add cloud features.
- Do not add billing, login, telemetry, or dashboards.

## Resulting tasks

- Add release-triggered publish workflow.
- Document npm trusted publishing.
- Keep manual fallback instructions.
- Mark npm auth as required for local publish.

## Success criteria

- Workflow exists and runs checks before publish.
- Docs describe trusted publishing and manual fallback.
- No npm publish occurs automatically during this build.
