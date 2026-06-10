# Verification Report

- Timestamp: 2026-06-10T23:26:11.343Z
- Repo: AgentLoopKit
- Git branch: main
- Git commit: a2fc2bc
- Working tree: dirty
- Overall status: fail


## Task Context
- Path: .agentloop/tasks/2026-06-11-align-release-smoke-with-unpinned-readme-policy.md
- Title: Align release smoke with unpinned README policy
- Task type: bugfix
- Status: proposed



## Failure Summary
### custom: `node scripts/prepublish-check.mjs`

- Exit code: 1

```text
CHANGELOG.md has unreleased entries.
Move them into a versioned release section before publishing to npm.
This prevents publishing package contents that do not match release metadata.
```


## Commands Run
### custom: `npm run lint`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 lint
> eslint .

```

### custom: `npm run typecheck`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 typecheck
> tsc --noEmit

```

### custom: `npm test`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  34 passed (34)
      Tests  186 passed (186)
   Start at  01:26:14
   Duration  17.38s (transform 808ms, setup 0ms, import 5.87s, tests 145.76s, environment 5ms)

```

### custom: `npm run check:links`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (717 file(s) checked).
```

### custom: `npm run build`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     169.52 KB
ESM dist/cli/index.js.map 320.84 KB
ESM ⚡️ Build success in 24ms
DTS Build start
DTS ⚡️ Build success in 724ms
DTS dist/cli/index.d.ts 13.00 B
```

### custom: `npm run smoke:release`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.27.0
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-hz3wT6/pack/agentloopkit-0.27.0.tgz
README has no stale exact version pins.
Packed binary version smoke passed.
Packed init smoke passed.
Packed local-only init smoke passed.
Packed create-task path guard smoke passed.
Packed verify task path guard smoke passed.
Packed home-directory dry-run guard smoke passed.
Release smoke passed.
```

### custom: `node scripts/prepublish-check.mjs`

- Exit code: 1
- Status: fail

```text
CHANGELOG.md has unreleased entries.
Move them into a versioned release section before publishing to npm.
This prevents publishing package contents that do not match release metadata.
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

**Health Score: A (100/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

No issues detected. Project looks healthy!
```

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Fix failing commands before claiming completion.
