# Verification Report

- Timestamp: `2026-06-11T21:57:10.365Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `35a21ef`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-11-build-local-acceptance-layer-commands.md`
- Title: `Build local acceptance layer commands`
- Task type: `feature`
- Status: `in-progress`




## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  47 passed (47)
      Tests  391 passed (391)
   Start at  23:57:15
   Duration  126.07s (transform 331ms, setup 0ms, import 2.13s, tests 1293.17s, environment 3ms)

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
ESM dist/cli/index.js     284.76 KB
ESM dist/cli/index.js.map 542.50 KB
ESM ⚡️ Build success in 28ms
DTS Build start
DTS ⚡️ Build success in 827ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/readiness-score.test.ts tests/ship.test.ts tests/prepare-pr.test.ts tests/runs.test.ts tests/maintainer-check.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 test
> vitest run tests/readiness-score.test.ts tests/ship.test.ts tests/prepare-pr.test.ts tests/runs.test.ts tests/maintainer-check.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  5 passed (5)
      Tests  6 passed (6)
   Start at  23:59:46
   Duration  14.83s (transform 57ms, setup 0ms, import 281ms, tests 34.89s, environment 0ms)

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

Markdown links OK (965 file(s) checked).
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

### task: `npx pnpm@10.12.1 audit --prod`

- Exit code: 0
- Status: pass


```text
No known vulnerabilities found
```

### task: `npm test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  47 passed (47)
      Tests  391 passed (391)
   Start at  00:00:26
   Duration  115.42s (transform 327ms, setup 0ms, import 2.19s, tests 1195.78s, environment 2ms)

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
ESM dist/cli/index.js     284.76 KB
ESM dist/cli/index.js.map 542.50 KB
ESM ⚡️ Build success in 26ms
DTS Build start
DTS ⚡️ Build success in 832ms
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
Ship smoke passed.
Run ledger smoke passed.
Prepare-pr smoke passed.
Maintainer-check smoke passed with status warn.
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
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-tC6LRr/pack/agentloopkit-0.27.0.tgz
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
