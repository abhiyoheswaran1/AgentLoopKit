# Verification Report

- Timestamp: `2026-06-14T13:55:25.300Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `96ab85c`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-14-release-agentloopkit-0-32-1.md`
- Title: `Release AgentLoopKit 0.32.1`
- Task type: `release`
- Status: `proposed`





## Commands Run
### custom: `node scripts/prepublish-check.mjs`

- Exit code: 0
- Status: pass


```text
Prepublish metadata check passed.
```

### custom: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.32.1 lint
> eslint .

```

### custom: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.32.1 typecheck
> tsc --noEmit

```

### custom: `npm test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.32.1 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  58 passed (58)
      Tests  546 passed (546)
   Start at  15:55:42
   Duration  224.46s (transform 530ms, setup 0ms, import 3.36s, tests 2259.82s, environment 4ms)

```

### custom: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.32.1 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     375.46 KB
ESM dist/cli/index.js.map 713.60 KB
ESM ⚡️ Build success in 29ms
DTS Build start
DTS ⚡️ Build success in 1009ms
DTS dist/cli/index.d.ts 13.00 B
```

### custom: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.32.1 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.32.1
Public docs checked: 71
Repo harness files checked: 2
Public docs hygiene passed.
```

### custom: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.32.1 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (1827 file(s) checked).
```

### custom: `npm run smoke:release`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.32.1 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.32.1
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-NgdXvJ/pack/agentloopkit-0.32.1.tgz
README has no stale exact version pins.
Public docs hygiene passed for 71 public docs and 2 harness files.
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
