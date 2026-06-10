# Verification Report

- Timestamp: 2026-06-10T18:06:54.499Z
- Repo: AgentLoopKit
- Git branch: main
- Git commit: 10cbdc9
- Working tree: dirty
- Overall status: pass


## Task Context
- Path: .agentloop/tasks/2026-06-10-prepare-0-26-4-schemastore-documentation-release.md
- Title: Prepare 0.26.4 SchemaStore documentation release
- Task type: docs
- Status: in-progress



## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.26.4 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  33 passed (33)
      Tests  146 passed (146)
   Start at  20:06:55
   Duration  11.59s (transform 1.87s, setup 0ms, import 5.83s, tests 89.92s, environment 3ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.26.4 lint /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.26.4 typecheck /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.26.4 build /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     154.47 KB
ESM dist/cli/index.js.map 292.85 KB
ESM ⚡️ Build success in 21ms
DTS Build start
DTS ⚡️ Build success in 657ms
DTS dist/cli/index.d.ts 13.00 B
```

### custom: `node scripts/prepublish-check.mjs`

- Exit code: 0
- Status: pass

```text
Prepublish metadata check passed.
```

### custom: `npx --yes pnpm@10.12.1 check:links`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.26.4 check:links /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsx scripts/check-markdown-links.ts

Markdown links OK (622 file(s) checked).
```

### custom: `npx --yes prettier@3.7.4 --check README.md CHANGELOG.md action.yml docs/distribution-channels.md docs/github-actions.md docs/mcp.md docs/release-notes.md package.json server.json .agentloop/tasks/2026-06-10-prepare-0-26-4-schemastore-documentation-release.md`

- Exit code: 0
- Status: pass

```text
Checking formatting...
All matched files use Prettier code style!
```

### custom: `npm run smoke:release`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.26.4 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.26.4
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-l7GvQD/pack/agentloopkit-0.26.4.tgz
README pins match package version.
Packed binary version smoke passed.
Packed init smoke passed.
Packed local-only init smoke passed.
Packed create-task path guard smoke passed.
Packed verify task path guard smoke passed.
Packed home-directory dry-run guard smoke passed.
Release smoke passed.
```

### custom: `npm publish --access public --dry-run`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.26.4 prepublishOnly
> node scripts/prepublish-check.mjs && npm run typecheck && npm test && npm run build

Prepublish metadata check passed.

> agentloopkit@0.26.4 typecheck
> tsc --noEmit


> agentloopkit@0.26.4 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  33 passed (33)
      Tests  146 passed (146)
   Start at  20:07:28
   Duration  11.35s (transform 817ms, setup 0ms, import 5.24s, tests 91.59s, environment 3ms)


> agentloopkit@0.26.4 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     154.47 KB
ESM dist/cli/index.js.map 292.85 KB
ESM ⚡️ Build success in 21ms
DTS Build start
DTS ⚡️ Build success in 693ms
DTS dist/cli/index.d.ts 13.00 B
npm notice
npm notice 📦  agentloopkit@0.26.4
npm notice Tarball Contents
npm notice 1.1kB LICENSE
npm notice 25.4kB README.md
npm notice 13B dist/cli/index.d.ts
npm notice 158.2kB dist/cli/index.js
npm notice 299.9kB dist/cli/index.js.map
npm notice 3.3kB dist/schema/agentloop.config.schema.json
npm notice 984B dist/templates/agents/claude-code.md
npm notice 1.2kB dist/templates/agents/codex.md
npm notice 955B dist/templates/agents/cursor.md
npm notice 994B dist/templates/agents/gemini-cli.md
npm notice 879B dist/templates/agents/generic.md
npm notice 962B dist/templates/agents/github-copilot-cli.md
npm notice 955B dist/templates/agents/opencode.md
npm notice 457B dist/templates/gates/dependency-gate.md
npm notice 472B dist/templates/gates/docs-gate.md
npm notice 621B dist/templates/gates/implementation-gate.md
npm notice 440B dist/templates/gates/regression-gate.md
npm notice 470B dist/templates/gates/review-gate.md
npm notice 502B dist/templates/gates/security-gate.md
npm notice 513B dist/templates/gates/test-gate.md
npm notice 120B dist/templates/handoffs/decision-log.md
npm notice 387B dist/templates/handoffs/pr-summary.md
npm notice 133B dist/templates/handoffs/release-notes.md
npm notice 155B dist/templates/handoffs/reviewer-brief.md
npm notice 94B dist/templates/handoffs/rollback-plan.md
npm notice 135B dist/templates/handoffs/verification-report.md
npm notice 614B dist/templates/harness/autonomous-work-rules.md
npm notice 4.2kB dist/templates/harness/commands.md
npm notice 446B dist/templates/harness/definition-of-done.md
npm notice 260B dist/templates/harness/release-checklist.md
npm notice 493B dist/templates/harness/repo-map.md
npm notice 375B dist/templates/harness/review-checklist.md
npm notice 333B dist/templates/harness/working-agreement.md
npm notice 720B dist/templates/loops/bugfix.md
npm notice 646B dist/templates/loops/dependency-upgrade.md
npm notice 648B dist/templates/loops/docs.md
npm notice 865B dist/templates/loops/feature.md
npm notice 674B dist/templates/loops/migration.md
npm notice 748B dist/templates/loops/refactor.md
npm notice 620B dist/templates/loops/release.md
npm notice 688B dist/templates/loops/security-review.md
npm notice 668B dist/templates/loops/test-generation.md
npm notice 308B dist/templates/policies/database-change-policy.md
npm notice 315B dist/templates/policies/dependency-change-policy.md
npm notice 243B dist/templates/policies/git-policy.md
npm notice 478B dist/templates/policies/no-destructive-actions.md
npm notice 325B dist/templates/policies/public-api-change-policy.md
npm notice 275B dist/templates/policies/secrets-policy.md
npm notice 314B dist/templates/policies/security-policy.md
npm notice 255B dist/templates/policies/ui-change-policy.md
npm notice 4.7kB dist/templates/root/agentloop-directory-readme.md
npm notice 917B dist/templates/root/agentloop.config.json
npm notice 3.7kB dist/templates/root/AGENTLOOP.md
npm notice 4.8kB dist/templates/root/AGENTS.md
npm notice 2.0kB dist/templates/tasks/README.md
npm notice 1.9kB package.json
npm notice 3.3kB schema/agentloop.config.schema.json
npm notice 563B server.json
npm notice Tarball Details
npm notice name: agentloopkit
npm notice version: 0.26.4
npm notice filename: agentloopkit-0.26.4.tgz
npm notice package size: 122.2 kB
npm notice unpacked size: 536.7 kB
npm notice shasum: 7c78020a4904fea5f4f66335fc0bca24e8c5df1d
npm notice integrity: sha512-a9sIGaDC84tT2[...]juYUCveAMNB9Q==
npm notice total files: 58
npm notice
npm notice Publishing to https://registry.npmjs.org/ with tag latest and public access (dry-run)
+ agentloopkit@0.26.4
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

### custom: `node -e "fetch('https://www.schemastore.org/api/json/catalog.json').then(r=>r.json()).then(j=>{const hit=j.schemas.filter(s=>s.name==='AgentLoopKit'||(s.fileMatch||[]).includes('agentloop.config.json')); if(hit.length!==1) process.exit(1); console.log(JSON.stringify(hit[0]));})"`

- Exit code: 0
- Status: pass

```text
{"name":"AgentLoopKit","description":"Configuration file for AgentLoopKit, a repo-level engineering loop for coding agents","fileMatch":["agentloop.config.json"],"url":"https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/schema/agentloop.config.schema.json"}
```

### custom: `git diff --check`

- Exit code: 0
- Status: pass

```text
(no output)
```

## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
