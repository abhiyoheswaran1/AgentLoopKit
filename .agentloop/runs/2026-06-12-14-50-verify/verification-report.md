# Verification Report

- Timestamp: `2026-06-12T12:42:07.778Z`
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

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.2 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  51 passed (51)
      Tests  436 passed (436)
   Start at  14:42:21
   Duration  159.78s (transform 391ms, setup 0ms, import 2.38s, tests 1619.21s, environment 3ms)

```

### custom: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.2 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (1252 file(s) checked).
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
ESM ⚡️ Build success in 26ms
DTS Build start
DTS ⚡️ Build success in 837ms
DTS dist/cli/index.d.ts 13.00 B
```

### custom: `npm run smoke:release`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.2 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.28.2
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-dpunLJ/pack/agentloopkit-0.28.2.tgz
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
    "count": 252,
    "latest": {
      "path": ".agentloop/reports/2026-06-12-14-41-verification-report.md",
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
AgentLoopKit: task="Prepare 0.28.2 patch release" status="in-progress"; verification=pass; run="verify pass"; tree=dirty (30); next="agentloop handoff"
Reason: Task and verification evidence exist, and the working tree has changes.

## review evidence gates
$ npx --no-install tsx src/cli/index.ts check-gates --redact-paths --strict
# AgentLoopKit Gates

- Overall status: `pass`
- Strict mode: `enabled (warnings fail)`
- Git: `main` @ `fbf9f21`
- Git root: `[git-root]`
- Git target: `root directory`
- Changed files: `30`

## Gates

- [`pass`] `Task contract`: `Prepare 0.28.2 patch release` - `.agentloop/tasks/2026-06-12-prepare-0-28-2-patch-release.md`
- [`pass`] `Verification report`: `Overall status: pass` - `.agentloop/reports/2026-06-12-14-41-verification-report.md`
- [`pass`] `Handoff summary`: `Reviewer handoff found.` - `.agentloop/handoffs/2026-06-12-14-24-pr-summary.md`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `30 changed file(s) detected.`
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
    "count": 252,
    "latest": {
      "path": ".agentloop/reports/2026-06-12-14-41-verification-report.md",
      "title": "Verification Report",
      "overallStatus": "pass"
    }
  },
  "handoffs": {
    "count": 245,
    "latest": {
      "path": ".agentloop

[output truncated: showing first 2500 and last 2500 characters of 17695 total]

"verify",
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
    },
    {
      "id": "2026-06-12-14-24-ship",
      "command": "ship",
      "createdAt": "2026-06-12-14-24",
      "task": {
        "path": ".agentloop/tasks/2026-06-12-add-task-only-verification-shortcut.md",
        "title": "Add task-only verification shortcut",
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

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.2 prepublishOnly
> node scripts/prepublish-check.mjs && npm run typecheck && npm test && npm run build

Prepublish metadata check passed.

> agentloopkit@0.28.2 typecheck
> tsc --noEmit


> agentloopkit@0.28.2 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  51 passed (51)
      Tests  436 passed (436)
   Start at  14:47:19
   Duration  198.45s (transform 397ms, setup 0ms, import 2.36s, tests 1988.96s, environment 3ms)


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
ESM ⚡️ Build success in 26ms
DTS Build start
DTS ⚡️ Build success in 875ms
DTS dist/cli/index.d.ts 13.00 B
npm notice
npm notice 📦  agentloopkit@0.28.2
npm notice Tarball Contents
npm notice 1.1kB LICENSE
npm notice 14.2kB README.md
npm notice 13B dist/cli/index.d.ts
npm notice 327.0kB dist/cli/index.js
npm notice 622.2kB dist/cli/index.js.map
npm notice 4.6kB dist/schema/agentloop.config.schema.json
npm notice 1.2kB dist/templates/agents/claude-code.md
npm notice 1.3kB dist/templates/agents/codex.md
npm notice 1.1kB dist/templates/agents/cursor.md
npm notice 1.2kB dist/templates/agents/gemini-cli.md
npm notice 1.1kB dist/templates/agents/generic.md
npm notice 1.1kB dist/templates/agents/github-copilot-cli.md
npm notice 1.1kB dist/templates/agents/opencode.md
npm notice 457B dist/templates/gates/dependency-gate.md
npm notice 472B dist/templates/gates/docs-gate.md
npm notice 621B dist/templates/gates/implementation-gate.md
npm notice 440B dist/templates/gates/regression-gate.md
npm notice 470B dist/templates/gates/review-gate.md
npm notice 502B dist/templates/gates/security-gate.md
npm notice 513B dist/templates/gates/test-gate.md
npm notice 120B dist/templates/handoffs/decision-log.md
npm notice 387B dist/templates/handoffs/pr-summary.md
npm notice 133B dist/templates/handoffs/release-notes.md
npm notice 155B dist/templates/handoffs/reviewer-brief.md
npm notice 94B dist/templates/handoffs/rollback-plan.md
npm notice 135B dist/templates/handoffs/verification-report.md
npm notice 614B dist/templates/harness/autonomous-work-rules.md
npm notice 5.7kB dist/templates/harness/commands.md
npm notice 446B dist/templates/harness/definition-of-done.md
npm notice 260B dist/templates/harness/release-checklist.md
npm notice 493B dist/templates/harness/repo-map.md
npm notice 375B dist/templates/harness/review-checklist.md
npm notice 333B dist/templates/harness/working-agreement.md
npm notice 720B dist/templates/loops/bugfix.md
npm notice 646B dist/templates/loops/dependency-upgrade.md
npm notice 648B dist/templates/loops/docs.md
npm notice 865B dist/templates/loops/feature.md
npm notice 674B dist/templates/loops/migration.md
npm notice 748B dist/templates/loops/refactor.md
npm notice 620B dist/templates/loops/release.md
npm notice 688B dist/templates/loops/security-review.md
npm notice 668B dist/templates/loops/test-generation.md
npm notice 308B dist/templates/policies/database-change-policy.md
npm notice 315B dist/templates/policies/dependency-change-policy.md
npm notice 243B dist/templates/policies/git-policy.md
npm notice 478B dist/templates/policies/no-destructive-actions.md
npm notice 325B dist/templates/policies/public-api-change-policy.md
npm notice 275B dist/templates/policies/secrets-policy.md
npm notice 314B dist/templates/policies/security-policy.md
npm notice 255B dist/templates/policies/ui-change-policy.md
npm notice 5.8kB dist/templates/root/agentloop-directory-readme.md
npm notice 917B dist/templates/root/agentloop.config.json
npm notice 4.2kB dist/templates/root/AGENTLOOP.md
npm notice 5.2kB dist/templates/root/AGENTS.md
npm notice 2.8kB dist/templates/tasks/README.md
npm notice 2.2kB package.json
npm notice 4.6kB schema/agentloop.config.schema.json
npm notice 563B server.json
npm notice Tarball Details
npm notice name: agentloopkit
npm notice version: 0.28.2
npm notice filename: agentloopkit-0.28.2.tgz
npm notice package size: 214.6 kB
npm notice unpacked size: 1.0 MB
npm notice shasum: ce0fd67ecc407045d45357e4cd77bfee10098698
npm notice integrity: sha512-fYt0nBKZNdfpY[...]L63UxAds9GooQ==
npm notice total files: 58
npm notice
npm notice Publishing to https://registry.npmjs.org/ with tag latest and public access (dry-run)
+ agentloopkit@0.28.2
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
- Review the diff and prepare a handoff summary.
