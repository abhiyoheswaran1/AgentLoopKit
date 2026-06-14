# AgentLoopKit Final Handoff

## Product summary

AgentLoopKit is a local-first, npm-distributed engineering loop for coding agents. It gives existing tools like Codex, Claude Code, Cursor, OpenCode, Gemini CLI, GitHub Copilot CLI, and generic agents repo-level task contracts, safety policies, verification reports, and reviewer handoffs.

It is not a SaaS, IDE, AI model wrapper, cloud dashboard, or prompt collection.

## What was built

- TypeScript Node CLI
- npm package metadata for `agentloopkit`
- binaries: `agentloop` and `agentloopkit`
- repo init flow with `--dry-run` and JSON output
- doctor checks with JSON output
- doctor risk-file category warnings with capped path examples
- task contract generation
- task contract creation with JSON output for agents and scripts
- task contract creation that activates the new task by default
- active task pinning with `.agentloop/state.json`
- read-only task contract listing with active-task markers
- explicit task status transitions in Markdown task contracts
- active task completion shortcut with `agentloop task done`
- review-ready next-action guidance for clean tasks still pinned in `review`
- task contract archiving into `.agentloop/tasks/archive/`
- static bash, zsh, fish, and PowerShell shell completion scripts
- verification report generation
- deterministic PR summary generation
- deterministic PR summary change-area classification and review-focus hints
- local static HTML evidence reports with `agentloop report`
- local SVG evidence badges with `agentloop badge`
- local CI provenance and evidence summaries with `agentloop ci-summary`
- local release-note handoffs with `agentloop release-notes`
- read-only npm registry status checks with `agentloop npm-status`
- read-only local evidence inventory with `agentloop artifacts`
- read-only local reviewability snapshot with `agentloop review-context`
- next-action shortcut with `agentloop next`
- prepublish metadata guard that blocks npm publish while `CHANGELOG.md` has unreleased entries
- read-only local policy inspection with `agentloop policy`
- read-only local policy template status with `agentloop policy status`
- verification reports with allowlisted CI context
- local status command for active task, latest verification, newest run evidence, dirty files, configured commands, and next action
- local gate-check command for task, verification, handoff, harness, policy, and git evidence
- opt-in `--redact-paths` output for status, gate checks, ship reports, and PR preparation before sharing logs publicly
- local acceptance-layer command with `agentloop ship`
- compact readiness-comment output with `agentloop ship --github-comment`
- repo-relative AgentLoop artifact paths in PR-facing Markdown, public JSON, and human write-confirmation output
- deterministic review-readiness scoring that does not claim to measure code quality
- PR description generation with `agentloop prepare-pr`
- `prepare-pr` reuse of matching fresh ship evidence to avoid duplicate run ledger entries
- `prepare-pr --json` evidence-source reporting for reused versus refreshed ship evidence
- `prepare-pr` grouped changed-file sections for reviewer scanning
- GitHub-comment Markdown output without token handling inside the CLI
- local run ledger under `.agentloop/runs/`
- safe run ledger path storage and display for CLI, MCP, review-context, and public command outputs
- opt-in run ledger records for `verify`, `summarize`, and `handoff` with `--write-run`
- `agentloop runs`, `agentloop show-run`, and `agentloop intent <file>`
- read-only maintainer reviewability check with `agentloop maintainer-check`
- read-only MCP access to policy template status, latest ship reports, artifact inventory metadata, review context snapshots, recent run ledger summaries and details, file intent matches, maintainer checks, and gate status
- agent instruction installation, including `install-agent all`
- template system for loops, gates, handoffs, agents, policies, tasks, and harness files
- generated `.agentloop/README.md`
- config validation and JSON schema
- generated config schema URL aligned to the GitHub-hosted schema file
- docs, examples, issue templates, PR template, CI, publish workflow
- README launch visuals generated with Playwright and VHS
- compact current release-status page at `docs/release-status.md`
- security-review workflow docs and a copyable example artifact set
- doctor risk-file heuristics docs with category examples and reviewer actions
- framework-specific task recipes for Remix, SvelteKit, Django, and FastAPI
- dependency-upgrade workflow docs and a lockfile-review example artifact set
- release-checklist example for GitHub-current/npm-lag maintainer handoffs
- internal product panel, target personas, simulated interview cycles, backlog, and dogfood log

## Current release

- Current npm release: `agentloopkit@0.32.0`
- GitHub release: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.32.0>
- Release asset: `agentloopkit-0.32.0.tgz`
- Release asset SHA-256: pending until the release tarball is attached
- Release tag: `v0.32.0` at the published release commit
- CI run: pending until release workflows complete
- CLI Smoke run: pending until release workflows complete
- Publish workflow run: pending until npm trusted publishing completes
- Docker workflow run: pending until GHCR publishing completes
- MCP Registry workflow run: pending until registry publishing completes
- Post-publish npm proof: `npm view agentloopkit version versions --json` should report latest `0.32.0`

## 0.32.0 release summary

Included:

- `agentloop schemastore` and a committed SchemaStore catalog entry for `agentloop.config.json`
- safe bundled and repo-local policy packs through `agentloop policy packs`, `policy pack show`, and `policy pack apply`
- bundled `agentloop-baseline` and `maintainer-review` packs that skip existing local policy files
- explicit local GitHub issue and PR metadata import through `agentloop github import`
- docs for SchemaStore support, GitHub metadata import, Windows package-manager planning, and editor-extension validation gates
- expanded fast test coverage for the new release-channel and adoption tooling

## 0.31.0 release summary

Included:

- read-only `agentloop upgrade-harness --details` and `--suggestions` output for copyable older-repo guidance
- `agentloop doctor` recommendations when generated harness guidance misses the current review-readiness loop
- split `test:unit`, `test:integration`, and `test:release` scripts plus a full `release-flow` wrapper
- `docs/upgrading-existing-repos.md` for safe upgrades from older AgentLoopKit installs
- client-specific read-only MCP setup examples for Claude Code, Cursor, Gemini CLI, OpenCode, and Codex
- realistic bugfix PR and dependency-upgrade examples using `create-task`, `verify`, `ship`, and `prepare-pr`

Release verification covers local task-linked verification, public docs hygiene, link checks, release-smoke checks, strict dogfood, project release checks, and the full `release-flow` gate before publish.

## 0.30.0 release summary

Included:

- read-only `agentloop upgrade-harness` for existing repos with older generated guidance
- safer existing-repo upgrade docs that explain why `init` skips user-edited files
- current main-loop docs around `verify`, `ship`, `prepare-pr`, and `maintainer-check`
- MCP client setup examples for the read-only server
- `npm run test:quick` for focused maintainer iteration while keeping the full suite as the release gate
- harness-upgrade and dependency-audit coverage in the project self-check gate

Release verification covered local task-linked verification, public docs hygiene, link checks, release-smoke checks, project self-checks, and ProjScan before publish.

## Previous release

- Previous npm release: `agentloopkit@0.29.0`
- GitHub release: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.29.0>
- Release asset: `agentloopkit-0.29.0.tgz`
- Release asset SHA-256: `2b295ff9e865069b64a80930d3b45b5ca0fe6bf8726d31b3a1de21e4362a0da4`
- Release tag: `v0.29.0` at commit `5b3148ec2025cd47bb698df6048fc236b544257b`
- CI run: `27467505332`
- CLI Smoke run: `27467505335`
- Publish workflow run: `27467512817`
- Docker workflow run: `27467512834`
- MCP Registry workflow run: `27467624266`
- Post-publish npm proof: `npm view agentloopkit version versions --json` reports latest `0.29.0`

## 0.29.0 release summary

Included:

- run ledger evidence in `agentloop artifacts`
- `agentloop artifacts --type run` and `agentloop artifacts --latest`
- safer redacted output for release, doctor, maintainer, review-context, and next-action logs
- pnpm dependency resolution pinned to patched `esbuild@0.28.1`
- synchronized package metadata, changelog, roadmap state, and MCP `server.json`

Release verification covered local release gates, npm trusted publishing, GitHub release assets, GHCR publishing through the Docker workflow, MCP Registry publishing, and clean-directory published-package smoke.

## Earlier release

- Earlier npm release: `agentloopkit@0.28.7`
- GitHub release: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.28.7>
- Release asset: `agentloopkit-0.28.7.tgz`
- Release asset SHA-256: `cd2c1b019e6f2b9e5a88576548da4f81048ca24cd9a3e5edd34141b82d08d27b`
- Release tag: `v0.28.7` at commit `d7bc79d02dfa5c8b5602866fbb88436dcd60be47`
- CI run: `27445382568`
- CLI Smoke run: `27445382562`
- Publish workflow run: `27445394952`
- Docker workflow run: `27445394954`
- MCP Registry workflow run: `27445602561`
- Post-publish npm proof: `npm view agentloopkit version versions --json` reports latest `0.28.7`

## 0.28.7 release summary

Included:

- concise public release notes with `agentloop release-notes --public`
- release-page output that omits local changed-file and AgentLoop evidence inventories
- synchronized package metadata, changelog, roadmap state, and MCP `server.json`

Release verification covered local release gates, npm trusted publishing, GitHub release assets, GHCR publishing through the Docker workflow, MCP Registry publishing, and clean-directory published-package smoke.

## 0.28.6 release

- Previous npm release: `agentloopkit@0.28.6`
- GitHub release: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.28.6>
- Release asset: `agentloopkit-0.28.6.tgz`
- Release asset SHA-256: `2f91b2c0adc5d44f5f32f09eb40f4e0ce028c07400c6fb76fe075070ec65b573`
- CI run: `27442870785`
- CLI Smoke run: `27442870779`
- Publish workflow run: `27442925865`
- Docker workflow run: `27442925900`
- MCP Registry workflow run: `27443148213`
- Post-publish npm proof: `npm view agentloopkit version versions --json` reports latest `0.28.6`

## 0.28.6 release summary

Included:

- stale release-note evidence detection in `agentloop release-check`
- strict release-check failure when generated release notes do not mention the package version
- synchronized package metadata, changelog, roadmap state, and MCP `server.json`

Release verification covered local release gates, npm trusted publishing, GitHub release assets, GHCR publishing through the Docker workflow, MCP Registry publishing, and clean-directory published-package smoke.

## 0.28.1 release

- npm release: `agentloopkit@0.28.1`
- GitHub release: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.28.1>
- Release asset: `agentloopkit-0.28.1.tgz`
- Release asset SHA-256: `88add27b0cabb4f833866748398e078496d5770151f558dde8a093d464965ac6`
- CI run: `27410702770`
- CLI Smoke run: `27410702781`
- Publish workflow run: `27410709613`
- Docker workflow run: `27410709578`
- GHCR image manifest: `ghcr.io/abhiyoheswaran1/agentloopkit:0.28.1` digest `sha256:d1a4c66e70d98cf6a18a261f513fce273b9c92727017c7ba910da391cfc11ea8`
- MCP Registry workflow run: `27410894807`
- Post-publish npm proof: `npm view agentloopkit version versions --json` reports latest `0.28.1`

## 0.28.1 release summary

Release tag `v0.28.1` points at commit `fd2c733`. Current `main` may include post-release documentation updates.

Included:

- repeatable local dogfood gates: `npm run dogfood` and `npm run dogfood:strict`
- official AgentLoopKit logo assets under `docs/logo/`
- refreshed README launch screenshots using the official mark
- README, contributor, and agent guidance for the dogfood gate
- stale release-guidance smoke coverage in public harness docs
- archived shipped internal task contracts and refreshed release evidence
- simplified npm-facing README with detailed command behavior moved to `docs/cli-reference.md`
- refreshed README terminal demo and showcase screenshot around `ship`, `prepare-pr`, `review-context`, run history, and file intent lookup
- generated first-run harness guidance with a risk-aware task example and task-linked verification command
- read-only `agentloop artifacts` command for local evidence inventory
- read-only `agentloop review-context` command for non-MCP agents
- cross-platform CLI smoke workflow for Ubuntu, macOS, and Windows
- local acceptance-layer commands: `ship`, `prepare-pr`, `runs`, `show-run`, `intent`, and `maintainer-check`
- `agentloop status` now surfaces the newest local run ledger entry in Markdown, JSON, and brief output
- `agentloop status --redact-paths`, `agentloop check-gates --redact-paths`, `agentloop ship --redact-paths`, and `agentloop prepare-pr --redact-paths` hide the absolute Git root for public logs while keeping default JSON stable for scripts
- read-only MCP access to local policy template status
- read-only MCP access to local review gate status
- read-only MCP access to local artifact inventory metadata
- read-only MCP review context snapshots that combine status, gates, policy status, artifacts, recent runs, and latest ship evidence
- safe run ledger path storage and display for CLI, MCP, status, review-context, and public command outputs

Release verification covered local checks, npm trusted publishing, GitHub release assets, GHCR publishing, MCP Registry publishing, and clean-directory install smoke.

## CLI commands

```bash
agentloop init
agentloop init --dry-run
agentloop doctor
agentloop doctor --json
agentloop create-task --title "Add settings page" --type feature
agentloop task list
agentloop task list --json
agentloop task show .agentloop/tasks/2026-06-09-add-settings-page.md
agentloop task show .agentloop/tasks/2026-06-09-add-settings-page.md --json
agentloop task set .agentloop/tasks/2026-06-09-add-settings-page.md
agentloop task status .agentloop/tasks/2026-06-09-add-settings-page.md in-progress
agentloop task status .agentloop/tasks/2026-06-09-add-settings-page.md review --json
agentloop task archive .agentloop/tasks/2026-06-09-add-settings-page.md
agentloop task current --json
agentloop task clear
agentloop status
agentloop status --json
agentloop next
agentloop next --json
agentloop check-gates
agentloop check-gates --json
agentloop check-gates --strict
agentloop ship
agentloop ship --json
agentloop ship --github-comment
agentloop ship --github-comment --redact-paths
agentloop prepare-pr
agentloop prepare-pr --github-comment
agentloop prepare-pr --json --github-comment --redact-paths
agentloop runs
agentloop show-run <id>
agentloop intent src/auth/callback.ts
agentloop maintainer-check
agentloop artifacts
agentloop artifacts --json
agentloop report
agentloop report --json
agentloop badge
agentloop badge --source gates
agentloop badge --json
agentloop ci-summary
agentloop ci-summary --json
agentloop ci-summary --write
agentloop release-notes
agentloop release-notes --json
agentloop release-notes --write
agentloop npm-status
agentloop npm-status --json
agentloop npm-status --expect-current
agentloop policy list
agentloop policy show security
agentloop policy status
agentloop policy show security --json
agentloop policy status --json
agentloop verify
agentloop verify --command "node smoke-test.js"
agentloop handoff
agentloop summarize --write
agentloop install-agent codex
agentloop install-agent all
agentloop list-templates
agentloop completion zsh
agentloop completion bash
agentloop completion fish
agentloop completion powershell
agentloop completion pwsh
agentloop version
```

## How to run locally

```bash
npx pnpm@10.12.1 install
npx pnpm@10.12.1 dev -- version
npx tsx src/cli/index.ts init --dry-run
```

## How to test

```bash
npx pnpm@10.12.1 lint
npx pnpm@10.12.1 typecheck
npx pnpm@10.12.1 test
npx pnpm@10.12.1 check:links
npx pnpm@10.12.1 build
npx projscan doctor --format markdown
```

Latest local verification:

