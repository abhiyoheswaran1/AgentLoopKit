# Verification Report

- Timestamp: `2026-06-12T14:08:54.437Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `3f3042c`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-12-fix-ship-archived-task-scoring.md`
- Title: `Fix ship archived task scoring`
- Task type: `bugfix`
- Status: `in-progress`




## Commands Run
### task: `npm test -- tests/ship.test.ts tests/check-gates.test.ts tests/maintainer-check.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.2 test
> vitest run tests/ship.test.ts tests/check-gates.test.ts tests/maintainer-check.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  3 passed (3)
      Tests  21 passed (21)
   Start at  16:08:58
   Duration  103.77s (transform 71ms, setup 0ms, import 246ms, tests 167.79s, environment 0ms)

```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.2 lint
> eslint .

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.2 typecheck
> tsc --noEmit

```

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.2 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (1295 file(s) checked).
```

### task: `git diff --check`

- Exit code: 0
- Status: pass


```text
(no output)
```

### task: `npx --yes projscan doctor --format markdown`

- Exit code: 0
- Status: pass


```text
# Project Health Report

**Health Score: A (100/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

No issues detected. Project looks healthy!
```

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
