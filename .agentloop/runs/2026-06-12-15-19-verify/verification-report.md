# Verification Report

- Timestamp: `2026-06-12T13:18:04.894Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `96cefee`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-12-add-release-metadata-sync-prepublish-guard.md`
- Title: `Add release metadata sync prepublish guard`
- Task type: `bugfix`
- Status: `in-progress`




## Commands Run
### custom: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.2 lint
> eslint .

```

### custom: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.2 typecheck
> tsc --noEmit

```

### custom: `npm test -- tests/prepublish-check.test.ts tests/distribution-artifacts.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.2 test
> vitest run tests/prepublish-check.test.ts tests/distribution-artifacts.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  2 passed (2)
      Tests  14 passed (14)
   Start at  15:18:18
   Duration  2.00s (transform 20ms, setup 0ms, import 59ms, tests 1.57s, environment 0ms)

```

### custom: `node scripts/prepublish-check.mjs`

- Exit code: 0
- Status: pass


```text
Prepublish metadata check passed.
```

### custom: `git diff --check`

- Exit code: 0
- Status: pass


```text
(no output)
```

### custom: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.2 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (1279 file(s) checked).
```

### custom: `npm run dogfood:strict`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.2 dogfood:strict
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
AgentLoopKit: task="Add release metadata sync prepublish guard" status="in-progress"; verification=pass; run="verify pass"; tree=dirty (12); next="agentloop handoff"
Reason: Task and verification evidence exist, and the working tree has changes.

## review evidence gates
$ npx --no-install tsx src/cli/index.ts check-gates --redact-paths --strict
# AgentLoopKit Gates

- Overall status: `pass`
- Strict mode: `enabled (warnings fail)`
- Git: `main` @ `96cefee`
- Git root: `[git-root]`
- Git target: `root directory`
- Changed files: `12`

## Gates

- [`pass`] `Task contract`: `Add release metadata sync prepublish guard` - `.agentloop/tasks/2026-06-12-add-release-metadata-sync-prepublish-guard.md`
- [`pass`] `Verification report`: `Overall status: pass` - `.agentloop/reports/2026-06-12-15-16-verification-report.md`
- [`pass`] `Handoff summary`: `Reviewer handoff found.` - `.agentloop/handoffs/2026-06-12-15-07-pr-summary.md`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `12 changed file(s) detected.`
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
      "path": ".agentloop/tasks/2026-06-12-add-release-metadata-sync-prepublish-guard.md",
      "title": "Add release metadata sync prepublish guard",
      "status": "in-progress"
    }
  },
  "verificationReports": {
    "count": 258,
    "latest": {
      "path": ".agentloop/reports/2026-06-12-15-16-verification-report.md",
      "title": "Verification Report",
      "overallStatus": "pass"
    }
  },
  "ha

[output truncated: showing first 2500 and last 2500 characters of 16250 total]

tle": "Add release metadata sync prepublish guard",
        "status": "in-progress"
      },
      "overallStatus": "pass",
      "changedFileCount": 8,
      "verificationReportPath": ".agentloop/reports/2026-06-12-15-14-verification-report.md"
    },
    {
      "id": "2026-06-12-15-13-verify",
      "command": "verify",
      "createdAt": "2026-06-12-15-13",
      "task": {
        "path": ".agentloop/tasks/2026-06-12-add-release-metadata-sync-prepublish-guard.md",
        "title": "Add release metadata sync prepublish guard",
        "status": "in-progress"
      },
      "overallStatus": "fail",
      "changedFileCount": 6,
      "verificationReportPath": ".agentloop/reports/2026-06-12-15-13-verification-report.md"
    },
    {
      "id": "2026-06-12-15-07-ship-2",
      "command": "ship",
      "createdAt": "2026-06-12-15-07",
      "task": {
        "path": ".agentloop/tasks/2026-06-12-prepare-0-28-2-patch-release.md",
        "title": "Prepare 0.28.2 patch release",
        "status": "in-progress"
      },
      "score": 100,
      "changedFileCount": 8,
      "verificationReportPath": ".agentloop/reports/2026-06-12-15-06-verification-report.md",
      "shipReportPath": ".agentloop/reports/2026-06-12-15-07-ship-report.md",
      "handoffPath": ".agentloop/handoffs/2026-06-12-15-07-pr-summary.md"
    },
    {
      "id": "2026-06-12-15-07-ship",
      "command": "ship",
      "createdAt": "2026-06-12-15-07",
      "task": {
        "path": ".agentloop/tasks/2026-06-12-prepare-0-28-2-patch-release.md",
        "title": "Prepare 0.28.2 patch release",
        "status": "in-progress"
      },
      "score": 100,
      "changedFileCount": 7,
      "verificationReportPath": ".agentloop/reports/2026-06-12-15-06-verification-report.md",
      "shipReportPath": ".agentloop/reports/2026-06-12-15-07-ship-report.md",
      "handoffPath": ".agentloop/handoffs/2026-06-12-15-07-pr-summary.md"
    }
  ],
  "latestShip": {
    "id": "2026-06-12-15-07-ship-2",
    "score": 100,
    "shipReportPath": ".agentloop/reports/2026-06-12-15-07-ship-report.md"
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

### custom: `npx --yes projscan doctor --format markdown`

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
