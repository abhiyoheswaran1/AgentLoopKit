# Verification Report

- Timestamp: `2026-06-12T10:58:35.415Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `b61a896`
- Working tree: `dirty`
- Overall status: fail


## Task Context
- Path: `.agentloop/tasks/2026-06-12-add-published-package-smoke-helper.md`
- Title: `Add published package smoke helper`
- Task type: `tests`
- Status: `in-progress`



## Failure Summary
### lint: `npx pnpm@10.12.1 lint`

- Exit code: 1

```text
> agentloopkit@0.28.1 lint /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> eslint .
/Users/abhyoh/local dev folder/Apps/AgentLoopKit/scripts/smoke-published-package.mjs
  102:26  error  'URL' is not defined           no-undef
  194:19  error  'setTimeout' is not defined    no-undef
  206:7   error  'clearTimeout' is not defined  no-undef
  210:7   error  'clearTimeout' is not defined  no-undef
✖ 4 problems (4 errors, 0 warnings)
 ELIFECYCLE  Command failed with exit code 1.
```

### task: `npm run lint`

- Exit code: 1

```text
> agentloopkit@0.28.1 lint
> eslint .
/Users/abhyoh/local dev folder/Apps/AgentLoopKit/scripts/smoke-published-package.mjs
  102:26  error  'URL' is not defined           no-undef
  194:19  error  'setTimeout' is not defined    no-undef
  206:7   error  'clearTimeout' is not defined  no-undef
  210:7   error  'clearTimeout' is not defined  no-undef
✖ 4 problems (4 errors, 0 warnings)
```


## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.1 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  50 passed (50)
      Tests  426 passed (426)
   Start at  12:58:40
   Duration  173.46s (transform 408ms, setup 0ms, import 2.41s, tests 1687.84s, environment 3ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 1
- Status: fail


```text

> agentloopkit@0.28.1 lint /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> eslint .


/Users/abhyoh/local dev folder/Apps/AgentLoopKit/scripts/smoke-published-package.mjs
  102:26  error  'URL' is not defined           no-undef
  194:19  error  'setTimeout' is not defined    no-undef
  206:7   error  'clearTimeout' is not defined  no-undef
  210:7   error  'clearTimeout' is not defined  no-undef

✖ 4 problems (4 errors, 0 warnings)

 ELIFECYCLE  Command failed with exit code 1.
```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.1 typecheck /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.1 build /Users/abhyoh/local dev folder/Apps/AgentLoopKit
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
ESM ⚡️ Build success in 24ms
DTS Build start
DTS ⚡️ Build success in 824ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/published-smoke-script.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.1 test
> vitest run tests/published-smoke-script.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  13:02:00
   Duration  453ms (transform 16ms, setup 0ms, import 23ms, tests 3ms, environment 0ms)

```

### task: `npm run smoke:published -- --version 0.28.1`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.1 smoke:published
> node scripts/smoke-published-package.mjs --version 0.28.1

# AgentLoopKit Published Package Smoke
Package: agentloopkit@0.28.1

## registry version lookup
$ npm view agentloopkit@0.28.1 version
0.28.1

## npx package binary version
$ npx --yes agentloopkit@0.28.1 version
0.28.1

## npx init dry-run
$ npx --yes agentloopkit@0.28.1 init --dry-run --json
dryRun=true; created=51; updated=0; skipped=0

## install published package
$ npm install agentloopkit@0.28.1 --ignore-scripts --no-audit --no-fund
added 114 packages in 1s

## installed agentloop bin version
$ /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-published-smoke-vFBKGj/install/node_modules/.bin/agentloop version
0.28.1

## installed agentloopkit bin version
$ /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-published-smoke-vFBKGj/install/node_modules/.bin/agentloopkit version
0.28.1

Published package smoke passed.
```

### task: `npm run lint`

- Exit code: 1
- Status: fail


```text

> agentloopkit@0.28.1 lint
> eslint .


/Users/abhyoh/local dev folder/Apps/AgentLoopKit/scripts/smoke-published-package.mjs
  102:26  error  'URL' is not defined           no-undef
  194:19  error  'setTimeout' is not defined    no-undef
  206:7   error  'clearTimeout' is not defined  no-undef
  210:7   error  'clearTimeout' is not defined  no-undef

✖ 4 problems (4 errors, 0 warnings)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.1 typecheck
> tsc --noEmit

```

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.1 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (1207 file(s) checked).
```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.1 build
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
ESM ⚡️ Build success in 27ms
DTS Build start
DTS ⚡️ Build success in 867ms
DTS dist/cli/index.d.ts 13.00 B
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
- Fix failing commands before claiming completion.
