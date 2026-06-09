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
agentloop status
agentloop status --json
agentloop verify
agentloop verify --command "node smoke-test.js"
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

## How to package

```bash
npx pnpm@10.12.1 build
npx pnpm@10.12.1 pack
npx --yes --package ./agentloopkit-0.2.0.tgz agentloop version
```

## How to publish to npm

Preferred path after `0.1.0`:

1. Configure npm trusted publishing for this GitHub repository.
2. Publish future GitHub releases.
3. Let `.github/workflows/publish.yml` run checks and `npm publish` through OIDC.
4. If a version already exists on npm, the workflow skips the publish step.

Manual fallback:

```bash
npm login
npm whoami
npm publish --access public
```

The first manual publish for `agentloopkit@0.1.0` was completed with npm browser/OTP authentication.

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

1. Better failed-command excerpts in verification reports.
2. Good-first-issue guidance and repo labels.
3. Better task status lifecycle.
4. Monorepo project detection.
5. Markdown link checking for docs.

## Known limitations

- npm trusted publishing still needs to be configured for future releases.
- `agentloopkit@0.2.0` needs final package verification and npm publish.
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
- [ ] Prepare `agentloopkit@0.2.0` status release.
- [ ] Publish `agentloopkit@0.2.0` to npm.
- [ ] Configure npm trusted publishing for future releases.
- [x] Confirm npm package install with `npx agentloopkit version`.
- [ ] Add GitHub repo description.
- [ ] Add initial good-first-issue labels.
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
- Example workflow: create-task, verify, summarize
- Ask: feedback from people using Codex, Claude Code, Cursor, OpenCode, Gemini CLI, or Copilot CLI
```

## Next 15 improvements

1. Add `agentloop status`: high star potential, high usefulness, medium effort, low maintenance, medium monetisation optionality.
2. Improve verification output excerpts: medium star potential, high usefulness, medium effort, low maintenance, low monetisation optionality.
3. Add task status lifecycle: medium star potential, high usefulness, medium effort, medium maintenance, medium monetisation optionality.
4. Improve monorepo detection: high usefulness, medium effort, medium maintenance, medium commercial optionality.
5. Add good-first-issue docs and labels: medium usefulness, low effort, low maintenance.
6. Add shell completions: medium usefulness, medium effort, low maintenance.
7. Add `agentloop handoff` alias for `summarize --write`: medium usefulness, low effort, low maintenance.
8. Add `agentloop check-gates`: medium usefulness, medium effort, medium maintenance.
9. Add config schema hosting: high trust improvement, low implementation in repo, external hosting needed.
10. Add markdown link checks: medium usefulness, low effort, low maintenance.
11. Add stack-specific starter recipes: high star potential, medium effort, medium maintenance.
12. Add CI import notes to verification reports: medium usefulness, medium effort.
13. Add policy pack customization: medium commercial optionality, medium effort.
14. Add local static HTML report: medium star potential, high effort, medium maintenance.
15. Add team/cloud roadmap only after open-source traction: high commercial optionality, high effort, high maintenance.
