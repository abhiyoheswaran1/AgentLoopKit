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
- task contract generation
- active task pinning with `.agentloop/state.json`
- read-only task contract listing with active-task markers
- verification report generation
- deterministic PR summary generation
- local status command for active task, latest verification, dirty files, configured commands, and next action
- agent instruction installation, including `install-agent all`
- template system for loops, gates, handoffs, agents, policies, tasks, and harness files
- generated `.agentloop/README.md`
- config validation and JSON schema
- docs, examples, issue templates, PR template, CI, publish workflow
- README launch visuals generated with Playwright and VHS
- internal product panel, target personas, simulated interview cycles, backlog, and dogfood log

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
agentloop task current --json
agentloop task clear
agentloop status
agentloop status --json
agentloop verify
agentloop verify --command "node smoke-test.js"
agentloop handoff
agentloop summarize --write
agentloop install-agent codex
agentloop install-agent all
agentloop list-templates
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

Latest local verification for the product-panel iteration:

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
- `npx pnpm@10.12.1 check:links`: pass, 250 Markdown files checked.
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

Current publish gap:

- GitHub release `v0.2.0` is public.
- GitHub release `v0.2.1` is public.
- GitHub releases `v0.3.0`, `v0.4.0`, `v0.5.0`, and `v0.6.0` are public with tarball assets.
- npm latest is still `0.1.1`.
- The `v0.2.0` publish workflow passed install, lint, typecheck, test, and build, then npm rejected `npm publish` because trusted publishing is not configured for this package/workflow.
- A local `npm publish --access public` retry reached npm browser authentication, then failed at npm's auth completion endpoint.
- The `v0.2.1` publish workflow passed install, lint, typecheck, tests, build, and `prepublishOnly`, then npm rejected `npm publish` with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- The `v0.6.0` publish workflow passed install, lint, typecheck, tests, build, npm upgrade, version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- Local `npm publish --access public` for `0.6.0` passed typecheck, Vitest, and build through `prepublishOnly`, then npm stopped at `EOTP`.
- Package-content changes after the `v0.7.0` tag are prepared on `main` as `agentloopkit@0.8.0`, but are not on npm yet.
- Do not paste npm OTPs or tokens into chat, issues, PRs, or release notes.

## How users install it

```bash
npx agentloopkit init
npx agentloopkit doctor
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

## Backlog

Top remaining items:

1. Repair npm trusted-publishing or local-auth publishing for `agentloopkit@0.8.0`.
2. Prepare the next npm-publishable release after trusted publishing is repaired.
3. Task status transitions.
4. Shell completions.
5. Config schema hosting.

## Known limitations

- GitHub releases `v0.2.0`, `v0.2.1`, `v0.3.0`, `v0.4.0`, `v0.5.0`, `v0.6.0`, and `v0.7.0` are public, but npm still shows `agentloopkit@0.1.1` until npm publish succeeds.
- `agentloopkit@0.8.0` is prepared on `main`, but its GitHub release and npm publish still need to complete.
- `agentloopkit@0.7.0`, `agentloopkit@0.6.0`, `agentloopkit@0.5.0`, and `agentloopkit@0.4.0` are not on npm.
- Local `npm publish --access public` for `0.3.0` passed package checks, then npm required browser/OTP authentication with `EOTP`.
- The stale manual GitHub Publish workflow for `0.3.0` targeted an older commit and was cancelled after the release workflow ran.
- The release-triggered GitHub Publish workflow for `v0.3.0` passed checks and failed at npm authorization with `E404`.
- The release-triggered GitHub Publish workflow for `v0.4.0` passed checks and failed at npm authorization with `E404`.
- The release-triggered GitHub Publish workflow for `v0.5.0` passed checks and failed at npm authorization with `E404`.
- The release-triggered GitHub Publish workflow for `v0.6.0` passed checks and failed at npm authorization with `E404`.
- The release-triggered GitHub Publish workflow for `v0.7.0` passed checks and failed at npm authorization with `E404`.
- Local `npm publish --access public` for `0.5.0` passed package checks, then npm stopped at `EOTP` and requires browser/OTP authentication.
- Local `npm publish --access public` for `0.6.0` passed package checks, then npm stopped at `EOTP` and requires browser/OTP authentication.
- Local `npm publish --access public` for `0.7.0` passed package checks, then npm stopped at `EOTP` and requires browser/OTP authentication.
- npm trusted publishing still needs npm-side configuration for this repository, or the maintainer must complete local browser/OTP authentication.
- `agentloop.config.schema.json` URL is documented but not hosted on a website.
- Project detection is heuristic.
- Monorepo support is warning and guidance only; AgentLoopKit does not infer package graphs or orchestrate workspace checks.
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
- [ ] Publish GitHub release `v0.8.0` with npm-pending notes.
- [ ] Publish `agentloopkit@0.8.0` to npm.
- [ ] Configure npm trusted publishing for future releases.
- [x] Confirm npm package install with `npx agentloopkit version`.
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
- Install: npx agentloopkit init
- What it does not do: no LLM wrapper, no SaaS, no telemetry
- Example workflow: create-task, verify, handoff
- Ask: feedback from people using Codex, Claude Code, Cursor, OpenCode, Gemini CLI, or Copilot CLI
```

## Next 15 improvements

1. Repair npm publishing for `0.8.0`: high usefulness, low repo effort, external npm setting required.
2. Add task status transitions: medium usefulness, medium effort.
3. Add shell completions: medium usefulness, medium effort, low maintenance.
4. Add task archive command: medium usefulness, medium effort, low maintenance.
5. Add `agentloop check-gates`: medium usefulness, medium effort, medium maintenance.
6. Add config schema hosting: high trust improvement, low implementation in repo, external hosting needed.
7. Add stack-specific starter recipes: high star potential, medium effort, medium maintenance.
8. Add CI import notes to verification reports: medium usefulness, medium effort.
9. Add policy pack customization: medium commercial optionality, medium effort.
10. Add local static HTML report: medium star potential, high effort, medium maintenance.
11. Add generated release-note handoff: medium usefulness, low effort, low maintenance.
12. Add richer doctor risk-file details: medium usefulness, low effort.
13. Add package recipe examples for monorepos: medium usefulness, low effort.
14. Add generated security-review example: medium trust improvement, low effort.
15. Add team/cloud roadmap only after open-source traction: high commercial optionality, high effort, high maintenance.