- `0.24.0` npm-status release-candidate verification:
  - Task contract: `.agentloop/tasks/2026-06-10-prepare-0-24-0-npm-status-release.md`.
  - Product cycle: `.agentloop/research/interview-cycle-103.md`.
  - Bumped package metadata to `0.24.0`.
  - Added a `0.24.0` changelog section for `agentloop npm-status`.
  - `npx tsx src/cli/index.ts version`: pass, reported `0.24.0`.
  - `node dist/cli/index.js version`: pass, reported `0.24.0`.
  - `node scripts/prepublish-check.mjs`: pass.
  - `npx pnpm@10.12.1 test`: pass, 29 files and 121 tests.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx pnpm@10.12.1 check:links`: pass, 559 Markdown files checked.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - `npm pack --pack-destination /tmp --silent`: pass, produced `/tmp/agentloopkit-0.24.0.tgz`.
  - Packed tarball smoke: pass; `agentloop version` reported `0.24.0`, `agentloop npm-status --registry-json /tmp/npm-view-agentloopkit.json --json` reported `catch-up-needed`, `completion powershell` printed `Register-ArgumentCompleter`, and `init --dry-run --json` worked in a temp git repo.
  - Local tarball SHA-256 before GitHub release: `4e721a9627d94944f300a60d71a14b0e519045ac3eb51d637f7227503f2a962d`.
  - `npx tsx src/cli/index.ts npm-status --json`: pass, reported local `0.24.0`, npm latest `0.1.1`, registry versions `0.1.0` and `0.1.1`, and status `catch-up-needed`.
  - `npx tsx src/cli/index.ts npm-status --expect-current`: expected fail with exit code 1 because npm latest does not match local package metadata.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `git diff --check`: pass.
  - `npm whoami`: expected fail with `E401`, so npm publish remains blocked from this shell.

- `0.23.0` PowerShell completion release-candidate verification:
  - Task contract: `.agentloop/tasks/2026-06-10-prepare-0-23-0-powershell-completion-release.md`.
  - Product cycle: `.agentloop/research/interview-cycle-091.md`.
  - Bumped package metadata to `0.23.0`.
  - Added a `0.23.0` changelog section for PowerShell completions.
  - `npx pnpm@10.12.1 test`: pass, 28 files and 113 tests.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx pnpm@10.12.1 check:links`: pass, 492 Markdown files checked.
  - `git diff --check`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - `npm pack --pack-destination /tmp --silent`: pass, produced `/tmp/agentloopkit-0.23.0.tgz`.
  - Packed tarball smoke: pass; `agentloop version` reported `0.23.0`, `completion powershell` printed `Register-ArgumentCompleter`, and `init --dry-run --json` worked in a temp git repo.
  - Local tarball SHA-256 before GitHub release: `b96f356db5b5b2f94a0f284590f3d272afe20fe87b6668e10c599164be72b27f`.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-06-21-verification-report.md`, overall status `pass`.
  - npm registry proof before release: latest remains `0.1.1`; versions remain `0.1.0` and `0.1.1`.
  - `npm whoami`: expected fail with `E401`, so npm publish remains blocked from this shell.

- `0.22.0` task-linked verification and README evidence release-candidate verification:
  - Task contracts: `.agentloop/tasks/2026-06-10-improve-verification-failure-summary.md`, `.agentloop/tasks/2026-06-10-include-task-context-in-verification.md`, `.agentloop/tasks/2026-06-10-refresh-readme-visuals-task-context.md`, and `.agentloop/tasks/2026-06-10-prepare-v0-22-0-release.md`.
  - Product cycles: `.agentloop/research/interview-cycle-082.md`, `.agentloop/research/interview-cycle-083.md`, `.agentloop/research/interview-cycle-084.md`, and `.agentloop/research/interview-cycle-085.md`.
  - Added failed-verification summaries.
  - Added task context to `agentloop verify --task <path>`.
  - Guarded `.env`-style paths so `verify --task` reports them as unavailable instead of reading them.
  - Refreshed README Playwright screenshots and VHS terminal demo around task-linked verification.
  - `npm whoami`: expected fail with `E401`, so npm publish remains blocked from this shell.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 28 files and 110 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 467 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `node dist/cli/index.js version`: `0.22.0`.
  - `node scripts/prepublish-check.mjs`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `git diff --check`: pass.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - `npm pack --pack-destination /tmp --silent`: pass, produced `/tmp/agentloopkit-0.22.0.tgz`.
  - Packed tarball smoke: pass; `agentloop version` reported `0.22.0`, `verify --task` passed, `handoff` wrote a PR summary, `release-notes --release-version 0.22.0 --json` reported `0.22.0`, and `check-gates --strict` passed.
  - Local tarball SHA-256 before GitHub release: `5ad3a2b35e430d6d9fa10cad4c6023230fc7f3593a8232370c9c2a8945b6489f`.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-05-34-verification-report.md`, overall status `pass`.
  - npm registry proof before release: latest remains `0.1.1`; versions remain `0.1.0` and `0.1.1`.
  - GitHub release `v0.22.0`: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.22.0.
  - GitHub release asset: `agentloopkit-0.22.0.tgz`.
  - GitHub release asset SHA-256: `5ad3a2b35e430d6d9fa10cad4c6023230fc7f3593a8232370c9c2a8945b6489f`.
  - GitHub Publish workflow run `27251450540`: package checks passed, then npm rejected `npm publish --access public` with `E404`.
  - npm registry proof after release: latest remains `0.1.1`; versions remain `0.1.0` and `0.1.1`.

- `0.21.0` next-action and release-safety release-candidate verification:
  - Task contracts: `.agentloop/tasks/2026-06-10-add-next-action-command.md`, `.agentloop/tasks/2026-06-10-add-publish-metadata-guard.md`, and `.agentloop/tasks/2026-06-10-prepare-v0-21-0-release.md`.
  - Product cycles: `.agentloop/research/interview-cycle-079.md`, `.agentloop/research/interview-cycle-080.md`, and `.agentloop/research/interview-cycle-081.md`.
  - Added `agentloop next` and `agentloop next --json`.
  - Added status logic so older verification reports do not count as current evidence for newer in-progress tasks.
  - Added `scripts/prepublish-check.mjs` and wired it into `prepublishOnly`.
  - Added `agentloop release-notes --release-version <version>` after dogfooding caught a collision with the CLI's global `--version` flag.
  - Red tests covered missing `next`, stale verification report handling, post-verification task status handling, missing prepublish guard behavior, and missing `--release-version` support.
  - Latest focused guard test: `npx pnpm@10.12.1 test tests/prepublish-check.test.ts`: pass.
  - Latest focused release-notes test: `npx pnpm@10.12.1 test tests/release-notes.test.ts`: pass, 1 file and 4 tests.
  - `node scripts/prepublish-check.mjs`: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 28 files and 105 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 448 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `git diff --check`: pass.
  - `npm pack --pack-destination /tmp --silent`: pass, produced `/tmp/agentloopkit-0.21.0.tgz`.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - Packed tarball smoke: pass; `agentloop version` reported `0.21.0`, `release-notes --release-version 0.21.0 --json` reported `0.21.0`, and `next --json` returned `agentloop create-task` after `init`.
  - Local tarball SHA-256 before GitHub release: `3f7c1ee4042f6dd08d2fd2cc2ecdcc039f853f95afb56be666c5497d7a3fe4d5`.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-04-41-verification-report.md`, overall status `pass`.
  - GitHub release `v0.21.0`: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.21.0.
  - GitHub release asset: `agentloopkit-0.21.0.tgz`.
  - GitHub release asset SHA-256: `3f7c1ee4042f6dd08d2fd2cc2ecdcc039f853f95afb56be666c5497d7a3fe4d5`.
  - GitHub Publish workflow run `27249612803`: package checks passed, then npm rejected `npm publish --access public` with `E404`.
  - npm registry proof after release: latest remains `0.1.1`; versions remain `0.1.0` and `0.1.1`.

- `0.20.0` release-note handoff release-candidate verification:
  - Task contract: `.agentloop/tasks/2026-06-10-add-release-notes-command.md`.
  - Product cycle: `.agentloop/research/interview-cycle-078.md`.
  - Red tests: `npx pnpm@10.12.1 test tests/release-notes.test.ts` failed before missing explicit `--from` refs and dirty working trees were reported.
  - Focused green tests: `npx pnpm@10.12.1 test tests/release-notes.test.ts tests/completion.test.ts`: pass, 2 files and 9 tests.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 test`: pass, 26 files and 97 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 434 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npm pack`: pass, produced `agentloopkit-0.20.0.tgz`.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - Packed tarball smoke: pass; `agentloop version` reported `0.20.0`, `release-notes --json --write` wrote a release-note artifact, and `check-gates --strict --json` passed in the smoke repo.
  - Tarball SHA-256: `df8407c7da4440a86a544973bdd052cadb0c0d2b10b1bb67f81548b857fdc201`.
  - README screenshots regenerated with Playwright.
  - README terminal GIF regenerated with VHS.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-03-45-verification-report.md`, overall status `pass`.
  - GitHub release `v0.20.0`: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.20.0.
  - GitHub release asset: `agentloopkit-0.20.0.tgz`.
  - GitHub Publish workflow run `27248000123`: package checks passed, then npm rejected `npm publish --access public` with `E404`.
  - npm registry proof: latest remains `0.1.1`; versions remain `0.1.0` and `0.1.1`.

- `0.19.0` local CI summary release-candidate verification:
  - Task contract: `.agentloop/tasks/2026-06-10-add-local-ci-summary-command.md`.
  - Product cycle: `.agentloop/research/interview-cycle-077.md`.
  - Red test: `npx pnpm@10.12.1 test tests/ci-summary.test.ts tests/completion.test.ts` failed before `ci-summary` and lookup isolation existed.
  - Focused green tests: `npx pnpm@10.12.1 test tests/ci-summary.test.ts tests/completion.test.ts tests/status.test.ts tests/check-gates.test.ts tests/html-report.test.ts tests/badge.test.ts tests/pr-summary.test.ts`: pass, 7 files and 28 tests.
  - `agentloop version`: reported `0.19.0`.
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 25 files and 94 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 431 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npm pack`: pass, produced `agentloopkit-0.19.0.tgz`.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - Packed tarball smoke: pass; `agentloop version` reported `0.19.0`, `ci-summary --json --write` reported GitHub Actions context, and `status` plus `check-gates` still selected the verification report.
  - Tarball SHA-256: `8d78d22b8b69786bd85b43234815765e2d373d44d05789a20ce3a2d19897e900`.
  - README terminal GIF regenerated with VHS from `docs/assets/readme/agentloopkit-cli.tape`.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-03-15-verification-report.md`, overall status `pass`.
  - AgentLoop CI summary: `.agentloop/reports/2026-06-10-03-18-ci-summary.md`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-03-18-pr-summary.md`.
  - GitHub CI run `27246728746`: pass.
  - GitHub release `v0.19.0`: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.19.0.
  - GitHub release asset: `agentloopkit-0.19.0.tgz`.
  - GitHub Publish workflow run `27246784493`: package checks passed, then npm rejected `npm publish --access public` with `E404`.

- Contributor playbook examples:
  - Task contract: `.agentloop/tasks/2026-06-10-add-contributor-playbook-examples.md`.
  - Product cycle: `.agentloop/research/interview-cycle-076.md`.
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 test`: pass, 24 files and 91 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 425 Markdown files checked.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-02-52-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-02-53-pr-summary.md`.
  - `agentloop check-gates --strict --json`: pass.

- `0.18.1` policy-customization patch release-candidate verification:
  - Task contract: `.agentloop/tasks/2026-06-10-prepare-0-18-1-policy-guidance-patch-release.md`.
  - Product cycle: `.agentloop/research/interview-cycle-074.md`.
  - `agentloop version`: reported `0.18.1`.
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 24 files and 91 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 413 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npm pack`: pass, produced `agentloopkit-0.18.1.tgz`.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - Packed tarball smoke: pass; `agentloop version` reported `0.18.1`, `init` generated harness files, and `policy status --json` reported all eight policies as `current`.
  - Tarball SHA-256: `01f38156e44610021752dadc90fe5d61f63ac210c3778274bce99b11833e972b`.
  - README terminal GIF regenerated with VHS from `docs/assets/readme/agentloopkit-cli.tape`.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-02-34-verification-report.md`, overall status `pass`.
  - GitHub CI run `27245102739`: pass.
  - GitHub release `v0.18.1`: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.18.1.
  - GitHub release tarball SHA-256: `01f38156e44610021752dadc90fe5d61f63ac210c3778274bce99b11833e972b`.
  - GitHub Publish workflow run `27245167172`: package checks passed, then npm rejected `npm publish --access public` with `E404`.
  - npm registry proof before release: latest remains `0.1.1`; versions remain `0.1.0` and `0.1.1`.

- `0.18.0` release-status documentation verification:
  - Task contract: `.agentloop/tasks/2026-06-10-record-0-18-0-release-status.md`.
  - Product cycle: `.agentloop/research/interview-cycle-072.md`.
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 test`: pass, 24 files and 91 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 405 Markdown files checked.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-02-19-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-02-20-pr-summary.md`.
  - AgentLoop gate check: `agentloop check-gates --strict --json`: pass.
  - npm registry proof during this cleanup: latest remains `0.1.1`; versions remain `0.1.0` and `0.1.1`.

- `0.18.0` policy-status release-candidate verification:
  - Focused red test: `npx pnpm@10.12.1 test tests/policy.test.ts tests/completion.test.ts` failed before `getPolicyStatus`, `policy status`, and completion entries existed.
  - Focused green test: `npx pnpm@10.12.1 test tests/policy.test.ts tests/completion.test.ts`: pass, 2 files and 12 tests.
  - Live CLI smoke: `agentloop version` reported `0.18.0`; `policy status --json` reported all eight repo policies as `current`.
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 24 files and 91 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 403 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npm pack`: pass, produced `agentloopkit-0.18.0.tgz`.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - Packed tarball smoke: pass after correcting the smoke assertion to expect traversal lookup failure.
  - Tarball SHA-256: `7c3b6b7f12c34e57b9bfd70bb4491abd566b37b86bf0c642d9d517a7dcdb4d26`.
  - README terminal GIF regenerated with VHS.
  - README screenshots regenerated with Playwright.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-02-06-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-02-07-pr-summary.md`.
  - AgentLoop HTML report: `.agentloop/reports/2026-06-10-02-07-agentloop-report.html`.
  - AgentLoop gate check: `agentloop check-gates --strict --json`: pass.
  - GitHub CI run `27244057325`: pass.
  - GitHub release `v0.18.0`: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.18.0.
  - GitHub release tarball SHA-256: `7c3b6b7f12c34e57b9bfd70bb4491abd566b37b86bf0c642d9d517a7dcdb4d26`.
  - GitHub Publish workflow run `27244098928`: package checks passed, then npm rejected `npm publish --access public` with `E404`.
  - Local exact-tarball publish for `0.18.0`: failed with authorization `E404`.
  - npm registry proof after release: latest remains `0.1.1`; versions remain `0.1.0` and `0.1.1`.

- `0.17.0` policy-inspection release-candidate verification:
  - Focused red test: `npx pnpm@10.12.1 test tests/policy.test.ts` failed before `src/core/policy.ts` existed.
  - Focused green test: `npx pnpm@10.12.1 test tests/policy.test.ts`: pass, 1 file and 4 tests.
  - Completion red test: `npx pnpm@10.12.1 test tests/completion.test.ts` failed before completions included `policy`.
  - Focused policy and completion tests: pass, 2 files and 10 tests.
  - Live CLI smoke: `agentloop version` reported `0.17.0`; `policy list --json` listed local policies; `policy show security` printed `# Security Policy`; traversal-style lookup failed with `Policy not found`.
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 24 files and 89 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 393 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npm pack`: pass, produced `agentloopkit-0.17.0.tgz`.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - Packed tarball smoke: pass after correcting the smoke assertion to match `init --json` path-string output.
  - README terminal GIF regenerated with VHS.
  - README screenshots regenerated with Playwright.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-01-40-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-01-42-pr-summary.md`.
  - AgentLoop HTML report: `.agentloop/reports/2026-06-10-01-42-agentloop-report.html`.
  - GitHub CI run `27243118355`: pass.
  - GitHub release `v0.17.0`: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.17.0.
  - GitHub release tarball SHA-256: `8b7bb6ae9307e79cf97e20e405a1cef6a4aefcc48466d865758cc87f3439d49c`.
  - GitHub Publish workflow run `27243165066`: package checks passed, then npm rejected `npm publish --access public` with `E404`.
  - npm registry proof after release: latest remains `0.1.1`; versions remain `0.1.0` and `0.1.1`.

