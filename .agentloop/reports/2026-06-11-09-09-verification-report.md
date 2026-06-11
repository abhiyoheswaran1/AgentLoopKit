# Verification Report

- Timestamp: 2026-06-11T07:09:52.203Z
- Repo: AgentLoopKit
- Git branch: main
- Git commit: b105780
- Working tree: dirty
- Overall status: pass


## Task Context
- Path: .agentloop/tasks/2026-06-11-guard-read-only-artifact-roots-from-symlink-escapes.md
- Title: Guard read-only artifact roots from symlink escapes
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


 Test Files  36 passed (36)
      Tests  296 passed (296)
   Start at  09:09:54
   Duration  53.96s (transform 535ms, setup 0ms, import 2.75s, tests 507.89s, environment 3ms)

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
ESM dist/cli/index.js     201.83 KB
ESM dist/cli/index.js.map 381.90 KB
ESM ⚡️ Build success in 26ms
DTS Build start
DTS ⚡️ Build success in 783ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npx pnpm@10.12.1 test tests/status.test.ts tests/policy.test.ts tests/mcp-server.test.ts tests/check-gates.test.ts tests/ci-summary.test.ts tests/badge.test.ts tests/html-report.test.ts tests/release-notes.test.ts`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run tests/status.test.ts tests/policy.test.ts tests/mcp-server.test.ts tests/check-gates.test.ts tests/ci-summary.test.ts tests/badge.test.ts tests/html-report.test.ts tests/release-notes.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  8 passed (8)
      Tests  80 passed (80)
   Start at  09:10:59
   Duration  25.33s (transform 209ms, setup 0ms, import 1.11s, tests 142.33s, environment 0ms)

```

### task: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  36 passed (36)
      Tests  296 passed (296)
   Start at  09:11:26
   Duration  55.01s (transform 400ms, setup 0ms, import 2.43s, tests 512.23s, environment 2ms)

```

### task: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 lint /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> eslint .

```

### task: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 typecheck /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsc --noEmit

```

### task: `npx pnpm@10.12.1 check:links`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 check:links /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsx scripts/check-markdown-links.ts

Markdown links OK (859 file(s) checked).
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
ESM dist/cli/index.js     201.83 KB
ESM dist/cli/index.js.map 381.90 KB
ESM ⚡️ Build success in 28ms
DTS Build start
DTS ⚡️ Build success in 801ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm run smoke:release`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.27.0
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-cHckE2/pack/agentloopkit-0.27.0.tgz
README has no stale exact version pins.
Public docs have no stale version pins or unsupported public claims.
Packed binary version smoke passed.
Packed init smoke passed.
Packed local-only init smoke passed.
Packed create-task path guard smoke passed.
Packed verify task path guard smoke passed.
Packed init symlink guard smoke passed.
Packed task archive symlink guard smoke passed.
Packed home-directory dry-run guard smoke passed.
Release smoke passed.
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
