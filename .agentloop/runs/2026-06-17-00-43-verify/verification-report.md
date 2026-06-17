# Verification Report

- Timestamp: `2026-06-16T22:43:11.907Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-17-separate-agentloop-evidence-churn-in-next-output-2.md`
- Title: `Separate AgentLoop evidence churn in next output`
- Task type: `feature`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/next.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/next.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  00:43:12
   Duration  15.22s (transform 74ms, setup 0ms, import 139ms, tests 14.97s, environment 0ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 typecheck
> tsc --noEmit

```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.35.2
Public docs checked: 73
Repo harness files checked: 2
Public docs hygiene passed.
```

## Post-Verification Gates
### post-verification: `npx --yes agentflight verify -- npm test -- tests/next.test.ts`

- Exit code: 0
- Status: pass


```text
AgentFlight verification

passed: npm test -- tests/next.test.ts
Evidence saved:
- stdout: .agentflight/evidence/af-20260616-224001-separate-agentloop-evidence-churn-in-next-output/verification-1.stdout.txt
- stderr: .agentflight/evidence/af-20260616-224001-separate-agentloop-evidence-churn-in-next-output/verification-1.stderr.txt

> agentloopkit@0.35.2 test
> vitest run tests/next.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  00:43:34
   Duration  13.73s (transform 91ms, setup 0ms, import 160ms, tests 13.42s, environment 0ms)
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
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