- `0.15.1` release-candidate verification:
  - `npx tsx src/cli/index.ts version`: pass, reported `0.15.1`.
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 21 files and 76 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 359 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `node dist/cli/index.js version`: pass, reported `0.15.1`.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.15.1.tgz`.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - Packed tarball smoke: pass, `agentloop version` reported `0.15.1`, `init --json` created files, `doctor --json` accepted the generated setup, and generated config used the GitHub raw schema URL.
  - npm registry proof: latest remains `0.1.1`; versions remain `0.1.0` and `0.1.1`.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-00-06-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-00-08-pr-summary.md`.

- `0.15.1` release-status verification:
  - `npx pnpm@10.12.1 check:links`: pass, 363 Markdown files checked.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `git diff --check`: pass.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-00-14-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-00-14-pr-summary.md`.

- Public roadmap refresh verification:
  - `npx pnpm@10.12.1 check:links`: pass, 367 Markdown files checked.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `git diff --check`: pass.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-00-19-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-00-19-pr-summary.md`.

- PR summary change-area verification:
  - Red focused test: `npx pnpm@10.12.1 test tests/pr-summary.test.ts` failed because `## Change Areas` was missing.
  - Focused green test: `npx pnpm@10.12.1 test tests/pr-summary.test.ts`: pass, 1 file and 5 tests.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 21 files and 77 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 371 Markdown files checked.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npx pnpm@10.12.1 build`: pass.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-00-27-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-00-28-pr-summary.md`.

- Doctor risk-file details iteration:
  - Red doctor test: `npx pnpm@10.12.1 test tests/doctor.test.ts` failed because category-level `Risk files:` checks were missing.
  - Red safety test: `npx pnpm@10.12.1 test tests/safety.test.ts` failed because Markdown docs such as `docs/migration-guide.md` were treated as semantic risk files.
  - Focused green test: `npx pnpm@10.12.1 test tests/doctor.test.ts tests/safety.test.ts`: pass, 2 files and 7 tests.
  - Live `doctor --json` smoke: pass, current repo reports deployment workflow files and the lockfile, not template Markdown docs.
  - `git diff --check`: pass.
  - Prettier check on touched files: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 21 files and 76 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 349 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - AgentLoop verification report: `.agentloop/reports/2026-06-09-23-44-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-09-23-45-pr-summary.md`.

- Config schema URL trust iteration:
  - Red focused test: `npx pnpm@10.12.1 test tests/config.test.ts tests/schema.test.ts tests/init.test.ts` failed because defaults, generated config, and schema `$id` still used `agentloopkit.dev`.
  - Focused green test: `npx pnpm@10.12.1 test tests/config.test.ts tests/schema.test.ts tests/init.test.ts`: pass, 3 files and 6 tests.
  - `git diff --check`: pass.
  - Prettier check on touched files: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 21 files and 76 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 353 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - AgentLoop verification report: `.agentloop/reports/2026-06-09-23-52-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-09-23-52-pr-summary.md`.

Earlier `0.15.0` release-candidate verification:

- `npx tsx src/cli/index.ts version`: pass, reported `0.15.0`.
- `node dist/cli/index.js version`: pass, reported `0.15.0`.
- Playwright README screenshot render: pass for `agentloopkit-showcase.png` and `agentloopkit-verification.png`.
- VHS README terminal render: pass for `agentloopkit-cli.gif` using the `0.15.0` tarball name.
- `git diff --check`: pass.
- `npx pnpm@10.12.1 lint`: pass.
- `npx pnpm@10.12.1 typecheck`: pass.
- `npx pnpm@10.12.1 test`: pass, 21 files and 74 tests.
- `npx pnpm@10.12.1 check:links`: pass, 341 Markdown files checked.
- `npx pnpm@10.12.1 build`: pass.
- `npx projscan doctor --format markdown`: A, 100/100.
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.15.0.tgz`.
- `npm publish --access public --dry-run`: pass.
- Packed CLI smoke: pass, `agentloop version` reported `0.15.0`, `init` created 50 files, and `verify --json --no-*` wrote a not-run report.
- Packed CI-context smoke: pass, `verify --json --no-*` included GitHub Actions workflow, event, ref, commit, run URL, and run attempt.
- Tarball SHA-256 before release: `e92f28382d16cccbebd027bbbcb5324f60de088e49bb611482b1e205f673f965`.
- npm registry proof before release: latest `0.1.1`, versions `0.1.0` and `0.1.1`.

Latest local verification for the `0.14.0` release candidate:

- `npx tsx src/cli/index.ts version`: pass, reported `0.14.0`.
- `node dist/cli/index.js version`: pass, reported `0.14.0`.
- Playwright README screenshot render: pass for `agentloopkit-showcase.png` and `agentloopkit-verification.png`.
- VHS README terminal render: pass for `agentloopkit-cli.gif` using the `0.14.0` tarball name and showing `check-gates --strict`.
- `git diff --check`: pass.
- `npx pnpm@10.12.1 lint`: pass.
- `npx pnpm@10.12.1 typecheck`: pass.
- `npx pnpm@10.12.1 test`: pass, 21 files and 71 tests.
- `npx pnpm@10.12.1 check:links`: pass, 320 Markdown files checked.
- `npx pnpm@10.12.1 build`: pass.
- `npx projscan doctor --format markdown`: A, 100/100.
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.14.0.tgz`.
- `npm publish --access public --dry-run`: pass.
- Packed CLI smoke: pass, `agentloop version` reported `0.14.0`, `check-gates --strict --json` passed with task, verification, and handoff evidence.
- Packed strict warning smoke: pass, `check-gates --strict --json` exited `1` with warning-only evidence.
- AgentLoop verification report: `.agentloop/reports/2026-06-09-22-40-verification-report.md`, overall status `pass`.
- Tarball SHA-256 before release: `1cb8b7dc178e6668839577a780943710e8d8689eb0f7a6599b027e9226e30b78`.
- npm registry proof before release: latest `0.1.1`, versions `0.1.0` and `0.1.1`.

Latest local verification for the `0.13.0` release candidate:

- `npx tsx src/cli/index.ts version`: pass, reported `0.13.0`.
- `node dist/cli/index.js version`: pass, reported `0.13.0`.
- Playwright README screenshot render: pass for `agentloopkit-showcase.png` and `agentloopkit-verification.png`.
- VHS README terminal render: pass for `agentloopkit-cli.gif` using the `0.13.0` tarball name and showing `check-gates`.
- `git diff --check`: pass.
- `npx pnpm@10.12.1 lint`: pass.
- `npx pnpm@10.12.1 typecheck`: pass.
- `npx pnpm@10.12.1 test`: pass, 21 files and 70 tests.
- `npx pnpm@10.12.1 check:links`: pass, 306 Markdown files checked.
- `npx pnpm@10.12.1 build`: pass.
- `npx projscan doctor --format markdown`: A, 100/100.
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.13.0.tgz`.
- `npm publish --access public --dry-run`: pass.
- Packed CLI smoke: pass, `agentloop version` reported `0.13.0`, missing gate evidence returned `agentloop create-task`, and task plus verification plus handoff made `check-gates` pass.
- Tarball SHA-256 before release: `2c04fd3eba66fe662fb6fe97037b3950099d228b3759d2b418dcb57debef7e18`.
- npm registry proof before release: latest `0.1.1`, versions `0.1.0` and `0.1.1`.

Latest local verification for the `0.12.0` release candidate:

- `npx tsx src/cli/index.ts version`: pass, reported `0.12.0`.
- `node dist/cli/index.js version`: pass, reported `0.12.0`.
- Playwright README screenshot render: pass for `agentloopkit-showcase.png` and `agentloopkit-verification.png`.
- VHS README terminal render: pass for `agentloopkit-cli.gif` using the `0.12.0` tarball name and showing `create-task --json`.
- `git diff --check`: pass.
- `npx pnpm@10.12.1 lint`: pass.
- `npx pnpm@10.12.1 typecheck`: pass.
- `npx pnpm@10.12.1 test`: pass, 20 files and 68 tests.
- `npx pnpm@10.12.1 check:links`: pass, 295 Markdown files checked.
- `npx pnpm@10.12.1 build`: pass.
- `npx projscan doctor --format markdown`: A, 100/100.
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.12.0.tgz`.
- `npm publish --access public --dry-run`: pass.
- Packed CLI smoke: pass, `agentloop version` reported `0.12.0` and `create-task --json` returned `task.path` and `task.markdown`.
- npm registry proof before release: latest `0.1.1`, versions `0.1.0` and `0.1.1`.

Latest local verification for the `0.11.0` release candidate:

- `npx tsx src/cli/index.ts version`: pass, reported `0.11.0`.
- `node dist/cli/index.js version`: pass, reported `0.11.0`.
- Playwright README screenshot render: pass for `agentloopkit-showcase.png` and `agentloopkit-verification.png`.
- VHS README terminal render: pass for `agentloopkit-cli.gif` using the `0.11.0` tarball name and showing task archive after handoff.
- `git diff --check`: pass.
- `npx pnpm@10.12.1 lint`: pass.
- `npx pnpm@10.12.1 typecheck`: pass.
- `npx pnpm@10.12.1 test`: pass, 20 files and 67 tests.
- `npx pnpm@10.12.1 check:links`: pass, 283 Markdown files checked.
- `npx pnpm@10.12.1 build`: pass.
- `npx projscan doctor --format markdown`: A, 100/100.
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.11.0.tgz`.
- `npm publish --access public --dry-run`: pass.
- Packed CLI smoke: pass, `agentloop version` reported `0.11.0`, `task archive` moved a smoke task into `.agentloop/tasks/archive/`, `task list --json` returned no active tasks, and `task current --json` returned `null`.
- npm registry proof before release: latest `0.1.1`, versions `0.1.0` and `0.1.1`.
- `agentloop verify --task .agentloop/tasks/2026-06-09-prepare-0-11-0-task-archive-release.md`: pass.

Latest local verification for `create-task --json`:

- Red test first: `npx pnpm@10.12.1 test tests/create-task.test.ts` failed because `create-task` rejected `--json`.
- Focused green test: `npx pnpm@10.12.1 test tests/create-task.test.ts`: pass, 1 file and 3 tests.
- `git diff --check`: pass.
- `npx pnpm@10.12.1 lint`: pass.
- `npx pnpm@10.12.1 typecheck`: pass.
- `npx pnpm@10.12.1 test`: pass, 20 files and 68 tests.
- `npx pnpm@10.12.1 check:links`: pass, 289 Markdown files checked.
- `npx pnpm@10.12.1 build`: pass.
- `npx projscan doctor --format markdown`: A, 100/100.
- Built CLI smoke: pass, `create-task --json` returned `task.path` and `task.markdown`.
- `agentloop verify --task .agentloop/tasks/2026-06-09-add-create-task-json-output.md`: pass.

Latest local verification for task archiving:

- Red test first: `npx pnpm@10.12.1 test tests/task-state.test.ts` failed because `archiveTask` did not exist and `agentloop task archive` was unknown.
- Red completion test: `npx pnpm@10.12.1 test tests/completion.test.ts` failed because task completions did not include `archive`.
- Focused green test: `npx pnpm@10.12.1 test tests/task-state.test.ts`: pass, 1 file and 14 tests.
- Focused completion test: `npx pnpm@10.12.1 test tests/completion.test.ts`: pass, 1 file and 6 tests.
- `git diff --check`: pass.
- `npx pnpm@10.12.1 lint`: pass.
- `npx pnpm@10.12.1 typecheck`: pass.
- `npx pnpm@10.12.1 test`: pass, 20 files and 67 tests.
- `npx pnpm@10.12.1 check:links`: pass, 279 Markdown files checked.
- `npx pnpm@10.12.1 build`: pass.
- `npx projscan doctor --format markdown`: A, 100/100.
- Built CLI smoke: pass, archived a temp task, removed it from list output, and cleared active state.
- `agentloop verify --task .agentloop/tasks/2026-06-09-add-task-archive-command.md`: pass.

Latest local verification for the `0.10.0` release candidate:

- `npx tsx src/cli/index.ts version`: pass, reported `0.10.0`.
- Playwright README screenshot render: pass for `agentloopkit-showcase.png` and `agentloopkit-verification.png`.
- VHS README terminal render: pass for `agentloopkit-cli.gif` using the `0.10.0` tarball name and showing `agentloop completion zsh`.
- `git diff --check`: pass.
- `npx pnpm@10.12.1 lint`: pass.
- `npx pnpm@10.12.1 typecheck`: pass.
- `npx pnpm@10.12.1 test`: pass, 20 files and 64 tests.
- `npx pnpm@10.12.1 check:links`: pass, 269 Markdown files checked.
- `npx pnpm@10.12.1 build`: pass.
- `npx projscan doctor --format markdown`: A, 100/100.
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.10.0.tgz`.
- `npm publish --access public --dry-run`: pass.
- Packed CLI smoke: pass, `agentloop version` reported `0.10.0` and completions rendered for zsh, bash, and fish.
- `agentloop verify --task .agentloop/tasks/2026-06-09-prepare-0-10-0-shell-completions-release.md`: pass.

Latest local verification for shell completions:

- Shell completion red test first: `npx pnpm@10.12.1 test tests/completion.test.ts` failed before `src/core/completions.ts` existed.
- Focused green test: `npx pnpm@10.12.1 test tests/completion.test.ts`: pass, 1 file and 6 tests.
- `git diff --check`: pass.
- `npx pnpm@10.12.1 lint`: pass.
- `npx pnpm@10.12.1 typecheck`: pass.
- `npx pnpm@10.12.1 test`: pass, 20 files and 64 tests.
- `npx pnpm@10.12.1 check:links`: pass, 265 Markdown files checked.
- `npx pnpm@10.12.1 build`: pass.
- `npx projscan doctor --format markdown`: A, 100/100.
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.9.0.tgz`.
- Packed CLI smoke: pass for zsh, bash, fish, and unsupported-shell failure output.
- `agentloop verify --task .agentloop/tasks/2026-06-09-add-shell-completions.md`: pass.

Latest release status:

- GitHub release `v0.18.0`: public, tarball attached.
- GitHub release URL: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.18.0
- Tarball SHA-256: `7c3b6b7f12c34e57b9bfd70bb4491abd566b37b86bf0c642d9d517a7dcdb4d26`.
- GitHub release asset digest: `sha256:7c3b6b7f12c34e57b9bfd70bb4491abd566b37b86bf0c642d9d517a7dcdb4d26`.
- CI run `27244057325`: passed for commit `c5d148b79ade57654b4ffc6c858143c926fabadf`.
- Publish workflow run `27244098928`: package checks passed, final `npm publish` failed with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- Local exact-tarball publish for `0.18.0`: failed with authorization `E404`.
- npm registry proof after release: latest `0.1.1`, versions `0.1.0` and `0.1.1`.

Latest local verification for the `0.9.0` release candidate:

- `npx tsx src/cli/index.ts version`: pass, reported `0.9.0`.
- `git diff --check`: pass.
- `npx pnpm@10.12.1 lint`: pass.
- `npx pnpm@10.12.1 typecheck`: pass.
- `npx pnpm@10.12.1 test`: pass, 19 files and 58 tests.
- `npx pnpm@10.12.1 check:links`: pass, 259 Markdown files checked.
- `npx pnpm@10.12.1 build`: pass.
- `npx projscan doctor --format markdown`: A, 100/100.
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.9.0.tgz`.
- `npm publish --access public --dry-run`: pass.
- Packed CLI smoke: pass, `agentloop version` reported `0.9.0` and `agentloop task status` updated a temp task to `done`.
- Playwright README screenshot render: pass for hero and verification PNGs.
- VHS README terminal render: pass for `agentloopkit-cli.gif` with the `0.9.0` tarball.
- `agentloop verify --task .agentloop/tasks/2026-06-09-prepare-0-9-0-task-status-release.md`: pass.

