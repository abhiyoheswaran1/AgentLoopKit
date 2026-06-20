# Interview Cycle 124

## Context

After local real-repo trials, the remaining repeated onboarding friction was `agentloop doctor` before initialization. The command prints useful missing-harness guidance, but it exits non-zero when `agentloop.config.json` is absent. That is correct for gates, but brittle for copy-paste trial scripts and first-run onboarding where users need to see the rest of the loop.

This is simulated internal product-panel feedback. It is not real user research.

## Personas Interviewed

- Indie Hacker Using Codex
- Open Source Maintainer
- AI-Skeptical Senior Engineer
- Platform Engineer
- Dogfood Steward

## Feedback Summary

The panel preferred an explicit advisory doctor mode over changing default exit semantics. The default command should remain useful for strict setup checks, while onboarding and real-repo trial docs should have a copy-paste-safe command that keeps diagnostics visible without stopping the shell.

## Raw Simulated Feedback

### Indie Hacker Using Codex

- What they liked: `doctor` tells them what is missing before setup.
- What confused them: the first command in a trial script can stop the script before `create-task` or `status` runs.
- What they would need before using it: a command name or flag that makes it obvious this is advisory preflight.
- What would make them recommend/star it: first-run commands that work in a terminal without shell gymnastics.
- What would make them abandon it: needing to know `|| true` on day one.

### Open Source Maintainer

- What they liked: non-zero default exits are useful for CI and maintainer gates.
- What confused them: trial docs currently look like a copy-paste block, but the first command can fail before the trial is initialized.
- What they would need before using it: docs should distinguish advisory onboarding from strict gates.
- What would make them recommend/star it: safer public examples that do not teach users to ignore failures broadly.
- What would make them abandon it: weakening default gate semantics for every user.

### AI-Skeptical Senior Engineer

- What they liked: `doctor` is deterministic and local.
- What confused them: a setup-health command has two jobs: inform humans and fail gates.
- What they would need before using it: keep those two jobs explicit instead of making failure behavior surprising.
- What would make them recommend/star it: tests proving advisory mode changes only exit behavior.
- What would make them abandon it: hiding the failing status or converting real failures into passes.

### Platform Engineer

- What they liked: `doctor --strict` already maps to team setup gates.
- What confused them: teams may also use doctor in onboarding scripts where a non-zero missing-config result is expected.
- What they would need before using it: an advisory flag that CI can avoid and docs can recommend for trials.
- What would make them recommend/star it: JSON output that still reports `overallStatus: "fail"` while the process exits 0 only when explicitly requested.
- What would make them abandon it: a flag that mutates config or runs `init` implicitly.

### Dogfood Steward

- What they liked: the last trial made the issue visible through local evidence, not guesses.
- What confused them: docs should not need shell-specific workarounds.
- What they would need before using it: AgentLoopKit, ProjScan, and AgentFlight evidence attached to the change.
- What would make them recommend/star it: the fix stays small and local.
- What would make them abandon it: scope creep into init automation, telemetry, policy packs, or release work.

## Product Council Debate

- Abhi: Smooth the first-run path, but do not reduce trust in setup checks.
- Maya: Put this in the CLI layer and keep the core diagnostics honest.
- Elias: Public docs should show `doctor --advisory --redact-paths` for trials instead of `doctor || true`.
- Nora: Add visible output that says advisory mode is enabled so users know why exit behavior differs.
- Samir: No hidden mutation, no token reads, no network calls, no secret reads.
- Lina: This helps agents run first-pass checks inside unfamiliar repos without aborting the session.
- Tom: Good if JSON still says fail. Bad if it masks the problem.
- Rachel: Platform teams can keep using default or strict mode in gates.

## Decision

Add `agentloop doctor --advisory`. Advisory mode keeps normal checks, `overallStatus`, warnings, failures, next actions, JSON content, and human output intact, but exits `0` even when the status is `fail`. Human and JSON output should show advisory mode is enabled. Default `doctor` and `doctor --strict` exit behavior remains unchanged.

## Non-Decisions

- Do not change `doctor` default exit behavior.
- Do not change `doctor --strict` diagnostics.
- Do not auto-run `init`.
- Do not add `|| true` guidance to public docs.
- Do not add network calls, telemetry, token reads, GitHub API usage, posting, policy-pack expansion, scoring changes, release, or publish behavior.

## Resulting Task

- Add TDD coverage for `doctor --advisory`.
- Implement the flag in the CLI and core output.
- Update real-repo trial and CLI docs.
- Update backlog, decision log, changelog, and task evidence.

## Success Criteria

- `agentloop doctor --json` in an uninitialized repo still exits non-zero and reports `overallStatus: "fail"`.
- `agentloop doctor --advisory --json` in the same repo exits `0`, reports `overallStatus: "fail"`, and reports `advisory: true`.
- Human advisory output includes `Advisory mode: enabled`.
- Real-repo trial docs use advisory mode for copy-paste preflight.
- Verification, ProjScan, AgentFlight, ship, and strict dogfood pass.
