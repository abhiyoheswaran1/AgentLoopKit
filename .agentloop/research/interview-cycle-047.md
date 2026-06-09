# Interview Cycle 47

Internal simulated feedback. Do not present this as real user research.

## Context

GitHub release `v0.12.0` is public and includes `agentloopkit-0.12.0.tgz` with a matching SHA-256 digest. GitHub CI passed for commit `8652219`. The release-triggered Publish workflow passed package checks, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.

## Personas interviewed

- Open Source Maintainer
- Security Reviewer
- Developer Experience Designer
- AI-Skeptical Senior Developer

## Feedback summary

The strongest signal is trust. The release is useful as a GitHub tarball, but npm still serves `0.1.1`. Public release notes and internal docs must record that split plainly.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: The release page has a verified tarball and clear changelog.
- What confused them: npm still lags behind source releases.
- What they would need before using it: Release notes that show the exact Publish workflow failure.
- What would make them recommend/star it: Honest registry proof and no inflated availability claims.
- What would make them abandon it: Docs that tell users `npx agentloopkit` includes `0.12.0` before npm proves it.

### Security Reviewer

- What they liked: The workflow did not touch credentials from the repo.
- What confused them: Whether another local publish retry will run.
- What they would need before using it: Keep the next action focused on npm trusted publishing or manual authenticated publish outside docs.
- What would make them recommend/star it: Record tarball digest, workflow ID, and exact npm error.
- What would make them abandon it: Hiding the failed publish result.

### Developer Experience Designer

- What they liked: The README visuals now match the current source version and 68-test suite.
- What confused them: Whether users should install by npx or GitHub tarball.
- What they would need before using it: Keep README install copy honest: npm is behind; GitHub tarball has newer source.
- What would make them recommend/star it: A release note that gives the immediate state in one paragraph.
- What would make them abandon it: Release notes that make users hunt for npm status.

### AI-Skeptical Senior Developer

- What they liked: The failed publish is documented instead of hand-waved.
- What confused them: Why npm reports E404 for a package that exists.
- What they would need before using it: State that the likely fix is npm-side trusted publishing or account/package permission repair.
- What would make them recommend/star it: Evidence before claims.
- What would make them abandon it: Blaming npm without proof.

## Product council debate

- Abhi: Record the split and keep going; GitHub release quality still matters.
- Maya: No code change. This is documentation and release-status hygiene.
- Elias: Update release notes, launch checklist, npm publishing docs, final handoff, dogfood log, and backlog.
- Nora: Put npm status near the top of the release note.
- Samir: Include the exact `E404` line and registry proof. Do not touch credentials.
- Lina: Agents can consume the tarball, but npx users need the truth.
- Tom: This is the kind of evidence that makes the tool credible.
- Rachel: Team users will care that package release state is traceable.

## Decision

Document the `v0.12.0` GitHub release status and npm authorization failure. Update the GitHub release notes with the Publish workflow result, update internal release records, and keep npm availability claims tied to `npm view`.

## Non-decisions

- Do not retry local npm publish in this cycle.
- Do not change trusted-publishing settings from the repo.
- Do not add package-install workarounds to the README.
- Do not create a new feature.

## Resulting tasks

- Update GitHub release notes for `v0.12.0`.
- Update launch checklist and npm publishing docs.
- Update final handoff and dogfood log.
- Update backlog with the release-status documentation item.
- Run link checks and projscan.

## Success criteria

- GitHub release notes show the actual Publish workflow result.
- Docs record npm latest `0.1.1` and versions `0.1.0`, `0.1.1`.
- No doc claims npm `0.12.0` availability.