Latest local verification for task status transitions:

- Red test first: `npx pnpm@10.12.1 test tests/task-state.test.ts` failed because `updateTaskStatus` did not exist and `agentloop task status` was unknown.
- Focused green test: `npx pnpm@10.12.1 test tests/task-state.test.ts`: pass, 1 file and 11 tests.
- `git diff --check`: pass.
- `npx pnpm@10.12.1 lint`: pass.
- `npx pnpm@10.12.1 typecheck`: pass.
- `npx pnpm@10.12.1 test`: pass, 19 files and 58 tests.
- `npx pnpm@10.12.1 check:links`: pass, 255 Markdown files checked.
- `npx pnpm@10.12.1 build`: pass.
- `npx projscan doctor --format markdown`: A, 100/100.
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.8.0.tgz`.
- Packed CLI smoke: pass, `agentloop task status` updated a temp task to `done`.
- Playwright README screenshot render: pass for hero and verification PNGs.
- VHS README terminal render: pass for `agentloopkit-cli.gif` with the new status command.
- `agentloop verify --task .agentloop/tasks/2026-06-09-add-task-status-transitions.md`: pass.

Earlier product-panel MVP verification:

- lint: pass
- typecheck: pass
- Vitest: 13 files, 26 tests passed
- build: pass
- projscan: A, 100/100
- pack: pass
- tarball smoke test for `.agentloop/README.md` and `install-agent all`: pass
- AgentLoopKit `verify`: pass
- AgentLoopKit `summarize --write`: pass

Latest local verification for the `0.1.1` README visual release candidate:

- `npx pnpm@10.12.1 lint`: pass
- `npx pnpm@10.12.1 typecheck`: pass
- `npx pnpm@10.12.1 test`: pass, 13 files and 26 tests
- `npx pnpm@10.12.1 build`: pass
- `npx projscan doctor --format markdown`: A, 100/100
- `npx pnpm@10.12.1 pack`: pass
- `npm publish --access public --dry-run`: pass
- `0.1.1` tarball smoke: pass
- `npm publish --access public`: completed after maintainer browser/OTP authentication

Latest local verification for the monorepo guidance iteration:

- Red test first: `npx pnpm@10.12.1 test tests/init.test.ts` failed because generated templates did not mention package-specific verification.
- Focused green test: `npx pnpm@10.12.1 test tests/init.test.ts`: pass, 1 file and 3 tests.
- `npx prettier --check ...`: pass for edited Markdown, templates, and test file.
- `git diff --check`: pass.
- `npx pnpm@10.12.1 lint`: pass.
- `npx pnpm@10.12.1 typecheck`: pass.
- `npx pnpm@10.12.1 test`: pass, 18 files and 51 tests.
- `npx pnpm@10.12.1 build`: pass.
- `npx projscan doctor --format markdown`: A, 100/100.
- Built CLI temp init smoke: pass, generated harness files include package-specific verification guidance.
- `agentloop verify --task .agentloop/tasks/2026-06-09-add-per-package-monorepo-verification-guidance.md`: pass.
- Playwright README screenshot render: pass for hero and verification PNGs.
- VHS README terminal render: pass for `agentloopkit-cli.gif`.

Latest local verification for the monorepo doctor suggestions iteration:

- Red test first: `npx pnpm@10.12.1 test tests/doctor.test.ts` failed because the Monorepo check message only listed markers.
- Focused green test: `npx pnpm@10.12.1 test tests/doctor.test.ts`: pass, 1 file and 3 tests.
- `npx prettier --check ...`: pass after formatting backlog and task contract.
- `git diff --check`: pass.
- `npx pnpm@10.12.1 lint`: pass.
- `npx pnpm@10.12.1 typecheck`: pass.
- `npx pnpm@10.12.1 test`: pass, 18 files and 51 tests.
- `npx pnpm@10.12.1 build`: pass.
- `npx projscan doctor --format markdown`: A, 100/100.
- Built CLI doctor JSON smoke: pass, Monorepo warning includes package-specific verification guidance.
- `npx pnpm@10.12.1 pack`: pass.
- Packed CLI doctor JSON smoke: pass.
- `agentloop verify --task .agentloop/tasks/2026-06-09-add-monorepo-doctor-verification-suggestions.md`: pass.

Latest local verification for the markdown link checking iteration:

- Red test first: `npx pnpm@10.12.1 test tests/markdown-links.test.ts` failed because `src/core/markdown-links.ts` did not exist.
- Focused green test: `npx pnpm@10.12.1 test tests/markdown-links.test.ts`: pass, 1 file and 4 tests.
- `npx prettier --check ...`: pass after formatting new files.
- `git diff --check`: pass.
- `npx pnpm@10.12.1 lint`: pass.
- `npx pnpm@10.12.1 typecheck`: pass.
- `npx pnpm@10.12.1 test`: pass, 19 files and 55 tests.
- `npx pnpm@10.12.1 check:links`: pass, 246 Markdown files checked.
- `npx pnpm@10.12.1 build`: pass.
- `npx projscan doctor --format markdown`: A, 100/100.
- `npx pnpm@10.12.1 pack`: pass.
- `agentloop verify --task .agentloop/tasks/2026-06-09-add-markdown-link-checking.md`: pass.

Latest local verification for the `0.8.0` release candidate:

- `npx tsx src/cli/index.ts version`: pass, reported `0.8.0`.
- `npx prettier --check ...`: pass for release metadata files.
- `git diff --check`: pass.
- `npx pnpm@10.12.1 lint`: pass.
- `npx pnpm@10.12.1 typecheck`: pass.
- `npx pnpm@10.12.1 test`: pass, 19 files and 55 tests.
- `npx pnpm@10.12.1 check:links`: pass, 251 Markdown files checked.
- `npx pnpm@10.12.1 build`: pass.
- `npx projscan doctor --format markdown`: A, 100/100.
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.8.0.tgz`.
- `npm publish --access public --dry-run`: pass.
- Packed CLI smoke: pass, `agentloop version` reported `0.8.0` and `doctor --json` included package-specific verification guidance.
- `agentloop verify --task .agentloop/tasks/2026-06-09-prepare-0-8-0-launch-quality-release.md`: pass.
- VHS README terminal render: pass for `agentloopkit-cli.gif` using the `0.8.0` tarball name.

Latest local verification for `agentloop status`:

- Red tests first: `tests/status.test.ts` and `tests/version.test.ts` failed before implementation.
- Focused green tests: `npx pnpm@10.12.1 test tests/status.test.ts tests/version.test.ts` passed, 2 files and 3 tests.
- `npx pnpm@10.12.1 lint`: pass
- `npx pnpm@10.12.1 typecheck`: pass
- `npx pnpm@10.12.1 test`: pass, 15 files and 29 tests
- `npx pnpm@10.12.1 build`: pass
- `npx projscan doctor --format markdown`: A, 100/100
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.2.0.tgz`
- `npm publish --access public --dry-run`: pass
- `0.2.0` tarball smoke: pass
- `agentloop verify`: pass after this repo's config was aligned to `npx pnpm@10.12.1`

Latest local verification for the `0.2.1` GitHub release:

- `git diff --check`: pass
- `npx pnpm@10.12.1 lint`: pass
- `npx pnpm@10.12.1 typecheck`: pass
- `npx pnpm@10.12.1 test`: pass, 15 files and 31 tests
- `npx pnpm@10.12.1 build`: pass
- `npx projscan doctor --format markdown`: A, 100/100
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.2.1.tgz`
- `npm publish --access public --dry-run`: pass
- Tarball smoke: version reports `0.2.1`; custom verification passes when default checks are disabled with `--no-test --no-lint --no-typecheck --no-build`
- GitHub release `v0.2.1`: created
- GitHub Publish workflow for `v0.2.1`: checks passed, npm publish failed with authorization `E404`
- npm registry check: latest remains `0.1.1`

Latest local verification for the `0.3.0` handoff command release candidate:

- Red test first: `npx pnpm@10.12.1 test tests/handoff.test.ts` failed with `unknown command 'handoff'`.
- Status red test: `npx pnpm@10.12.1 test tests/status.test.ts` failed because status still suggested `agentloop summarize --write`.
- Focused green tests: `npx pnpm@10.12.1 test tests/handoff.test.ts tests/status.test.ts`: pass, 2 files and 5 tests
- `git diff --check`: pass
- `npx pnpm@10.12.1 lint`: pass
- `npx pnpm@10.12.1 typecheck`: pass
- `npx pnpm@10.12.1 test`: pass, 16 files and 33 tests
- `npx pnpm@10.12.1 build`: pass
- `npx projscan doctor --format markdown`: A, 100/100
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.3.0.tgz`
- Tarball smoke: pass, `agentloop handoff --json` wrote a handoff file from an isolated temp repo
- `npm publish --access public --dry-run`: pass
- `agentloop verify`: pass
- `agentloop handoff --task .agentloop/tasks/2026-06-09-add-handoff-command-alias.md --json`: pass

Latest local verification for the `0.3.0` repeated create-task flag fix:

- Reproduction in a temp repo: only the last repeated constraint, non-goal, acceptance criterion, and verification command appeared.
- Red test first: `npx pnpm@10.12.1 test tests/create-task.test.ts` failed because earlier repeated values were missing.
- Focused green test: `npx pnpm@10.12.1 test tests/create-task.test.ts`: pass
- `git diff --check`: pass
- `npx pnpm@10.12.1 lint`: pass
- `npx pnpm@10.12.1 typecheck`: pass
- `npx pnpm@10.12.1 test`: pass, 17 files and 34 tests
- `npx pnpm@10.12.1 build`: pass
- `npx projscan doctor --format markdown`: A, 100/100
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.3.0.tgz`
- Tarball smoke: pass, repeated create-task flags were preserved from the packed CLI
- `npm publish --access public --dry-run`: pass

Latest CI recovery for the `0.3.0` repeated create-task flag fix:

- GitHub CI run `27214329125` failed because CLI tests ran `npx tsx` from temp directories and npm tried to install `tsx` during tests.
- Focused local recovery test: `npx pnpm@10.12.1 test tests/create-task.test.ts tests/handoff.test.ts tests/status.test.ts tests/version.test.ts`: pass, 4 files and 7 tests
- `git diff --check`: pass
- `npx pnpm@10.12.1 lint`: pass
- `npx pnpm@10.12.1 typecheck`: pass
- `npx pnpm@10.12.1 test`: pass, 17 files and 34 tests
- `npx pnpm@10.12.1 build`: pass
- `npx projscan doctor --format markdown`: A, 100/100

Latest local verification for the `0.3.0` active task detection fix:

- Red tests first: `npx pnpm@10.12.1 test tests/status.test.ts tests/pr-summary.test.ts` failed because older alphabetically later task files were selected.
- Focused green tests: `npx pnpm@10.12.1 test tests/status.test.ts tests/pr-summary.test.ts`: pass, 2 files and 7 tests
- `git diff --check`: pass
- `npx pnpm@10.12.1 lint`: pass
- `npx pnpm@10.12.1 typecheck`: pass
- `npx pnpm@10.12.1 test`: pass, 17 files and 36 tests
- `npx pnpm@10.12.1 build`: pass
- `npx projscan doctor --format markdown`: A, 100/100
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.3.0.tgz`
- Tarball smoke: pass, packed `agentloop status --json` selected the newer modified task

Latest local verification for the `0.3.0` create-task area flags:

- Red test first: `npx pnpm@10.12.1 test tests/create-task.test.ts` failed with `unknown option '--likely-file'`.
- Focused green test: `npx pnpm@10.12.1 test tests/create-task.test.ts`: pass
- `git diff --check`: pass
- `npx pnpm@10.12.1 lint`: pass
- `npx pnpm@10.12.1 typecheck`: pass
- `npx pnpm@10.12.1 test`: pass, 17 files and 36 tests
- `npx pnpm@10.12.1 build`: pass
- `npx projscan doctor --format markdown`: A, 100/100
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.3.0.tgz`
- Tarball smoke: pass, packed `create-task` wrote repeated likely and forbidden file entries
- `npm publish --access public --dry-run`: pass

Latest local verification for the `0.3.0` create-task alias and npm auth recovery work:

- Dogfood reproduction: `node dist/cli/index.js create-task ... --desired-outcome ...` failed with `unknown option '--desired-outcome'`.
- Red test first: `npx pnpm@10.12.1 test tests/create-task.test.ts` failed with `unknown option '--problem-statement'`.
- Focused green test: `npx pnpm@10.12.1 test tests/create-task.test.ts`: pass, 2 tests
- `npx tsx src/cli/index.ts create-task ... --problem-statement ... --desired-outcome ... --verification ... --rollback ...`: pass, wrote `.agentloop/tasks/2026-06-09-document-npm-otp-publish-blocker.md`
- `git diff --check`: pass
- `npx pnpm@10.12.1 lint`: pass
- `npx pnpm@10.12.1 typecheck`: pass
- `npx pnpm@10.12.1 test`: pass, 17 files and 37 tests
- `npx pnpm@10.12.1 build`: pass
- `npx projscan doctor --format markdown`: A, 100/100
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.3.0.tgz`
- Tarball smoke: pass, packed `create-task` accepted the alias flags and wrote the expected task contract fields
- `npm publish --access public --dry-run`: pass
- Local `npm publish --access public` for `0.3.0`: typecheck pass, Vitest pass with 17 files and 36 tests, build pass, then npm stopped at `EOTP`
- GitHub release `v0.3.0`: created with npm-pending notes and attached `agentloopkit-0.3.0.tgz`
- GitHub Publish workflow run `27215993837` for `v0.3.0`: passed install, lint, typecheck, tests, build, npm upgrade, version check, and `prepublishOnly`; npm rejected the final publish with `E404`
- Stale manual GitHub Publish workflow run `27215293502`: cancelled because it targeted an older `0.3.0` commit
- npm registry check: latest remains `0.1.1`

Latest local verification for the unreleased active task lifecycle command:

- Red test first: `npx pnpm@10.12.1 test tests/task-state.test.ts tests/status.test.ts tests/pr-summary.test.ts tests/handoff.test.ts` failed because `src/core/task-state.ts` did not exist and status/handoff selected the newest task.
- Focused green test: `npx pnpm@10.12.1 test tests/task-state.test.ts tests/status.test.ts tests/pr-summary.test.ts tests/handoff.test.ts`: pass, 4 files and 15 tests
- `git diff --check`: pass
- `npx pnpm@10.12.1 lint`: pass
- `npx pnpm@10.12.1 typecheck`: pass
- `npx pnpm@10.12.1 test`: pass, 18 files and 43 tests
- `npx pnpm@10.12.1 build`: pass
- `npx projscan doctor --format markdown`: A, 100/100
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.3.0.tgz`
- Tarball smoke: pass, packed `agentloop task set`, `status --json`, and `task clear` behaved as expected
- `npm publish --access public --dry-run`: pass
- `agentloop verify --task .agentloop/tasks/2026-06-09-add-active-task-lifecycle-command.md`: pass, wrote `.agentloop/reports/2026-06-09-17-26-verification-report.md`
- `agentloop handoff --json`: pass, wrote `.agentloop/handoffs/2026-06-09-17-26-pr-summary.md`

Latest local verification for the `0.4.0` active task release candidate:

