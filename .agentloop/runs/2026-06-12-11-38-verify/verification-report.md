# Verification Report

- Timestamp: `2026-06-12T09:34:43.762Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `b45bba7`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-12-archive-shipped-0-28-0-review-tasks.md`
- Title: `Archive shipped 0.28.0 review tasks`
- Task type: `docs`
- Status: `in-progress`




## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  48 passed (48)
      Tests  415 passed (415)
   Start at  11:34:49
   Duration  165.88s (transform 355ms, setup 0ms, import 2.24s, tests 1659.22s, environment 2ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 lint /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 typecheck /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 build /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     312.39 KB
ESM dist/cli/index.js.map 595.14 KB
ESM ⚡️ Build success in 48ms
DTS Build start
DTS ⚡️ Build success in 1055ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `node dist/cli/index.js task doctor --json`

- Exit code: 0
- Status: pass


```text
{
  "taskDoctor": {
    "overallStatus": "pass",
    "counts": {
      "checked": 2,
      "diagnostics": 0,
      "terminalTasks": 0,
      "missingStatuses": 0,
      "unsupportedStatuses": 0
    },
    "diagnostics": []
  }
}
```

### task: `node dist/cli/index.js status --brief`

- Exit code: 0
- Status: pass


```text
AgentLoopKit: task="Archive shipped 0.28.0 review tasks" status="in-progress"; verification=missing; run="ship 96/100"; tree=dirty (45); next="agentloop verify"
Reason: A task exists, but no verification report was found.
```

## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
