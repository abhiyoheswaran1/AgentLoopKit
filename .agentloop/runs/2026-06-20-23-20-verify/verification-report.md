# Verification Report

- Timestamp: `2026-06-20T21:18:43.983Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `32aec524`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-20-use-untracked-aware-diff-stats-in-handoffs-and-reports.md`
- Title: `Use untracked-aware diff stats in handoffs and reports`
- Task type: `bugfix`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/pr-summary.test.ts tests/html-report.test.ts tests/ship.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.37.0 test
> vitest run tests/pr-summary.test.ts tests/html-report.test.ts tests/ship.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  3 passed (3)
      Tests  44 passed (44)
   Start at  23:18:48
   Duration  122.99s (transform 135ms, setup 0ms, import 331ms, tests 223.30s, environment 0ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.37.0 typecheck
> tsc --noEmit

```


## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