- `npx tsx src/cli/index.ts task set .agentloop/tasks/2026-06-09-prepare-0-4-0-active-task-release.md --json`: pass
- `npx tsx src/cli/index.ts version`: pass, reported `0.4.0`
- `git diff --check`: pass
- `npx pnpm@10.12.1 lint`: pass
- `npx pnpm@10.12.1 typecheck`: pass
- `npx pnpm@10.12.1 test`: pass, 18 files and 43 tests
- `npx pnpm@10.12.1 build`: pass
- `npx projscan doctor --format markdown`: A, 100/100
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.4.0.tgz`
- Tarball smoke: pass, packed `agentloop version` reported `0.4.0` and `agentloop task set/clear` worked
- `npm publish --access public --dry-run`: pass
- `agentloop verify --task .agentloop/tasks/2026-06-09-prepare-0-4-0-active-task-release.md`: pass, wrote `.agentloop/reports/2026-06-09-17-33-verification-report.md`
- `agentloop handoff --json`: pass, wrote `.agentloop/handoffs/2026-06-09-17-33-pr-summary.md`
- `agentloop task clear --json`: pass, removed `.agentloop/state.json`
- GitHub release `v0.4.0`: created with npm-pending notes and attached `agentloopkit-0.4.0.tgz`
- GitHub Publish workflow run `27217477927` for `v0.4.0`: passed install, lint, typecheck, tests, build, npm upgrade, version check, and `prepublishOnly`; npm rejected the final publish with `E404`

Latest local verification for the unreleased task-list command:

- Red test first: `npx pnpm@10.12.1 test tests/task-state.test.ts` failed because `listTasks` did not exist and `agentloop task list` was an unknown command.
- Focused green test: `npx pnpm@10.12.1 test tests/task-state.test.ts`: pass, 1 file and 5 tests
- `npx tsx src/cli/index.ts task list --json`: pass, listed task contracts without creating `.agentloop/state.json`
- `npx tsx src/cli/index.ts task set .agentloop/tasks/2026-06-09-add-task-list-command.md --json`: pass
- `npx tsx src/cli/index.ts task list`: pass, showed the active task first
- `git diff --check`: pass
- `npx pnpm@10.12.1 lint`: pass
- `npx pnpm@10.12.1 typecheck`: pass
- `npx pnpm@10.12.1 test`: pass, 18 files and 45 tests
- `npx pnpm@10.12.1 build`: pass
- `npx projscan doctor --format markdown`: A, 100/100
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.4.0.tgz`
- Tarball smoke: pass, packed `init`, `create-task`, `task list`, `task set`, and `task clear` behaved as expected in a fresh repo
- `npm publish --access public --dry-run`: pass
- `agentloop verify --task .agentloop/tasks/2026-06-09-add-task-list-command.md`: pass, wrote `.agentloop/reports/2026-06-09-17-46-verification-report.md`
- `agentloop handoff`: pass, wrote `.agentloop/handoffs/2026-06-09-17-47-pr-summary.md`
- `agentloop task clear --json`: pass, removed `.agentloop/state.json`

Latest local verification for the `0.5.0` task-list release candidate:

- `npx tsx src/cli/index.ts version`: pass, reported `0.5.0`
- `git diff --check`: pass
- `npx pnpm@10.12.1 lint`: pass
- `npx pnpm@10.12.1 typecheck`: pass
- `npx pnpm@10.12.1 test`: pass, 18 files and 45 tests
- `npx pnpm@10.12.1 build`: pass
- `npx projscan doctor --format markdown`: A, 100/100
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.5.0.tgz`
- Tarball smoke: pass, packed `agentloop version` reported `0.5.0` and `agentloop task list` behaved as expected
- `npm publish --access public --dry-run`: pass
- `agentloop verify --task .agentloop/tasks/2026-06-09-prepare-0-5-0-task-list-release.md`: pass, wrote `.agentloop/reports/2026-06-09-17-54-verification-report.md`
- `agentloop handoff`: pass, wrote `.agentloop/handoffs/2026-06-09-17-54-pr-summary.md`
- `agentloop task clear --json`: pass, removed `.agentloop/state.json`

Latest local verification for the `0.6.0` task-show release candidate:

- `npx tsx src/cli/index.ts version`: pass, reported `0.6.0`
- `git diff --check`: pass
- `npx pnpm@10.12.1 lint`: pass
- `npx pnpm@10.12.1 typecheck`: pass
- `npx pnpm@10.12.1 test`: pass, 18 files and 48 tests
- `npx pnpm@10.12.1 build`: pass
- `npx projscan doctor --format markdown`: A, 100/100
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.6.0.tgz`
- Tarball smoke: pass, packed `agentloop version` reported `0.6.0` and `agentloop task show` behaved as expected
- `npm publish --access public --dry-run`: pass
- `agentloop verify --task .agentloop/tasks/2026-06-09-prepare-0-6-0-task-show-release.md`: pass, wrote `.agentloop/reports/2026-06-09-18-15-verification-report.md`
- `agentloop handoff`: pass, wrote `.agentloop/handoffs/2026-06-09-18-15-pr-summary.md`
- `agentloop task clear --json`: pass, removed `.agentloop/state.json`

Latest local verification for the `0.6.0` README visual refresh and GitHub release:

- Playwright screenshot render: pass for README hero and verification PNGs
- VHS terminal render: pass for the README GIF
- `git diff --check`: pass
- `npx pnpm@10.12.1 lint`: pass
- `npx pnpm@10.12.1 typecheck`: pass
- `npx pnpm@10.12.1 test`: pass, 18 files and 48 tests
- `npx pnpm@10.12.1 build`: pass
- `npx projscan doctor --format markdown`: A, 100/100
- `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.6.0.tgz`
- Packed CLI smoke: pass, `agentloop version` reported `0.6.0` and dry-run init reported 50 files
- GitHub CI run `27220632864`: pass on commit `284cd2a`
- GitHub release `v0.6.0`: published with attached `agentloopkit-0.6.0.tgz`
- GitHub Publish workflow run `27220705510`: package checks and `prepublishOnly` passed, final `npm publish` failed with authorization `E404`
- Local `npm publish --access public`: package checks passed, npm stopped at `EOTP`

Latest local verification for unreleased monorepo doctor awareness:

- Red focused test: `npx pnpm@10.12.1 test tests/project-detection.test.ts tests/doctor.test.ts` failed before implementation because `detectMonorepo` did not exist and doctor had no `Monorepo` check.
- Focused green test: `npx pnpm@10.12.1 test tests/project-detection.test.ts tests/doctor.test.ts`: pass, 2 files and 8 tests
- CLI smoke in a temp workspace root: pass, `doctor --json` reported package workspaces, `pnpm-workspace.yaml`, and `turbo.json`
- `git diff --check`: pass
- `npx pnpm@10.12.1 lint`: pass
- `npx pnpm@10.12.1 typecheck`: pass
- `npx pnpm@10.12.1 test`: pass, 18 files and 51 tests
- `npx pnpm@10.12.1 build`: pass
- `npx projscan doctor --format markdown`: A, 100/100
- `npx pnpm@10.12.1 pack`: pass
- Packed CLI smoke: pass, `doctor --json` reported package workspaces and `rush.json`

## How to package

```bash
npx pnpm@10.12.1 build
npx pnpm@10.12.1 pack
npx --yes --package ./agentloopkit-0.6.0.tgz agentloop version
```

## How to publish to npm

Preferred path after `0.1.0`:

1. Configure npm trusted publishing for this GitHub repository.
2. Publish future GitHub releases, or rerun the Publish workflow for an existing release.
3. Let `.github/workflows/publish.yml` run checks and `npm publish` through OIDC.
4. If a version already exists on npm, the workflow skips the publish step.

Trusted publisher settings:

- Owner: `abhiyoheswaran1`
- Repository: `AgentLoopKit`
- Workflow filename: `publish.yml`
- Allowed action: `npm publish`

Manual fallback:

```bash
npm login
npm whoami
npm publish --access public
```

The first manual publish for `agentloopkit@0.1.0` was completed with npm browser/OTP authentication.

Current publish state:

