# Interview Cycle 88

## Context

`FINAL_HANDOFF.md` is the maintainer-facing closeout document for AgentLoopKit. The repo now has GitHub releases through `v0.22.0`, npm still serves `0.1.1`, and README includes a temporary `npx --package` GitHub tarball path. Some final-handoff sections still describe `0.19.0` as the current npm recovery target or imply `npx agentloopkit init` gets the current CLI.

This cycle is internal simulated feedback for product judgment. It is not real user research.

## Personas interviewed

- Founder / Product Lead
- Open Source Maintainer
- Developer Experience Designer
- Security Reviewer
- Skeptical Senior Developer

## Feedback summary

The strongest signal was handoff accuracy. A stale final handoff can undo otherwise good release documentation because it tells the next maintainer to recover the wrong version.

## Raw simulated feedback

### Founder / Product Lead

- What they liked: The public README now gives a current tarball path while npm lags.
- What confused them: The final handoff still says the next publish target is `0.19.0`.
- What they would need before using it: One current launch checklist.
- What would make them recommend/star it: The repo reads like one coherent product, not a trail of release fragments.
- What would make them abandon it: Announcing a command that installs old npm behavior.

### Open Source Maintainer

- What they liked: The release and CI evidence are preserved.
- What confused them: The checklist stops before `v0.20.0`, `v0.21.0`, and `v0.22.0`.
- What they would need before using it: The final handoff should match the current GitHub release.
- What would make them recommend/star it: Clear next action: publish `0.22.0` after npm auth works.
- What would make them abandon it: A handoff that points to stale package versions.

### Developer Experience Designer

- What they liked: The README workaround is direct.
- What confused them: Suggested announcement copy still leads with `npx agentloopkit init`.
- What they would need before using it: Announcement copy should mention the temporary GitHub tarball until npm catches up.
- What would make them recommend/star it: Launch copy that does not surprise first-run users.
- What would make them abandon it: Asking users to infer the current install command from release notes.

### Security Reviewer

- What they liked: The docs do not ask for tokens or hidden install scripts.
- What confused them: The handoff does not name the current tarball fallback as temporary.
- What they would need before using it: Clear npm-auth blocker, no publish attempt, and no curl-pipe-shell path.
- What would make them recommend/star it: The exact `npm view` proof remains visible.
- What would make them abandon it: Publishing old versions from the wrong commit.

### Skeptical Senior Developer

- What they liked: The one-time npm catch-up story is defensible.
- What confused them: A long handoff with stale entries is hard to trust.
- What they would need before using it: Short current-state bullets at the end.
- What would make them recommend/star it: A practical, honest launch checklist.
- What would make them abandon it: A mismatch between README, npm docs, and final handoff.

## Product council debate

- Abhi: "Make the handoff current. Do not let stale internal docs confuse launch."
- Maya: "Do not rewrite history. Update current-state guidance only."
- Elias: "The launch checklist must include `v0.22.0` and npm pending."
- Nora: "Announcement copy should not lead with stale npm while npm lags."
- Samir: "No publish retry. Keep the blocker explicit."
- Lina: "The tarball command belongs in the handoff until npm catches up."
- Tom: "Fix the `0.19.0` reference. That is the bug."
- Rachel: "Teams need one current next step."

## Decision

Refresh the final handoff current-state sections for `v0.22.0`: backlog, limitations, launch checklist, announcement copy, and next improvements. Preserve historical release evidence.

## Non-decisions

- Do not change CLI behavior.
- Do not publish to npm.
- Do not remove historical release notes.
- Do not claim real user feedback.

## Resulting tasks

- Add `v0.20.0`, `v0.21.0`, and `v0.22.0` entries to the final launch checklist.
- Change the npm recovery target in Next 15 improvements from `0.19.0` to `0.22.0`.
- Mention the temporary GitHub tarball path in known limitations and launch copy.
- Update backlog and dogfood records.
- Run link checks, projscan, and AgentLoop verification.

## Success criteria

- No final-handoff current-state section treats `0.19.0` as the active publish target.
- Final handoff names `0.22.0` as the next npm catch-up publish.
- Announcement copy does not imply npm `0.1.1` contains the current CLI.
- Verification passes.
