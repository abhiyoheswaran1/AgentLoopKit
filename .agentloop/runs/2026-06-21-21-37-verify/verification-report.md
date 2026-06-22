# Verification Report

- Timestamp: `2026-06-21T19:14:42.665Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `08219cdf`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-21-build-explainable-agent-work-evidence-map.md`
- Title: `Build explainable agent work evidence map`
- Task type: `feature`
- Status: `in-progress`



## Duplicate Commands
- Skipped duplicate `task` command `npx pnpm@10.12.1 test`; already selected as `test`.
- Skipped duplicate `task` command `npx pnpm@10.12.1 lint`; already selected as `lint`.
- Skipped duplicate `task` command `npx pnpm@10.12.1 typecheck`; already selected as `typecheck`.
- Skipped duplicate `task` command `npx pnpm@10.12.1 build`; already selected as `build`.



## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.38.0 test [git-root]
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  68 passed (68)
      Tests  882 passed (882)
   Start at  21:14:48
   Duration  1157.07s (transform 705ms, setup 0ms, import 3.40s, tests 4415.81s, environment 4ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.38.0 lint [git-root]
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.38.0 typecheck [git-root]
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.38.0 build [git-root]
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     532.17 KB
ESM dist/cli/index.js.map 999.16 KB
ESM ⚡️ Build success in 31ms
DTS Build start
DTS ⚡️ Build success in 972ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/evidence-map.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.38.0 test
> vitest run tests/evidence-map.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  21:34:32
   Duration  28.00s (transform 89ms, setup 0ms, import 174ms, tests 27.45s, environment 0ms)

```

### task: `npm test -- tests/cli-explain-diff.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.38.0 test
> vitest run tests/cli-explain-diff.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  21:35:04
   Duration  27.52s (transform 49ms, setup 0ms, import 115ms, tests 27.03s, environment 0ms)

```

### task: `npm test -- tests/resume-pack.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.38.0 test
> vitest run tests/resume-pack.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  21:35:35
   Duration  62.85s (transform 48ms, setup 0ms, import 109ms, tests 62.37s, environment 0ms)

```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.38.0 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.38.0
Public docs checked: 76
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.38.0 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (4902 file(s) checked).
```

### task: `git diff --check`

- Exit code: 0
- Status: pass


```text
(no output)
```


## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
