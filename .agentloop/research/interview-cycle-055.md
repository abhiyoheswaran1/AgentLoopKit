# Interview Cycle 55

## Context

AgentLoopKit now has task lifecycle commands, verification reports, handoffs, strict gate checks, README visuals, GitHub Actions recipes, and examples for common repo shapes. The examples still lack practical command recipes a developer can copy into a task contract.

## Personas interviewed

- Indie Hacker Using Codex
- Agency Developer
- Platform Engineer
- Open Source Maintainer
- Skeptical Senior Developer

## Feedback summary

The strongest signal is first-week usefulness. Developers need stack-specific verification commands before they can trust `agentloop verify` and `check-gates` in real repositories.

## Raw simulated feedback

### Indie Hacker Using Codex

- What they liked: `agentloop init` gives structure fast.
- What confused them: Which verification commands to put into a Next.js task.
- What they would need before using it: A short recipe for tests, lint, typecheck, and build.
- What would make them recommend/star it: Copy-pasteable setup for the stack they already use.
- What would make them abandon it: A methodology page that leaves command wiring vague.

### Agency Developer

- What they liked: The tool can be reused across client repos.
- What confused them: How to adapt it for docs-only repos or empty repos.
- What they would need before using it: Examples that separate app, API, Python, docs, and early-stage repos.
- What would make them recommend/star it: Client-friendly verification recipes.
- What would make them abandon it: Framework-specific behavior hidden inside the CLI.

### Platform Engineer

- What they liked: Monorepo guidance says root checks are not proof for every package.
- What confused them: Where to put package-specific commands.
- What they would need before using it: Workspace examples using `pnpm --filter`, `npm --workspace`, and package-local commands.
- What would make them recommend/star it: Honest limits around project detection.
- What would make them abandon it: A package graph runner without clear ownership.

### Open Source Maintainer

- What they liked: Examples can set contributor expectations.
- What confused them: Some examples are too thin to show review value.
- What they would need before using it: Example READMEs that name likely risk areas and handoff expectations.
- What would make them recommend/star it: Recipes maintainers can paste into CONTRIBUTING docs.
- What would make them abandon it: Generated docs that look bulky and unused.

### Skeptical Senior Developer

- What they liked: The CLI does not infer too much.
- What confused them: Whether recipes are mandatory.
- What they would need before using it: Clear language that recipes are starting points.
- What would make them recommend/star it: Concrete command examples.
- What would make them abandon it: Claims that one generic verification command covers every repo.

## Product council debate

- Abhi: Stack recipes are a strong adoption feature and do not require a new command.
- Maya: Keep recipes as docs. No stack-specific runner.
- Elias: Link them from README and examples.
- Nora: Make every recipe copy-pasteable.
- Samir: Do not encourage secret scanning or environment dumping.
- Lina: Agents can use these recipes when writing task contracts.
- Tom: State that commands are examples, not proof of full coverage.
- Rachel: Teams can adapt these into internal standards later.

## Decision

Add stack-specific starter recipes as docs and examples. Keep CLI behavior unchanged and avoid framework automation.

## Non-decisions

- Do not add a stack-specific command generator.
- Do not infer monorepo package graphs.
- Do not change `init` output.
- Do not add dependencies.

## Resulting tasks

- Add `docs/stack-recipes.md`.
- Update common examples with verification commands, risk areas, and handoff notes.
- Link recipes from README and getting-started docs.
- Update backlog, final handoff, and dogfood log.

## Success criteria

- Next.js, Node API, Python service, docs-only, empty repo, and monorepo recipes exist.
- Examples include commands that can be copied into task contracts.
- Docs warn that root commands do not prove package-level coverage unless the repo says so.
- Link check and project health checks pass.
