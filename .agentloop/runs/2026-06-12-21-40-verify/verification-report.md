# Verification Report

- Timestamp: `2026-06-12T19:30:40.168Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `5051d48`
- Working tree: `dirty`
- Overall status: fail


## Task Context
- Path: `.agentloop/tasks/2026-06-12-release-agentloopkit-0-28-5-patch.md`
- Title: `Release AgentLoopKit 0.28.5 patch`
- Task type: `release`
- Status: `proposed`




## Failure Summary
### task: `npm test`

- Exit code: 1

```text
 ❯ tests/release-smoke.test.ts:257:11
    255|         version,
    256|       }),
    257|     ).not.toThrow();
       |           ^
    258|   });
    259| });
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
 Test Files  1 failed | 50 passed (51)
      Tests  1 failed | 454 passed (455)
   Start at  21:30:53
   Duration  265.45s (transform 415ms, setup 0ms, import 2.38s, tests 2645.09s, environment 3ms)
```

### task: `npm run smoke:release`

- Exit code: 1

```text
> agentloopkit@0.28.5 smoke:release
> node scripts/smoke-packed-release.mjs
Release smoke for agentloopkit@0.28.5
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-UfK6hp/pack/agentloopkit-0.28.5.tgz
README has no stale exact version pins.
Public docs have no stale version pins or unsupported public claims.
Release smoke failed: ROADMAP.md current state is stale: expected current public release v0.28.5.
```

### task: `npm publish --access public --dry-run`

- Exit code: 1

```text
    258|   });
    259| });
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
 Test Files  1 failed | 50 passed (51)
      Tests  1 failed | 454 passed (455)
   Start at  21:36:32
   Duration  208.14s (transform 389ms, setup 0ms, import 2.39s, tests 1913.29s, environment 3ms)
npm error code 1
npm error path /Users/abhyoh/local dev folder/Apps/AgentLoopKit
npm error command failed
npm error command sh -c node scripts/prepublish-check.mjs && npm run typecheck && npm test && npm run build
npm error A complete log of this run can be found in: /Users/abhyoh/.npm/_logs/2026-06-12T19_36_23_637Z-debug-0.log
```


## Commands Run
### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.5 lint
> eslint .

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.5 typecheck
> tsc --noEmit

```

### task: `npm test`

- Exit code: 1
- Status: fail


```text

> agentloopkit@0.28.5 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit

 ❯ tests/release-smoke.test.ts (18 tests | 1 failed) 17ms
     × current roadmap release state matches package metadata 3ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/release-smoke.test.ts > release smoke script helpers > current roadmap release state matches package metadata
AssertionError: expected [Function] to not throw an error but 'Error: ROADMAP.md current state is st…' was thrown

- Expected:
undefined

+ Received:
"Error: ROADMAP.md current state is stale: expected current public release v0.28.5."

 ❯ tests/release-smoke.test.ts:257:11
    255|         version,
    256|       }),
    257|     ).not.toThrow();
       |           ^
    258|   });
    259| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 50 passed (51)
      Tests  1 failed | 454 passed (455)
   Start at  21:30:53
   Duration  265.45s (transform 415ms, setup 0ms, import 2.38s, tests 2645.09s, environment 3ms)

```

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.5 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (1412 file(s) checked).
```

### task: `node scripts/prepublish-check.mjs`

- Exit code: 0
- Status: pass


```text
Prepublish metadata check passed.
```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.5 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     325.89 KB
ESM dist/cli/index.js.map 620.24 KB
ESM ⚡️ Build success in 25ms
DTS Build start
DTS ⚡️ Build success in 888ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm run smoke:release`

- Exit code: 1
- Status: fail


```text

> agentloopkit@0.28.5 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.28.5
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-UfK6hp/pack/agentloopkit-0.28.5.tgz
README has no stale exact version pins.
Public docs have no stale version pins or unsupported public claims.
Release smoke failed: ROADMAP.md current state is stale: expected current public release v0.28.5.
```

### task: `node scripts/smoke-cli.mjs`

- Exit code: 0
- Status: pass


```text
CLI smoke for agentloopkit@0.28.5
Version smoke passed.
Missing config smoke passed.
Init dry-run smoke passed.
Init smoke passed.
Doctor smoke passed.
Create-task smoke passed.
Task lifecycle smoke passed.
Verify smoke passed.
Verify progress smoke passed.
Handoff smoke passed.
Check-gates smoke passed with status pass.
Ship smoke passed.
Review-context smoke passed.
Run ledger limit smoke passed.
Run ledger smoke passed.
Prepare-pr smoke passed.
Maintainer-check smoke passed with status warn.
Task done smoke passed.
Nested cwd smoke passed.
CLI smoke passed.
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

### task: `npm publish --access public --dry-run`

- Exit code: 1
- Status: fail


```text

> agentloopkit@0.28.5 prepublishOnly
> node scripts/prepublish-check.mjs && npm run typecheck && npm test && npm run build

Prepublish metadata check passed.

> agentloopkit@0.28.5 typecheck
> tsc --noEmit


> agentloopkit@0.28.5 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit

 ❯ tests/release-smoke.test.ts (18 tests | 1 failed) 17ms
     × current roadmap release state matches package metadata 3ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/release-smoke.test.ts > release smoke script helpers > current roadmap release state matches package metadata
AssertionError: expected [Function] to not throw an error but 'Error: ROADMAP.md current state is st…' was thrown

- Expected:
undefined

+ Received:
"Error: ROADMAP.md current state is stale: expected current public release v0.28.5."

 ❯ tests/release-smoke.test.ts:257:11
    255|         version,
    256|       }),
    257|     ).not.toThrow();
       |           ^
    258|   });
    259| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 50 passed (51)
      Tests  1 failed | 454 passed (455)
   Start at  21:36:32
   Duration  208.14s (transform 389ms, setup 0ms, import 2.39s, tests 1913.29s, environment 3ms)

npm error code 1
npm error path /Users/abhyoh/local dev folder/Apps/AgentLoopKit
npm error command failed
npm error command sh -c node scripts/prepublish-check.mjs && npm run typecheck && npm test && npm run build
npm error A complete log of this run can be found in: /Users/abhyoh/.npm/_logs/2026-06-12T19_36_23_637Z-debug-0.log
```

### task: `npm pack --pack-destination /tmp --silent`

- Exit code: 0
- Status: pass


```text
agentloopkit-0.28.5.tgz
```

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Fix failing commands before claiming completion.