- GitHub release `v0.32.0` is public.
- npm latest is `agentloopkit@0.32.0`.
- GHCR and MCP Registry workflows passed for `0.32.0`.
- npm trusted publishing is configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`.
- Releases now publish through GitHub Releases and trusted publishing.
- Do not publish stale intermediate versions from current `main`. Use matching release commits or release tarballs if an old line must be reproduced.
- Do not paste npm OTPs or tokens into chat, issues, PRs, or release notes.

## How users install it

```bash
npx agentloopkit init
npx agentloopkit doctor
npx --yes agentloopkit@latest version
```

Pinned team usage:

```bash
pnpm add -D agentloopkit
pnpm agentloop init
```

Global install:

```bash
npm install -g agentloopkit
agentloop init
```

## Product panel cycles completed

### Cycle 1: First-run experience

Decision: add generated `.agentloop/README.md` so users and agents get a local directory map and next commands.

Implemented:

- `.agentloop/README.md` template
- init generation and dry-run coverage
- tests

### Cycle 2: Agent compatibility

Decision: add `agentloop install-agent all` for multi-agent users.

Implemented:

- bulk install helper
- CLI support
- tests
- README update

### Cycle 3: Open-source launch readiness

Decision: add npm trusted publishing workflow and clearer publishing docs.

Implemented:

- `.github/workflows/publish.yml`
- publishing docs update
- README publishing status
- changelog and roadmap updates

### Cycle 4: README launch visuals

Decision: add README-native visuals generated with Playwright and VHS, then ship a patch release instead of mutating `0.1.0`.

Implemented:

- Playwright-rendered workflow and verification screenshots
- VHS terminal GIF of the published CLI flow
- README image embeds with npm-safe raw GitHub URLs
- `0.1.1` release candidate and changelog entry
- publish workflow guard for already-published versions

### Cycle 5: Status command

Decision: add a read-only status command instead of a dashboard.

Implemented:

- `agentloop status`
- `agentloop status --json`
- package-version-based `agentloop version`
- Vitest coverage for status and version behavior

### Cycle 21: Active task lifecycle

Decision: add a transparent repo-local active task pointer instead of relying only on newest-file inference.

Implemented:

- `agentloop task set <path>`
- `agentloop task current`
- `agentloop task clear`
- `.agentloop/state.json` read/write/clear behavior
- status and handoff preference for the pinned task

### Cycle 22: 0.4.0 release candidate

Decision: prepare a GitHub release for the active task lifecycle while keeping npm availability notes explicit.

Implemented:

- package metadata bump to `0.4.0`
- `v0.4.0` GitHub release with attached tarball
- release-status docs for the npm authorization failure

### Cycle 23: Task discovery

Decision: add a read-only task-list command so users and agents can inspect task contracts before pinning one.

Implemented:

- `agentloop task list`
- `agentloop task list --json`
- active-task markers, status, title, path, and modification time output
- docs and generated agent template updates

### Cycle 24: 0.5.0 release candidate

Decision: move task-list behavior into a new release candidate because `v0.4.0` already points at the active-task lifecycle release.

Implemented:

- package metadata bump to `0.5.0`
- `0.5.0` changelog entry for task discovery
- launch, publishing, final handoff, backlog, and product-panel release records

### Cycle 25: Task contract reading

Decision: add a read-only task-show command so users and agents can inspect a selected task contract after listing it.

Implemented:

- `agentloop task show <path>`
- `agentloop task show <path> --json`
- path safety through the existing `.agentloop/tasks` resolver
- docs and generated agent template updates

### Cycle 26: 0.6.0 release candidate

Decision: move task-show behavior into a new release candidate because `v0.5.0` already points at the task-list release.

Implemented:

- package metadata bump to `0.6.0`
- `0.6.0` changelog entry for task reading
- launch, publishing, final handoff, backlog, and product-panel release records

### Cycle 27: README visual refresh

Decision: refresh launch visuals for the current `0.6.0` workflow before creating the GitHub release.

Implemented:

- Playwright-rendered README hero and verification screenshots
- VHS terminal GIF generated from a locally packed `0.6.0` tarball
- README copy clarifying the source-versus-npm version split
- `v0.6.0` GitHub release with attached tarball and npm-pending notes

### Cycle 28: Monorepo doctor awareness

Decision: add a warning-only doctor check for common workspace markers.

Implemented:

- `detectMonorepo`
- `Monorepo` doctor check in markdown and JSON output
- Vitest coverage for package workspaces, `pnpm-workspace.yaml`, Turbo, Nx, Lerna, and Rush markers
- README and getting-started docs

### Cycle 29: 0.7.0 release candidate

Decision: prepare monorepo doctor awareness as `0.7.0` because `v0.6.0` already points at task reading and README visual refresh.

Implemented:

- package metadata bump to `0.7.0`
- `0.7.0` changelog entry for monorepo doctor awareness
- launch, publishing, final handoff, backlog, and product-panel release records

### Cycle 30: 0.7.0 release status

Decision: publish the GitHub release and record the npm authorization blocker without implying npm availability.

Implemented:

- public GitHub release `v0.7.0` with attached `agentloopkit-0.7.0.tgz`
- release notes updated with Publish workflow and local npm auth results
- launch, publishing, final handoff, backlog, and dogfood release-status records

### Cycle 31: per-package monorepo verification guidance

Decision: add guidance to generated files and docs, not a workspace runner.

Implemented:

- generated `.agentloop/harness/commands.md` guidance for root versus package-level checks
- generated `.agentloop/README.md` monorepo notes with package-check examples
- generated `.agentloop/tasks/README.md` guidance for package-specific verification commands
- README and getting-started docs that state AgentLoopKit does not infer package graphs or run workspace commands automatically
- Vitest coverage for generated guidance

### Cycle 32: monorepo doctor verification suggestions

Decision: make the Monorepo doctor warning actionable while preserving explicit command execution.

Implemented:

- Monorepo doctor warning now suggests package-specific verification commands
- Doctor JSON shape remains the same; only the message changed
- README and getting-started docs mention the more actionable warning
- Vitest coverage for the displayed warning

### Cycle 33: markdown link checking

Decision: add a local docs trust check without network crawling.

Implemented:

- dependency-free local Markdown link checker
- Vitest coverage for missing local links, anchors, external links, fenced code, and ignored directories
- `pnpm check:links`
- CI step for Markdown link checking
- contributor and launch checklist updates

### Cycle 34: 0.8.0 release candidate

Decision: package the post-`v0.7.0` launch-quality work as `0.8.0`.

Implemented:

- package metadata bump to `0.8.0`
- `0.8.0` changelog entry for monorepo guidance, actionable doctor warnings, and Markdown link checking
- README source note update
- VHS tape update to use `agentloopkit-0.8.0.tgz`
- launch, publishing, final handoff, backlog, and product-panel release records

### Cycle 35: 0.8.0 release status

Decision: publish the GitHub release and record the npm authorization blocker without implying npm availability.

Implemented:

- public GitHub release `v0.8.0` with attached `agentloopkit-0.8.0.tgz`
- release notes updated with Publish workflow and local npm auth results
- launch, publishing, final handoff, backlog, and dogfood release-status records

### Cycle 36: task status transitions

Decision: add a narrow task status command that edits Markdown task contracts instead of adding a task database.

Implemented:

- `agentloop task status <path> <status>`
- JSON output for status updates
- fixed status set: `proposed`, `in-progress`, `blocked`, `review`, and `done`
- generated agent, harness, README, and getting-started guidance
- refreshed README screenshots and VHS terminal demo

### Cycle 37: 0.9.0 release candidate

Decision: package task status transitions as `0.9.0` because `v0.8.0` already points at the previous launch-quality release.

Implemented:

- package metadata bump to `0.9.0`
- `0.9.0` changelog entry for task status transitions
- README source note update
- VHS tape update to use `agentloopkit-0.9.0.tgz`
- launch, publishing, final handoff, backlog, and product-panel release records

### Cycle 38: 0.9.0 release status

Decision: publish the GitHub release and record the npm authorization blocker without implying npm availability.

Implemented:

- public GitHub release `v0.9.0` with attached `agentloopkit-0.9.0.tgz`
- release notes updated with Publish workflow `E404` and npm registry state
- launch checklist, npm publishing docs, final handoff, backlog, and dogfood release-status records

### Cycle 39: Shell completions

Decision: add shell completion script generation for repeat CLI users, with no profile-file mutation.

Implemented:

- `agentloop completion <bash|zsh|fish>`
- static completion scripts printed to stdout
- top-level command, task subcommand, task status, install-agent, and shell-name completions
- README and getting-started docs that tell users the command does not edit shell profiles

### Cycle 40: 0.10.0 release candidate

Decision: package shell completions as `0.10.0` because `v0.9.0` already points at the task-status release.

Implemented:

- package metadata bump to `0.10.0`
- `0.10.0` changelog entry for shell completions
- README source note update
- VHS tape update to use `agentloopkit-0.10.0.tgz` and show `agentloop completion zsh`
- Playwright screenshot refresh for current test and verification counts
- launch, publishing, final handoff, backlog, and product-panel release records

### Cycle 41: 0.10.0 release status

Decision: publish the GitHub release and record the npm authorization blocker without implying npm availability.

Implemented:

- public GitHub release `v0.10.0` with attached `agentloopkit-0.10.0.tgz`
- release notes updated with Publish workflow `E404` and npm registry state
- launch checklist, npm publishing docs, final handoff, backlog, and dogfood release-status records

### Cycle 42: task archive command

Decision: add a single-task archive command instead of a task database, bulk move, restore flow, or dashboard.

Implemented:

- `agentloop task archive <path>`
- file move into `.agentloop/tasks/archive/`
- collision refusal for existing archive files
- active task pointer clearing when the archived task was active
- task list behavior that excludes archived tasks by default
- README, docs, shell completions, harness, and generated agent guidance

### Cycle 43: 0.11.0 release candidate

Decision: package task archiving as `0.11.0` because `v0.10.0` already points at the shell-completion release.

Implemented:

- package metadata bump to `0.11.0`
- `0.11.0` changelog entry for task archiving
- README source note and quick command flow update
- VHS tape update to use `agentloopkit-0.11.0.tgz` and show `agentloop task archive`
- Playwright screenshot refresh for current test counts and archive workflow
- launch, publishing, final handoff, backlog, and product-panel release records

### Cycle 44: 0.11.0 release status

Decision: publish the GitHub release and record the npm authorization blocker without implying npm availability.

Implemented:

- public GitHub release `v0.11.0` with attached `agentloopkit-0.11.0.tgz`
- release notes updated with Publish workflow `E404` and npm registry state
- launch checklist, npm publishing docs, final handoff, backlog, and dogfood release-status records

### Cycle 45: create-task JSON output

Decision: add opt-in JSON output to `create-task` because agents should not parse the human success line.

Implemented:

- `agentloop create-task --json`
- JSON output containing the created task path and Markdown content
- unchanged default text output
- README, getting-started, task-contract docs, and generated task README guidance

### Cycle 46: 0.12.0 release candidate

Decision: package `create-task --json` as `0.12.0` because `v0.11.0` already points at the task archive release.

Implemented:

- package metadata bump to `0.12.0`
- `0.12.0` changelog entry for `create-task --json`
- Playwright screenshot refresh showing 68 tests
- VHS tape update to use `agentloopkit-0.12.0.tgz` and show `create-task --json`
- launch checklist, npm publishing docs, final handoff, backlog, and dogfood release-candidate records

### Cycle 47: 0.12.0 release status

Decision: document the public GitHub release and npm authorization failure without claiming npm availability.

Implemented:

- public GitHub release `v0.12.0` with attached `agentloopkit-0.12.0.tgz`
- release notes updated with Publish workflow `E404` and npm registry state
- launch checklist, npm publishing docs, final handoff, backlog, and dogfood release-status records

### Cycle 48: check-gates command

Decision: add a local review-evidence checker instead of a policy engine.

Implemented:

- `agentloop check-gates`
- human and JSON output for task, verification, handoff, harness, policy, and git gates
- `agentloop check-gates --json`
- gate checks for task contract, verification report, handoff summary, repo harness, safety policies, and git context
- generated agent and harness guidance updates
- README, getting-started docs, dedicated gate-check docs, generated harness guidance, and agent templates

### Cycle 49: 0.13.0 release candidate

Decision: package `check-gates` as `0.13.0` because it gives agents one deterministic review-readiness command before handoff.

Implemented:

- package metadata bump to `0.13.0`
- `0.13.0` changelog entry for `check-gates`
- Playwright screenshot refresh showing 70 tests and `check-gates`
- VHS tape update to use `agentloopkit-0.13.0.tgz` and show `check-gates`
- launch checklist, npm publishing docs, final handoff, backlog, and dogfood release-candidate records

### Cycle 50: 0.13.0 release status

Decision: document `v0.13.0` as a public GitHub release and keep npm status explicit after the publish workflow failed at authorization.

Implemented:

- GitHub release `v0.13.0` with attached `agentloopkit-0.13.0.tgz`
- release notes updated with the npm version-jump explanation and exact `E404` failure
- launch checklist, npm publishing docs, final handoff, backlog, and dogfood release-status records

### Cycle 51: check-gates strict mode

Decision: add `agentloop check-gates --strict` so CI users can fail on warning-level gates without parsing JSON.

Implemented:

- strict mode in the check-gates core and CLI
- JSON output with `strict: true` or `strict: false`
- Markdown output that names strict mode
- Vitest coverage for default warning behavior and strict warning failure
- README, getting-started docs, gate-check docs, and generated harness guidance

### Cycle 52: 0.14.0 release candidate

Decision: package strict gate checks as `0.14.0` because `main` now contains behavior that `v0.13.0` does not.

Implemented:

- package metadata bump to `0.14.0`
- `0.14.0` changelog entry for `check-gates --strict`
- README source note explaining the npm jump from `0.1.1` to the next catch-up version
- Playwright screenshot refresh showing 71 tests and strict gates
- VHS tape update to use `agentloopkit-0.14.0.tgz` and show `check-gates --strict`
- launch checklist, npm publishing docs, final handoff, backlog, and dogfood release-candidate records

### Cycle 53: 0.14.0 release status

Decision: document `v0.14.0` as a public GitHub release and keep npm status explicit after the publish workflow failed at authorization.

Implemented:

- GitHub release `v0.14.0` with attached `agentloopkit-0.14.0.tgz`
- release notes updated with exact `E404` failure and npm registry state
- launch checklist, npm publishing docs, final handoff, backlog, and dogfood release-status records

### Cycle 54: GitHub Actions usage recipes

Decision: add CI recipes as documentation and examples instead of adding a workflow installer.

Implemented:

- `docs/github-actions.md` with committed-evidence and CI-generated-artifact recipes
- `examples/github-actions/README.md` with copy-pasteable workflow snippets
- README and getting-started links to the CI recipes
- generated harness guidance explaining strict gates in CI
- npm-status-honest install notes that pin the `v0.14.0` GitHub tarball while npm latest remains behind

### Cycle 55: stack-specific starter recipes

Decision: add stack recipes as documentation and example guidance instead of adding framework automation.

Implemented:

- `docs/stack-recipes.md` with Next.js, React/Vite, Node API, Python, docs-only, empty-repo, and monorepo recipes
- example README updates for Next.js, Node API, Python service, docs-only, and empty repos
- README and getting-started links to stack recipes
- copy-pasteable task contract examples and verification commands
- explicit reminder that root monorepo checks do not prove package-level coverage unless the repo documents that behavior

### Cycle 56: CI context in verification reports

Decision: add safe CI provenance to verification reports without adding a dashboard, workflow installer, or environment dump.

Implemented:

- GitHub Actions `CI Context` section in `agentloop verify` reports
- generic `CI=true` fallback that records `Generic CI`
- allowlisted CI variable handling with no `.env` reads and no arbitrary environment output
- tests for GitHub Actions metadata, generic CI metadata, and local-report omission
- README, verification docs, GitHub Actions docs, examples, and generated harness guidance

### Cycle 57: 0.15.0 release candidate

Decision: package CI context in verification reports as `0.15.0` because `main` now contains behavior that `v0.14.0` does not.

Implemented:

- package metadata bump to `0.15.0`
- `0.15.0` changelog entry for CI context in verification reports
- README and CI recipe updates that pin the future `v0.15.0` GitHub tarball while npm remains behind
- VHS tape update to use `agentloopkit-0.15.0.tgz`
- Playwright screenshot refresh with the current 74-test count
- launch checklist, npm publishing docs, final handoff, backlog, and dogfood release-candidate records

### Cycle 58: 0.15.0 release status

Decision: document `v0.15.0` as a public GitHub release and keep npm status explicit after the publish workflow failed at authorization.

Implemented:

- GitHub release `v0.15.0` with attached `agentloopkit-0.15.0.tgz`
- release notes with tarball SHA, local verification, CI run, and npm-pending status
- Publish workflow result for run `27237034367`: package checks passed, final `npm publish` failed with `E404`
- npm registry proof after release: latest `0.1.1`, versions `0.1.0` and `0.1.1`
- launch checklist, npm publishing docs, final handoff, backlog, and dogfood release-status records

### Cycle 59: doctor risk file details

Decision: improve first-run trust by making `doctor` show risk-file categories and capped path examples while keeping all findings warning-only.

Implemented:

- category-level `Risk files: <category>` checks in `doctor`
- three-path preview with a `(+N more)` suffix
- env-file path reporting without reading or printing contents
- Markdown documentation skipped for semantic risk categories to avoid template and policy false positives
- focused doctor and safety tests for category output and env-content privacy
- README, getting-started docs, backlog, dogfood log, decisions, and final handoff updates

### Cycle 60: config schema URL trust

Decision: use the GitHub raw schema URL for generated config editor support until a dedicated schema domain exists.

Implemented:

- default config `$schema` updated to the GitHub raw schema URL
- generated root config template updated to the same URL
- repo `agentloop.config.json` updated to the same URL
- packaged schema `$id` updated to the same URL
- configuration docs and README clarify that CLI validation is local and does not fetch the schema URL at runtime
- focused tests for defaults, init output, and schema metadata

### Cycle 61: 0.15.1 patch release candidate

Decision: package doctor risk-file details and config schema URL trust as `0.15.1`, a patch release, because the changes improve launch trust without adding a new command or breaking behavior.

Implemented so far:

- package metadata bump to `0.15.1`
- `0.15.1` changelog entry for doctor risk details and schema URL trust
- README, GitHub Actions docs, examples, and VHS source updated to pin the `v0.15.1` tarball while npm remains behind
- README screenshot sources updated from 74 tests to 76 tests
- launch checklist, npm publishing docs, final handoff, backlog, and dogfood release-candidate records

### Cycle 62: 0.15.1 release status

Decision: document `v0.15.1` as a public GitHub release and keep npm status explicit after the Publish workflow failed at authorization.

Implemented:

- GitHub release `v0.15.1` with attached `agentloopkit-0.15.1.tgz`
- tarball SHA-256 `56b3ac5b212d24c2214e73a59c5e5fd08fe9f62a0e17956ec5c07cbad7672490`
- Publish workflow run `27239176000` recorded as passing package checks and failing at npm publish with `E404`
- npm registry proof still showing latest `0.1.1`
- release-status task contract, product-panel cycle, launch checklist, npm publishing docs, dogfood log, and final handoff updates

### Cycle 63: Public roadmap refresh

Decision: refresh the public roadmap because it still listed shipped task status transitions and shell completion as future work after `v0.15.1`.

Implemented:

- `ROADMAP.md` now separates shipped capabilities, current npm blocker, near-term local-first improvements, later options, and non-goals
- README publishing status now states that npm currently serves `0.1.1` while GitHub release `v0.15.1` is current
- backlog, dogfood log, task contract, and product-panel cycle records

### Cycle 64: PR summary change areas

Decision: add deterministic path-based change-area classification to PR summaries so reviewers can see the shape of a diff faster without an LLM or file-content inspection.

Implemented:

- `## Change Areas` section grouped by source, tests, docs, CI, config/package, AgentLoop, risk-sensitive, and other paths
- `## Review Focus` section with deterministic reviewer hints based on those path groups
- Vitest coverage for the new summary output
- README, PR-summary docs, changelog, roadmap, backlog, dogfood log, and README visual asset refresh

### Cycle 65: Local HTML evidence report

Decision: add `agentloop report` as a local static evidence artifact after verification and handoff, without building a dashboard or calling external services.

Implemented:

- `agentloop report` CLI command with `--task`, `--report`, `--handoff`, `--out`, and `--json`
- static HTML renderer with escaped task, verification, handoff, git, diff, and deterministic summary content
- compact JSON output that returns the report path, metadata, and source paths without printing the full HTML body
- generated-handoff detection that ignores bundled handoff templates unless the user passes a path
- Vitest coverage for escaping, repository output, and CLI JSON behavior
- README, docs, generated harness templates, GitHub Actions recipe, changelog, roadmap, backlog, dogfood, final handoff, and README visual refresh

### Cycle 66: Local evidence badges

Decision: add `agentloop badge` as a local SVG status pointer for existing verification or gate evidence, without using a remote badge service.

Implemented:

- `agentloop badge` CLI command with `--source verification`, `--source gates`, `--strict`, `--out`, and `--json`
- dependency-free SVG badge renderer with escaped label and message text
- verification badge output at `.agentloop/reports/agentloop-verification.svg`
- gate badge output at `.agentloop/reports/agentloop-gates.svg`
- compact JSON output without embedding SVG contents
- Vitest coverage for SVG escaping, verification badge output, and gate-source CLI output
- README, badge docs, GitHub Actions examples, generated harness templates, roadmap, changelog, backlog, and dogfood updates

### Cycle 67: 0.16.0 npm catch-up release

Decision: prepare `0.16.0` as the release for badge behavior and npm catch-up. Existing GitHub tags already occupy `v0.2.0` through `v0.15.1`, so publishing an old version with newer source would make the package history less trustworthy.

Planned:

- package metadata bump to `0.16.0`
- `0.16.0` changelog entry for badge, report, and deterministic PR-summary improvements
- README and publishing docs updated to explain the one-time npm catch-up jump
- VHS source updated to use the `0.16.0` tarball
- npm publish and GitHub release only after verification, pack, smoke test, and CI pass

### Cycle 68: Template version guidance

Decision: add a local `.agentloop/manifest.json` and `doctor` checks for template provenance. This gives agents and maintainers a warning when generated harness metadata is missing, stale, invalid, or newer than the installed CLI without building an automatic migration engine.

Implemented:

- `.agentloop/manifest.json` generation during `agentloop init`
- current template version constants
- `agentloop doctor` warning-only manifest checks
- manual migration guidance in `docs/template-migrations.md`
- README, getting-started, configuration, generated workspace README, roadmap, changelog, backlog, and dogfood updates
- Vitest coverage for init manifest generation and doctor manifest checks

### Cycle 69: Local policy inspection

Decision: add read-only policy inspection instead of a policy engine. Users and agents need a direct way to find generated safety guidance, but AgentLoopKit should not claim compliance, scan source code, fetch policy packs, or mutate policy files.

Implemented:

- `agentloop policy list`
- `agentloop policy show <policy>`
- JSON output for policy list and show
- safe lookup restricted to known Markdown files under `.agentloop/policies/`
- static shell completion updates
- `docs/policies.md`, README, generated harness, agent-template, publishing, and release-doc updates
- package metadata bump to `0.17.0` because `main` moved after the public `v0.16.0` tag
- README terminal GIF regenerated with VHS and screenshots regenerated with Playwright

### Cycle 71: Local policy drift status

Decision: add read-only policy template status instead of policy editing, enforcement, migration, or compliance scoring. Agents and maintainers need to know whether local policy files are current, modified, missing, or extra without AgentLoopKit rewriting repo rules.

