# Verification Report

- Timestamp: `2026-06-16T13:00:35.769Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `d6129a7`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-16-release-agentloopkit-0-35-0.md`
- Title: `Release AgentLoopKit 0.35.0`
- Task type: `release`
- Status: `in-progress`





## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.0 test [git-root]
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  63 passed (63)
      Tests  650 passed (650)
   Start at  15:00:39
   Duration  196.22s (transform 1.00s, setup 0ms, import 4.99s, tests 2096.22s, environment 5ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.0 lint [git-root]
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.0 typecheck [git-root]
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.0 build [git-root]
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     441.29 KB
ESM dist/cli/index.js.map 829.98 KB
ESM ⚡️ Build success in 89ms
DTS Build start
DTS ⚡️ Build success in 2449ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `node scripts/prepublish-check.mjs`

- Exit code: 0
- Status: pass


```text
Prepublish metadata check passed.
```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.0 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.35.0
Public docs checked: 73
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.0 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (2630 file(s) checked).
```

### task: `npm run smoke:release`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.0 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.35.0
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-6XB6I1/pack/agentloopkit-0.35.0.tgz
README has no stale exact version pins.
Public docs hygiene passed for 73 public docs and 2 harness files.
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
