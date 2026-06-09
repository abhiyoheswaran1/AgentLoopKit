# Interview Cycle 13

## Context

GitHub release `v0.2.0` is public, but npm still reports `agentloopkit@0.1.1` as latest. The publish workflow has the right shape, but npm needs package-side trusted publisher configuration before OIDC publish can succeed.

## Personas interviewed

- Open Source Maintainer
- Security Reviewer
- Principal Engineer
- Founder / Product Lead

## Feedback summary

The strongest signal: publish recovery needs exact owner-facing instructions, not another workflow rewrite. The package owner must configure npm trusted publishing or complete a local browser-auth publish.

## Raw simulated feedback

### Open Source Maintainer

- Liked: release workflow runs checks before publish.
- Confused: whether `0.2.0` is live on npm.
- Would need before rerunning release: exact npm settings and expected verification command.
- Would recommend/star it if: release notes and docs stay honest about npm status.
- Would abandon it if: docs imply a failed publish succeeded.

### Security Reviewer

- Liked: no npm token is stored in GitHub.
- Confused: whether local fallback creates provenance.
- Would need before approving: clear rule that OTPs and tokens never enter chat or PRs.
- Would recommend/star it if: trusted publishing is the preferred path.
- Would abandon it if: the workflow starts using long-lived tokens.

### Principal Engineer

- Liked: workflow already has `id-token: write`, Node 24, and npm upgrade.
- Confused: why another code change would help.
- Would need before continuing: docs that separate package-code PRs from the frozen `v0.2.0` tag.
- Would recommend/star it if: version sequencing stays clean.
- Would abandon it if: `0.2.0` gets published from a commit that does not match the tag.

### Founder / Product Lead

- Liked: npm distribution remains the main path.
- Confused: launch status is split between GitHub and npm.
- Would need before announcing: npm latest matches the release or the announcement names the pending state.
- Would recommend/star it if: recovery steps are clear and short.
- Would abandon it if: release friction hides the product's core value.

## Product council debate

- Abhi: Keep moving, but do not blur release truth.
- Maya: Fix docs. Do not rewrite the workflow unless evidence shows the workflow is wrong.
- Elias: Put the exact npm package settings in the publishing guide.
- Nora: Add a checklist that tells the maintainer what to do next.
- Samir: Do not introduce npm tokens. Trusted publishing is safer.
- Lina: Keep package-content PRs open until version sequencing is explicit.
- Tom: State that npm latest is `0.1.1`; do not dress it up.
- Rachel: Future teams will trust the tool more if release evidence is clear.

## Decision

Update publishing docs, launch checklist, and final handoff with the exact trusted publisher setup and current `0.2.0` recovery state.

## Non-decisions

- No new release tag.
- No package version bump.
- No npm publish retry.
- No package-content PR merge.

## Resulting tasks

- Update `docs/npm-publishing.md`.
- Update `docs/launch-checklist.md`.
- Update `FINAL_HANDOFF.md`.
- Update backlog and dogfood notes.

## Success criteria

- Maintainer can configure npm trusted publishing from the docs.
- Docs state that npm latest remains `0.1.1` until recovery succeeds.
- Verification passes.
