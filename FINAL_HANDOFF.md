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
- verification report generation
- deterministic PR summary generation
- local status command for active task, latest verification, dirty files, configured commands, and next action
- agent instruction installation, including `install-agent all`
- template system for loops, gates, handoffs, agents, policies, tasks, and harness files
- generated `.agentloop/README.md`
- config validation and JSON schema
- docs, examples, issue templates, PR template, CI, publish workflow
- internal product panel, target personas, simulated interview cycles, backlog, and dogfood log

## CLI commands

```bash
agentloop init
agentloop init --dry-run
agentloop doctor
agentloop doctor --json
agentloop create-task --title "Add settings page" --type feature
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

## How to package

```bash
npx pnpm@10.12.1 build
npx pnpm@10.12.1 pack
npx --yes --package ./agentloopkit-0.3.0.tgz agentloop version
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
- npm latest is still `0.1.1`.
- The `v0.2.0` publish workflow passed install, lint, typecheck, test, and build, then npm rejected `npm publish` because trusted publishing is not configured for this package/workflow.
- A local `npm publish --access public` retry reached npm browser authentication, then failed at npm's auth completion endpoint.
- The `v0.2.1` publish workflow passed install, lint, typecheck, tests, build, and `prepublishOnly`, then npm rejected `npm publish` with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- Package-content changes after the `v0.2.1` tag are prepared on `main` as `agentloopkit@0.3.0`, but are not on npm yet.
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

## User persona feedback summary

This section is simulated/internal persona feedback. It is not real user research.

Strongest signals:

- First-run setup needs an obvious local index.
- Multi-agent users want one command for common agent instructions.
- Security-sensitive users care about no telemetry, no postinstall scripts, provenance, and transparent file writes.
- Skeptical developers need deterministic outputs and practical review value.
- README readers need visual proof of the workflow before installing.
- Agents and reviewers need one local command that shows current task, latest report, dirty files, and next action.

## Backlog

Top remaining items:

1. Repair npm trusted-publishing or local-auth publishing for `agentloopkit@0.3.0`.
2. Prepare the next release version after the active task command, likely `0.4.0`.
3. Monorepo project detection.
4. Markdown link checking for docs.
5. Shell completions.

## Known limitations

- GitHub releases `v0.2.0`, `v0.2.1`, and `v0.3.0` are public, but npm still shows `agentloopkit@0.1.1` until npm publish succeeds.
- `agentloopkit@0.3.0` is the latest GitHub release, but `main` now contains unreleased active task lifecycle work.
- Local `npm publish --access public` for `0.3.0` passed package checks, then npm required browser/OTP authentication with `EOTP`.
- The stale manual GitHub Publish workflow for `0.3.0` targeted an older commit and was cancelled after the release workflow ran.
- The release-triggered GitHub Publish workflow for `v0.3.0` passed checks and failed at npm authorization with `E404`.
- npm trusted publishing still needs npm-side configuration for this repository, or the maintainer must complete local browser/OTP authentication.
- `agentloop.config.schema.json` URL is documented but not hosted on a website.
- Project detection is heuristic.
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

1. Repair npm publishing for `0.3.0`: high usefulness, low repo effort, external npm setting required.
2. Prepare `0.4.0` release metadata for the active task command: high usefulness, low effort, low maintenance.
3. Improve monorepo detection: high usefulness, medium effort, medium maintenance.
4. Add markdown link checks: medium usefulness, low effort, low maintenance.
5. Add shell completions: medium usefulness, medium effort, low maintenance.
6. Add `agentloop task list`: medium usefulness, medium effort, low maintenance.
7. Add `agentloop check-gates`: medium usefulness, medium effort, medium maintenance.
8. Add config schema hosting: high trust improvement, low implementation in repo, external hosting needed.
9. Add stack-specific starter recipes: high star potential, medium effort, medium maintenance.
10. Add CI import notes to verification reports: medium usefulness, medium effort.
11. Add policy pack customization: medium commercial optionality, medium effort.
12. Add local static HTML report: medium star potential, high effort, medium maintenance.
13. Add task archive/list command: medium usefulness, medium effort, low maintenance.
14. Add generated release-note handoff: medium usefulness, low effort, low maintenance.
15. Add team/cloud roadmap only after open-source traction: high commercial optionality, high effort, high maintenance.
