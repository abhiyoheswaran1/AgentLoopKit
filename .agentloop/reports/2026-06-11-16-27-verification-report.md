# Verification Report

- Timestamp: 2026-06-11T14:27:12.551Z
- Repo: AgentLoopKit
- Git branch: main
- Git commit: b005d10
- Working tree: dirty
- Overall status: pass

## Task Context

- Path: .agentloop/tasks/2026-06-11-harden-ci-metadata-markdown-output.md
- Title: Harden CI metadata Markdown output
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
      Tests  359 passed (359)
   Start at  16:27:17
   Duration  106.09s (transform 352ms, setup 0ms, import 2.02s, tests 966.38s, environment 2ms)

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
ESM dist/cli/index.js     245.83 KB
ESM dist/cli/index.js.map 465.91 KB
ESM ⚡️ Build success in 20ms
DTS Build start
DTS ⚡️ Build success in 795ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/verification.test.ts tests/ci-summary.test.ts`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 test
> vitest run tests/verification.test.ts tests/ci-summary.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  2 passed (2)
      Tests  43 passed (43)
   Start at  16:29:27
   Duration  54.95s (transform 72ms, setup 0ms, import 208ms, tests 99.31s, environment 0ms)

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
      Tests  359 passed (359)
   Start at  16:30:32
   Duration  98.12s (transform 338ms, setup 0ms, import 2.09s, tests 952.83s, environment 3ms)

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
ESM dist/cli/index.js     245.83 KB
ESM dist/cli/index.js.map 465.91 KB
ESM ⚡️ Build success in 22ms
DTS Build start
DTS ⚡️ Build success in 858ms
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
