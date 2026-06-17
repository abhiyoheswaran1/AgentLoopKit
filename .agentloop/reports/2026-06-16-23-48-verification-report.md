# Verification Report

- Timestamp: `2026-06-16T21:48:03.467Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-16-ignore-agentloop-evidence-in-agentflight-changed-file-filters-2.md`
- Title: `Ignore AgentLoop evidence in AgentFlight changed-file filters`
- Task type: `feature`
- Status: `in-progress`





## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test [git-root]
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  63 passed (63)
      Tests  707 passed (707)
   Start at  23:48:04
   Duration  73.04s (transform 2.96s, setup 0ms, import 10.04s, tests 768.66s, environment 5ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 lint [git-root]
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 typecheck [git-root]
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 build [git-root]
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     467.74 KB
ESM dist/cli/index.js.map 876.60 KB
ESM ⚡️ Build success in 42ms
DTS Build start
DTS ⚡️ Build success in 909ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/autonomous-dogfood.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/autonomous-dogfood.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  23:49:27
   Duration  159ms (transform 20ms, setup 0ms, import 19ms, tests 14ms, environment 0ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 typecheck
> tsc --noEmit

```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 lint
> eslint .

```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     467.74 KB
ESM dist/cli/index.js.map 876.60 KB
ESM ⚡️ Build success in 29ms
DTS Build start
DTS ⚡️ Build success in 905ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  63 passed (63)
      Tests  707 passed (707)
   Start at  23:49:34
   Duration  71.53s (transform 2.30s, setup 0ms, import 8.55s, tests 750.56s, environment 8ms)

```

## Post-Verification Gates
### post-verification: `npx --yes agentflight verify -- npm test -- tests/autonomous-dogfood.test.ts`

- Exit code: 0
- Status: pass


```text
AgentFlight verification

passed: npm test -- tests/autonomous-dogfood.test.ts
Evidence saved:
- stdout: .agentflight/evidence/af-20260616-214044-ignore-agentloop-evidence-in-agentflight-changed-file-filters/verification-3.stdout.txt
- stderr: .agentflight/evidence/af-20260616-214044-ignore-agentloop-evidence-in-agentflight-changed-file-filters/verification-3.stderr.txt

> agentloopkit@0.35.2 test
> vitest run tests/autonomous-dogfood.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  23:50:48
   Duration  150ms (transform 20ms, setup 0ms, import 20ms, tests 15ms, environment 0ms)
```

### post-verification: `npx --yes projscan doctor --format markdown`

- Exit code: 0
- Status: pass


```text
# Project Health Report

**Health Score: A (100/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

No issues detected. Project looks healthy!
```

### post-verification: `npx --yes agentflight doctor`

- Exit code: 0
- Status: pass


```text
AgentFlight Doctor

Overall: OK

- OK Node.js version: v26.3.0 satisfies AgentFlight's Node.js 20+ target.
- OK npm availability: npm 11.16.0 is available.
- OK git availability: git is available.
- OK repository root: [git-root]
- OK package manager: pnpm
- OK .agentflight presence: .agentflight exists.
- OK config validity: .agentflight/config.json is valid.
- OK .agentflight writable: .agentflight is writable.
- OK current session: A current session exists.
- OK ProjScan availability: ProjScan is available.
- OK AgentLoopKit availability: AgentLoopKit is available.
- OK test script: npm run test is configured.
- OK build script: npm run build is configured.
- OK typecheck script: npm run typecheck is configured.
- OK lint script: npm run lint is configured.
```


## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
