# Verification Report

- Timestamp: `2026-06-13T08:20:44.293Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `3a890bc`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-13-clean-stale-root-handoff-release-copy.md`
- Title: `Clean stale root handoff release copy`
- Task type: `docs`
- Status: `in-progress`





## Commands Run
### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.7 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.28.7
Public docs checked: 66
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npm test -- tests/release-smoke.test.ts -t "final handoff|publish-state|public docs hygiene"`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.7 test
> vitest run tests/release-smoke.test.ts -t final handoff|publish-state|public docs hygiene


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  1 passed (1)
      Tests  3 passed | 18 skipped (21)
   Start at  10:20:50
   Duration  407ms (transform 22ms, setup 0ms, import 31ms, tests 9ms, environment 0ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.7 typecheck
> tsc --noEmit

```

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
