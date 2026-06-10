# Interview Cycle 76

## Context

AgentLoopKit now has issue templates, a PR template, label guidance, and repo-type policy examples. The remaining contributor-onboarding gap is practical: maintainers need examples they can copy when opening scoped first issues.

## Personas interviewed

- Open Source Contributor
- Open Source Maintainer
- AI-Skeptical Senior Engineer
- Developer Experience Designer
- Principal Engineer

## Feedback summary

The strongest signal is copyability. Contributors do not need more philosophy before a first PR. Maintainers need issue bodies that name files, acceptance criteria, and verification commands. Keep this docs-only, avoid label automation, and do not touch package behavior while npm publishing is still catching up.

## Raw simulated feedback

### Open Source Contributor

- What they liked: The repo has tests, issue templates, and a PR template.
- What confused them: They still need examples of what a bounded AgentLoopKit issue looks like.
- What they would need before using it: A short page with copyable issue bodies.
- What would make them recommend/star it: A first contribution that feels scoped instead of vague.
- What would make them abandon it: Being asked to understand release policy before a docs or test PR.

### Open Source Maintainer

- What they liked: The labels and templates give maintainers a starting point.
- What confused them: Maintainers still have to write good issue examples from scratch.
- What they would need before using it: Good-first examples for docs, tests, templates, and examples.
- What would make them recommend/star it: Less review back-and-forth on first PRs.
- What would make them abandon it: A dependency or bot just to manage labels.

### AI-Skeptical Senior Engineer

- What they liked: The repo asks for verification evidence instead of AI claims.
- What confused them: Some first issues could still become loose wording tasks.
- What they would need before using it: Acceptance criteria tied to files and commands.
- What would make them recommend/star it: Contributor guidance that changes PR quality.
- What would make them abandon it: Generic community boilerplate.

### Developer Experience Designer

- What they liked: The PR template already asks for AgentLoop evidence.
- What confused them: First-time contributors need a simpler path than the full release docs.
- What they would need before using it: A playbook linked from `CONTRIBUTING.md`.
- What would make them recommend/star it: Copy-paste examples that set expectations without extra ceremony.
- What would make them abandon it: Long onboarding pages before a small PR.

### Principal Engineer

- What they liked: This change can stay docs-only.
- What confused them: Nothing in the CLI needs to change for this iteration.
- What they would need before using it: No runtime dependencies, no package release, no label automation.
- What would make them recommend/star it: A clearer contribution path with stable tests.
- What would make them abandon it: Contributor automation that maintainers must maintain.

## Product council debate

- Abhi: This is small but useful launch polish. Keep it docs-only.
- Maya: Do not add a label-sync tool. A checked-in label map is enough.
- Elias: Contributors should see issue examples before release internals.
- Nora: Put copyable examples in one page and link it from `CONTRIBUTING.md`.
- Samir: Keep verification expectations explicit. Do not ask contributors to paste secrets or env contents.
- Lina: Ask for task, verification, and handoff evidence where the contributor uses AgentLoopKit.
- Tom: Remove vague community language. Name files, commands, and review expectations.
- Rachel: This helps teams create internal first-agent tasks later, but no team feature belongs here.

## Decision

Add `docs/contributor-playbook.md` with copyable issue examples for docs, tests, template wording, and example repo updates. Link it from `CONTRIBUTING.md` and README. Update roadmap, backlog, final handoff, and dogfood records. Do not change package runtime, labels automation, or npm release metadata.

## Non-decisions

- No issue bot.
- No label-sync dependency.
- No GitHub App.
- No package release for this docs-only improvement.
- No claim that these examples come from real contributors.

## Resulting tasks

- Add `docs/contributor-playbook.md`.
- Link it from `CONTRIBUTING.md` and README.
- Mark the roadmap contributor-example item as shipped.
- Update backlog and final handoff records.
- Run Vitest, link checks, projscan, AgentLoop verification, and gate checks.

## Success criteria

- The playbook includes at least four copyable issue examples.
- Each example names files, acceptance criteria, verification commands, and AgentLoop evidence.
- Public docs avoid claims about real user feedback.
- No runtime code, package metadata, or npm publish behavior changes.
