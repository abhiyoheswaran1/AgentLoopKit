# Interview Cycle 15

## Context

GitHub release `v0.2.1` was published after the release candidate passed local verification. The release-triggered Publish workflow passed install, lint, typecheck, tests, build, and package `prepublishOnly`, then npm rejected `npm publish --access public` with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`. npm latest remains `0.1.1`.

This is simulated/internal product-panel output, not real user research.

## Personas interviewed

- Open Source Maintainer
- Security Reviewer
- Indie Hacker Using Codex
- Startup CTO
- AI-Skeptical Senior Engineer

## Feedback summary

The strongest signal is trust: do not let public release notes imply npm availability when npm publish failed. The repo can keep `v0.2.1` public if the notes clearly explain that npm latest is still `0.1.1` and the next step is npm trusted-publisher configuration or a successful local authenticated publish.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: The GitHub release has concrete verification evidence.
- What confused them: GitHub says `v0.2.1`, npm says `0.1.1`.
- What they would need before using it: A public note that names which version is installable today.
- What would make them recommend/star it: Transparent release notes and no hidden publish claims.
- What would make them abandon it: A README or release page that advertises an npm version that does not exist.

### Security Reviewer

- What they liked: The workflow did not bypass npm authorization with a token in chat.
- What confused them: npm's 404 text sounds like a missing package, even though the package exists.
- What they would need before using it: Exact trusted-publisher settings and a registry verification command.
- What would make them recommend/star it: Clear provenance path and no credential leakage.
- What would make them abandon it: Any attempt to paste OTPs, tokens, or private npm logs into public docs.

### Indie Hacker Using Codex

- What they liked: `0.1.1` is still usable with `npx`.
- What confused them: They might copy `npx agentloopkit@0.2.1` from the release before npm has it.
- What they would need before using it: A fallback command pinned to the available version.
- What would make them recommend/star it: A smooth `npx` path and honest limitations.
- What would make them abandon it: Install commands that fail on first try.

### Startup CTO

- What they liked: The release process has checks and visible failure handling.
- What confused them: Whether the team should adopt `0.1.1` or wait for `0.2.1`.
- What they would need before using it: A stable install recommendation and a short recovery note.
- What would make them recommend/star it: Disciplined release hygiene.
- What would make them abandon it: Ambiguous package state.

### AI-Skeptical Senior Engineer

- What they liked: The tool applies its own verification discipline.
- What confused them: Why a GitHub release exists when npm publish failed.
- What they would need before using it: Proof that the released code passed tests and a clear npm status.
- What would make them recommend/star it: Treating failed publish as a first-class release note.
- What would make them abandon it: Spin.

## Product council debate

- Abhi: Keep the GitHub release, but make the npm gap impossible to miss.
- Maya: Do not change runtime code for a publishing authorization problem.
- Elias: Update launch docs and the release note now. People read release pages quickly.
- Nora: Give users one install command that works today.
- Samir: Do not ask for or store tokens. Trusted publishing is the right path.
- Lina: `0.2.1` has useful agent-loop improvements, but failed install commands hurt trust.
- Tom: A failed publish is not a disaster. Hiding it would be.
- Rachel: The release process itself is a signal. Keep it boring and auditable.

## Decision

Keep GitHub release `v0.2.1` public, edit the release note to say npm latest remains `0.1.1`, and update internal launch docs, dogfood log, and backlog with the npm authorization blocker.

## Non-decisions

- Do not add npm tokens to GitHub secrets as a workaround.
- Do not publish another version number until npm publishing is fixed.
- Do not change package behavior to compensate for a release authorization problem.
- Do not claim `agentloopkit@0.2.1` is installable from npm until `npm view` confirms it.

## Resulting tasks

- Update public GitHub release notes for `v0.2.1`.
- Update `docs/npm-publishing.md`.
- Update `docs/launch-checklist.md`.
- Update `.agentloop/dogfood-log.md`.
- Add a P0 backlog item for npm publish authorization.
- Verify npm registry state with `npm view agentloopkit version versions --json`.

## Success criteria

- Public release notes distinguish GitHub release status from npm availability.
- Internal docs name the exact failed command and next recovery step.
- npm status is verified from the registry, not inferred from local publish output.
