# Verification Report

- Timestamp: `2026-06-16T22:01:09.034Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-16-ignore-generated-evidence-in-projscan-scans-2.md`
- Title: `Ignore generated evidence in ProjScan scans`
- Task type: `feature`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/autonomous-dogfood.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/autonomous-dogfood.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  00:01:09
   Duration  177ms (transform 23ms, setup 0ms, import 22ms, tests 22ms, environment 0ms)

```

## Post-Verification Gates
### post-verification: `npx --yes agentflight verify -- npm test -- tests/autonomous-dogfood.test.ts`

- Exit code: 0
- Status: pass


```text
AgentFlight verification

passed: npm test -- tests/autonomous-dogfood.test.ts
Evidence saved:
- stdout: .agentflight/evidence/af-20260616-215940-ignore-generated-evidence-in-projscan-scans/verification-2.stdout.txt
- stderr: .agentflight/evidence/af-20260616-215940-ignore-generated-evidence-in-projscan-scans/verification-2.stderr.txt

> agentloopkit@0.35.2 test
> vitest run tests/autonomous-dogfood.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  00:01:11
   Duration  175ms (transform 23ms, setup 0ms, import 23ms, tests 15ms, environment 0ms)
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
