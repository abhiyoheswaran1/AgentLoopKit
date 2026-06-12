# Verification Report

- Timestamp: `2026-06-12T11:48:53.367Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `6f6a836`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-12-accept-archived-task-evidence-in-gates.md`
- Title: `Accept archived task evidence in gates`
- Task type: `bugfix`
- Status: `in-progress`




## Commands Run
### task: `npm test -- tests/check-gates.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.1 test
> vitest run tests/check-gates.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  13:48:57
   Duration  97.16s (transform 52ms, setup 0ms, import 110ms, tests 96.68s, environment 0ms)

```

### task: `npm run dogfood:strict`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.1 dogfood:strict
> node scripts/dogfood.mjs --strict

# AgentLoopKit Dogfood Gate
Mode: strict

## task folder hygiene
$ npx --no-install tsx src/cli/index.ts task doctor --json
{
  "taskDoctor": {
    "overallStatus": "pass",
    "counts": {
      "checked": 2,
      "diagnostics": 0,
      "terminalTasks": 0,
      "missingStatuses": 0,
      "unsupportedStatuses": 0
    },
    "diagnostics": []
  }
}

## current loop status
$ npx --no-install tsx src/cli/index.ts status --brief --redact-paths
AgentLoopKit: task="Accept archived task evidence in gates" status="in-progress"; verification=pass; run="verify pass"; tree=dirty (25); next="agentloop handoff"
Reason: Task and verification evidence exist, and the working tree has changes.

## review evidence gates
$ npx --no-install tsx src/cli/index.ts check-gates --redact-paths --strict
# AgentLoopKit Gates

- Overall status: `pass`
- Strict mode: `enabled (warnings fail)`
- Git: `main` @ `6f6a836`
- Git root: `[git-root]`
- Git target: `root directory`
- Changed files: `25`

## Gates

- [`pass`] `Task contract`: `Accept archived task evidence in gates` - `.agentloop/tasks/2026-06-12-accept-archived-task-evidence-in-gates.md`
- [`pass`] `Verification report`: `Overall status: pass` - `.agentloop/reports/2026-06-12-13-46-verification-report.md`
- [`pass`] `Handoff summary`: `Reviewer handoff found.` - `.agentloop/handoffs/2026-06-12-13-34-pr-summary.md`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `25 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`

## Next Action

Run `agentloop handoff`.

Gate evidence is present. Refresh the reviewer handoff if the diff changed.


## artifact inventory
$ npx --no-install tsx src/cli/index.ts artifacts --json
{
  "tasks": {
    "count": 2,
    "byStatus": {
      "deferred": 1,
      "in-progress": 1
    },
    "latest": {
      "path": ".agentloop/tasks/2026-06-12-accept-archived-task-evidence-in-gates.md",
      "title": "Accept archived task evidence in gates",
      "status": "in-progress"
    }
  },
  "verificationReports": {
    "count": 247,
    "latest": {
      "path": ".agentloop/reports/2026-06-12-13-46-verification-report.md",
      "title": "Verification Report",
      "overallStatus": "pass"
    }
  },
  "handoffs": {
    "coun

[output truncated: showing first 2500 and last 2500 characters of 17355 total]

e-mode.md",
        "title": "Add bulk task archive mode",
        "status": "in-progress"
      },
      "score": 96,
      "changedFileCount": 15,
      "verificationReportPath": ".agentloop/reports/2026-06-12-13-30-verification-report.md",
      "shipReportPath": ".agentloop/reports/2026-06-12-13-33-ship-report.md",
      "handoffPath": ".agentloop/handoffs/2026-06-12-13-34-pr-summary.md"
    },
    {
      "id": "2026-06-12-13-31-verify",
      "command": "verify",
      "createdAt": "2026-06-12-13-31",
      "task": {
        "path": ".agentloop/tasks/2026-06-12-add-bulk-task-archive-mode.md",
        "title": "Add bulk task archive mode",
        "status": "in-progress"
      },
      "overallStatus": "pass",
      "changedFileCount": 12,
      "verificationReportPath": ".agentloop/reports/2026-06-12-13-30-verification-report.md"
    },
    {
      "id": "2026-06-12-13-13-ship",
      "command": "ship",
      "createdAt": "2026-06-12-13-13",
      "task": {
        "path": ".agentloop/tasks/2026-06-12-add-published-package-smoke-helper.md",
        "title": "Add published package smoke helper",
        "status": "in-progress"
      },
      "score": 96,
      "changedFileCount": 15,
      "verificationReportPath": ".agentloop/reports/2026-06-12-13-08-verification-report.md",
      "shipReportPath": ".agentloop/reports/2026-06-12-13-13-ship-report.md",
      "handoffPath": ".agentloop/handoffs/2026-06-12-13-13-pr-summary.md"
    },
    {
      "id": "2026-06-12-13-12-verify",
      "command": "verify",
      "createdAt": "2026-06-12-13-12",
      "task": {
        "path": ".agentloop/tasks/2026-06-12-add-published-package-smoke-helper.md",
        "title": "Add published package smoke helper",
        "status": "in-progress"
      },
      "overallStatus": "pass",
      "changedFileCount": 13,
      "verificationReportPath": ".agentloop/reports/2026-06-12-13-08-verification-report.md"
    }
  ],
  "latestShip": {
    "id": "2026-06-12-13-33-ship",
    "score": 96,
    "shipReportPath": ".agentloop/reports/2026-06-12-13-33-ship-report.md"
  },
  "safety": {
    "readOnly": true,
    "includesMarkdownContent": false,
    "commandsRun": []
  }
}

## projscan project health
$ npx --yes projscan doctor --format markdown
# Project Health Report

**Health Score: A (100/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

No issues detected. Project looks healthy!

Dogfood gate passed.
```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.1 lint
> eslint .

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.1 typecheck
> tsc --noEmit

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
ESM dist/cli/index.js     317.87 KB
ESM dist/cli/index.js.map 604.95 KB
ESM ⚡️ Build success in 24ms
DTS Build start
DTS ⚡️ Build success in 818ms
DTS dist/cli/index.d.ts 13.00 B
```

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
