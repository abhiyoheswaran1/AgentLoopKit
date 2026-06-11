# Interview Cycle 109

## Context

AgentLoopKit `main` already contains many unreleased `0.28.0` safety, DX, and docs improvements after `0.27.0`. The maintainer asked for a systematic launch-quality sprint without cutting a new version until the batch is ready.

This cycle is internal simulated product-panel feedback. It is not real user research.

## Personas interviewed

- Open Source Maintainer
- Developer Experience Designer
- Power User / Agentic Engineer
- Skeptical Senior Developer
- Security Reviewer

## Feedback summary

The strongest signal was trust on first contact. npm users need a shorter README, agents need clearer first-run guidance, maintainers need cross-platform smoke proof, and reviewers need one command that inventories local evidence without mutating the repo.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: The product has real CLI behavior, examples, docs, and a clear safety posture.
- What confused them: The README carried too much command detail for first-time npm readers.
- What they would need before using it: A 30-second README path plus a deeper command reference.
- What would make them recommend/star it: Clean install path, smoke-tested package behavior, and no unsupported channel claims.
- What would make them abandon it: npm page copy that reads like maintainer release notes.

### Developer Experience Designer

- What they liked: `init`, `doctor`, `create-task`, `verify`, and `handoff` form a clear loop.
- What confused them: Generated harness files listed many commands but did not show the best first task to create.
- What they would need before using it: A risk-aware first task example with next commands.
- What would make them recommend/star it: First-run output and generated files that tell agents exactly what to do next.
- What would make them abandon it: Markdown noise that still leaves the agent guessing.

### Power User / Agentic Engineer

- What they liked: Task state, verification reports, handoffs, gates, and local-only harnesses.
- What confused them: Evidence files accumulate across reports, handoffs, badges, CI summaries, and release notes.
- What they would need before using it: A read-only inventory command for current evidence.
- What would make them recommend/star it: `agentloop artifacts --json` for scripts and agent context.
- What would make them abandon it: A command that cleans up or rewrites evidence without explicit approval.

### Skeptical Senior Developer

- What they liked: No LLM dependency, no telemetry, no postinstall script, and deterministic outputs.
- What confused them: Whether the package is actually proven on Windows and macOS.
- What they would need before using it: A built-CLI smoke workflow across operating systems.
- What would make them recommend/star it: Boring CI that exercises the real binary.
- What would make them abandon it: Claims of compatibility without runnable evidence.

### Security Reviewer

- What they liked: Recent symlink and path hardening.
- What confused them: Whether a new artifact inventory command could read outside the repo.
- What they would need before using it: Missing directories return zero and unsafe roots are skipped.
- What would make them recommend/star it: Explicit tests proving no mutation and no outside-root reads.
- What would make them abandon it: Evidence commands that read secrets or scan arbitrary files.

## Product council debate

- Abhi: "Keep the wedge clear. This is a local engineering loop, not a generic workflow app."
- Maya: "The smoke script should run the built CLI in a temp repo. That is more useful than another unit test."
- Elias: "README must be the npm page, not the maintainer diary."
- Nora: "Generated files need a first task example with risk, rollback, and verification."
- Samir: "The artifacts command is acceptable only if it is read-only and repo-bounded."
- Lina: "Agents need `artifacts --json`; otherwise they parse directory trees manually."
- Tom: "Show practical proof. If it is deterministic and local, I can review it."
- Rachel: "Cross-platform smoke CI is team-adoption work. Keep it lightweight."

## Decision

Build four aligned improvements for the future `0.28.0` batch:

- simplify the npm-facing README and move command detail into `docs/cli-reference.md`
- add cross-platform built-CLI smoke CI
- add read-only `agentloop artifacts`
- improve generated first-run task guidance

## Non-decisions

- Do not bump package version.
- Do not publish npm.
- Do not create a GitHub release.
- Do not add Homebrew, Scoop, WinGet, editor extension, SaaS, dashboard, telemetry, or AI API work.

## Resulting tasks

- Update README and create CLI reference docs.
- Add `.github/workflows/smoke.yml` and `scripts/smoke-cli.mjs`.
- Add `agentloop artifacts` with human and JSON output.
- Update generated harness guidance and tests.
- Update changelog, roadmap, release-status docs, backlog, dogfood log, and final handoff.

## Success criteria

- Public README explains install and first workflow quickly.
- Smoke CI covers Ubuntu, macOS, and Windows.
- `agentloop artifacts --json` returns stable repo-relative evidence paths.
- Generated first-run guidance includes risk and task-linked verification.
- Full verification passes before pushing.
