# Verification Report

- Timestamp: `2026-06-15T17:09:28.992Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `b62d009`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-15-make-dogfood-start-source-first.md`
- Title: `Make dogfood start source-first`
- Task type: `bugfix`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/dogfood-start-script.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 test
> vitest run tests/dogfood-start-script.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  19:09:33
   Duration  404ms (transform 16ms, setup 0ms, import 23ms, tests 3ms, environment 0ms)

```

### task: `npm run test:unit`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/release-proof.test.ts tests/public-docs-hygiene.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  22 passed (22)
      Tests  90 passed (90)
   Start at  19:09:37
   Duration  22.67s (transform 160ms, setup 0ms, import 571ms, tests 50.05s, environment 1ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 typecheck
> tsc --noEmit

```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 lint
> eslint .

```

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
