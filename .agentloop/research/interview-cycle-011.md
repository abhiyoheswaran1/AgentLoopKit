# Interview Cycle 11

## Context

CI passes after the Node 24 runtime opt-in, but GitHub still reports that pinned action versions target Node 20. Upstream tags show v6 major lines for checkout, setup-node, and pnpm setup actions.

This is simulated internal product-panel feedback. It is not real user research.

## Personas interviewed

- Open Source Maintainer
- Principal Engineer
- Security Reviewer
- Open Source Contributor

## Feedback summary

The strongest signal: remove avoidable CI warning noise with a workflow-only change that does not affect package contents or credentials.

## Raw simulated feedback

### Open Source Maintainer

- Liked: CI is green.
- Confused: green checks still show runtime deprecation annotations.
- Would need before using it: warnings owned or removed.
- Would recommend/star it if: the repo looks maintained in Actions.
- Would abandon it if: launch workflows show preventable warnings.

### Principal Engineer

- Liked: simple workflow structure.
- Confused: env opt-in did not remove the target-runtime annotation.
- Would need before using it: current action pins.
- Would recommend/star it if: workflow maintenance stays explicit.
- Would abandon it if: release hardening changes package behavior.

### Security Reviewer

- Liked: no token handling changes.
- Confused: none; this is supply-chain hygiene.
- Would need before using it: no new secret or auth mechanism.
- Would recommend/star it if: workflow dependencies stay current.
- Would abandon it if: action upgrades happen without verification.

### Open Source Contributor

- Liked: predictable CI.
- Confused: warnings in green jobs are hard to interpret.
- Would need before contributing: clean Actions output.
- Would recommend/star it if: first PR checks are easy to read.
- Would abandon it if: CI looks stale.

## Product council debate

- Abhi: This is launch polish, not product scope creep.
- Maya: Upgrade only the action pins. Do not redesign CI.
- Elias: Green, low-noise Actions matter for contributors.
- Nora: Fewer warnings means clearer reviews.
- Samir: No auth changes. Acceptable.
- Lina: Agents can trust CI output more easily.
- Tom: Maintenance work is useful when it removes real warning noise.
- Rachel: Teams look at CI hygiene before adopting tools.

## Decision

Upgrade CI and Publish workflows to `actions/checkout@v6`, `actions/setup-node@v6`, and `pnpm/action-setup@v6`.

## Non-decisions

- No package version change.
- No npm publish retry.
- No CI matrix.
- No secret/token changes.

## Resulting tasks

- Update `.github/workflows/ci.yml`.
- Update `.github/workflows/publish.yml`.
- Record backlog and dogfood notes.
- Verify locally and with `projscan`.

## Success criteria

- Local checks pass.
- PR CI passes.
- CI annotations no longer complain about Node 20-targeted actions.
