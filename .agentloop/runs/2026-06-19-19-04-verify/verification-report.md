# Verification Report

- Timestamp: `2026-06-19T17:03:42.843Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `3fbe6629`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-19-guard-real-repo-trial-guidance.md`
- Title: `Guard real-repo trial guidance`
- Task type: `tests`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/public-docs-hygiene.test.ts --reporter=verbose`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.1 test
> vitest run tests/public-docs-hygiene.test.ts --reporter=verbose


 RUN  v4.1.8 [git-root]

 ✓ tests/public-docs-hygiene.test.ts > public docs hygiene > rejects public adoption or testimonial claims without evidence 17ms
 ✓ tests/public-docs-hygiene.test.ts > public docs hygiene > rejects premature Pro or SaaS upgrade copy in public docs 2ms
 ✓ tests/public-docs-hygiene.test.ts > public docs hygiene > rejects unsupported marketplace and package-manager availability claims 2ms
 ✓ tests/public-docs-hygiene.test.ts > public docs hygiene > rejects maintainer release runbook details in README 2ms
 ✓ tests/public-docs-hygiene.test.ts > public docs hygiene > allows release-specific docs to discuss publishing workflows 3ms
 ✓ tests/public-docs-hygiene.test.ts > public docs hygiene > rejects release incident chatter in README 1ms
 ✓ tests/public-docs-hygiene.test.ts > public docs hygiene > allows release-specific docs to preserve release incident history 2ms
 ✓ tests/public-docs-hygiene.test.ts > public docs hygiene > keeps release checklist proof phases separated 1ms
 ✓ tests/public-docs-hygiene.test.ts > public docs hygiene > allows deferred channel design docs to describe future gates 2ms
 ✓ tests/public-docs-hygiene.test.ts > public docs hygiene > rejects real-repo trial guidance without no-public-proof boundary 2ms
 ✓ tests/public-docs-hygiene.test.ts > public docs hygiene > rejects real-repo trial guidance without local-only safety boundary 2ms
 ✓ tests/public-docs-hygiene.test.ts > public docs hygiene > rejects real-repo trial guidance without metadata scoring boundary 2ms
 ✓ tests/public-docs-hygiene.test.ts > public docs hygiene > ignores internal planning docs when checking public claims 2ms

 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  19:03:46
   Duration  1.39s (transform 26ms, setup 0ms, import 23ms, tests 40ms, environment 0ms)

```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.1 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.36.1
Public docs checked: 74
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.1 typecheck
> tsc --noEmit

```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.1 lint
> eslint .

```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.1 build
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
ESM ⚡️ Build success in 35ms
DTS Build start
DTS ⚡️ Build success in 1016ms
DTS dist/cli/index.d.ts 13.00 B
```


## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
