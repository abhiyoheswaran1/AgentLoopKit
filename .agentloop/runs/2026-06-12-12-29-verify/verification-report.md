# Verification Report

- Timestamp: `2026-06-12T10:21:59.944Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `ca4d646`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-12-add-repeatable-dogfood-gate-and-official-icon-assets.md`
- Title: `Add repeatable dogfood gate and official icon assets`
- Task type: `feature`
- Status: `in-progress`




## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  49 passed (49)
      Tests  421 passed (421)
   Start at  12:22:05
   Duration  170.71s (transform 475ms, setup 0ms, import 2.64s, tests 1691.30s, environment 3ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 lint /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 typecheck /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 build /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     312.39 KB
ESM dist/cli/index.js.map 595.14 KB
ESM ⚡️ Build success in 41ms
DTS Build start
DTS ⚡️ Build success in 1092ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/dogfood-script.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 test
> vitest run tests/dogfood-script.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  12:25:24
   Duration  405ms (transform 17ms, setup 0ms, import 24ms, tests 3ms, environment 0ms)

```

### task: `npm run dogfood`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 dogfood
> node scripts/dogfood.mjs

# AgentLoopKit Dogfood Gate
Mode: default

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
AgentLoopKit: task="Add repeatable dogfood gate and official icon assets" status="in-progress"; verification=missing; run="ship 100/100"; tree=dirty (13); next="agentloop verify"
Reason: A task exists, but no verification report was found.

## review evidence gates
$ npx --no-install tsx src/cli/index.ts check-gates --redact-paths
# AgentLoopKit Gates

- Overall status: `fail`
- Strict mode: `disabled`
- Git: `main` @ `ca4d646`
- Git root: `[git-root]`
- Git target: `root directory`
- Changed files: `13`

## Gates

- [`pass`] `Task contract`: `Add repeatable dogfood gate and official icon assets` - `.agentloop/tasks/2026-06-12-add-repeatable-dogfood-gate-and-official-icon-assets.md`
- [`fail`] `Verification report`: `Latest verification report predates the current task. Rerun verification.` - `.agentloop/reports/2026-06-12-11-54-verification-report.md`
- [`pass`] `Handoff summary`: `Reviewer handoff found.` - `.agentloop/handoffs/2026-06-12-12-01-pr-summary.md`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `13 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`

## Next Action

Run `agentloop verify --task .agentloop/tasks/2026-06-12-add-repeatable-dogfood-gate-and-official-icon-assets.md`.

Run verification and fix failures before review.

review evidence gates reported exit code 1; continuing in default mode.

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
      "path": ".agentloop/tasks/2026-06-12-add-repeatable-dogfood-gate-and-official-icon-assets.md",
      "title": "Add repeatable dogfood gate and official icon assets",
      "status": "in-progress"
    }
  },
  "verificationReports": {
    "count"

[output truncated: showing first 2500 and last 2500 characters of 16962 total]

 "title": "Clean stale 0.28.0 harness release guidance",
        "status": "in-progress"
      },
      "overallStatus": "pass",
      "changedFileCount": 7,
      "verificationReportPath": ".agentloop/reports/2026-06-12-11-54-verification-report.md"
    },
    {
      "id": "2026-06-12-11-38-ship",
      "command": "ship",
      "createdAt": "2026-06-12-11-38",
      "task": {
        "path": ".agentloop/tasks/2026-06-12-archive-shipped-0-28-0-review-tasks.md",
        "title": "Archive shipped 0.28.0 review tasks",
        "status": "in-progress"
      },
      "score": 89,
      "changedFileCount": 47,
      "verificationReportPath": ".agentloop/reports/2026-06-12-11-34-verification-report.md",
      "shipReportPath": ".agentloop/reports/2026-06-12-11-38-ship-report.md",
      "handoffPath": ".agentloop/handoffs/2026-06-12-11-38-pr-summary.md"
    },
    {
      "id": "2026-06-12-11-38-verify",
      "command": "verify",
      "createdAt": "2026-06-12-11-38",
      "task": {
        "path": ".agentloop/tasks/2026-06-12-archive-shipped-0-28-0-review-tasks.md",
        "title": "Archive shipped 0.28.0 review tasks",
        "status": "in-progress"
      },
      "overallStatus": "pass",
      "changedFileCount": 46,
      "verificationReportPath": ".agentloop/reports/2026-06-12-11-34-verification-report.md"
    },
    {
      "id": "2026-06-12-11-08-ship",
      "command": "ship",
      "createdAt": "2026-06-12-11-08",
      "task": {
        "path": ".agentloop/tasks/2026-06-12-release-agentloopkit-0-28-0.md",
        "title": "Release AgentLoopKit 0.28.0",
        "status": "in-progress"
      },
      "score": 96,
      "changedFileCount": 12,
      "verificationReportPath": ".agentloop/reports/2026-06-12-11-00-verification-report.md",
      "shipReportPath": ".agentloop/reports/2026-06-12-11-08-ship-report.md",
      "handoffPath": ".agentloop/handoffs/2026-06-12-11-08-pr-summary.md"
    }
  ],
  "latestShip": {
    "id": "2026-06-12-12-01-ship",
    "score": 100,
    "shipReportPath": ".agentloop/reports/2026-06-12-12-01-ship-report.md"
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

> agentloopkit@0.28.0 lint
> eslint .

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 typecheck
> tsc --noEmit

```

### task: `npm test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  49 passed (49)
      Tests  421 passed (421)
   Start at  12:26:13
   Duration  183.00s (transform 397ms, setup 0ms, import 2.49s, tests 1851.14s, environment 3ms)

```

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (1190 file(s) checked).
```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     312.39 KB
ESM dist/cli/index.js.map 595.14 KB
ESM ⚡️ Build success in 30ms
DTS Build start
DTS ⚡️ Build success in 890ms
DTS dist/cli/index.d.ts 13.00 B
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
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
