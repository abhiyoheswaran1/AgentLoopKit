# Verification Report

- Timestamp: `2026-06-15T17:37:09.825Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `36f5456`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/archive/2026-06-15-guard-self-dogfood-instruction-drift.md`
- Title: `Guard self-dogfood instruction drift`
- Task type: `test-generation`
- Status: `done`





## Commands Run
### task: `npm test -- tests/autonomous-dogfood.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 test
> vitest run tests/autonomous-dogfood.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  19:37:13
   Duration  430ms (transform 15ms, setup 0ms, import 22ms, tests 6ms, environment 0ms)

```

### task: `npm run test:unit`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/release-proof.test.ts tests/public-docs-hygiene.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  22 passed (22)
      Tests  91 passed (91)
   Start at  19:37:18
   Duration  21.98s (transform 167ms, setup 0ms, import 596ms, tests 46.85s, environment 1ms)

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

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (1996 file(s) checked).
```

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
