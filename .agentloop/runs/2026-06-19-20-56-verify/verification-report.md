# Verification Report

- Timestamp: `2026-06-19T18:46:28.403Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `3fbe6629`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-19-prepare-agentloopkit-0-36-2-release-2.md`
- Title: `Prepare AgentLoopKit 0.36.2 release`
- Task type: `release`
- Status: `in-progress`





## Commands Run
### custom: `node scripts/prepublish-check.mjs`

- Exit code: 0
- Status: pass


```text
Prepublish metadata check passed.
```

### custom: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.2 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.36.2
Public docs checked: 74
Repo harness files checked: 2
Public docs hygiene passed.
```

### custom: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.2 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (4429 file(s) checked).
```

### custom: `npx --yes projscan coupling --cycles-only`

- Exit code: 0
- Status: pass


```text

  ◆ ProjScan v4.8.0
  [config: .projscanrc.json]
- Computing coupling + cycles...

Coupling + Cycles
────────────────────────────────────────

  167 files in graph · 0 cycles

```

### custom: `npx pnpm@10.12.1 vitest run --reporter=verbose`

- Exit code: 0
- Status: pass


```text

 RUN  v4.1.8 [git-root]

 ✓ tests/task-state.test.ts > task state > sets, reads, and clears an active task path 6ms
 ✓ tests/task-state.test.ts > task state > rejects active task paths outside the configured task directory 2ms
 ✓ tests/task-state.test.ts > task state > lists task contracts with active task first 4ms
 ✓ tests/task-state.test.ts > task state > filters task list status in core inventory while preserving active ordering 3ms
 ✓ tests/task-state.test.ts > task state > classifies exact AgentFlight placeholder task contracts in task inventory 2ms
 ✓ tests/task-state.test.ts > task state > reads task contract content with metadata 1ms
 ✓ tests/task-state.test.ts > task state > updates only the status line in a task contract 4ms
 ✓ tests/task-state.test.ts > task state > accepts deferred as a parked task status 4ms
 ✓ tests/task-state.test.ts > task state > archives a task contract and clears active state when it was active 4ms
 ✓ tests/task-state.test.ts > task state > refuses to overwrite an archived task contract 2ms
 ✓ tests/task-state.test.ts > task state > rejects archive destinations that resolve outside the repo 2ms
 ✓ tests/task-state.test.ts > task state > rejects unsupported task statuses 1ms
 ✓ tests/task-state.test.ts > task state > rejects task contract reads outside the configured task directory 1ms
 ✓ tests/task-state.test.ts > task state > rejects task lifecycle paths that traverse a symlinked task subdirectory 2ms
 ✓ tests/task-state.test.ts > task state > ignores active task state that points through a symlinked task subdirectory 2ms
 ✓ tests/task-state.test.ts > task state > rejects active task state writes when the state directory resolves outside the repo 2ms
 ✓ tests/task-state.test.ts > task state > ignores active task state when state.json resolves outside the repo 2ms
 ✓ tests/task-state.test.ts > task state > task doctor warns when active state points to a missing task 4ms
 ✓ tests/task-state.test.ts > task state > task doctor warns when active state points to an archived task 9ms
 ✓ tests/task-state.test.ts > task state > task doctor warns when active state points to a terminal task 12ms
 ✓ tests/task-state.test.ts > task state > task doctor warns when active state points to a deferred task 4ms
 ✓ tests/task-state.test.ts > task state > task doctor warns when active task is an AgentFlight placeholder 6ms
 ✓ tests/task-state.test.ts > task state > task doctor skips placeholder-section warnings for AgentFlight placeholders

[output truncated: showing first 2500 and last 2500 characters of 100147 total]

amples.test.ts > examples documentation > existing-repo upgrade guide documents the safe latest-version path 0ms
 ✓ tests/package-metadata.test.ts > package metadata > identifies Baseframe Labs as the public project owner 2ms
 ✓ tests/schemastore.test.ts > SchemaStore support > accepts redact-paths without changing SchemaStore output 15747ms
 ✓ tests/schemastore.test.ts > SchemaStore support > prints human SchemaStore catalog values on one Markdown line while preserving JSON values 7ms
 ✓ tests/status.test.ts > status command > prefers explicit active task state over modified time fallback 3500ms
 ✓ tests/ship.test.ts > ship command > compacts AgentLoop evidence churn in ship report markdown only 14519ms
 ✓ tests/status.test.ts > status command > recommends archiving an explicitly active done task 6907ms
 ✓ tests/ship.test.ts > ship command > keeps same-minute ship report and handoff artifacts instead of overwriting them 10335ms
 ✓ tests/ship.test.ts > ship command > uses latest run task evidence when the task contract was archived 9538ms
 ✓ tests/status.test.ts > status command > hydrates latest run task metadata from archived task files 15969ms
 ✓ tests/ship.test.ts > ship command > renders ship report task paths on one markdown line 6962ms
 ✓ tests/ship.test.ts > ship command > renders ship GitHub comment dynamic values on one markdown line 0ms
 ✓ tests/status.test.ts > status command > does not request another handoff when dirty files are covered by the latest handoff run 7463ms
 ✓ tests/ship.test.ts > ship command > includes GitHub comment markdown in JSON output when requested 9803ms
 ✓ tests/status.test.ts > status command > recommends finishing an active task when dirty files are covered by the latest handoff run 16503ms
 ✓ tests/ship.test.ts > ship command > escapes Markdown control characters in ship report and GitHub comment readiness lists 9237ms
 ✓ tests/ship.test.ts > ship command > redacts nested gate git root paths when requested 16793ms
 ✓ tests/ship.test.ts > ship command > prints only GitHub comment markdown when requested without JSON 9506ms
 ✓ tests/ship.test.ts > ship command > prints ship report confirmation path on one Markdown line while preserving JSON path values 15971ms
 ✓ tests/ship.test.ts > ship command > accepts redacted GitHub comment output 8846ms

 Test Files  64 passed (64)
      Tests  822 passed (822)
   Start at  20:46:50
   Duration  583.37s (transform 653ms, setup 0ms, import 3.28s, tests 5383.58s, environment 4ms)

```

### custom: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.2 typecheck
> tsc --noEmit

```

### custom: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.2 lint
> eslint .

```

### custom: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.2 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     494.88 KB
ESM dist/cli/index.js.map 928.08 KB
ESM ⚡️ Build success in 31ms
DTS Build start
DTS ⚡️ Build success in 1065ms
DTS dist/cli/index.d.ts 13.00 B
```


## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
