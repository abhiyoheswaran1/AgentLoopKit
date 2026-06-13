# Contributor Playbook

This page helps maintainers open small issues and helps contributors make reviewable AgentLoopKit changes.

Use it with `.github/ISSUE_TEMPLATE/good_first_issue.md`, `.github/ISSUE_TEMPLATE/feature_request.md`, and `.github/PULL_REQUEST_TEMPLATE.md`.

## Good First Issue Rules

A good first issue should:

- name the files or folders the contributor should inspect first
- avoid package publishing, security policy, public API, and large template changes
- include acceptance criteria that fit in one focused PR
- list the verification commands the maintainer expects
- ask for AgentLoop evidence when the contributor uses the tool

Avoid `good first issue` when the task changes CLI contracts, npm release behavior, dependency policy, security guidance, or generated templates used by many repos.

## Copyable Issue Examples

### Docs Link Fix

~~~markdown
## Goal

Fix broken or confusing links in one docs page.

## Suggested Files

- docs/getting-started.md
- docs/task-contracts.md

## Acceptance Criteria

- [ ] Links point to existing files or sections.
- [ ] The page still reads naturally after the edit.
- [ ] No CLI behavior changes.

## Verification

```bash
npx pnpm@10.12.1 check:links
npx projscan doctor --format markdown
```

## AgentLoopKit Handoff

- Task contract:
- Verification report:
- Handoff summary:
~~~

### Small Test Coverage Gap

~~~markdown
## Goal

Add one Vitest case for existing behavior.

## Suggested Files

- tests/<area>.test.ts
- src/core/<area>.ts

## Acceptance Criteria

- [ ] The test describes one behavior.
- [ ] The test fails before the fix or confirms a missing coverage path.
- [ ] No unrelated refactor or formatting churn.

## Verification

```bash
npx pnpm@10.12.1 test tests/<area>.test.ts
npx pnpm@10.12.1 test:quick
npx pnpm@10.12.1 test
npx projscan doctor --format markdown
```

## AgentLoopKit Handoff

- Task contract:
- Verification report:
- Handoff summary:
~~~

### Template Wording Polish

~~~markdown
## Goal

Make one generated template easier for agents to follow.

## Suggested Files

- src/templates/<category>/<template>.md
- tests/init.test.ts

## Acceptance Criteria

- [ ] The generated wording names concrete agent actions.
- [ ] The change does not add new product claims.
- [ ] Tests confirm `init` still writes the template.

## Verification

```bash
npx pnpm@10.12.1 test tests/init.test.ts
npx pnpm@10.12.1 test
npx projscan doctor --format markdown
```

## AgentLoopKit Handoff

- Task contract:
- Verification report:
- Handoff summary:
~~~

### Example Repo Update

~~~markdown
## Goal

Improve one example folder so new users can copy its setup.

## Suggested Files

- examples/<example>/README.md
- examples/<example>/sample-task.md

## Acceptance Criteria

- [ ] The example names the repo type and expected verification commands.
- [ ] The sample task includes constraints, non-goals, and rollback notes.
- [ ] Public docs do not claim real usage or adoption.

## Verification

```bash
npx pnpm@10.12.1 check:links
npx projscan doctor --format markdown
```

## AgentLoopKit Handoff

- Task contract:
- Verification report:
- Handoff summary:
~~~

## PR Review Expectations

Maintainers should expect a first contribution to include:

- a short summary of the change
- the files touched
- the checks run
- any checks skipped and why
- risk and rollback notes when behavior changed

For behavior changes, ask for a focused Vitest test. For docs-only work, `check:links` and `projscan` are usually enough.

## Maintainer Triage Notes

Use labels this way:

- `good first issue`: bounded work with named files and no architecture decision
- `help wanted`: useful work that needs contributor time
- `docs`: documentation, examples, screenshots, or generated prose
- `cli`: command behavior, output, or ergonomics
- `templates`: generated loops, gates, policies, agents, or handoffs
- `safety`: destructive-action, secret, dependency, or package-trust concerns
- `release`: versioning, packaging, CI, or npm publishing
- `needs verification`: missing test, build, link check, or verification report

Do not use labels as a substitute for a scoped issue. The issue body should still tell the contributor where to start and how to prove the work.
