# Verification Report

- Timestamp: `2026-06-12T12:31:59.017Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `fbf9f21`
- Working tree: `dirty`
- Overall status: fail


## Task Context
- Path: `.agentloop/tasks/2026-06-12-prepare-0-28-2-patch-release.md`
- Title: `Prepare 0.28.2 patch release`
- Task type: `release`
- Status: `in-progress`



## Failure Summary
### custom: `npm test`

- Exit code: 1

```text
 ❯ tests/distribution-artifacts.test.ts:11:33
      9|     expect(packageJson.mcpName).toBe('io.github.abhiyoheswaran1/agentl…
     10|     expect(serverJson.name).toBe(packageJson.mcpName);
     11|     expect(serverJson.packages).toEqual([
       |                                 ^
     12|       {
     13|         registryType: 'npm',
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
 Test Files  1 failed | 50 passed (51)
      Tests  1 failed | 435 passed (436)
   Start at  14:32:12
   Duration  178.44s (transform 391ms, setup 0ms, import 2.46s, tests 1766.63s, environment 4ms)
```

### custom: `npm publish --access public --dry-run`

- Exit code: 1

```text
     12|       {
     13|         registryType: 'npm',
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
 Test Files  1 failed | 50 passed (51)
      Tests  1 failed | 435 passed (436)
   Start at  14:37:34
   Duration  184.16s (transform 453ms, setup 0ms, import 2.59s, tests 1872.28s, environment 3ms)
npm error code 1
npm error path /Users/abhyoh/local dev folder/Apps/AgentLoopKit
npm error command failed
npm error command sh -c node scripts/prepublish-check.mjs && npm run typecheck && npm test && npm run build
npm error A complete log of this run can be found in: /Users/abhyoh/.npm/_logs/2026-06-12T12_37_25_598Z-debug-0.log
```


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

### custom: `npm test`

- Exit code: 1
- Status: fail


```text

> agentloopkit@0.28.2 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit

 ❯ tests/distribution-artifacts.test.ts (10 tests | 1 failed) 11ms
     × MCP Registry metadata matches the npm package marker 6ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/distribution-artifacts.test.ts > distribution artifacts > MCP Registry metadata matches the npm package marker
AssertionError: expected [ { registryType: 'npm', …(3) } ] to deeply equal [ { registryType: 'npm', …(3) } ]

- Expected
+ Received

@@ -3,8 +3,8 @@
      "identifier": "agentloopkit",
      "registryType": "npm",
      "transport": {
        "type": "stdio",
      },
-     "version": "0.28.2",
+     "version": "0.28.1",
    },
  ]

 ❯ tests/distribution-artifacts.test.ts:11:33
      9|     expect(packageJson.mcpName).toBe('io.github.abhiyoheswaran1/agentl…
     10|     expect(serverJson.name).toBe(packageJson.mcpName);
     11|     expect(serverJson.packages).toEqual([
       |                                 ^
     12|       {
     13|         registryType: 'npm',

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 50 passed (51)
      Tests  1 failed | 435 passed (436)
   Start at  14:32:12
   Duration  178.44s (transform 391ms, setup 0ms, import 2.46s, tests 1766.63s, environment 4ms)

```

### custom: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.2 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (1249 file(s) checked).
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

### custom: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.2 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     319.31 KB
ESM dist/cli/index.js.map 607.62 KB
ESM ⚡️ Build success in 24ms
DTS Build start
DTS ⚡️ Build success in 1139ms
DTS dist/cli/index.d.ts 13.00 B
```

### custom: `npm run smoke:release`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.2 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.28.2
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-h8AytD/pack/agentloopkit-0.28.2.tgz
README has no stale exact version pins.
Public docs have no stale version pins or unsupported public claims.
Packed binary version smoke passed.
Packed init smoke passed.
Packed local-only init smoke passed.
Packed create-task path guard smoke passed.
Packed verify task path guard smoke passed.
Packed init symlink guard smoke passed.
Packed task archive symlink guard smoke passed.
Packed home-directory dry-run guard smoke passed.
Release smoke passed.
```

### custom: `node scripts/smoke-cli.mjs`

- Exit code: 0
- Status: pass


```text
CLI smoke for agentloopkit@0.28.2
Version smoke passed.
Missing config smoke passed.
Init dry-run smoke passed.
Init smoke passed.
Doctor smoke passed.
Create-task smoke passed.
Task lifecycle smoke passed.
Verify smoke passed.
Handoff smoke passed.
Check-gates smoke passed with status pass.
Ship smoke passed.
Review-context smoke passed.
Run ledger smoke passed.
Prepare-pr smoke passed.
Maintainer-check smoke passed with status warn.
Task done smoke passed.
Nested cwd smoke passed.
CLI smoke passed.
```

### custom: `node dist/cli/index.js artifacts --json`

- Exit code: 0
- Status: pass


```text
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
    "count": 251,
    "latest": {
      "path": ".agentloop/reports/2026-06-12-14-31-verification-report.md",
      "title": "Verification Report",
      "overallStatus": "pass"
    }
  },
  "handoffs": {
    "count": 245,
    "latest": {
      "path": ".agentloop/handoffs/2026-06-12-14-24-pr-summary.md",
      "title": "PR Summary"
    }
  },
  "htmlReports": {
    "count": 6,
    "latest": {
      "path": ".agentloop/reports/2026-06-10-02-07-agentloop-report.html"
    }
  },
  "badges": {
    "count": 2,
    "latest": {
      "path": ".agentloop/reports/agentloop-verification.svg"
    }
  },
  "ciSummaries": {
    "count": 2,
    "latest": {
      "path": ".agentloop/reports/2026-06-10-03-51-ci-summary.md",
      "title": "AgentLoopKit CI Summary"
    }
  },
  "releaseNotes": {
    "count": 4,
    "latest": {
      "path": ".agentloop/handoffs/2026-06-12-12-35-release-notes.md",
      "title": "Release Notes"
    }
  }
}
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
AgentLoopKit: task="Prepare 0.28.2 patch release" status="in-progress"; verification=pass; run="verify pass"; tree=dirty (26); next="agentloop handoff"
Reason: Task and verification evidence exist, and the working tree has changes.

## review evidence gates
$ npx --no-install tsx src/cli/index.ts check-gates --redact-paths --strict
# AgentLoopKit Gates

- Overall status: `pass`
- Strict mode: `enabled (warnings fail)`
- Git: `main` @ `fbf9f21`
- Git root: `[git-root]`
- Git target: `root directory`
- Changed files: `26`

## Gates

- [`pass`] `Task contract`: `Prepare 0.28.2 patch release` - `.agentloop/tasks/2026-06-12-prepare-0-28-2-patch-release.md`
- [`pass`] `Verification report`: `Overall status: pass` - `.agentloop/reports/2026-06-12-14-31-verification-report.md`
- [`pass`] `Handoff summary`: `Reviewer handoff found.` - `.agentloop/handoffs/2026-06-12-14-24-pr-summary.md`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `26 changed file(s) detected.`
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
    "count": 251,
    "latest": {
      "path": ".agentloop/reports/2026-06-12-14-31-verification-report.md",
      "title": "Verification Report",
      "overallStatus": "pass"
    }
  },
  "handoffs": {
    "count": 245,
    "latest": {
      "path": ".agentloop

[output truncated: showing first 2500 and last 2500 characters of 17445 total]

ask-only verification shortcut",
        "status": "in-progress"
      },
      "score": 96,
      "changedFileCount": 14,
      "verificationReportPath": ".agentloop/reports/2026-06-12-14-20-verification-report.md",
      "shipReportPath": ".agentloop/reports/2026-06-12-14-24-ship-report.md",
      "handoffPath": ".agentloop/handoffs/2026-06-12-14-24-pr-summary.md"
    },
    {
      "id": "2026-06-12-14-22-verify",
      "command": "verify",
      "createdAt": "2026-06-12-14-22",
      "task": {
        "path": ".agentloop/tasks/2026-06-12-add-task-only-verification-shortcut.md",
        "title": "Add task-only verification shortcut",
        "status": "in-progress"
      },
      "overallStatus": "pass",
      "changedFileCount": 9,
      "verificationReportPath": ".agentloop/reports/2026-06-12-14-20-verification-report.md"
    },
    {
      "id": "2026-06-12-14-19-verify",
      "command": "verify",
      "createdAt": "2026-06-12-14-19",
      "task": {
        "path": ".agentloop/tasks/2026-06-12-add-task-only-verification-shortcut.md",
        "title": "Add task-only verification shortcut",
        "status": "in-progress"
      },
      "overallStatus": "pass",
      "changedFileCount": 7,
      "verificationReportPath": ".agentloop/reports/2026-06-12-14-16-verification-report.md"
    },
    {
      "id": "2026-06-12-13-51-ship",
      "command": "ship",
      "createdAt": "2026-06-12-13-51",
      "task": {
        "path": ".agentloop/tasks/2026-06-12-accept-archived-task-evidence-in-gates.md",
        "title": "Accept archived task evidence in gates",
        "status": "in-progress"
      },
      "score": 92,
      "changedFileCount": 27,
      "verificationReportPath": ".agentloop/reports/2026-06-12-13-48-verification-report.md",
      "shipReportPath": ".agentloop/reports/2026-06-12-13-51-ship-report.md",
      "handoffPath": ".agentloop/handoffs/2026-06-12-13-51-pr-summary.md"
    }
  ],
  "latestShip": {
    "id": "2026-06-12-14-24-ship",
    "score": 96,
    "shipReportPath": ".agentloop/reports/2026-06-12-14-24-ship-report.md"
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

### custom: `npm publish --access public --dry-run`

- Exit code: 1
- Status: fail


```text

> agentloopkit@0.28.2 prepublishOnly
> node scripts/prepublish-check.mjs && npm run typecheck && npm test && npm run build

Prepublish metadata check passed.

> agentloopkit@0.28.2 typecheck
> tsc --noEmit


> agentloopkit@0.28.2 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit

 ❯ tests/distribution-artifacts.test.ts (10 tests | 1 failed) 10ms
     × MCP Registry metadata matches the npm package marker 5ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/distribution-artifacts.test.ts > distribution artifacts > MCP Registry metadata matches the npm package marker
AssertionError: expected [ { registryType: 'npm', …(3) } ] to deeply equal [ { registryType: 'npm', …(3) } ]

- Expected
+ Received

@@ -3,8 +3,8 @@
      "identifier": "agentloopkit",
      "registryType": "npm",
      "transport": {
        "type": "stdio",
      },
-     "version": "0.28.2",
+     "version": "0.28.1",
    },
  ]

 ❯ tests/distribution-artifacts.test.ts:11:33
      9|     expect(packageJson.mcpName).toBe('io.github.abhiyoheswaran1/agentl…
     10|     expect(serverJson.name).toBe(packageJson.mcpName);
     11|     expect(serverJson.packages).toEqual([
       |                                 ^
     12|       {
     13|         registryType: 'npm',

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 50 passed (51)
      Tests  1 failed | 435 passed (436)
   Start at  14:37:34
   Duration  184.16s (transform 453ms, setup 0ms, import 2.59s, tests 1872.28s, environment 3ms)

npm error code 1
npm error path /Users/abhyoh/local dev folder/Apps/AgentLoopKit
npm error command failed
npm error command sh -c node scripts/prepublish-check.mjs && npm run typecheck && npm test && npm run build
npm error A complete log of this run can be found in: /Users/abhyoh/.npm/_logs/2026-06-12T12_37_25_598Z-debug-0.log
```

### custom: `npm pack --pack-destination /tmp --silent`

- Exit code: 0
- Status: pass


```text
agentloopkit-0.28.2.tgz
```

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Fix failing commands before claiming completion.
