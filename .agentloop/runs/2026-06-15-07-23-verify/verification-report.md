# Verification Report

- Timestamp: `2026-06-15T05:18:47.484Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `08fe270`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-15-release-agentloopkit-0-33-0.md`
- Title: `Release AgentLoopKit 0.33.0`
- Task type: `release`
- Status: `proposed`





## Commands Run
### task: `node scripts/prepublish-check.mjs`

- Exit code: 0
- Status: pass


```text
Prepublish metadata check passed.
```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 lint
> eslint .

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 typecheck
> tsc --noEmit

```

### task: `npm test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  60 passed (60)
      Tests  558 passed (558)
   Start at  07:19:02
   Duration  234.80s (transform 460ms, setup 0ms, import 2.75s, tests 2358.17s, environment 3ms)

```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     402.23 KB
ESM dist/cli/index.js.map 764.51 KB
ESM ⚡️ Build success in 31ms
DTS Build start
DTS ⚡️ Build success in 965ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.33.0
Public docs checked: 72
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (1869 file(s) checked).
```

### task: `npm run smoke:release`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.33.0
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-NmJ21x/pack/agentloopkit-0.33.0.tgz
README has no stale exact version pins.
Public docs hygiene passed for 72 public docs and 2 harness files.
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
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
