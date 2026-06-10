# Interview Cycle 100

## Context

AgentLoopKit now has framework recipes, security-review examples, risk-file docs, and policy inspection. The next trust gap is dependency upgrades: agents often change package files and lockfiles, but reviewers need the reason, lockfile impact, verification, and rollback in one handoff. This cycle is simulated internal product-panel feedback, not real user research.

## Personas interviewed

- Security Reviewer
- AI-Skeptical Senior Engineer
- Open Source Maintainer
- Platform Engineer
- Agency Developer

## Feedback summary

The strongest signal is supply-chain trust. AgentLoopKit should not become a scanner or dependency bot, but it should show agents how to make package changes narrow and reviewable.

## Raw simulated feedback

### Security Reviewer

- What they liked: Dependency policies already say lockfiles need intentional review.
- What confused them: There is no public workflow for what a dependency-upgrade handoff should contain.
- What they would need before using it: Old version, new version, lockfile impact, verification, and skipped checks.
- What would make them recommend/star it: No registry calls and no fake safety claims.
- What would make them abandon it: Automated upgrade behavior without review.

### AI-Skeptical Senior Engineer

- What they liked: The loop can keep package changes scoped.
- What confused them: Whether passing tests implies the package is safe.
- What they would need before using it: Plain wording that tests are not a package audit.
- What would make them recommend/star it: A reviewer checklist for lockfile churn.
- What would make them abandon it: Scanner theater.

### Open Source Maintainer

- What they liked: Contributors often submit dependency PRs with weak summaries.
- What confused them: Which evidence to ask for when a lockfile changes.
- What they would need before using it: A copyable example PR summary.
- What would make them recommend/star it: Less time spent asking follow-up questions.
- What would make them abandon it: Bot-like bulk upgrades.

### Platform Engineer

- What they liked: The product stays local and repo-level.
- What confused them: Whether AgentLoopKit reads package metadata from registries.
- What they would need before using it: Clear non-goals around registry APIs and audits.
- What would make them recommend/star it: Teams can standardize dependency handoffs without a new service.
- What would make them abandon it: Network calls or package-manager automation.

### Agency Developer

- What they liked: A repeatable upgrade summary helps client work.
- What confused them: How to explain lockfile changes without pasting huge diffs.
- What they would need before using it: A handoff shape that names direct and transitive impact.
- What would make them recommend/star it: Client-friendly rollback notes.
- What would make them abandon it: A workflow that requires paid services.

## Product council debate

- Abhi: This strengthens the reviewability wedge and avoids SaaS scope.
- Maya: Keep it docs and examples. No dependencies, no registry calls.
- Elias: Link it from README and getting started.
- Nora: Make the task and handoff copyable.
- Samir: Say tests do not prove package safety.
- Lina: Agents need fields for lockfile impact and skipped checks.
- Tom: Avoid scanner claims.
- Rachel: Teams can use this as lightweight supply-chain governance.

## Decision

Add a dependency-upgrade workflow page and example artifact set.

## Non-decisions

- Do not add package-manager automation.
- Do not call registries or advisory APIs.
- Do not add vulnerability scanning.
- Do not enforce dependency policy.
- Do not change package files in this repo.

## Resulting tasks

- Add `docs/dependency-upgrades.md`.
- Add `examples/dependency-upgrade/README.md`.
- Add sample task, verification report, and PR summary.
- Link from README and getting-started docs.
- Update backlog, dogfood log, and final handoff.
- Verify links, whitespace, projscan, and AgentLoop verification.

## Success criteria

- The workflow explains lockfile review and rollback.
- Example artifacts show verification and skipped checks.
- Public docs state AgentLoopKit does not scan packages or call registries.
- Checks pass.
