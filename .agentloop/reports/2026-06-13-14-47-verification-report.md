# Verification Report

- Timestamp: `2026-06-13T12:47:43.542Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `219229c`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-13-release-0-29-0.md`
- Title: `Release 0.29.0`
- Task type: `release`
- Status: `in-progress`





## Commands Run
### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.29.0 lint
> eslint .

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.29.0 typecheck
> tsc --noEmit

```

### task: `npm test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.29.0 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  52 passed (52)
      Tests  520 passed (520)
   Start at  14:47:57
   Duration  195.82s (transform 418ms, setup 0ms, import 2.44s, tests 1859.24s, environment 3ms)

```

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.29.0 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (1765 file(s) checked).
```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.29.0 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     344.73 KB
ESM dist/cli/index.js.map 654.43 KB
ESM ⚡️ Build success in 31ms
DTS Build start
DTS ⚡️ Build success in 883ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.29.0 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.29.0
Public docs checked: 66
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npm run smoke:release`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.29.0 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.29.0
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-9nmK6G/pack/agentloopkit-0.29.0.tgz
README has no stale exact version pins.
Public docs hygiene passed for 66 public docs and 2 harness files.
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

### task: `npx --yes pnpm@10.12.1 audit --audit-level high`

- Exit code: 0
- Status: pass


```text
No known vulnerabilities found
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
