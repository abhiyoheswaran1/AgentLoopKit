# Verification Report

- Timestamp: 2026-06-10T23:03:12.685Z
- Repo: AgentLoopKit
- Git branch: main
- Git commit: 742d82d
- Working tree: dirty
- Overall status: pass


## Task Context
- Path: .agentloop/tasks/2026-06-11-guard-public-docs-against-stale-version-pins.md
- Title: Guard public docs against stale version pins
- Task type: tests
- Status: proposed




## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  34 passed (34)
      Tests  182 passed (182)
   Start at  01:03:14
   Duration  17.65s (transform 1.20s, setup 0ms, import 6.69s, tests 144.44s, environment 4ms)

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
ESM dist/cli/index.js     169.12 KB
ESM dist/cli/index.js.map 320.06 KB
ESM ⚡️ Build success in 19ms
DTS Build start
DTS ⚡️ Build success in 696ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npx --yes pnpm@10.12.1 test tests/release-smoke.test.ts`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run tests/release-smoke.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  01:03:40
   Duration  149ms (transform 19ms, setup 0ms, import 26ms, tests 7ms, environment 0ms)

```

### task: `npx --yes pnpm@10.12.1 test`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  34 passed (34)
      Tests  182 passed (182)
   Start at  01:03:41
   Duration  17.90s (transform 912ms, setup 0ms, import 6.03s, tests 146.79s, environment 25ms)

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

### task: `git diff --check`

- Exit code: 0
- Status: pass

```text
(no output)
```

## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
