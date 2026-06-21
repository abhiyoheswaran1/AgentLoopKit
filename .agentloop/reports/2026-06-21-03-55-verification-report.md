# Verification Report

- Timestamp: `2026-06-21T01:55:59.121Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `32aec524`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-21-add-readiness-score-tests-to-unit-guard.md`
- Title: `Add readiness-score tests to unit guard`
- Task type: `tests`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/package-scripts.test.ts tests/readiness-score.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.37.0 test
> vitest run tests/package-scripts.test.ts tests/readiness-score.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  2 passed (2)
      Tests  10 passed (10)
   Start at  03:56:03
   Duration  695ms (transform 27ms, setup 0ms, import 40ms, tests 8ms, environment 0ms)

```

### task: `npm run test:unit`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.37.0 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/github-action-runner.test.ts tests/release-proof.test.ts tests/readiness-score.test.ts tests/public-docs-hygiene.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/maintenance-check-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  25 passed (25)
      Tests  156 passed (156)
   Start at  03:56:09
   Duration  66.61s (transform 209ms, setup 0ms, import 669ms, tests 153.75s, environment 1ms)

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

Markdown links OK (4620 file(s) checked).
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

[![projscan health](https:[git-root]

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
