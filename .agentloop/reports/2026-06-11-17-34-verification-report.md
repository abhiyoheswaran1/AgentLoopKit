# Verification Report

- Timestamp: 2026-06-11T15:34:43.067Z
- Repo: AgentLoopKit
- Git branch: main
- Git commit: 7510c16
- Working tree: dirty
- Overall status: pass


## Task Context
- Path: .agentloop/tasks/2026-06-11-harden-artifacts-markdown-output.md
- Title: Harden artifacts Markdown output
- Task type: bugfix
- Status: in-progress




## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  42 passed (42)
      Tests  363 passed (363)
   Start at  17:34:45
   Duration  102.49s (transform 329ms, setup 0ms, import 2.25s, tests 1001.16s, environment 3ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 lint /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 typecheck /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 build /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     246.56 KB
ESM dist/cli/index.js.map 467.57 KB
ESM ⚡️ Build success in 41ms
DTS Build start
DTS ⚡️ Build success in 1001ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/artifacts.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 test
> vitest run tests/artifacts.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  17:36:46
   Duration  27.58s (transform 29ms, setup 0ms, import 106ms, tests 27.24s, environment 0ms)

```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 lint
> eslint .

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 typecheck
> tsc --noEmit

```

### task: `npm test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  42 passed (42)
      Tests  363 passed (363)
   Start at  17:37:21
   Duration  105.61s (transform 336ms, setup 0ms, import 2.15s, tests 1025.26s, environment 2ms)

```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     246.56 KB
ESM dist/cli/index.js.map 467.57 KB
ESM ⚡️ Build success in 24ms
DTS Build start
DTS ⚡️ Build success in 862ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `node scripts/smoke-cli.mjs`

- Exit code: 0
- Status: pass


```text
CLI smoke for agentloopkit@0.27.0
Version smoke passed.
Missing config smoke passed.
Init dry-run smoke passed.
Init smoke passed.
Doctor smoke passed.
Create-task smoke passed.
Task lifecycle smoke passed.
Verify smoke passed.
Handoff smoke passed.
Check-gates smoke passed with status pass.
Nested cwd smoke passed.
CLI smoke passed.
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
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
