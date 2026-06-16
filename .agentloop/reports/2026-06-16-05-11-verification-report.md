# Verification Report

- Timestamp: `2026-06-16T03:11:21.862Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `485e7dd`
- Working tree: `dirty`
- Overall status: fail


## Task Context
- Path: `.agentloop/tasks/2026-06-16-make-install-agent-output-markdown-safe.md`
- Title: `Make install-agent output Markdown-safe`
- Task type: `bugfix`
- Status: `in-progress`




## Failure Summary
### task: `npm run dogfood:strict`

- Exit code: 1

```text
- [`pass`] `Task contract`: `Make install-agent output Markdown-safe` - `.agentloop/tasks/2026-06-16-make-install-agent-output-markdown-safe.md`
- [`fail`] `Verification report`: `Latest verification report predates the current task. Rerun verification.` - `.agentloop/reports/2026-06-16-04-53-verification-report.md`
- [`warn`] `Handoff summary`: `Latest handoff does not cover the current dirty files.` - `.agentloop/handoffs/2026-06-16-04-58-pr-summary-2.md`
- [`warn`] `Task hygiene`: ``Task folder has 2 hygiene diagnostics. Run `agentloop task doctor` for cleanup details.``
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `6 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
## Next Action
Run `agentloop verify --task .agentloop/tasks/2026-06-16-make-install-agent-output-markdown-safe.md`.
Run verification and fix failures before review.
Dogfood gate failed: review evidence gates failed with exit code 1
```


## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  62 passed (62)
      Tests  620 passed (620)
   Start at  05:11:23
   Duration  75.13s (transform 2.36s, setup 0ms, import 11.22s, tests 770.83s, environment 9ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 lint /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 typecheck /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 build /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     428.47 KB
ESM dist/cli/index.js.map 807.47 KB
ESM ⚡️ Build success in 34ms
DTS Build start
DTS ⚡️ Build success in 896ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/agent-installation.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 test
> vitest run tests/agent-installation.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  05:12:48
   Duration  4.26s (transform 57ms, setup 0ms, import 102ms, tests 4.04s, environment 0ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 typecheck
> tsc --noEmit

```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 lint
> eslint .

```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     428.47 KB
ESM dist/cli/index.js.map 807.47 KB
ESM ⚡️ Build success in 60ms
DTS Build start
DTS ⚡️ Build success in 1194ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm run dogfood:strict`

- Exit code: 1
- Status: fail


```text

> agentloopkit@0.33.0 dogfood:strict
> node scripts/dogfood.mjs --strict

# AgentLoopKit Dogfood Gate
Mode: strict

## task folder hygiene
$ npx --no-install tsx src/cli/index.ts task doctor --json
{
  "taskDoctor": {
    "overallStatus": "warn",
    "counts": {
      "checked": 2,
      "diagnostics": 2,
      "terminalTasks": 0,
      "missingStatuses": 0,
      "unsupportedStatuses": 0
    },
    "diagnostics": [
      {
        "id": "placeholder-task-section",
        "severity": "warn",
        "path": ".agentloop/tasks/2026-06-16-make-install-agent-output-markdown-safe.md",
        "title": "Make install-agent output Markdown-safe",
        "status": "in-progress",
        "message": "Task contract still contains placeholder guidance in review-critical section(s).",
        "recommendation": "Replace placeholder section(s) with task-specific scope, acceptance, verification, and rollback evidence before implementation continues.",
        "sections": [
          "Likely Files or Areas",
          "Rollback Notes"
        ]
      },
      {
        "id": "post-verification-gate-in-verification-commands",
        "severity": "warn",
        "path": ".agentloop/tasks/2026-06-16-make-install-agent-output-markdown-safe.md",
        "title": "Make install-agent output Markdown-safe",
        "status": "in-progress",
        "message": "Task contract records likely post-verification gate command(s) under Verification Commands.",
        "recommendation": "Move the listed command(s) from Verification Commands to Post-Verification Gates.",
        "commands": [
          "npm run dogfood:strict"
        ]
      }
    ]
  }
}

## current loop status
$ npx --no-install tsx src/cli/index.ts status --brief --redact-paths
AgentLoopKit: task="Make install-agent output Markdown-safe" status="in-progress"; verification=missing; run="ship 92/100"; tree=dirty (6); next="agentloop verify"
Reason: A task exists, but no verification report was found.

## public docs hygiene
$ node scripts/public-docs-hygiene.mjs
# AgentLoopKit Public Docs Hygiene
Version: 0.33.0
Public docs checked: 73
Repo harness files checked: 2
Public docs hygiene passed.

## dependency audit
$ npx --yes pnpm@10.12.1 audit --audit-level high
No known vulnerabilities found

## harness upgrade audit
$ npx --no-install tsx src/cli/index.ts upgrade-harness --json --redact-paths
{
  "status": "pass",
  "dryRun": false,
  "writesFiles": false,
  "targetDirectory": "[agentloop-root]",
  "manifest": {
    "p

[output truncated: showing first 2500 and last 2500 characters of 5437 total]

   },
    {
      "path": "AGENTLOOP.md",
      "exists": true,
      "status": "current",
      "presentTopics": [
        "ship",
        "prepare-pr",
        "run-ledger",
        "maintainer-check",
        "review-context",
        "upgrade-safety"
      ],
      "missingTopics": []
    },
    {
      "path": ".agentloop/harness/commands.md",
      "exists": true,
      "status": "current",
      "presentTopics": [
        "ship",
        "prepare-pr",
        "run-ledger",
        "maintainer-check",
        "review-context",
        "upgrade-safety"
      ],
      "missingTopics": []
    },
    {
      "path": ".agentloop/README.md",
      "exists": true,
      "status": "current",
      "presentTopics": [
        "ship",
        "prepare-pr",
        "run-ledger",
        "maintainer-check",
        "review-context",
        "upgrade-safety"
      ],
      "missingTopics": []
    }
  ],
  "suggestions": [],
  "nextSteps": [
    "Run `agentloop upgrade-harness` after updating the CLI to inspect existing harness guidance.",
    "Harness guidance already mentions the current review-readiness loop."
  ]
}

## review evidence gates
$ npx --no-install tsx src/cli/index.ts check-gates --redact-paths --strict
# AgentLoopKit Gates

- Overall status: `fail`
- Strict mode: `enabled (warnings fail)`
- Git: `main` @ `485e7dd`
- Git root: `[git-root]`
- Git target: `root directory`
- Changed files: `6`

## Gates

- [`pass`] `Task contract`: `Make install-agent output Markdown-safe` - `.agentloop/tasks/2026-06-16-make-install-agent-output-markdown-safe.md`
- [`fail`] `Verification report`: `Latest verification report predates the current task. Rerun verification.` - `.agentloop/reports/2026-06-16-04-53-verification-report.md`
- [`warn`] `Handoff summary`: `Latest handoff does not cover the current dirty files.` - `.agentloop/handoffs/2026-06-16-04-58-pr-summary-2.md`
- [`warn`] `Task hygiene`: ``Task folder has 2 hygiene diagnostics. Run `agentloop task doctor` for cleanup details.``
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `6 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`

## Next Action

Run `agentloop verify --task .agentloop/tasks/2026-06-16-make-install-agent-output-markdown-safe.md`.

Run verification and fix failures before review.


Dogfood gate failed: review evidence gates failed with exit code 1
```

## Not Run
- Nothing skipped.

## Recommended Next Actions
- Fix failing commands before claiming completion.
