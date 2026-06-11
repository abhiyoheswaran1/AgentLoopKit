# Verification Report

- Timestamp: 2026-06-11T06:29:11.196Z
- Repo: AgentLoopKit
- Git branch: main
- Git commit: 2930f63
- Working tree: dirty
- Overall status: pass


## Task Context
- Path: .agentloop/tasks/2026-06-11-add-packed-symlink-safety-smoke.md
- Title: Add packed symlink safety smoke
- Task type: tests
- Status: in-progress




## Commands Run
### task: `npx pnpm@10.12.1 test tests/release-smoke.test.ts`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run tests/release-smoke.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  08:29:12
   Duration  222ms (transform 25ms, setup 0ms, import 35ms, tests 10ms, environment 0ms)

```

### task: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  36 passed (36)
      Tests  285 passed (285)
   Start at  08:29:14
   Duration  49.51s (transform 682ms, setup 0ms, import 3.23s, tests 464.03s, environment 4ms)

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

Markdown links OK (854 file(s) checked).
```

### task: `npx pnpm@10.12.1 build`

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
ESM dist/cli/index.js     202.47 KB
ESM dist/cli/index.js.map 382.79 KB
ESM ⚡️ Build success in 26ms
DTS Build start
DTS ⚡️ Build success in 760ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm run smoke:release`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.27.0
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-nl9ksp/pack/agentloopkit-0.27.0.tgz
README has no stale exact version pins.
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