Implemented:

- `agentloop policy status`
- `agentloop policy status --json`
- deterministic `current`, `modified`, `missing`, and `extra` status entries
- comparison against bundled policy templates without remote fetches or local mutation
- static shell completion updates
- README, policy docs, generated harness, agent-template, publishing, launch-checklist, and final-handoff updates
- package metadata bump to `0.18.0` because `main` moved after the public `v0.17.0` tag
- README terminal GIF regenerated with VHS and screenshots regenerated with Playwright

### Cycle 72: 0.18.0 release status

Decision: explain the one-time npm catch-up jump instead of backfilling stale intermediate npm versions. GitHub release `v0.18.0` is public, npm still serves `0.1.1`, and the next npm publish should ship current source as `0.18.0` after account authentication or trusted publishing works.

Implemented:

- release-status task contract for `0.18.0`
- internal simulated feedback cycle for the version-jump question
- README note that normal sequential semver resumes after npm catches up
- changelog update for the `v0.18.0` GitHub release and npm authorization failures
- npm publishing docs section explaining why npm should jump from `0.1.1` to `0.18.0`
- launch checklist, roadmap, GitHub Actions docs, example CI tarball pins, final handoff, backlog, and dogfood updates

### Cycle 73: Policy customization guidance

Decision: document how maintainers should customize local policy files after `agentloop policy status`, without adding a policy editor, compliance score, remote policy pack, or enforcement engine.

Implemented:

- status-action table for `current`, `modified`, `missing`, and `extra`
- policy customization workflow in `docs/policies.md`
- README pointer that modified policies can be intentional repo guidance
- template migration guidance for reviewing policy drift during upgrades
- generated `AGENTS.md`, `AGENTLOOP.md`, `.agentloop/README.md`, harness command, and review-checklist guidance
- internal product-panel cycle and task contract for the docs-only change

### Cycle 74: 0.18.1 policy-guidance patch release

Decision: prepare a patch release because policy customization guidance changed bundled templates after `v0.18.0`. Publishing current source as `0.18.0` would create a tarball that does not match the public `v0.18.0` GitHub release.

Implemented:

- package metadata bump to `0.18.1`
- changelog entry for policy customization guidance
- README, npm publishing docs, launch checklist, GitHub Actions docs, GitHub Actions examples, roadmap, final handoff, backlog, and product-panel updates
- README terminal GIF source updated to install the `0.18.1` tarball and regenerated with VHS
- local verification, pack, dry-run publish, packed-tarball smoke, and AgentLoop verification evidence

### Cycle 75: Repo-type policy examples

Decision: add concrete GitHub docs examples for common repo types instead of building policy packs or enforcement behavior.

Implemented:

- `docs/policy-examples.md`
- examples for web apps, APIs/services, Python services, docs-only repos, monorepos, and open-source review workflows
- link from `docs/policies.md`
- roadmap, backlog, product-panel, task contract, dogfood, verification, and handoff records

### Cycle 76: Contributor playbook examples

Decision: add copyable first-issue examples for maintainers instead of adding label automation, issue bots, or package behavior.

Implemented:

- `docs/contributor-playbook.md`
- docs, test, template-wording, and example-repo issue examples
- README and `CONTRIBUTING.md` links
- roadmap, changelog, backlog, product-panel, task contract, dogfood, verification, and handoff records

### Cycle 77: Local CI summary command

Decision: add a local read-only CI summary command instead of GitHub API imports, PR comments, or a dashboard.

Implemented:

- `agentloop ci-summary`
- `agentloop ci-summary --json`
- `agentloop ci-summary --write`
- verification-report lookup isolation from `*-ci-summary.md` artifacts
- GitHub Actions docs, examples, generated harness guidance, completions, tests, release metadata, and README demo source updates

### Cycle 90: PowerShell completions

Decision: add Windows-friendly shell completion support while keeping completion generation static, inspectable, and stdout-only.

Implemented:

- `agentloop completion powershell`
- `agentloop completion pwsh`
- PowerShell `Register-ArgumentCompleter` output for `agentloop` and `agentloopkit`
- top-level command, task command, policy command, task status, agent-name, and shell-name completions
- README and getting-started updates that keep profile-file mutation out of scope

### Cycle 94: Current release-state clarity

Decision: make the GitHub/npm split easier to trust by naming `v0.23.0` as the current release line and explaining the one-time npm catch-up rule.

Implemented:

- README current-release wording fixed from the older `v0.22.0` workflow to the `v0.23.0` workflow
- release-status docs and launch checklist updated with the current-main-to-`0.23.0` rule
- final handoff current-state wording reduced so old release attempts do not obscure the current blocker

### Cycle 103: npm-status release coherence

Decision: prepare current `main` as `0.24.0` because `agentloop npm-status` landed after the public `v0.23.0` GitHub release.

Implemented:

- package metadata and changelog moved to `0.24.0`
- current release docs and tarball guidance updated for `v0.24.0`
- npm catch-up rule clarified: publish the current source line once, then return to normal semver
- local npm auth checked with `npm whoami`; this shell still returns `E401`

### Cycle 95: GitLab CI and Buildkite examples

Decision: add provider examples as documentation, not workflow installers.

Implemented:

- `examples/gitlab-ci/README.md`
- `examples/buildkite/README.md`
- GitHub Actions example tarball pins refreshed to `v0.23.0`
- README and CI docs links to the provider examples

### Cycle 96: GitLab CI and Buildkite provenance

Decision: identify GitLab CI and Buildkite in local verification reports and CI summaries through documented, non-secret environment-variable allowlists.

Implemented:

- GitLab CI provider detection for project path, pipeline source, ref, commit, and pipeline URL
- Buildkite provider detection for pipeline slug, source, branch, commit, and build URL
- verification report and `ci-summary` tests for both providers
- docs updated to state provider-specific provenance without provider APIs, token reads, or arbitrary environment dumps

### Cycle 97: Security-review example

Decision: add a concrete security-review workflow without turning AgentLoopKit into a scanner or compliance product.

Implemented:

- `docs/security-review.md`
- `examples/security-review/README.md`
- sample `security-review` task contract
- sample verification report with explicit checks not run
- sample PR summary with reviewer checklist and rollback notes
- README, getting-started, and policy-doc links to the workflow

### Cycle 98: Doctor risk-file heuristics docs

Decision: explain `doctor` risk-file categories in one public page without changing behavior or implying scanner guarantees.

Implemented:

- `docs/doctor-risk-files.md`
- category table for migrations, auth, security, billing, deployment, lockfiles, and env files
- env-file path-only handling guidance
- task-contract usage guidance for agents
- reviewer questions for risk-file handoffs
- README, getting-started, and security-review links to the page

### Cycle 99: Framework-specific task recipes

Decision: expand stack guidance with framework-specific task-contract examples while keeping AgentLoopKit guidance-only.

Implemented:

- Remix recipe with loaders, actions, auth, and adapter review notes
- SvelteKit recipe with server actions, hooks, session, and adapter notes
- Django recipe with permissions, settings, migrations, and management-command notes
- FastAPI recipe with dependency injection, auth dependencies, Alembic, and OpenAPI notes
- README and getting-started links updated for the expanded recipe set

### Cycle 100: Dependency-upgrade workflow example

Decision: show agents how to make dependency and lockfile changes reviewable without adding scanner, registry, or bot behavior.

Implemented:

- `docs/dependency-upgrades.md`
- `examples/dependency-upgrade/README.md`
- sample `dependency-upgrade` task contract
- sample verification report with skipped checks
- sample PR summary with lockfile review checklist and rollback notes
- README, getting-started, and policy-doc links to the workflow

### Cycle 101: Release-checklist example

Decision: add a compact maintainer example for documenting GitHub-current/npm-lag release state without publishing, tagging, or changing metadata.

Implemented:

- `docs/release-checklist-example.md`
- `examples/release-checklist/README.md`
- sample release-status task contract
- sample verification report that states publish commands were not run
- sample release handoff with npm state, next action, and rollback notes
- README, launch checklist, npm publishing, and release-status links to the workflow

### Cycle 102: npm-status catch-up check

Decision: add a read-only npm registry status command so maintainers can check catch-up state without publishing, reading credentials, or changing release metadata.

Implemented:

- `agentloop npm-status`
- `agentloop npm-status --json`
- `agentloop npm-status --expect-current`
- captured registry JSON mode with `--registry-json`
- core npm registry parsing and status classification
- shell completion entries
- `docs/npm-status.md`
- README, getting-started, publishing, release-status, release-checklist, harness, backlog, and decision updates

## User persona feedback summary

This section is simulated/internal persona feedback. It is not real user research.

Strongest signals:

- First-run setup needs an obvious local index.
- Multi-agent users want one command for common agent instructions.
- Security-sensitive users care about no telemetry, no postinstall scripts, provenance, and transparent file writes.
- Skeptical developers need deterministic outputs and practical review value.
- README readers need visual proof of the workflow before installing.
- Agents and reviewers need one local command that shows current task, latest report, dirty files, and next action.
- Agents need a deterministic way to list task contracts before choosing the active task.
- Agents need a deterministic way to read a selected task contract without changing active state.
- Agents need a safe status command so task contracts move through the loop without hand-editing Markdown.
- Agents and maintainers need a local marker for generated template provenance before comparing or refreshing harness files.
- Repeat CLI users need completions for the growing command surface, but security-sensitive users want inspectable scripts rather than dotfile installers.
- Windows and PowerShell users need the same inspectable completion flow as bash, zsh, and fish users.
- Repeat users need a way to move finished task contracts out of the active list without deleting Markdown history.
- Release readers need the README visuals and changelog to match the newest source command before a GitHub release is cut.
- Agents need `create-task` to return machine-readable output like the rest of the task lifecycle commands.
- Release readers need the npm/GitHub version gap explained before they trust a catch-up publish.
- Maintainers need to know that customized policy files are repo decisions, not automatic errors.
- Maintainers need repo-type policy examples before local policies become useful in real projects.
- Contributors and maintainers need copyable issue examples that name files, acceptance criteria, verification commands, and AgentLoop evidence.
- Teams using GitLab CI and Buildkite need the same local evidence workflow and provider-specific provenance without API integration.
- Release readers need `0.12.0` metadata and visuals to match `create-task --json` before the GitHub release.
- Agents and reviewers need one deterministic command that checks review evidence without running tests.
- Release readers need `0.13.0` metadata and visuals to match `check-gates` before the GitHub release.
- Release readers need a plain explanation that npm may jump from `0.1.1` to `0.13.0` because intermediate versions were GitHub-only while npm publish was blocked.
- CI users need `check-gates` to fail on warnings without changing the default local command behavior.
- Release readers need `0.14.0` metadata and visuals to match `check-gates --strict` before the GitHub release.
- npm readers need a direct note that the catch-up publish is now `0.16.0` because existing GitHub tags already cover earlier source releases.
- Teams need CI recipes that show where `verify`, `handoff`, and `check-gates --strict` belong in pull request checks.
- Maintainers need those recipes to avoid branch mutation, hidden uploads, and stale npm claims.
- Developers need stack-specific starter commands before task contracts feel concrete.
- Platform users need monorepo recipes that separate root checks from package checks.
- Reviewers need CI-generated verification reports to show workflow, event, ref, commit, and run URL.
- Release readers need `0.15.0` metadata and visuals to match CI context in verification reports before the GitHub release.
- Reviewers and agents need `doctor` to name risk categories instead of reporting only a total count.
- First-run configs should not point at an unproven custom schema domain.
- Release readers need patch-level semver for trust polish instead of another minor version jump.
- Public roadmap readers need shipped work and future work separated clearly after `v0.15.1`.
- Reviewers need deterministic PR summaries to group changed files by review area without LLM calls.
- Teams need one local HTML evidence artifact after task, verification, and handoff files exist.
- Reviewers need small local status badges that point back to verification or gate evidence.
- Platform users and agents need policy template drift visibility without a compliance engine.
- CI reviewers need one compact local summary that ties CI provenance, task evidence, verification status, handoff state, and gates together.

## Backlog

Top remaining items:

1. Complete npm browser/OTP authentication or trusted publishing for the current release line, now `agentloopkit@0.24.0`.
2. Optional schema-store submission after npm publishing is stable.
3. Remove the temporary GitHub tarball fallback from README after npm reports `0.24.0` or newer.
4. Evaluate organization policy packs only after local policy workflows mature.
5. Add GitHub issue and PR metadata import after the local workflow matures.

## Known limitations

- GitHub releases through `v0.24.0` are public, but npm still shows `agentloopkit@0.1.1` until npm publish succeeds.
- npm should jump from `0.1.1` to the current GitHub release because public GitHub tags already occupy the intermediate versions.
- Do not publish stale intermediate versions to npm from current `main`. Publish each version only from its matching release commit or release tarball.
- Local `npm publish --access public` for `0.16.0` passed `prepublishOnly`, then npm stopped at `EOTP` for browser/OTP authentication.
- The release-triggered GitHub Publish workflow for `v0.16.0` passed checks and failed at npm authorization with `E404`.
- GitHub release `v0.16.0`: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.16.0
- GitHub release `v0.16.0` tarball SHA-256: `687dac923ee3976e4975641a20844ece4ce41c2123794423c46cd72091f8cb18`.
- GitHub release `v0.17.0`: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.17.0
- GitHub release `v0.17.0` tarball SHA-256: `8b7bb6ae9307e79cf97e20e405a1cef6a4aefcc48466d865758cc87f3439d49c`.
- GitHub release `v0.18.0`: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.18.0
- `agentloopkit@0.18.0` tarball SHA-256: `7c3b6b7f12c34e57b9bfd70bb4491abd566b37b86bf0c642d9d517a7dcdb4d26`.
- The release-triggered GitHub Publish workflow for `v0.18.0` passed checks and failed at npm authorization with `E404`.
- Local exact-tarball publish for `0.18.0` failed with authorization `E404`.
- `agentloopkit@0.18.1` is prepared on `main` for policy customization guidance after package templates changed.
- GitHub release `v0.18.1`: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.18.1
- `agentloopkit@0.18.1` tarball SHA-256: `01f38156e44610021752dadc90fe5d61f63ac210c3778274bce99b11833e972b`.
- The release-triggered GitHub Publish workflow for `v0.18.1` passed checks and failed at npm authorization with `E404`.
- `agentloopkit@0.19.0` is published as GitHub release `v0.19.0` for local CI summaries.
- GitHub release `v0.19.0`: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.19.0
- `agentloopkit@0.19.0` tarball SHA-256: `8d78d22b8b69786bd85b43234815765e2d373d44d05789a20ce3a2d19897e900`.
- The release-triggered GitHub Publish workflow for `v0.19.0` passed checks and failed at npm authorization with `E404`.
- Local `npm whoami` returned `E401`; run `npm login` again before another local publish attempt.
- `agentloopkit@0.8.0` is not on npm yet.
- `agentloopkit@0.7.0`, `agentloopkit@0.6.0`, `agentloopkit@0.5.0`, and `agentloopkit@0.4.0` are not on npm.
- Local `npm publish --access public` for `0.3.0` passed package checks, then npm required browser/OTP authentication with `EOTP`.
- The stale manual GitHub Publish workflow for `0.3.0` targeted an older commit and was cancelled after the release workflow ran.
- The release-triggered GitHub Publish workflow for `v0.3.0` passed checks and failed at npm authorization with `E404`.
- The release-triggered GitHub Publish workflow for `v0.4.0` passed checks and failed at npm authorization with `E404`.
- The release-triggered GitHub Publish workflow for `v0.5.0` passed checks and failed at npm authorization with `E404`.
- The release-triggered GitHub Publish workflow for `v0.6.0` passed checks and failed at npm authorization with `E404`.
- The release-triggered GitHub Publish workflow for `v0.7.0` passed checks and failed at npm authorization with `E404`.
- The release-triggered GitHub Publish workflow for `v0.8.0` passed checks and failed at npm authorization with `E404`.
- The release-triggered GitHub Publish workflow for `v0.9.0` passed checks and failed at npm authorization with `E404`.
- The release-triggered GitHub Publish workflow for `v0.10.0` passed checks and failed at npm authorization with `E404`.
- The release-triggered GitHub Publish workflow for `v0.11.0` passed checks and failed at npm authorization with `E404`.
- The release-triggered GitHub Publish workflow for `v0.12.0` passed checks and failed at npm authorization with `E404`.
- The release-triggered GitHub Publish workflow for `v0.13.0` passed checks and failed at npm authorization with `E404`.
- The release-triggered GitHub Publish workflow for `v0.14.0` passed checks and failed at npm authorization with `E404`.
- The release-triggered GitHub Publish workflow for `v0.15.0` passed checks and failed at npm authorization with `E404`.
- The release-triggered GitHub Publish workflow for `v0.15.1` passed checks and failed at npm authorization with `E404`.
- Local `npm publish --access public` for `0.5.0` passed package checks, then npm stopped at `EOTP` and requires browser/OTP authentication.
- Local `npm publish --access public` for `0.6.0` passed package checks, then npm stopped at `EOTP` and requires browser/OTP authentication.
- Local `npm publish --access public` for `0.7.0` passed package checks, then npm stopped at `EOTP` and requires browser/OTP authentication.
- Local `npm publish --access public` for `0.8.0` passed package checks, then npm stopped at `EOTP` and requires browser/OTP authentication.
- Local `npm publish --access public` for `0.13.0` passed package checks, then npm stopped at `EOTP` and requires browser/OTP authentication.
- npm trusted publishing still needs npm-side configuration for this repository, or the maintainer must complete local browser/OTP authentication.
- Until npm catches up, current users should run the `v0.24.0` GitHub release tarball with `npx --yes --package https://github.com/abhiyoheswaran1/AgentLoopKit/releases/download/v0.24.0/agentloopkit-0.24.0.tgz agentloop <command>`.
- Generated configs use the GitHub raw schema URL for editor support; a branded schema domain is not configured yet.
- Project detection is heuristic.
- Monorepo support is warning and guidance only; AgentLoopKit does not infer package graphs or orchestrate workspace checks.
- GitHub Actions recipes are documentation only; `agentloop init` does not install workflows.
- Third-party agent config files are not created unless conventions are safe and known.
- PR summaries are deterministic and do not infer semantic intent from code.
- No cloud dashboard, shared history, team accounts, or telemetry.

