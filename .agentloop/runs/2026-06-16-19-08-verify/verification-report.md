# Verification Report

- Timestamp: `2026-06-16T17:07:43.861Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-16-decouple-maintenance-check-from-strict-release-proof-2.md`
- Title: `Decouple maintenance check from strict release proof`
- Task type: `bugfix`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/maintenance-check-script.test.ts tests/autonomous-dogfood.test.ts tests/package-scripts.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/maintenance-check-script.test.ts tests/autonomous-dogfood.test.ts tests/package-scripts.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  3 passed (3)
      Tests  12 passed (12)
   Start at  19:07:44
   Duration  143ms (transform 23ms, setup 0ms, import 39ms, tests 16ms, environment 0ms)

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
ESM dist/cli/index.js     455.29 KB
ESM dist/cli/index.js.map 854.84 KB
ESM ⚡️ Build success in 35ms
DTS Build start
DTS ⚡️ Build success in 892ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm run maintenance:check`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 maintenance:check
> node scripts/maintenance-check.mjs


## unit tests
$ npm run test:unit

> agentloopkit@0.35.2 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/github-action-runner.test.ts tests/release-proof.test.ts tests/public-docs-hygiene.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/maintenance-check-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts


 RUN  v4.1.8 [git-root]

 ✓ tests/safety.test.ts (4 tests) 34ms
 ✓ tests/package-manager.test.ts (3 tests) 12ms
 ✓ tests/public-docs-hygiene.test.ts (5 tests) 89ms
 ✓ tests/config.test.ts (8 tests) 17ms
 ✓ tests/project-detection.test.ts (7 tests) 51ms
 ✓ tests/markdown-format.test.ts (3 tests) 3ms
 ✓ tests/github-action-runner.test.ts (5 tests) 6ms
 ✓ tests/autonomous-dogfood.test.ts (5 tests) 51ms
 ✓ tests/dogfood-start-script.test.ts (4 tests) 6ms
 ✓ tests/task-contract.test.ts (1 test) 22ms
 ✓ tests/roadmap-channels.test.ts (2 tests) 10ms
 ✓ tests/package-metadata.test.ts (1 test) 4ms
 ✓ tests/schema.test.ts (1 test) 15ms
 ✓ tests/post-verification-gates.test.ts (20 tests) 5ms
 ✓ tests/package-scripts.test.ts (4 tests) 23ms
 ✓ tests/maintenance-check-script.test.ts (3 tests) 3ms
 ✓ tests/slug.test.ts (1 test) 4ms
 ✓ tests/template-renderer.test.ts (2 tests) 3ms
 ✓ tests/schemastore.test.ts (4 tests) 817ms
     ✓ prints SchemaStore catalog entry from the CLI without writing files  787ms
 ✓ tests/cli-docs-drift.test.ts (1 test) 571ms
     ✓ public command surface is reflected in help, README, CLI reference, and completions  570ms
 ✓ tests/version.test.ts (2 tests) 1218ms
     ✓ prints the package version  754ms
     ✓ prints the package version as JSON when requested  463ms
 ✓ tests/github-metadata.test.ts (9 tests) 1574ms
     ✓ exposes read-only local JSON import through the CLI  612ms
     ✓ keeps imported titles and output paths on one line in human output while preserving JSON values  799ms
 ✓ tests/policy-packs.test.ts (7 tests) 3190ms
     ✓ exposes policy pack list, show, and apply through the CLI  

[output truncated: showing first 2500 and last 2500 characters of 34027 total]

 ".agentloop/reports/2026-06-16-18-59-verification-report.md"
    },
    {
      "id": "2026-06-16-18-52-handoff",
      "command": "handoff",
      "createdAt": "2026-06-16-18-52",
      "task": {
        "path": ".agentloop/tasks/archive/2026-06-16-prevent-stale-agentloop-task-state.md",
        "title": "Prevent stale AgentLoop task state",
        "status": "done"
      },
      "changedFileCount": 23,
      "verificationReportPath": ".agentloop/reports/2026-06-16-18-50-verification-report.md",
      "handoffPath": ".agentloop/handoffs/2026-06-16-18-52-pr-summary.md"
    },
    {
      "id": "2026-06-16-18-51-handoff",
      "command": "handoff",
      "createdAt": "2026-06-16-18-51",
      "task": {
        "path": ".agentloop/tasks/archive/2026-06-16-prevent-stale-agentloop-task-state.md",
        "title": "Prevent stale AgentLoop task state",
        "status": "done"
      },
      "changedFileCount": 19,
      "verificationReportPath": ".agentloop/reports/2026-06-16-18-50-verification-report.md",
      "handoffPath": ".agentloop/handoffs/2026-06-16-18-51-pr-summary.md"
    }
  ],
  "latestShip": null,
  "githubMetadata": {
    "status": "missing",
    "path": ".agentloop/github/context.json"
  },
  "safety": {
    "readOnly": true,
    "includesMarkdownContent": false,
    "commandsRun": []
  }
}

## agentflight session health
$ npx --yes agentflight doctor
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

## projscan project health
$ npx --yes projscan --format markdown doctor
# Project Health Report

**Health Score: A (100/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

No issues detected. Project looks healthy!

Dogfood gate passed.

Maintenance check passed.
```


## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
