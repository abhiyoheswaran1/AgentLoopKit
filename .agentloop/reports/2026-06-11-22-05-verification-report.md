# Verification Report

- Timestamp: `2026-06-11T20:05:57.649Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `cf0224c`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-11-harden-pr-summary-diff-stat-markdown.md`
- Title: `Harden PR summary diff stat Markdown`
- Task type: `bugfix`
- Status: `in-progress`




## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  42 passed (42)
      Tests  382 passed (382)
   Start at  22:06:04
   Duration  129.70s (transform 361ms, setup 0ms, import 2.09s, tests 1240.34s, environment 3ms)

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
ESM dist/cli/index.js     248.23 KB
ESM dist/cli/index.js.map 471.54 KB
ESM ⚡️ Build success in 24ms
DTS Build start
DTS ⚡️ Build success in 836ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/pr-summary.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 test
> vitest run tests/pr-summary.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  22:08:30
   Duration  3.72s (transform 76ms, setup 0ms, import 156ms, tests 2.80s, environment 0ms)

```

### task: `git diff --check`

- Exit code: 0
- Status: pass


```text
(no output)
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

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (953 file(s) checked).
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

### task: `npm test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  42 passed (42)
      Tests  382 passed (382)
   Start at  22:08:49
   Duration  127.96s (transform 400ms, setup 0ms, import 2.28s, tests 1218.69s, environment 3ms)

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
ESM dist/cli/index.js     248.23 KB
ESM dist/cli/index.js.map 471.54 KB
ESM ⚡️ Build success in 22ms
DTS Build start
DTS ⚡️ Build success in 830ms
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

### task: `npm run smoke:release`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.27.0
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-TuW4Ak/pack/agentloopkit-0.27.0.tgz
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

## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
