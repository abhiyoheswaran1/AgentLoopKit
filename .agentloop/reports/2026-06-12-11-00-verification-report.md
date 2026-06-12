# Verification Report

- Timestamp: `2026-06-12T09:00:02.732Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `5c24bf6`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-12-release-agentloopkit-0-28-0.md`
- Title: `Release AgentLoopKit 0.28.0`
- Task type: `release`
- Status: `in-progress`




## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  48 passed (48)
      Tests  415 passed (415)
   Start at  11:00:08
   Duration  151.75s (transform 349ms, setup 0ms, import 2.20s, tests 1493.25s, environment 3ms)

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
ESM ⚡️ Build success in 23ms
DTS Build start
DTS ⚡️ Build success in 834ms
DTS dist/cli/index.d.ts 13.00 B
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


 Test Files  48 passed (48)
      Tests  415 passed (415)
   Start at  11:03:16
   Duration  151.83s (transform 347ms, setup 0ms, import 2.18s, tests 1540.50s, environment 3ms)

```

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (1167 file(s) checked).
```

### task: `node scripts/prepublish-check.mjs`

- Exit code: 0
- Status: pass


```text
Prepublish metadata check passed.
```

### task: `git diff --check`

- Exit code: 0
- Status: pass


```text
(no output)
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
ESM ⚡️ Build success in 28ms
DTS Build start
DTS ⚡️ Build success in 915ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm run smoke:release`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.28.0
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-aoEjbL/pack/agentloopkit-0.28.0.tgz
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

### task: `node scripts/smoke-cli.mjs`

- Exit code: 0
- Status: pass


```text
CLI smoke for agentloopkit@0.28.0
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

### task: `node dist/cli/index.js artifacts --json`

- Exit code: 0
- Status: pass


```text
{
  "tasks": {
    "count": 23,
    "byStatus": {
      "deferred": 1,
      "in-progress": 1,
      "review": 21
    },
    "latest": {
      "path": ".agentloop/tasks/2026-06-12-release-agentloopkit-0-28-0.md",
      "title": "Release AgentLoopKit 0.28.0",
      "status": "in-progress"
    }
  },
  "verificationReports": {
    "count": 237,
    "latest": {
      "path": ".agentloop/reports/2026-06-12-10-29-verification-report.md",
      "title": "Verification Report",
      "overallStatus": "pass"
    }
  },
  "handoffs": {
    "count": 236,
    "latest": {
      "path": ".agentloop/handoffs/2026-06-12-10-34-pr-summary.md",
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
    "count": 3,
    "latest": {
      "path": ".agentloop/handoffs/2026-06-12-10-59-release-notes.md",
      "title": "AgentLoopKit v0.28.0"
    }
  }
}
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
