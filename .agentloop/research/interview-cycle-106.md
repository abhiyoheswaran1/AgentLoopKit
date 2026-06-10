# Interview Cycle 106

## Context

AgentLoopKit `0.24.4` is published on npm and GitHub. The README already contains generated Playwright screenshots and a VHS terminal demo, but the terminal demo had grown long and showed older command coverage. The next public release should present the current first-run loop more clearly.

This cycle is simulated internal product-panel feedback, not real user research.

## Personas interviewed

- Indie Hacker Using Codex
- Open Source Maintainer
- AI-Skeptical Senior Engineer
- Developer Experience Designer
- Power User / Agentic Engineer

## Feedback summary

The strongest signal is that the README demo should explain the product faster than the command list. Viewers need to see the repo-local loop: initialize, inspect, create a task, verify, handoff, and produce reviewer evidence. They do not need every command in one GIF.

## Raw simulated feedback

### Indie Hacker Using Codex

- What they liked: `npx agentloopkit init` is the first visible command.
- What confused them: Long terminal output makes it hard to know what to try next.
- What they would need before using it: A demo that shows the shortest useful path.
- What would make them recommend/star it: A clear before-review workflow they can copy.
- What would make them abandon it: A README that looks like a process manual instead of a tool.

### Open Source Maintainer

- What they liked: The demo assets are generated from committed sources.
- What confused them: A demo that includes every command looks less intentional.
- What they would need before using it: Evidence that task, verification, and handoff artifacts are real files.
- What would make them recommend/star it: A concise loop that helps PR reviewers.
- What would make them abandon it: Manual screenshots or stale npm-facing examples.

### AI-Skeptical Senior Engineer

- What they liked: The CLI remains deterministic and local.
- What confused them: JSON payloads in a public GIF look like implementation noise.
- What they would need before using it: Human-readable output that shows what the tool adds.
- What would make them recommend/star it: Verification and handoff evidence without AI claims.
- What would make them abandon it: Any public copy that sounds like hype or fake adoption.

### Developer Experience Designer

- What they liked: VHS makes the demo reproducible.
- What confused them: The previous GIF was visually busy and too long.
- What they would need before using it: A smaller, readable demo with a dark terminal and clear pacing.
- What would make them recommend/star it: A first-run sequence that feels deliberate.
- What would make them abandon it: Setup commands leaking into the recording.

### Power User / Agentic Engineer

- What they liked: The flow includes `verify`, `handoff`, `check-gates`, `report`, and `badge`.
- What confused them: Agent-facing JSON output is useful, but not in a README hero demo.
- What they would need before using it: A demo that proves agents can follow the loop without a cloud backend.
- What would make them recommend/star it: Reproducible local evidence artifacts.
- What would make them abandon it: A workflow that depends on a specific coding agent.

## Product council debate

- Abhi: The README has to sell the wedge quickly: repo-level engineering discipline for agents.
- Maya: Keep the demo source small and deterministic; no screenshot-only edits.
- Elias: The npm README is the public surface. Keep internal release history out.
- Nora: The GIF should show one clean journey, not a catalog of commands.
- Samir: Hidden setup is acceptable only if the tape source is committed and transparent.
- Lina: Show `verify` and `handoff`; those are the agentic engineering payoff.
- Tom: Remove JSON walls and fake excitement. Show commands and evidence.
- Rachel: Static local reports and badges hint at team value without building SaaS.

## Decision

Refresh the VHS terminal demo around the first useful loop: `init`, `doctor`, task creation, task state, `status`, `verify`, `next`, `handoff`, `check-gates`, `report`, and `badge`. Use a compact dark terminal, hide setup with VHS `Hide`/`Wait`/`Show`, and keep README copy user-facing.

## Non-decisions

- Do not build a frontend app.
- Do not add a dashboard, hosted demo, telemetry, or analytics.
- Do not publish the GIF to an external VHS hosting service.
- Do not claim real interviews or adoption.
- Do not include internal release-state notes in README.

## Resulting tasks

- Update `docs/assets/readme/agentloopkit-cli.tape`.
- Regenerate `docs/assets/readme/agentloopkit-cli.gif`.
- Update README alt text and asset regeneration notes.
- Record the dogfood result.
- Include the visual refresh in the next patch release.

## Success criteria

- The GIF starts with the visible user-facing init command.
- The setup command does not appear at the start or loop boundary.
- The GIF is smaller than the previous 5.4 MB asset.
- The README describes the commands shown in the GIF.
- The npm-facing README contains no internal release incident notes.
