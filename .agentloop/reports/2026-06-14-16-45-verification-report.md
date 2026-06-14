# Verification Report

- Timestamp: `2026-06-14T14:45:13.001Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `fb1e747`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-14-improve-roadmap-adoption-evidence.md`
- Title: `Improve roadmap adoption evidence`
- Task type: `feature`
- Status: `in-progress`





## Commands Run
### task: `npm run test:unit`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.32.1 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/roadmap-channels.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  18 passed (18)
      Tests  73 passed (73)
   Start at  16:45:16
   Duration  8.27s (transform 111ms, setup 0ms, import 459ms, tests 21.48s, environment 1ms)

```

### task: `npm run test:integration`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.32.1 test:integration
> vitest run tests/doctor.test.ts tests/upgrade-harness.test.ts tests/init.test.ts tests/create-task.test.ts tests/verification.test.ts tests/ship.test.ts tests/prepare-pr.test.ts tests/maintainer-check.test.ts tests/release-check.test.ts tests/dogfood-script.test.ts tests/release-smoke.test.ts tests/published-smoke-script.test.ts tests/mcp-server.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  13 passed (13)
      Tests  178 passed (178)
   Start at  16:45:28
   Duration  127.86s (transform 203ms, setup 0ms, import 849ms, tests 658.43s, environment 1ms)

```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.32.1 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.32.1
Public docs checked: 71
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.32.1 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (1835 file(s) checked).
```

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
