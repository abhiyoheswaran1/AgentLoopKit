# Interview Cycle 27

Internal simulated feedback. Do not present this as real user research.

## Context

`agentloopkit@0.6.0` is prepared on `main` with the `task list`, `task show`, `task set`, `verify`, and `handoff` flow documented. npm latest still reports `0.1.1`, so README visuals must show the current source workflow without depending on stale npm output.

## Personas interviewed

- Indie Hacker Using Codex
- Claude Code Power User
- Open Source Maintainer
- Developer Experience Designer
- AI-Skeptical Senior Engineer

## Feedback summary

The strongest signal is trust at first glance. The README should show what AgentLoopKit creates, how the CLI feels, and how verification evidence looks. The terminal demo must run against the current local build, not whatever npm currently serves.

## Raw simulated feedback

### Indie Hacker Using Codex

- Liked: the hero screenshot explains the repo-local loop before any install step.
- Confused: npm latest lag makes the command list feel risky.
- Would need before using it: a clear note about source version versus npm version.
- Would recommend/star it if: the first screen shows the loop, not a generic AI pitch.
- Would abandon it if: the README screenshots did not match the CLI they can run.

### Claude Code Power User

- Liked: task contracts and handoffs are visible as concrete files.
- Confused: the old GIF used `npx agentloopkit`, which can resolve to the stale npm package.
- Would need before using it: a demo generated from the current repo package.
- Would recommend/star it if: the README proves the workflow is deterministic and local.
- Would abandon it if: generated docs overclaim agent compatibility.

### Open Source Maintainer

- Liked: Playwright and VHS sources make the launch assets reproducible.
- Confused: screenshots had old test counts and release timestamps.
- Would need before using it: up-to-date visual evidence and honest publishing notes.
- Would recommend/star it if: the README makes safety and no-telemetry claims visible.
- Would abandon it if: image links broke on GitHub or npm.

### Developer Experience Designer

- Liked: the visual system feels CLI-native and avoids a fake SaaS dashboard.
- Confused: the hero copy used shorthand for GitHub Copilot CLI.
- Would need before using it: tighter copy and a current terminal flow.
- Would recommend/star it if: the README shows init, task creation, task inspection, verification, and handoff in one pass.
- Would abandon it if: the visuals looked like unrelated marketing art.

### AI-Skeptical Senior Engineer

- Liked: verification evidence is shown as command output, not a claim.
- Confused: "visual proof" can become decoration if not tied to real artifacts.
- Would need before using it: screenshots generated from committed source files.
- Would recommend/star it if: the README stays direct about npm auth and limitations.
- Would abandon it if: the tool looked like another AI wrapper.

## Product council debate

- Abhi: The README needs stronger screenshots before the next release. Keep the wedge: repo-level loop, no SaaS.
- Maya: Do not touch CLI behavior for a docs iteration. Use current build artifacts and verify the repo.
- Elias: Reproducible image sources matter for open-source trust. Broken or stale README images hurt stars.
- Nora: The terminal GIF should show the actual first workflow: init, create task, inspect task, verify, handoff.
- Samir: Do not use npm latest in the tape while npm is behind. Pack the local build and install it into a temp repo.
- Lina: Agents need to see `task list` and `task show`; that is the practical preflight.
- Tom: Keep copy concrete. The screenshot should prove evidence, not vibe.
- Rachel: This is enough launch polish without turning into a dashboard.

## Decision

Refresh the README visuals for `0.6.0`: render the hero and verification screenshots with Playwright, regenerate the terminal GIF with VHS from a locally packed tarball, and update README copy with honest source-versus-npm status.

## Non-decisions

- Do not add a website, dashboard, cloud service, telemetry, or analytics.
- Do not change CLI behavior in this iteration.
- Do not claim npm `0.6.0` availability until npm verifies it.
- Do not claim real user feedback from this simulated review.

## Resulting tasks

- Update `docs/assets/readme/showcase.html`.
- Update `docs/assets/readme/verification.html`.
- Update `docs/assets/readme/agentloopkit-cli.tape` so it packs the local build before the demo.
- Regenerate `agentloopkit-showcase.png`, `agentloopkit-verification.png`, and `agentloopkit-cli.gif`.
- Tighten README copy using stop-slop rules.
- Verify, dogfood, commit, push, and continue release work.

## Success criteria

- README image links point to committed assets.
- VHS demo does not depend on npm latest.
- Playwright screenshots reflect current `0.6.0` source claims and current test counts.
- Project checks, build, projscan, and packed CLI smoke pass after the docs refresh.
