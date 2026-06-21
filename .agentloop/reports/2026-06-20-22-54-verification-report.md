# Verification Report

- Timestamp: `2026-06-20T20:54:48.394Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `32aec524`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-20-show-untracked-files-in-ship-diff-stat.md`
- Title: `Show untracked files in ship diff stat`
- Task type: `bugfix`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/ship.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.37.0 test
> vitest run tests/ship.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  22:54:52
   Duration  243.34s (transform 100ms, setup 0ms, import 195ms, tests 242.77s, environment 0ms)

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
