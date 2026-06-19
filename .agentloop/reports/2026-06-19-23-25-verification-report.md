# Verification Report

- Timestamp: `2026-06-19T21:25:44.685Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `3ee1f4a9`
- Working tree: `dirty`
- Overall status: fail


## Task Context
- Path: `.agentloop/tasks/2026-06-19-run-real-repo-usefulness-trials-2.md`
- Title: `Run real-repo usefulness trials`
- Task type: `feature`
- Status: `in-progress`




## Failure Summary
### test: `npx pnpm@10.12.1 test`

- Exit code: 1

```text
    225|     expect(result.stdout).toContain('- Latest ship score: `94`/100');
    226|     expect(result.stdout).toContain('- GitHub metadata: issue `#42` `O…
    227|     expect(result.stdout).toContain('Run `agentloop handoff`.');
       |                           ^
    228|     expect(result.stdout).not.toContain(dir);
    229|     expect(result.stdout).not.toContain('Review handoff.');
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯
 Test Files  2 failed | 62 passed (64)
      Tests  2 failed | 822 passed (824)
   Start at  23:25:51
   Duration  348.93s (transform 675ms, setup 0ms, import 3.50s, tests 3707.48s, environment 4ms)
 ELIFECYCLE  Test failed. See above for more details.
```


## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 1
- Status: fail


```text

> agentloopkit@0.36.2 test [git-root]
> vitest run


 RUN  v4.1.8 [git-root]

 ❯ tests/review-context.test.ts (5 tests | 1 failed) 39378ms
     × prints concise Markdown review context by default 6139ms
 ❯ tests/mcp-tools.test.ts (3 tests | 1 failed) 10064ms
     × returns status, task, policy, report, and handoff data without running commands 9195ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/mcp-tools.test.ts > mcp tools > returns status, task, policy, report, and handoff data without running commands
AssertionError: expected 'agentloop task doctor' to be 'agentloop handoff' // Object.is equality

Expected: "agentloop handoff"
Received: "agentloop task doctor"

 ❯ tests/mcp-tools.test.ts:405:46
    403|     const handoffPayload = handoff.payload as HandoffPayload;
    404|
    405|     expect(statusPayload.nextAction.command).toBe('agentloop handoff');
       |                                              ^
    406|     expect(nextPayload.command).toBe('agentloop handoff');
    407|     expect(tasksPayload.tasks[0]).toMatchObject({ title: 'Add API rout…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  tests/review-context.test.ts > review-context command > prints concise Markdown review context by default
AssertionError: expected '# AgentLoopKit Review Context\n\n- Ac…' to contain 'Run `agentloop handoff`.'

- Expected
+ Received

- Run `agentloop handoff`.
+ # AgentLoopKit Review Context
+
+ - Active task: `Fix login redirect bug` (`proposed`) - `.agentloop/tasks/2026-06-19-fix-login-redirect-bug.md`
+ - Latest verification: `pass` - `.agentloop/reports/2026-06-10-12-30-verification-report.md`
+ - Gates: `warn`
+ - Policy status: `8` current, `0` modified, `0` missing, `0` extra
+ - Artifacts: `1` task(s), `1` AgentFlight placeholder task(s), `1` verification report(s), `1` handoff(s)
+ - Latest ship score: `94`/100 - `.agentloop/reports/2026-06-10-12-32-ship-report.md`
+ - GitHub metadata: issue `#42` `OPEN`, PR `#77` `OPEN` - `.agentloop/github/context.json`
+ - Working tree: `dirty (63; 47 non-evidence, 16 AgentLoop evidence)`
+
+ ## Recent Runs
+
+ - `ship` `94`/100 - `1` changed file(s) - `2026-06-10-12-32-ship`
+
+ ## Next Action
+
+ Run `agentloop task doctor`.
+
+ Active task still has placeholder guidance in review-critical sections. Replace it before verification or handoff evidence.
+
+ ## Safety
+
+ This snapshot is read-only. It does not run commands, write files, include full Markdown artifact bodies, read `.env` contents, or call external APIs.
+

 ❯ tests/review-context.test.ts:227:27
    225|     expect(result.stdout).toContain('- Latest ship score: `94`/100');
    226|     expect(result.stdout).toContain('- GitHub metadata: issue `#42` `O…
    227|     expect(result.stdout).toContain('Run `agentloop handoff`.');
       |                           ^
    228|     expect(result.stdout).not.toContain(dir);
    229|     expect(result.stdout).not.toContain('Review handoff.');

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  2 failed | 62 passed (64)
      Tests  2 failed | 822 passed (824)
   Start at  23:25:51
   Duration  348.93s (transform 675ms, setup 0ms, import 3.50s, tests 3707.48s, environment 4ms)

 ELIFECYCLE  Test failed. See above for more details.
```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.2 lint [git-root]
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.2 typecheck [git-root]
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.2 build [git-root]
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     495.55 KB
ESM dist/cli/index.js.map 929.15 KB
ESM ⚡️ Build success in 33ms
DTS Build start
DTS ⚡️ Build success in 1007ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npx pnpm@10.12.1 vitest run tests/status.test.ts tests/next.test.ts -t "placeholder"`

- Exit code: 0
- Status: pass


```text

 RUN  v4.1.8 [git-root]


 Test Files  2 passed (2)
      Tests  7 passed | 53 skipped (60)
   Start at  23:32:09
   Duration  31.86s (transform 103ms, setup 0ms, import 256ms, tests 56.59s, environment 0ms)

```

### task: `npm run test:quick`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.2 test:quick
> npm run test:unit


> agentloopkit@0.36.2 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/github-action-runner.test.ts tests/release-proof.test.ts tests/public-docs-hygiene.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/maintenance-check-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  24 passed (24)
      Tests  150 passed (150)
   Start at  23:32:46
   Duration  86.31s (transform 242ms, setup 0ms, import 786ms, tests 170.65s, environment 2ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.2 typecheck
> tsc --noEmit

```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.2 lint
> eslint .

```

### task: `npm run build`

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
ESM dist/cli/index.js     495.55 KB
ESM dist/cli/index.js.map 929.15 KB
ESM ⚡️ Build success in 31ms
DTS Build start
DTS ⚡️ Build success in 1027ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm run check:public-docs`

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

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.2 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (4442 file(s) checked).
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

### task: `npx --yes agentflight doctor`

- Exit code: 0
- Status: pass


```text
AgentFlight Doctor

Overall: OK

- OK Node.js version: v26.3.0 satisfies AgentFlight's Node.js 20+ target.
- OK npm availability: npm 11.16.0 is available.
- OK git availability: git is available.
- OK repository root: [git-root]
- OK package manager: pnpm
- OK .agentflight presence: .agentflight exists.
- OK config validity: .agentflight/config.json is valid.
- OK .agentflight writable: .agentflight is writable.
- OK current session: A current session exists.
- OK ProjScan availability: ProjScan is available.
- OK AgentLoopKit availability: AgentLoopKit is available.
- OK test script: npm run test is configured.
- OK build script: npm run build is configured.
- OK typecheck script: npm run typecheck is configured.
- OK lint script: npm run lint is configured.
```


## Not Run
- Nothing skipped.

## Recommended Next Actions
- Fix failing commands before claiming completion.
