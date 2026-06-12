# AgentLoopKit v0.28.2

Patch release for focused task-contract verification.

## Changes

- Added `agentloop verify --task <path> --task-commands --only-task-commands`.
- Kept task Markdown execution explicit: the shortcut requires both `--task` and `--task-commands`.
- Records configured `test`, `lint`, `typecheck`, and `build` commands as not run when the shortcut is used.
- Updated README and verification docs to show explicit task paths for task-contract commands.
- Updated MCP Registry package metadata in `server.json` to `0.28.2`.

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm test`: 51 files, 436 tests
- `npm run check:links`: 1252 Markdown files checked
- `node scripts/prepublish-check.mjs`
- `git diff --check`
- `npm run build`
- `npm run smoke:release`
- `node scripts/smoke-cli.mjs`
- `node dist/cli/index.js artifacts --json`
- `npx --yes projscan doctor --format markdown`: A 100/100
- `npm run dogfood:strict`
- `npm publish --access public --dry-run`
- `npm pack --pack-destination /tmp --silent`

## Release Asset

- Local tarball: `/tmp/agentloopkit-0.28.2.tgz`
- SHA-256: `ea34d7a9d3edefea9ba7edd447cf3e1ec85dd8b94a8d638c7906182f61705b09`

## Safety

No postinstall script, telemetry, cloud backend, token handling, or hidden network calls were added.