## Launch checklist

- [x] Push source to GitHub.
- [x] Push `v0.1.0` tag.
- [x] Create draft GitHub release.
- [x] Attach packed tarball to draft release.
- [x] Add CI.
- [x] Add publish workflow.
- [x] Publish `agentloopkit@0.1.0` to npm.
- [x] Prepare `agentloopkit@0.1.1` README visual release.
- [x] Publish `agentloopkit@0.1.1` to npm.
- [x] Publish GitHub release `v0.1.1`.
- [x] Prepare `agentloopkit@0.2.0` status release.
- [x] Publish GitHub release `v0.2.0`.
- [ ] Publish `agentloopkit@0.2.0` to npm.
- [x] Prepare `agentloopkit@0.2.1` release candidate.
- [x] Publish GitHub release `v0.2.1` with npm-pending notes.
- [ ] Publish `agentloopkit@0.2.1` to npm.
- [x] Prepare `agentloopkit@0.3.0` handoff command release candidate.
- [x] Publish GitHub release `v0.3.0` with npm-pending notes.
- [x] Run GitHub Publish workflow for `v0.3.0`; package checks passed, npm authorization failed.
- [ ] Publish `agentloopkit@0.3.0` to npm.
- [x] Prepare `agentloopkit@0.4.0` active task release candidate.
- [x] Publish GitHub release `v0.4.0` with npm-pending notes.
- [x] Run GitHub Publish workflow for `v0.4.0`; package checks passed, npm authorization failed.
- [ ] Publish `agentloopkit@0.4.0` to npm.
- [x] Prepare `agentloopkit@0.5.0` task-list release candidate.
- [x] Publish GitHub release `v0.5.0` with npm-pending notes.
- [x] Run GitHub Publish workflow for `v0.5.0`; package checks passed, npm authorization failed.
- [x] Try local `npm publish --access public` for `0.5.0`; package checks passed, npm required browser/OTP authentication.
- [ ] Publish `agentloopkit@0.5.0` to npm.
- [x] Prepare `agentloopkit@0.6.0` task-show release candidate.
- [x] Publish GitHub release `v0.6.0` with npm-pending notes.
- [x] Run GitHub Publish workflow for `v0.6.0`; package checks passed, npm authorization failed.
- [x] Try local `npm publish --access public` for `0.6.0`; package checks passed, npm required browser/OTP authentication.
- [ ] Publish `agentloopkit@0.6.0` to npm.
- [x] Prepare `agentloopkit@0.7.0` monorepo doctor release candidate.
- [x] Publish GitHub release `v0.7.0` with npm-pending notes.
- [x] Run GitHub Publish workflow for `v0.7.0`; package checks passed, npm authorization failed.
- [x] Try local `npm publish --access public` for `0.7.0`; package checks passed, npm required browser/OTP authentication.
- [ ] Publish `agentloopkit@0.7.0` to npm.
- [x] Prepare `agentloopkit@0.8.0` launch-quality release candidate.
- [x] Publish GitHub release `v0.8.0` with npm-pending notes.
- [x] Run GitHub Publish workflow for `v0.8.0`; package checks passed, npm authorization failed.
- [x] Try local `npm publish --access public` for `0.8.0`; package checks passed, npm required browser/OTP authentication.
- [ ] Publish `agentloopkit@0.8.0` to npm.
- [x] Prepare `agentloopkit@0.9.0` task-status release candidate.
- [x] Publish GitHub release `v0.9.0` with npm-pending notes.
- [x] Run GitHub Publish workflow for `v0.9.0`; package checks passed, npm authorization failed.
- [ ] Publish `agentloopkit@0.9.0` to npm.
- [x] Prepare `agentloopkit@0.10.0` shell-completions release candidate.
- [x] Publish GitHub release `v0.10.0` with npm-pending notes.
- [x] Run GitHub Publish workflow for `v0.10.0`; package checks passed, npm authorization failed.
- [ ] Publish `agentloopkit@0.10.0` to npm.
- [x] Prepare `agentloopkit@0.11.0` task-archive release candidate.
- [x] Publish GitHub release `v0.11.0` with npm-pending notes.
- [x] Run GitHub Publish workflow for `v0.11.0`; package checks passed, npm authorization failed.
- [ ] Publish `agentloopkit@0.11.0` to npm.
- [x] Prepare `agentloopkit@0.12.0` create-task JSON release candidate.
- [x] Publish GitHub release `v0.12.0` with npm-pending notes.
- [x] Run GitHub Publish workflow for `v0.12.0`; package checks passed, npm authorization failed.
- [ ] Publish `agentloopkit@0.12.0` to npm.
- [x] Prepare `agentloopkit@0.13.0` check-gates release candidate.
- [x] Publish GitHub release `v0.13.0` with npm-pending notes.
- [x] Run GitHub Publish workflow for `v0.13.0`; package checks passed, npm authorization failed.
- [x] Try local `npm publish --access public` for `0.13.0`; package checks passed, npm required browser/OTP authentication.
- [ ] Publish `agentloopkit@0.13.0` to npm.
- [x] Prepare `agentloopkit@0.14.0` strict-gates release candidate.
- [x] Publish GitHub release `v0.14.0` with npm-pending notes.
- [x] Run GitHub Publish workflow for `v0.14.0`; package checks passed, npm authorization failed.
- [ ] Publish `agentloopkit@0.14.0` to npm.
- [x] Prepare `agentloopkit@0.15.0` CI-context release candidate.
- [x] Publish GitHub release `v0.15.0` with npm-pending notes.
- [x] Run GitHub Publish workflow for `v0.15.0`; package checks passed, npm authorization failed.
- [ ] Publish `agentloopkit@0.15.0` to npm.
- [x] Prepare `agentloopkit@0.15.1` trust-polish patch release candidate.
- [x] Publish GitHub release `v0.15.1` with npm-pending notes.
- [x] Run GitHub Publish workflow for `v0.15.1`; package checks passed, npm authorization failed.
- [ ] Publish `agentloopkit@0.15.1` to npm.
- [x] Prepare `agentloopkit@0.16.0` badge release candidate.
- [x] Publish GitHub release `v0.16.0` with badge release notes.
- [ ] Publish `agentloopkit@0.16.0` to npm.
- [x] Try local `npm publish --access public` for `0.16.0`; package checks passed, npm required browser/OTP authentication.
- [x] Run GitHub Publish workflow for `v0.16.0`; package checks passed, npm authorization failed.
- [x] Prepare `agentloopkit@0.17.0` policy-inspection release candidate.
- [x] Publish GitHub release `v0.17.0` with policy-inspection release notes.
- [ ] Publish `agentloopkit@0.17.0` to npm.
- [x] Run GitHub Publish workflow for `v0.17.0`; package checks passed, npm authorization failed.
- [x] Try local exact-tarball publish for `0.17.0`; npm required browser/OTP authentication.
- [x] Prepare `agentloopkit@0.18.0` policy-status release candidate.
- [x] Publish GitHub release `v0.18.0` with policy-status release notes.
- [ ] Publish `agentloopkit@0.18.0` to npm.
- [x] Run GitHub Publish workflow for `v0.18.0`; package checks passed, npm authorization failed.
- [x] Try local exact-tarball publish for `0.18.0`; npm authorization failed.
- [x] Prepare `agentloopkit@0.18.1` policy-customization patch release candidate.
- [x] Publish GitHub release `v0.18.1` with policy-customization release notes.
- [ ] Publish `agentloopkit@0.18.1` to npm.
- [x] Run GitHub Publish workflow for `v0.18.1`; package checks passed, npm authorization failed.
- [x] Prepare `agentloopkit@0.19.0` CI-summary release candidate.
- [x] Publish GitHub release `v0.19.0` with CI-summary release notes.
- [x] Run GitHub Publish workflow for `v0.19.0`; package checks passed, npm authorization failed.
- [ ] Publish `agentloopkit@0.19.0` to npm.
- [x] Prepare `agentloopkit@0.20.0` release-note handoff release candidate.
- [x] Publish GitHub release `v0.20.0` with release-note handoff notes.
- [x] Run GitHub Publish workflow for `v0.20.0`; package checks passed, npm authorization failed.
- [ ] Publish `agentloopkit@0.20.0` to npm.
- [x] Prepare `agentloopkit@0.21.0` next-action and release-safety release candidate.
- [x] Publish GitHub release `v0.21.0` with next-action and release-safety notes.
- [x] Run GitHub Publish workflow for `v0.21.0`; package checks passed, npm authorization failed.
- [ ] Publish `agentloopkit@0.21.0` to npm.
- [x] Prepare `agentloopkit@0.22.0` task-linked verification and README evidence release candidate.
- [x] Publish GitHub release `v0.22.0` with task-linked verification and README evidence notes.
- [x] Run GitHub Publish workflow for `v0.22.0`; package checks passed, npm authorization failed.
- [x] Document temporary `v0.22.0` GitHub tarball usage while npm serves `0.1.1`.
- [ ] Publish `agentloopkit@0.22.0` to npm.
- [x] Prepare `agentloopkit@0.23.0` PowerShell completion release candidate.
- [x] Publish GitHub release `v0.23.0` with PowerShell completion notes.
- [x] Run GitHub Publish workflow for `v0.23.0`; package checks passed, npm authorization failed.
- [ ] Publish `agentloopkit@0.23.0` to npm.
- [x] Prepare `agentloopkit@0.24.0` npm-status release candidate.
- [x] Publish GitHub release `v0.24.0` with npm-status notes.
- [x] Publish `agentloopkit@0.24.0` to npm.
- [x] Configure npm trusted publishing for future releases.
- [x] Confirm npm package install for the published `0.24.0` package with `npx --yes agentloopkit@0.24.0 version`.
- [x] Publish GitHub release `v0.24.3` with task-path and init safety notes.
- [x] Publish `agentloopkit@0.24.3` to npm through trusted publishing.
- [x] Confirm npm package install for `0.24.3` with `npx --yes agentloopkit@0.24.3 version`.
- [x] Publish GitHub release `v0.24.4` with npm README pin notes.
- [x] Publish `agentloopkit@0.24.4` to npm through trusted publishing.
- [x] Confirm npm package install for `0.24.4` with `npx --yes agentloopkit@0.24.4 version`.
- [x] Publish GitHub release `v0.24.5` with release-smoke and README VHS demo notes.
- [x] Publish `agentloopkit@0.24.5` to npm through trusted publishing.
- [x] Confirm npm package install for `0.24.5` with `npx --yes agentloopkit@0.24.5 version`.
- [x] Add GitHub repo description and discovery topics.
- [x] Add initial good-first-issue labels.
- [ ] Announce launch.

## Suggested announcement copy

GitHub repo description:

```text
A drop-in engineering loop for coding agents: task contracts, verification reports, reviewer handoffs, and repo-level safety policies.
```

Product Hunt style tagline:

```text
Make coding agents work like disciplined engineers.
```

Twitter/X launch post:

```text
I built AgentLoopKit: a local-first npm CLI that gives Codex, Claude Code, Cursor, OpenCode, Gemini CLI, and other coding agents a repo-level engineering loop.

npx agentloopkit init

It generates task contracts, safety policies, verification reports, and PR handoffs. No telemetry. No cloud. No LLM required.
```

Hacker News title:

```text
Show HN: AgentLoopKit, a repo-level engineering loop for coding agents
```

Reddit/dev.to post outline:

```text
Title: I built a local-first engineering loop for coding agents

- Problem: agent-generated work can be hard to review
- Approach: repo-level task contracts, gates, policies, verification reports, and handoffs
- Install today: npx agentloopkit init
- What it does not do: no LLM wrapper, no SaaS, no telemetry
- Example workflow: create-task, verify, handoff
- Ask: feedback from people using Codex, Claude Code, Cursor, OpenCode, Gemini CLI, or Copilot CLI
```

## Next 15 improvements

1. Add Scoop and WinGet manifests after Windows smoke tests are stable: medium Windows value, medium effort.
2. Add report theme customization with strict no-external-assets defaults: medium usefulness, medium effort.
3. Add optional workflow generator only after docs recipes prove useful: medium adoption impact, medium maintenance.
4. Add more packed-tarball smoke fixtures for release recovery flows: medium trust improvement, low effort.
5. Add GitLab CI and Buildkite retry guidance after provider-specific provenance sees use: medium usefulness, low effort.
6. Add Rails and Laravel task-contract recipes if contributors ask for them: medium usefulness, low effort.
7. Add package-manager-specific dependency-upgrade recipes for npm, yarn, and bun: medium usefulness, low effort.
8. Add Windows CI smoke coverage for PowerShell completions and `npx agentloopkit init`: medium trust improvement, medium effort.
9. Keep the VS Code/Open VSX extension deferred until command-palette shortcuts have clear demand: medium adoption value, high maintenance.
10. Add richer MCP docs and example client configs without expanding write access: medium agent-compatibility value, low effort.
11. Add GHCR usage recipes for common CI providers: medium CI usefulness, low effort.
12. Add static report pruning guidance so repos do not accumulate noisy local artifacts: medium maintainability value, low effort.
13. Add policy-pack examples as plain local templates before considering any registry or marketplace: medium future optionality, medium effort.
14. Add migration notes for repos initialized on older AgentLoopKit template versions: medium user value, medium effort.
15. Keep the SchemaStore catalog entry in sync if the config schema URL changes: medium trust value, low effort.
