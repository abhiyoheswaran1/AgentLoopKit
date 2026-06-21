# Verification Report

- Timestamp: `2026-06-21T04:15:52.519Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `32aec524`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-21-show-review-area-counts-in-ship-scope-warnings.md`
- Title: `Show review-area counts in ship scope warnings`
- Task type: `feature`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/readiness-score.test.ts tests/ship.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.37.0 test
> vitest run tests/readiness-score.test.ts tests/ship.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  2 passed (2)
      Tests  23 passed (23)
   Start at  06:15:56
   Duration  128.32s (transform 127ms, setup 0ms, import 224ms, tests 127.72s, environment 0ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.37.0 typecheck
> tsc --noEmit

```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.37.0 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.37.0
Public docs checked: 74
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.37.0 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (4685 file(s) checked).
```

### task: `npx --no-install tsx src/cli/index.ts task doctor --redact-paths`

- Exit code: 0
- Status: pass


```text
# AgentLoopKit Task Doctor

Status: `pass`
Checked: `25`
Diagnostics: `0`

No task folder hygiene issues found.
```

### task: `npx --yes projscan doctor --format markdown`

- Exit code: 0
- Status: pass


```text
# Project Health Report

**Health Score: A (90/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

Found **1** issue(s).

- ⚠️ **Install lifecycle script present: prepublishOnly** - The package manifest defines "prepublishOnly": "node scripts/prepublish-check.mjs && npm run typecheck && npm test && npm run build". Install lifecycle scripts execute during dependency installation and are a common supply-chain execution path; verify this script before release or install.
```


## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
