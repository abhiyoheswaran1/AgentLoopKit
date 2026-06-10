# Verification Report

- Timestamp: 2026-06-10T19:13:50.158Z
- Repo: AgentLoopKit
- Git branch: main
- Git commit: 2bc5b2b
- Working tree: dirty
- Overall status: pass


## Task Context
- Path: .agentloop/tasks/2026-06-10-add-task-doctor-diagnostics.md
- Title: Add task doctor diagnostics
- Task type: feature
- Status: in-progress



## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.26.5 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  33 passed (33)
      Tests  154 passed (154)
   Start at  21:13:51
   Duration  12.23s (transform 983ms, setup 0ms, import 5.06s, tests 93.94s, environment 7ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.26.5 lint /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.26.5 typecheck /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.26.5 build /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     158.85 KB
ESM dist/cli/index.js.map 301.07 KB
ESM ⚡️ Build success in 17ms
DTS Build start
DTS ⚡️ Build success in 693ms
DTS dist/cli/index.d.ts 13.00 B
```

### custom: `npx pnpm@10.12.1 check:links`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.26.5 check:links /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsx scripts/check-markdown-links.ts

Markdown links OK (636 file(s) checked).
```

### custom: `npx --yes projscan doctor --format markdown`

- Exit code: 0
- Status: pass

```text
# Project Health Report

**Health Score: A (97/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

Found **1** issue(s).

- ℹ️ **Unused exports in scripts/smoke-packed-release.mjs** - 4 named exports (assertReadmePins, createSmokeSteps, runReleaseSmoke, isDirectRun) but nothing in the project imports this file. Dead code or awaiting wiring?
```

### custom: `node dist/cli/index.js task doctor --json`

- Exit code: 0
- Status: pass

```text
{
  "taskDoctor": {
    "overallStatus": "warn",
    "counts": {
      "checked": 119,
      "diagnostics": 103,
      "terminalTasks": 103,
      "missingStatuses": 0,
      "unsupportedStatuses": 18
    },
    "diagnostics": [
      {
        "id": "legacy-task-status",
        "severity": "warn",
        "path": ".agentloop/tasks/2026-06-09-add-create-task-area-flags.md",
        "title": "Add create-task area flags",
        "status": "completed",
        "message": "Task contract uses legacy terminal status \"completed\".",
        "recommendation": "Run `agentloop task status .agentloop/tasks/2026-06-09-add-create-task-area-flags.md done`, then archive it after verification and handoff."
      },
      {
        "id": "legacy-task-status",
        "severity": "warn",
        "path": ".agentloop/tasks/2026-06-09-add-handoff-command-alias.md",
        "title": "Add handoff command alias",
        "status": "completed",
        "message": "Task contract uses legacy terminal status \"completed\".",
        "recommendation": "Run `agentloop task status .agentloop/tasks/2026-06-09-add-handoff-command-alias.md done`, then archive it after verification and handoff."
      },
      {
        "id": "legacy-task-status",
        "severity": "warn",
        "path": ".agentloop/tasks/2026-06-09-add-monorepo-doctor-awareness.md",
        "title": "Add monorepo doctor awareness",
        "status": "completed",
        "message": "Task contract uses legacy terminal status \"completed\".",
        "recommendation": "Run `agentloop task status .agentloop/tasks/2026-06-09-add-monorepo-doctor-awareness.md done`, then archive it after verification and handoff."
      },
      {
        "id": "legacy-task-status",
        "severity": "warn",
        "path": ".agentloop/tasks/2026-06-09-add-status-command.md",
        "title": "Add status command",
        "status": "verified",
        "message": "Task contract uses legacy terminal status \"verified\".",
        "recommendation": "Run `agentloop task status .agentloop/tasks/2026-06-09-add-status-command.md done`, then archive it after verification and handoff."
      },
      {
        "id": "legacy-task-status",
        "severity": "warn",
        "path": ".agentloop/tasks/2026-06-09-add-task-list-command.md",
        "title": "Add task list command",
        "status": "verified",
        "message": "Task contract uses legacy terminal status \"verified\".",
        "recommendation": "Run `agentloop task status .agentloop/

[output truncated: showing first 2500 and last 2500 characters of 50472 total]

-refresh-readme-visuals-task-context.md` after verification and handoff."
      },
      {
        "id": "terminal-task-in-active-folder",
        "severity": "warn",
        "path": ".agentloop/tasks/2026-06-10-refresh-roadmap-v0-23-0.md",
        "title": "Refresh roadmap for v0.23.0",
        "status": "done",
        "message": "Terminal task contract is still in the active task folder.",
        "recommendation": "Run `agentloop task archive .agentloop/tasks/2026-06-10-refresh-roadmap-v0-23-0.md` after verification and handoff."
      },
      {
        "id": "terminal-task-in-active-folder",
        "severity": "warn",
        "path": ".agentloop/tasks/2026-06-10-release-0-26-2-cleanup-patch.md",
        "title": "Release 0.26.2 cleanup patch",
        "status": "done",
        "message": "Terminal task contract is still in the active task folder.",
        "recommendation": "Run `agentloop task archive .agentloop/tasks/2026-06-10-release-0-26-2-cleanup-patch.md` after verification and handoff."
      },
      {
        "id": "terminal-task-in-active-folder",
        "severity": "warn",
        "path": ".agentloop/tasks/2026-06-10-remove-homebrew-tap-channel.md",
        "title": "Remove Homebrew tap channel",
        "status": "done",
        "message": "Terminal task contract is still in the active task folder.",
        "recommendation": "Run `agentloop task archive .agentloop/tasks/2026-06-10-remove-homebrew-tap-channel.md` after verification and handoff."
      },
      {
        "id": "terminal-task-in-active-folder",
        "severity": "warn",
        "path": ".agentloop/tasks/2026-06-10-run-big-bug-pass.md",
        "title": "Run big bug pass",
        "status": "done",
        "message": "Terminal task contract is still in the active task folder.",
        "recommendation": "Run `agentloop task archive .agentloop/tasks/2026-06-10-run-big-bug-pass.md` after verification and handoff."
      },
      {
        "id": "terminal-task-in-active-folder",
        "severity": "warn",
        "path": ".agentloop/tasks/2026-06-10-skip-unreadable-directories-during-project-detection.md",
        "title": "Skip unreadable directories during project detection",
        "status": "done",
        "message": "Terminal task contract is still in the active task folder.",
        "recommendation": "Run `agentloop task archive .agentloop/tasks/2026-06-10-skip-unreadable-directories-during-project-detection.md` after verification and handoff."
      }
    ]
  }
}
```

## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
