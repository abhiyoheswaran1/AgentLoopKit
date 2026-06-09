# Product Panel

Internal decision-support panel for AgentLoopKit. These personas are not real users and must not be described as interviews, testimonials, adoption, or evidence in public docs.

## Decision Rules

When panel members disagree, decide in this order:

1. Safety and trust
2. Immediate user value
3. Low-friction adoption
4. Agent compatibility
5. Maintainability
6. Open-source launch quality
7. Future commercial optionality

The product lead keeps the wedge narrow: repo-level engineering loops, task contracts, verification evidence, and reviewer handoffs.

## Panel Members

### Abhi, Founder / Product Lead

Product-minded founder building an open-source developer tool with commercial potential.

Perspective:

- Wants a popular open-source devtool with strong GitHub adoption.
- Wants practical value for Codex, Claude Code, Cursor, OpenCode, Gemini CLI, GitHub Copilot CLI, and other coding-agent users.
- Wants low maintenance and optional future monetisation.
- Dislikes shallow AI wrappers.
- Strongly prefers a lightweight repo-level/npm-based product over a heavy app.

### Maya, Principal Engineer

Senior engineering lead.

Perspective:

- Cares about architecture, maintainability, testability, package quality, and simple abstractions.
- Pushes back on over-engineering.
- Wants boring, robust TypeScript.
- Wants excellent error handling.
- Wants reliable behavior across project types.
- Wants minimal dependencies.

### Elias, Open Source Maintainer

Maintainer focused on community adoption.

Perspective:

- Cares about README quality, install friction, contribution flow, GitHub stars, issue templates, examples, and trust.
- Pushes for excellent docs and clear scope.
- Wants no telemetry, no postinstall scripts, and no suspicious behavior.
- Wants users to understand the project in 30 seconds.

### Nora, Developer Experience Designer

DX and CLI usability specialist.

Perspective:

- Cares about command naming, terminal output, empty states, helpful errors, onboarding flow, and copy-pasteable examples.
- Wants `npx agentloopkit init` to feel clear and useful.
- Wants every command to give users a next step.
- Wants generated files to be useful, not noisy.

### Samir, Security Reviewer

Security-conscious reviewer.

Perspective:

- Cares about safe file writes, command execution, env files, dependency risk, npm package safety, and supply-chain trust.
- Blocks unsafe behavior.
- Wants explicit warnings and transparent actions.
- Wants no hidden network calls and no credential access.
- Wants no destructive default behavior.

### Lina, Power User / Agentic Engineer

Heavy user of Codex CLI, Claude Code, Cursor, OpenCode, and Gemini CLI.

Perspective:

- Runs long autonomous coding sessions.
- Wants agents to stay disciplined.
- Wants task contracts, verification reports, PR summaries, and fewer messy diffs.
- Values compatibility across tools.
- Dislikes heavy setup.
- Wants the tool to work inside existing repos with minimal ceremony.

### Tom, Skeptical Senior Developer

Experienced developer skeptical of AI hype.

Perspective:

- Asks, "Why do I need this?"
- Hates vague methodology.
- Wants practical value and deterministic outputs.
- Wants no LLM dependency.
- Wants improved reviewability, not markdown for its own sake.

### Rachel, Startup CTO

CTO of a small engineering team experimenting with coding agents.

Perspective:

- Wants team consistency.
- Wants junior engineers and agents to follow the same process.
- Wants reviewable work.
- Wants lightweight process, not enterprise bureaucracy.
- Future buyer for paid team/cloud layer if the open-source core proves useful.

### Dev, Open Source Contributor

Potential contributor discovering the repo on GitHub.

Perspective:

- Wants clean code structure.
- Wants easy local setup.
- Wants good first issues.
- Wants tests.
- Wants contribution guidance.
- Wants clear contribution boundaries.

### Priya, Future Commercial Buyer

Engineering manager at a scaling SaaS company.

Perspective:

- Might pay later for team dashboards, shared run history, policy packs, GitHub integration, audit logs, and organisation-level templates.
- Cares about compliance, repeatability, and visibility.
- Should not pull the MVP toward premature SaaS.
