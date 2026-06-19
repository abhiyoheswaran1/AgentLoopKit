# Real-Repo Usefulness Trials Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Run local real-repo AgentLoopKit trials, identify repeated first-use or review-evidence friction, and implement only the highest-confidence small fix.

**Architecture:** Keep trial execution outside sibling working trees by archiving committed repo state into temporary directories. Record trial findings as internal AgentLoop research evidence, then create a second focused implementation plan for the selected fix before touching source code.

**Tech Stack:** AgentLoopKit CLI, AgentFlight, ProjScan, Node.js, Git archives, Vitest for any behavior change.

---

### Task 1: Trial Harness

**Files:**
- Modify: `.agentloop/tasks/2026-06-19-run-real-repo-usefulness-trials-2.md`
- Create: `.agentloop/research/real-repo-usefulness-trials-2026-06-19.md`

- [ ] **Step 1: Confirm the task contract is active**

Run:

```bash
npx --no-install agentloop status --redact-paths
```

Expected: the active task is `Run real-repo usefulness trials`.

- [ ] **Step 2: Build the current CLI**

Run:

```bash
npm run build
```

Expected: `dist/cli/index.js` is rebuilt successfully.

- [ ] **Step 3: Create a temporary trial root**

Run:

```bash
trial_root=$(mktemp -d)
printf '%s\n' "$trial_root"
```

Expected: command prints one temporary directory path.

### Task 2: Run Three Local Repo Trials

**Files:**
- Create: `.agentloop/research/real-repo-usefulness-trials-2026-06-19.md`

- [ ] **Step 1: Trial `projscan` as a TypeScript CLI repo**

Run the current AgentLoopKit CLI against a temporary archive of `../projscan`. Use only local commands and do not mutate `../projscan`.

Expected observations to record:

- whether `doctor` gives a useful next step before initialization
- whether `init --dry-run --json` is understandable
- whether `init --yes` creates a reviewable harness
- whether `create-task`, `verify`, `status`, `ship`, and `prepare-pr` produce usable review evidence
- whether any output is noisy, misleading, or missing the next action

- [ ] **Step 2: Trial `LaunchDesk` as a web app repo**

Repeat the same command sequence against a temporary archive of `../LaunchDesk`.

Expected observations to record:

- whether project detection and package-manager detection match the repo shape
- whether generated guidance feels too heavy for an app repo
- whether verification and review surfaces work without GitHub credentials

- [ ] **Step 3: Trial `EndpointOS` as a larger app/service repo**

Repeat the same command sequence against a temporary archive of `../EndpointOS`.

Expected observations to record:

- whether the loop remains understandable in a larger repo
- whether review evidence helps or adds process noise
- whether any safety warning is unclear

### Task 3: Persona Synthesis

**Files:**
- Create: `.agentloop/research/real-repo-usefulness-trials-2026-06-19.md`
- Modify: `.agentloop/backlog.md`
- Modify: `DECISIONS.md`

- [ ] **Step 1: Write internal trial notes**

Create `.agentloop/research/real-repo-usefulness-trials-2026-06-19.md` with:

- internal-use disclaimer
- repo shapes
- commands run
- useful outputs
- confusing outputs
- safety observations
- repeated friction
- non-decisions

- [ ] **Step 2: Ask the personas against findings**

Record a concise product-panel synthesis using the existing personas:

- Product Maintainer: usefulness and scope
- CLI Engineer: command behavior and next-action clarity
- Docs and DX Writer: onboarding copy and examples
- Security Reviewer: local-only and token-free boundaries
- Dogfood Steward: AgentLoopKit, AgentFlight, and ProjScan evidence

- [ ] **Step 3: Choose one fix**

Choose only one fix if trial evidence repeats across at least two repo shapes. If no repeated friction appears, record that the next step is more real external usage and do not change source code.

### Task 4: Focused Fix Plan

**Files:**
- Create: `docs/superpowers/plans/2026-06-19-<selected-fix>.md`

- [ ] **Step 1: Write the focused implementation plan**

Use the writing-plans skill again for the selected fix. The focused plan must name exact files, failing tests, implementation steps, and verification commands.

- [ ] **Step 2: Execute the focused plan with TDD**

Follow red-green-refactor for any behavior change. Do not write production code before the failing test exists and has failed for the expected reason.

- [ ] **Step 3: Run bug pass**

Run the selected focused tests, `npm run test:quick`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run check:public-docs`, `npm run check:links`, `npx --yes projscan doctor --format markdown`, and `npx --yes agentflight doctor`.

- [ ] **Step 4: Generate AgentLoop evidence**

Run:

```bash
npx --no-install agentloop verify --task .agentloop/tasks/2026-06-19-run-real-repo-usefulness-trials-2.md --task-commands --progress --timeout-ms 900000 --redact-paths
npx --no-install agentloop ship --redact-paths
npm run dogfood:strict
```

Expected: verification and ship evidence pass, with only documented warnings.

## Self-Review

- Spec coverage: covers local trials, persona synthesis, selected fix planning, implementation, bug pass, and AgentLoop evidence.
- Placeholder scan: no `TBD`, `TODO`, or unspecified implementation files for the discovery phase. The selected fix intentionally receives its own plan after trial evidence exists.
- Scope check: release channels, scoring changes, new policy packs, telemetry, GitHub posting, and sibling repo mutation remain out of scope.
