# Verification Report

- Timestamp: `2026-06-12T12:53:03.688Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `fbf9f21`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-12-prepare-0-28-2-patch-release.md`
- Title: `Prepare 0.28.2 patch release`
- Task type: `release`
- Status: `in-progress`




## Commands Run
### custom: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.2 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (1261 file(s) checked).
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
AgentLoopKit: task="Prepare 0.28.2 patch release" status="in-progress"; verification=pass; run="ship 92/100"; tree=dirty (38); next="agentloop handoff"
Reason: Task and verification evidence exist, and the working tree has changes.

## review evidence gates
$ npx --no-install tsx src/cli/index.ts check-gates --redact-paths --strict
# AgentLoopKit Gates

- Overall status: `pass`
- Strict mode: `enabled (warnings fail)`
- Git: `main` @ `fbf9f21`
- Git root: `[git-root]`
- Git target: `root directory`
- Changed files: `38`

## Gates

- [`pass`] `Task contract`: `Prepare 0.28.2 patch release` - `.agentloop/tasks/2026-06-12-prepare-0-28-2-patch-release.md`
- [`pass`] `Verification report`: `Overall status: pass` - `.agentloop/reports/2026-06-12-14-42-verification-report.md`
- [`pass`] `Handoff summary`: `Reviewer handoff found.` - `.agentloop/handoffs/2026-06-12-14-51-pr-summary.md`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `38 changed file(s) detected.`
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
      "path": ".agentloop/tasks/2026-06-12-prepare-0-28-2-patch-release.md",
      "title": "Prepare 0.28.2 patch release",
      "status": "in-progress"
    }
  },
  "verificationReports": {
    "count": 253,
    "latest": {
      "path": ".agentloop/reports/2026-06-12-14-42-verification-report.md",
      "title": "Verification Report",
      "overallStatus": "pass"
    }
  },
  "handoffs": {
    "count": 246,
    "latest": {
      "path": ".agentloop

[output truncated: showing first 2500 and last 2500 characters of 18753 total]

-51-ship-report.md",
      "handoffPath": ".agentloop/handoffs/2026-06-12-14-51-pr-summary.md"
    },
    {
      "id": "2026-06-12-14-50-verify",
      "command": "verify",
      "createdAt": "2026-06-12-14-50",
      "task": {
        "path": ".agentloop/tasks/2026-06-12-prepare-0-28-2-patch-release.md",
        "title": "Prepare 0.28.2 patch release",
        "status": "in-progress"
      },
      "overallStatus": "pass",
      "changedFileCount": 31,
      "verificationReportPath": ".agentloop/reports/2026-06-12-14-42-verification-report.md"
    },
    {
      "id": "2026-06-12-14-41-verify",
      "command": "verify",
      "createdAt": "2026-06-12-14-41",
      "task": {
        "path": ".agentloop/tasks/2026-06-12-prepare-0-28-2-patch-release.md",
        "title": "Prepare 0.28.2 patch release",
        "status": "in-progress"
      },
      "overallStatus": "pass",
      "changedFileCount": 29,
      "verificationReportPath": ".agentloop/reports/2026-06-12-14-41-verification-report.md"
    },
    {
      "id": "2026-06-12-14-40-verify",
      "command": "verify",
      "createdAt": "2026-06-12-14-40",
      "task": {
        "path": ".agentloop/tasks/2026-06-12-prepare-0-28-2-patch-release.md",
        "title": "Prepare 0.28.2 patch release",
        "status": "in-progress"
      },
      "overallStatus": "fail",
      "changedFileCount": 26,
      "verificationReportPath": ".agentloop/reports/2026-06-12-14-31-verification-report.md"
    },
    {
      "id": "2026-06-12-14-31-verify",
      "command": "verify",
      "createdAt": "2026-06-12-14-31",
      "task": {
        "path": ".agentloop/tasks/2026-06-12-prepare-0-28-2-patch-release.md",
        "title": "Prepare 0.28.2 patch release",
        "status": "in-progress"
      },
      "overallStatus": "pass",
      "changedFileCount": 25,
      "verificationReportPath": ".agentloop/reports/2026-06-12-14-31-verification-report.md"
    }
  ],
  "latestShip": {
    "id": "2026-06-12-14-51-ship",
    "score": 92,
    "shipReportPath": ".agentloop/reports/2026-06-12-14-51-ship-report.md"
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

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
