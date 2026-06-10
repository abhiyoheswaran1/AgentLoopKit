# Policy Examples

These examples show how maintainers can make `.agentloop/policies/*.md` useful for specific repo types.

Use them as starting points. They guide agents and reviewers; they do not enforce behavior or prove compliance.

## Web App

Use for Next.js, React/Vite, Remix, Astro, or similar frontends.

Suggested additions:

```markdown
## Web App Rules

- Treat routing, auth guards, checkout flows, and data-loading boundaries as high-risk.
- Before changing UI state, identify affected pages, components, and tests in the task contract.
- Preserve existing design-system conventions unless the task asks for a design change.
- Verify responsive states for changed screens when the repo has a browser test or screenshot workflow.
- Handoff must list changed routes, visible behavior changes, verification commands, and any untested viewport.
```

Good verification examples:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Add a browser or screenshot command when the repo already has one.

## API Or Service

Use for Node APIs, Go services, Rails apps, Django APIs, or similar backend repos.

Suggested additions:

```markdown
## API Rules

- Treat auth, permissions, billing, rate limits, request validation, and data writes as high-risk.
- Do not change response shapes, status codes, or public endpoints without naming the change in the task contract.
- Add or update tests for new endpoint behavior and failure cases.
- Include rollback notes for migrations, queue changes, and external integration changes.
- Handoff must list changed endpoints, affected clients, verification commands, and compatibility risks.
```

Good verification examples:

```bash
npm test
npm run typecheck
npm run build
```

If the service has integration tests, name the subset that covers the changed endpoint.

## Python Service

Use for FastAPI, Flask, Django, data workers, CLI services, and Python libraries.

Suggested additions:

```markdown
## Python Rules

- Treat dependency, settings, migration, and background-job changes as high-risk.
- Do not read `.env` values or print secrets from settings modules.
- Keep generated files, fixtures, and snapshots focused on the task.
- Update tests for changed parser, API, task, or model behavior.
- Handoff must list touched modules, verification commands, and any skipped environment-specific checks.
```

Good verification examples:

```bash
pytest
ruff check .
mypy .
```

Use the repo's real commands instead of adding tools just for AgentLoopKit.

## Docs-Only Repo

Use for documentation sites, handbooks, SDK docs, or Markdown-heavy repos.

Suggested additions:

```markdown
## Docs Rules

- Treat installation commands, API examples, security guidance, and migration instructions as high-risk.
- Do not claim a command works unless it was run or copied from verified project docs.
- Keep terminology consistent with existing docs.
- Update links when moving pages.
- Handoff must list changed pages, link checks, rendered-doc checks when available, and unverified commands.
```

Good verification examples:

```bash
npm run lint
npm run build
npm run check:links
```

For static sites, include the site build command before claiming docs are ready.

## Monorepo

Use for workspaces with multiple packages, services, or apps.

Suggested additions:

```markdown
## Monorepo Rules

- Identify the affected workspace package before editing.
- Do not claim root checks cover every package unless repo docs say they do.
- Prefer package-scoped verification for package-scoped changes.
- Watch shared packages, build scripts, lockfiles, and release config as high-risk areas.
- Handoff must separate root checks, package checks, and checks not run.
```

Good verification examples:

```bash
pnpm --filter <package> test
pnpm --filter <package> build
npm --workspace <package> test
```

Use both root and package commands when a change touches shared code.

## Open-Source Maintainer Workflow

Use when maintainers review outside contributions or agent-generated pull requests.

Suggested additions:

```markdown
## Contribution Review Rules

- PRs should include a task contract, verification report, and reviewer handoff when AgentLoopKit is available.
- Review policy changes like code changes.
- Do not accept broad formatting churn unless the task contract asks for it.
- Do not accept generated code that lacks verification evidence for the changed behavior.
- Handoff must list changed files, tests run, risks, rollback notes, and follow-ups.
```

Good verification examples:

```bash
agentloop check-gates --strict
agentloop verify
agentloop handoff
```

Use `check-gates --strict` as a review-evidence gate, not as a substitute for code review.

## How to apply an example

1. Pick the example closest to your repo.
2. Copy only the rules that match real repo risk.
3. Paste them into the relevant file under `.agentloop/policies/`.
4. Replace placeholder commands with commands that already exist in the repo.
5. Run `agentloop policy status`.
6. Record the policy change in the task contract or PR summary.

Keep examples short enough for agents to read before implementation. If a policy grows into a handbook, split the repo-specific detail into normal project docs and link to it from the policy file.
