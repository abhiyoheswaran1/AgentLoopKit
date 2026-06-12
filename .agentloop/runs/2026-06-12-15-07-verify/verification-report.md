# Verification Report

- Timestamp: `2026-06-12T13:06:33.542Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `fda3195`
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

Markdown links OK (1263 file(s) checked).
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

### custom: `npm run smoke:published -- --version 0.28.2`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.2 smoke:published
> node scripts/smoke-published-package.mjs --version 0.28.2

# AgentLoopKit Published Package Smoke
Package: agentloopkit@0.28.2

## registry version lookup
$ npm view agentloopkit@0.28.2 version
0.28.2

## npx package binary version
$ npx --yes agentloopkit@0.28.2 version
0.28.2

## npx init dry-run
$ npx --yes agentloopkit@0.28.2 init --dry-run --json
dryRun=true; created=51; updated=0; skipped=0

## install published package
$ npm install agentloopkit@0.28.2 --ignore-scripts --no-audit --no-fund
added 114 packages in 696ms

## installed agentloop bin version
$ <installed agentloop bin> version
0.28.2

## installed agentloopkit bin version
$ <installed agentloopkit bin> version
0.28.2

Published package smoke passed.
```

### custom: `node dist/cli/index.js npm-status --agentloopkit --expect-current --json`

- Exit code: 0
- Status: pass


```text
{
  "packageName": "agentloopkit",
  "localVersion": "0.28.2",
  "status": "current",
  "registry": {
    "latest": "0.28.2",
    "versions": [
      "0.1.0",
      "0.1.1",
      "0.24.0",
      "0.24.1",
      "0.24.2",
      "0.24.3",
      "0.24.4",
      "0.24.5",
      "0.25.0",
      "0.26.0",
      "0.26.1",
      "0.26.2",
      "0.26.3",
      "0.26.4",
      "0.26.5",
      "0.27.0",
      "0.28.0",
      "0.28.1",
      "0.28.2"
    ],
    "hasLocalVersion": true
  },
  "source": {
    "command": "npm view agentloopkit version versions --json",
    "exitCode": 0
  },
  "recommendation": "npm has caught up. Remove temporary GitHub tarball fallback docs if they are still present.",
  "safety": {
    "does": [
      "runs npm view when no captured registry JSON is provided"
    ],
    "doesNot": [
      "publish packages",
      "create tags",
      "create GitHub releases",
      "read npm token files directly",
      "read .env files",
      "upload files",
      "change package metadata"
    ]
  },
  "markdown": "# npm Status\n\n- Package: `agentloopkit`\n- Local version: `0.28.2`\n- npm latest: `0.28.2`\n- Registry contains local version: yes\n- Registry versions: `0.1.0`, `0.1.1`, `0.24.0`, `0.24.1`, `0.24.2`, `0.24.3`, `0.24.4`, `0.24.5`, `0.25.0`, `0.26.0`, `0.26.1`, `0.26.2`, `0.26.3`, `0.26.4`, `0.26.5`, `0.27.0`, `0.28.0`, `0.28.1`, `0.28.2`\n- Status: npm latest matches local package version\n\n## Recommendation\n\nnpm has caught up. Remove temporary GitHub tarball fallback docs if they are still present.\n\n## Safety\n\nThis command only runs `npm view --json agentloopkit version versions` unless `--registry-json` is provided. AgentLoopKit does not read npm token files directly, but npm may use normal npm configuration when the live registry check runs. It does not publish packages, create tags, create GitHub releases, read .env files, upload files, or change package metadata.\n"
}
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
AgentLoopKit: task="Prepare 0.28.2 patch release" status="in-progress"; verification=pass; run="verify pass"; tree=dirty (5); next="agentloop handoff"
Reason: Task and verification evidence exist, and the working tree has changes.

## review evidence gates
$ npx --no-install tsx src/cli/index.ts check-gates --redact-paths --strict
# AgentLoopKit Gates

- Overall status: `pass`
- Strict mode: `enabled (warnings fail)`
- Git: `main` @ `fda3195`
- Git root: `[git-root]`
- Git target: `root directory`
- Changed files: `5`

## Gates

- [`pass`] `Task contract`: `Prepare 0.28.2 patch release` - `.agentloop/tasks/2026-06-12-prepare-0-28-2-patch-release.md`
- [`pass`] `Verification report`: `Overall status: pass` - `.agentloop/reports/2026-06-12-14-53-verification-report.md`
- [`pass`] `Handoff summary`: `Reviewer handoff found.` - `.agentloop/handoffs/2026-06-12-14-51-pr-summary.md`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `5 changed file(s) detected.`
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
    "count": 254,
    "latest": {
      "path": ".agentloop/reports/2026-06-12-14-53-verification-report.md",
      "title": "Verification Report",
      "overallStatus": "pass"
    }
  },
  "handoffs": {
    "count": 246,
    "latest": {
      "path": ".agentloop/ha

[output truncated: showing first 2500 and last 2500 characters of 14960 total]

-ship",
      "command": "ship",
      "createdAt": "2026-06-12-14-51",
      "task": {
        "path": ".agentloop/tasks/2026-06-12-prepare-0-28-2-patch-release.md",
        "title": "Prepare 0.28.2 patch release",
        "status": "in-progress"
      },
      "score": 92,
      "changedFileCount": 32,
      "verificationReportPath": ".agentloop/reports/2026-06-12-14-42-verification-report.md",
      "shipReportPath": ".agentloop/reports/2026-06-12-14-51-ship-report.md",
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
