# Interview Cycle 99

## Context

AgentLoopKit already has stack recipes for broad project types. The next adoption gap is concrete task-contract examples for frameworks that developers name when evaluating tools: Remix, SvelteKit, Django, and FastAPI. This cycle is simulated internal product-panel feedback, not real user research.

## Personas interviewed

- Indie Hacker Using Codex
- Agency Developer
- Platform Engineer
- Open Source Maintainer
- AI-Skeptical Senior Engineer

## Feedback summary

The strongest signal is recognition. Developers should see their framework and understand how to translate AgentLoopKit into their repo without installing sample apps or trusting framework-specific automation.

## Raw simulated feedback

### Indie Hacker Using Codex

- What they liked: Existing recipes show commands to put in task contracts.
- What confused them: Remix and SvelteKit projects have server-route behavior that generic React examples do not cover.
- What they would need before using it: One copyable command for the framework they use.
- What would make them recommend/star it: Recipes that name real files such as loaders, actions, hooks, and server modules.
- What would make them abandon it: A setup that requires changing their framework tooling.

### Agency Developer

- What they liked: Recipes help reuse AgentLoopKit across client repos.
- What confused them: Python examples do not distinguish Django request permissions from FastAPI dependency injection.
- What they would need before using it: Short task contracts per framework that mention likely risk areas.
- What would make them recommend/star it: Client-friendly examples that do not need extra dependencies.
- What would make them abandon it: Overbuilt sample applications.

### Platform Engineer

- What they liked: Stack docs stay guidance-only.
- What confused them: Whether AgentLoopKit detects these frameworks differently.
- What they would need before using it: Docs that say users adapt commands from their own repo scripts.
- What would make them recommend/star it: Framework recipes that improve consistency without runners.
- What would make them abandon it: Package graph inference or automatic workspace orchestration.

### Open Source Maintainer

- What they liked: Copyable examples reduce contributor handholding.
- What confused them: Which framework-specific files deserve extra review.
- What they would need before using it: Extra-care bullets tied to route handlers, migrations, auth, deployment, and OpenAPI contracts.
- What would make them recommend/star it: A contributor can copy a task and produce a better PR summary.
- What would make them abandon it: Claims of official framework support.

### AI-Skeptical Senior Engineer

- What they liked: The recipes are deterministic text.
- What confused them: Whether recipes imply test coverage is complete.
- What they would need before using it: Clear warning to state what was not verified.
- What would make them recommend/star it: Framework examples that help review without adding magic.
- What would make them abandon it: Claims that AgentLoopKit knows the framework's test graph.

## Product council debate

- Abhi: Framework recognition improves GitHub adoption without changing the product wedge.
- Maya: Add docs only. Do not add detection, runners, or package graph inference.
- Elias: Link the expanded recipe set from README and getting started.
- Nora: Keep each recipe to commands, task example, and extra care.
- Samir: Make auth, env, migrations, and deployment risks visible.
- Lina: Agents need examples that name likely files and forbidden files.
- Tom: Say users adapt these recipes to their own scripts.
- Rachel: Teams can standardize task contracts across mixed stacks.

## Decision

Expand `docs/stack-recipes.md` with Remix, SvelteKit, Django, and FastAPI recipes.

## Non-decisions

- Do not add framework detection.
- Do not add example applications.
- Do not add dependencies.
- Do not add workspace runners or package graph inference.
- Do not claim official support from those frameworks.

## Resulting tasks

- Add Remix recipe.
- Add SvelteKit recipe.
- Add Django recipe.
- Add FastAPI recipe.
- Update README, getting-started docs, backlog, dogfood log, and final handoff.
- Verify links, whitespace, projscan, and AgentLoop verification.

## Success criteria

- Each framework has a command starter, task-contract example, and extra-care notes.
- Public docs frame recipes as adaptable guidance, not automated support.
- Checks pass.
