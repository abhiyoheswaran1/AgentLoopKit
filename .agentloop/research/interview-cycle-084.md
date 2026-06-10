# Interview Cycle 84

## Context

AgentLoopKit now includes task context in verification reports. The README already has Playwright screenshots and a VHS terminal demo, but the visuals still show older evidence and do not demonstrate the task-linked verification workflow.

This cycle is internal simulated feedback for product judgment. It is not real user research.

## Personas interviewed

- Indie Hacker Using Codex
- Open Source Maintainer
- Power User / Agentic Engineer
- Skeptical Senior Developer
- Developer Experience Designer

## Feedback summary

The strongest signal was launch trust. A GitHub visitor should see current local evidence, not stale numbers or a demo that depends on a hardcoded tarball version.

## Raw simulated feedback

### Indie Hacker Using Codex

- What they liked: The README already explains `npx agentloopkit init` quickly.
- What confused them: The screenshots show older test counts that do not match the current repo.
- What they would need before using it: A demo that makes the task-to-report loop obvious.
- What would make them recommend/star it: A short terminal flow that looks real and easy to reproduce.
- What would make them abandon it: A polished README that appears disconnected from the CLI.

### Open Source Maintainer

- What they liked: Screenshots and GIFs make the repository easier to scan.
- What confused them: Hardcoded `agentloopkit-0.21.0.tgz` in the tape will break later.
- What they would need before using it: Asset regeneration commands that future contributors can run.
- What would make them recommend/star it: Visuals that show review evidence and safety posture.
- What would make them abandon it: Binary asset churn without source files.

### Power User / Agentic Engineer

- What they liked: Task contracts, verification reports, and handoffs are all visible.
- What confused them: The screenshot does not show the new `Task Context` section.
- What they would need before using it: Proof that `verify --task` is part of the loop.
- What would make them recommend/star it: A demo that agents can follow inside any repo.
- What would make them abandon it: A GIF that only shows a happy path with no task traceability.

### Skeptical Senior Developer

- What they liked: The product avoids LLM claims and uses deterministic reports.
- What confused them: Stale counts make the README feel unattended.
- What they would need before using it: Current evidence and reproducible asset instructions.
- What would make them recommend/star it: A screenshot that shows actual review artifacts.
- What would make them abandon it: Marketing polish without current command output.

### Developer Experience Designer

- What they liked: The current visual language is readable and restrained.
- What confused them: The verification screenshot misses the newest behavior and the terminal demo is version-pinned.
- What they would need before using it: Updated visual hierarchy around task context.
- What would make them recommend/star it: First-screen README visuals that teach the product in seconds.
- What would make them abandon it: Dense visuals that feel like a wall of CLI output.

## Product council debate

- Abhi: "README trust matters for stars. Keep the visuals current."
- Maya: "Do not add dependencies. Improve the source assets and keep regeneration simple."
- Elias: "A hardcoded tarball filename is a maintainer trap."
- Nora: "Task context belongs in the verification screenshot now."
- Samir: "Do not show anything that implies env-file reading or telemetry."
- Lina: "The demo should model how agents connect task contracts to verification."
- Tom: "Stale numbers undercut the deterministic evidence story."
- Rachel: "This helps teams understand review artifacts without reading every doc."

## Decision

Refresh README visual assets around task-linked verification. Update screenshot HTML sources, make the VHS tape install the newest local packed tarball, regenerate PNG screenshots with Playwright, and regenerate the GIF with VHS if the local renderer works.

## Non-decisions

- Do not create a web app.
- Do not add Playwright or VHS as runtime dependencies.
- Do not publish a new npm version in this iteration.
- Do not claim real user feedback.

## Resulting tasks

- Update `showcase.html` to remove stale test counts.
- Update `verification.html` to show task context and current test counts.
- Update `agentloopkit-cli.tape` to install the latest local packed tarball.
- Regenerate README PNG screenshots with Playwright.
- Regenerate the terminal GIF with VHS if possible.
- Update the dogfood log and handoff.

## Success criteria

- README visual assets match current product behavior.
- Future maintainers can regenerate assets without editing a package version in the VHS tape.
- Verification and screenshot commands pass locally.
