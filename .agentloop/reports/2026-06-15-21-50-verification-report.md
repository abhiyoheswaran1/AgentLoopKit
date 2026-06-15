# Verification Report

- Timestamp: `2026-06-15T19:50:19.798Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `bdd279b`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/archive/2026-06-15-filter-ship-report-artifacts.md`
- Title: `Filter ship report artifacts`
- Task type: `feature`
- Status: `done`





## Commands Run
### task: `npm test -- tests/artifacts.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 test
> vitest run tests/artifacts.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  26 passed (26)
   Start at  21:50:23
   Duration  81.99s (transform 37ms, setup 0ms, import 96ms, tests 81.52s, environment 0ms)

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
   Start at  21:51:50
   Duration  22.18s (transform 141ms, setup 0ms, import 527ms, tests 49.48s, environment 1ms)

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

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.33.0
Public docs checked: 73
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (2013 file(s) checked).
```

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
