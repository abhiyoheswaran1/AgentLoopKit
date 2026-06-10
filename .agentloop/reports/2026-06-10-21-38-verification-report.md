# Verification Report

- Timestamp: 2026-06-10T19:38:25.208Z
- Repo: AgentLoopKit
- Git branch: main
- Git commit: 64cb00f
- Working tree: dirty
- Overall status: pass


## Task Context
- Path: .agentloop/tasks/archive/2026-06-10-prepare-v0-27-0-task-doctor-release.md
- Title: Prepare v0.27.0 task doctor release
- Task type: release
- Status: done



## Commands Run
### custom: `node dist/cli/index.js npm-status --expect-current`

- Exit code: 0
- Status: pass

```text
# npm Status

- Package: `agentloopkit`
- Local version: `0.27.0`
- npm latest: `0.27.0`
- Registry contains local version: yes
- Registry versions: `0.1.0`, `0.1.1`, `0.24.0`, `0.24.1`, `0.24.2`, `0.24.3`, `0.24.4`, `0.24.5`, `0.25.0`, `0.26.0`, `0.26.1`, `0.26.2`, `0.26.3`, `0.26.4`, `0.26.5`, `0.27.0`
- Status: npm latest matches local package version

## Recommendation

npm has caught up. Remove temporary GitHub tarball fallback docs if they are still present.

## Safety

This command only runs `npm view agentloopkit version versions --json` unless `--registry-json` is provided. It does not publish packages, create tags, create GitHub releases, read npm tokens, read .env files, upload files, or change package metadata.

```

### custom: `npx pnpm@10.12.1 check:links`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 check:links /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsx scripts/check-markdown-links.ts

Markdown links OK (642 file(s) checked).
```

### custom: `git diff --check`

- Exit code: 0
- Status: pass

```text
(no output)
```

### custom: `node scripts/prepublish-check.mjs`

- Exit code: 0
- Status: pass

```text
Prepublish metadata check passed.
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

### custom: `tmp=$(mktemp -d); cd "$tmp" && npx --yes agentloopkit@0.27.0 version`

- Exit code: 0
- Status: pass

```text
0.27.0
```

### custom: `gh release view v0.27.0 --json tagName,name,url,isDraft,isPrerelease,targetCommitish`

- Exit code: 0
- Status: pass

```text
{"isDraft":false,"isPrerelease":false,"name":"AgentLoopKit v0.27.0","tagName":"v0.27.0","targetCommitish":"64cb00ff9371a054d6a9496f3f9e16c5c23a6828","url":"https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.27.0"}
```

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
