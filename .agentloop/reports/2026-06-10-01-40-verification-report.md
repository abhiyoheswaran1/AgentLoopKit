# Verification Report

- Timestamp: 2026-06-09T23:40:29.900Z
- Repo: AgentLoopKit
- Git branch: main
- Git commit: aa59987
- Working tree: dirty
- Overall status: pass


## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.17.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  24 passed (24)
      Tests  89 passed (89)
   Start at  01:40:31
   Duration  11.18s (transform 277ms, setup 0ms, import 1.54s, tests 65.14s, environment 2ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.17.0 lint /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.17.0 typecheck /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.17.0 build /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     105.48 KB
ESM dist/cli/index.js.map 199.89 KB
ESM ⚡️ Build success in 16ms
DTS Build start
DTS ⚡️ Build success in 527ms
DTS dist/cli/index.d.ts 13.00 B
```

### custom: `git diff --check`

- Exit code: 0
- Status: pass

```text
(no output)
```

### custom: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.17.0 lint /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> eslint .

```

### custom: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.17.0 typecheck /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsc --noEmit

```

### custom: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.17.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  24 passed (24)
      Tests  89 passed (89)
   Start at  01:40:54
   Duration  11.50s (transform 323ms, setup 0ms, import 1.64s, tests 69.82s, environment 1ms)

```

### custom: `npx pnpm@10.12.1 check:links`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.17.0 check:links /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsx scripts/check-markdown-links.ts

Markdown links OK (393 file(s) checked).
```

### custom: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.17.0 build /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     105.48 KB
ESM dist/cli/index.js.map 199.89 KB
ESM ⚡️ Build success in 17ms
DTS Build start
DTS ⚡️ Build success in 521ms
DTS dist/cli/index.d.ts 13.00 B
```

### custom: `npx projscan doctor --format markdown`

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
