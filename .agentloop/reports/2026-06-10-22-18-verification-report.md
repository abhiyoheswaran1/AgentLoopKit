# Verification Report

- Timestamp: 2026-06-10T20:18:52.738Z
- Repo: AgentLoopKit
- Git branch: main
- Git commit: 2010989
- Working tree: dirty
- Overall status: pass


## Task Context
- Path: .agentloop/tasks/archive/2026-06-10-archive-completed-task-contracts.md
- Title: Archive completed task contracts
- Task type: docs
- Status: done



## Commands Run
### custom: `node -e "const fs=require('fs'); const files=fs.readdirSync('.agentloop/tasks').filter(f=>f.endsWith('.md')&&f!=='README.md').sort(); const expected=['2026-06-10-add-scoop-winget-manifests.md','2026-06-10-explore-vscode-open-vsx-extension.md']; if(JSON.stringify(files)!==JSON.stringify(expected)){console.error(files.join('\n')); process.exit(1)} console.log(files.join('\n'));"`

- Exit code: 0
- Status: pass

```text
2026-06-10-add-scoop-winget-manifests.md
2026-06-10-explore-vscode-open-vsx-extension.md
```

### custom: `node dist/cli/index.js task doctor --json`

- Exit code: 0
- Status: pass

```text
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
```

### custom: `node dist/cli/index.js status --json`

- Exit code: 0
- Status: pass

```text
{
  "project": {
    "name": "agentloopkit",
    "type": "typescript-package",
    "packageManager": "pnpm"
  },
  "git": {
    "isRepository": true,
    "branch": "main",
    "commit": "2010989"
  },
  "workingTree": {
    "dirty": true,
    "changedFileCount": 209,
    "changedFiles": [
      {
        "status": "M",
        "path": ".agentloop/dogfood-log.md"
      },
      {
        "status": "D",
        "path": ".agentloop/tasks/2026-06-09-add-check-gates-command.md"
      },
      {
        "status": "D",
        "path": ".agentloop/tasks/2026-06-09-add-check-gates-strict-mode.md"
      },
      {
        "status": "D",
        "path": ".agentloop/tasks/2026-06-09-add-ci-context-to-verification-reports.md"
      },
      {
        "status": "D",
        "path": ".agentloop/tasks/2026-06-09-add-create-task-area-flags.md"
      },
      {
        "status": "D",
        "path": ".agentloop/tasks/2026-06-09-add-create-task-json-output.md"
      },
      {
        "status": "D",
        "path": ".agentloop/tasks/2026-06-09-add-github-actions-ci-recipes.md"
      },
      {
        "status": "D",
        "path": ".agentloop/tasks/2026-06-09-add-handoff-command-alias.md"
      },
      {
        "status": "D",
        "path": ".agentloop/tasks/2026-06-09-add-monorepo-doctor-awareness.md"
      },
      {
        "status": "D",
        "path": ".agentloop/tasks/2026-06-09-add-shell-completions.md"
      },
      {
        "status": "D",
        "path": ".agentloop/tasks/2026-06-09-add-stack-specific-starter-recipes.md"
      },
      {
        "status": "D",
        "path": ".agentloop/tasks/2026-06-09-add-status-command.md"
      },
      {
        "status": "D",
        "path": ".agentloop/tasks/2026-06-09-add-task-archive-command.md"
      },
      {
        "status": "D",
        "path": ".agentloop/tasks/2026-06-09-add-task-list-command.md"
      },
      {
        "status": "D",
        "path": ".agentloop/tasks/2026-06-09-add-task-show-command.md"
      },
      {
        "status": "D",
        "path": ".agentloop/tasks/2026-06-09-add-task-status-transitions.md"
      },
      {
        "status": "D",
        "path": ".agentloop/tasks/2026-06-09-ask-for-agentloopkit-evidence-in-github-templates.md"
      },
      {
        "status": "D",
        "path": ".agentloop/tasks/2026-06-09-document-0-10-0-release-status.md"
      },
      {
        "status": "D",
        "path": ".agentloop/tasks/2026-06-09-document-0-11-0-release-status.md"
      },
      {

[output truncated: showing first 2500 and last 2500 characters of 27349 total]


        "path": ".agentloop/tasks/archive/2026-06-10-record-v0-21-0-release-status.md"
      },
      {
        "status": "??",
        "path": ".agentloop/tasks/archive/2026-06-10-record-v0-22-0-release-status.md"
      },
      {
        "status": "??",
        "path": ".agentloop/tasks/archive/2026-06-10-record-v0-23-0-release-status.md"
      },
      {
        "status": "??",
        "path": ".agentloop/tasks/archive/2026-06-10-refresh-final-handoff-v0-22-0.md"
      },
      {
        "status": "??",
        "path": ".agentloop/tasks/archive/2026-06-10-refresh-public-roadmap-after-0-15-1.md"
      },
      {
        "status": "??",
        "path": ".agentloop/tasks/archive/2026-06-10-refresh-readme-vhs-demo.md"
      },
      {
        "status": "??",
        "path": ".agentloop/tasks/archive/2026-06-10-refresh-readme-visuals-task-context.md"
      },
      {
        "status": "??",
        "path": ".agentloop/tasks/archive/2026-06-10-refresh-roadmap-v0-23-0.md"
      },
      {
        "status": "??",
        "path": ".agentloop/tasks/archive/2026-06-10-release-0-26-2-cleanup-patch.md"
      },
      {
        "status": "??",
        "path": ".agentloop/tasks/archive/2026-06-10-remove-homebrew-tap-channel.md"
      },
      {
        "status": "??",
        "path": ".agentloop/tasks/archive/2026-06-10-run-big-bug-pass.md"
      },
      {
        "status": "??",
        "path": ".agentloop/tasks/archive/2026-06-10-skip-unreadable-directories-during-project-detection.md"
      }
    ]
  },
  "activeTask": null,
  "latestTask": null,
  "latestReport": {
    "path": ".agentloop/reports/2026-06-10-22-12-verification-report.md",
    "title": "Verification Report",
    "overallStatus": "pass"
  },
  "commands": {
    "configured": [
      "test",
      "lint",
      "typecheck",
      "build",
      "format"
    ],
    "missing": []
  },
  "nextAction": {
    "command": "agentloop create-task",
    "reason": "No task contract was found."
  },
  "markdown": "# AgentLoopKit Status\n\n- Project: agentloopkit (typescript-package)\n- Package manager: pnpm\n- Git: main @ 2010989\n- Working tree: dirty (209 changed file(s))\n- Active task: No task contract found.\n- Latest open task: No open task found.\n- Latest verification: pass - .agentloop/reports/2026-06-10-22-12-verification-report.md\n- Configured commands: test, lint, typecheck, build, format\n- Missing commands: none\n\n## Next Action\n\nRun `agentloop create-task`.\n\nNo task contract was found.\n"
}
```

### custom: `npx pnpm@10.12.1 check:links`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 check:links /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsx scripts/check-markdown-links.ts

Markdown links OK (652 file(s) checked).
```

### custom: `git diff --check`

- Exit code: 0
- Status: pass

```text
(no output)
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

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
