# Design: `agentloop init` writes `.agentloop/.gitignore`

- **Date:** 2026-07-13
- **Status:** Approved (brainstorming)
- **Source:** Consumer issue — "init should separate durable evidence from mutable per-machine state (`.agentloop/.gitignore`)"

## Problem

`agentloop init` scaffolds `.agentloop/` as one committable blob, but the directory mixes
two kinds of files:

- **Durable evidence** worth versioning: task contracts (`tasks/`), verification reports
  (`reports/`), handoffs (`handoffs/`), policies (`policies/`), harness templates
  (`loops/*.md`, `gates/`, `agents/`, `harness/`), and `manifest.json`.
- **Mutable per-machine state** that churns on every command: `state.json` (active-task
  pointer), loop instance directories (`loops/<timestamp>/loop.json`), and the local run
  ledger (`runs/`).

Because init does not write a `.gitignore`, the per-machine files land in git. Once the
harness is committed (as the README recommends for clean diff evidence), every
`agentloop loop tick`, `task done`, or `ship` dirties the working tree. Downstream:

1. Every feature commit drags along `state.json` / `loop.json` / run-ledger churn, or the
   tree is permanently dirty.
2. Scope-checking tools that watch the working tree read the harness's own writes as scope
   drift. Concretely, projscan's auto-generated proof contracts forbid `.agentloop/**`, so
   using AgentLoopKit and projscan together exactly as documented produces
   `blocked: forbidden file(s) touched: .agentloop/loops/<instance>/loop.json,
   .agentloop/state.json, ...` and `projscan review-gate` returns `reviewer decision: stop`.

Every consumer currently rediscovers the same manual workaround (root `.gitignore` entries
plus `git rm --cached` plus editing the saved projscan contract). veriskit already solves
the equivalent problem by writing a `.veris/.gitignore` at init time. AgentLoopKit should
do the same.

## Goal

`agentloop init` writes a `.agentloop/.gitignore` that ignores per-machine state while
keeping durable evidence tracked, and helps consumers un-track state that an older init
already committed.

## Non-goals

- Changing what any runtime command writes, or where.
- Untracking files automatically (init never runs `git rm`; it only advises).
- Migrating this repo's own already-tracked `.agentloop/` history.
- Touching `research/` (not produced by any CLI command — see below).

## Design

### 1. Generated `.agentloop/.gitignore`

`init` writes the following file (skip-if-exists, exactly like every other scaffolded file):

```gitignore
# AgentLoopKit per-machine state — the CLI regenerates these; safe to ignore.
# Durable evidence stays tracked: tasks/, reports/, handoffs/, policies/,
# loops/*.md, manifest.json. See .agentloop/README.md for the full split.
state.json
loops/*/
runs/
```

Pattern rationale:

- `state.json` — active-task pointer; pure per-machine state.
- `loops/*/` — the trailing slash matches only the timestamped instance **directories**
  (`loops/<timestamp>/loop.json`); the `loops/*.md` harness templates stay tracked.
- `runs/` — CLI-produced ledger that the existing docs already describe as a "local run
  ledger" (AGENTLOOP.md line 24, README line 439). Ignoring it is consistent with that
  framing and removes the largest churn source from the working tree.

**Explicitly excluded from the ignore set:**

- `research/` — **not written by any CLI command**. It only exists as hand-authored dogfood
  content in the AgentLoopKit repo itself. A fresh consumer never gets a `research/` dir, so
  shipping it in the scaffold would be misleading dead weight. Dropped.
- Everything else at the `.agentloop/` root (`tasks/`, `reports/`, `handoffs/`, `policies/`,
  `gates/`, `agents/`, `harness/`, `manifest.json`) stays tracked as durable evidence.

**Known divergence, chosen deliberately:** the filed issue assumed `runs/` is "durable
evidence worth versioning." AgentLoopKit's own docs frame `runs/` as a *local* ledger, and
the maintainer chose to ignore it. This spec follows the docs/maintainer decision. If run
evidence is ever meant to be canonical committed evidence, this line is the one to revisit.

### 2. Single source of truth for per-machine paths

Add to `src/core/constants.ts`:

- `AGENTLOOP_GITIGNORE_FILE = '.agentloop/.gitignore'`
- `AGENTLOOP_PER_MACHINE_PATTERNS = ['state.json', 'loops/*/', 'runs/']` — the ordered list
  used to render the `.gitignore` body **and** to build the already-tracked check. Keeping
  one list prevents the ignore file and the detection logic from drifting apart.

The generated file body is `<header comment>\n` + `AGENTLOOP_PER_MACHINE_PATTERNS.join('\n')`
+ trailing newline.

### 3. Writing the file in `init.ts`

- `validateInitOutputTargets`: register a target for `.agentloop/.gitignore` with
  `expectedDir: AGENTLOOP_DIR` and `expectedExtension: ''`. The resolver validates with
  `absolutePath.endsWith(expectedExtension)`, and `endsWith('')` is always true, so a
  dotfile with no extension passes. `resolveInitFilePath` maps any non-`AGENTS.md` path to
  artifactType `init-file`, which is correct here.
- Write it via the existing `writeGeneratedFile(cwd, AGENTLOOP_GITIGNORE_FILE, AGENTLOOP_DIR,
  '', body, result)` helper so it inherits skip-if-exists and dry-run behavior for free. It
  is added to `result.created` / `result.skipped` like any other file.

### 4. Already-tracked hint

After all files are written, detect per-machine paths that git already tracks — the exact
case a consumer hits when re-running `init` over a harness committed by an older version.

- **New git helper** `listTrackedPaths(cwd, pathspecs: string[]): Promise<string[]>` in
  `src/core/git.ts`, implemented as `git ls-files -z -- <pathspecs>` (via `execa(..., { cwd,
  reject: false })`, matching the file's existing style). Returns `[]` on non-zero exit or
  outside a repo. Pathspecs are the per-machine patterns resolved under `.agentloop/`:
  `.agentloop/state.json`, `.agentloop/loops/*/`, `.agentloop/runs/`.
- In `init.ts`, call it only when `result.git.isRepository`. If it returns any paths,
  populate a new optional `InitResult.perMachineState` field:

  ```ts
  perMachineState?: {
    trackedPaths: string[];        // sorted, repo-relative
    untrackCommand: string;        // ready-to-run git rm suggestion
  };
  ```

  `untrackCommand` is
  `git rm -r --cached .agentloop/state.json '.agentloop/loops/*/' .agentloop/runs/`,
  narrowed to only the pattern groups that actually had a tracked hit (don't suggest
  un-tracking `runs/` if nothing under `runs/` is tracked).
- This runs in dry-run too (it's read-only detection), so `init --dry-run` surfaces the
  same advice.

### 5. CLI rendering (`src/cli/commands/init.ts`)

- The field flows into `--json` automatically via the existing `...result` spread. Its paths
  should pass through the same `redact` map used for `created`/`updated`/`skipped` so
  `--redact-paths` stays honored.
- Human output: after the created/updated/skipped summary, if `result.perMachineState`
  exists, print:

  ```
  Note: per-machine state is already git-tracked (<paths>).
        Run: <untrackCommand>
        then commit, so the new .agentloop/.gitignore takes effect.
  ```

### 6. Documentation

Add a short "Committed vs ignored" section to two templates so consumers understand the
split without reverse-engineering it:

- `src/templates/root/agentloop-directory-readme.md` (rendered to `.agentloop/README.md`) —
  the authoritative per-directory breakdown.
- `src/templates/root/AGENTLOOP.md` — a one-paragraph pointer next to the existing
  `.agentloop/runs/` description.

Content states: durable evidence (`tasks/`, `reports/`, `handoffs/`, `policies/`,
`loops/*.md`, `manifest.json`) is committed; per-machine state (`state.json`, `loops/*/`,
`runs/`) is git-ignored via the generated `.agentloop/.gitignore`.

## Behavior summary

| Scenario | Result |
| --- | --- |
| Fresh `init` in a git repo | `.agentloop/.gitignore` created; no tracked state exists, so no hint. |
| `init` re-run, no `.gitignore` yet, old state committed | `.gitignore` created; hint lists tracked paths + `git rm` command. |
| `init` re-run, `.gitignore` already present | `.gitignore` skipped; hint still fires if state is tracked. |
| `init --dry-run` | `.gitignore` reported under created; hint still computed (read-only). |
| `init` outside a git repo | `.gitignore` still written; tracked-file check skipped (no hint). |
| `init --local-only` | `.gitignore` still written (harmless; the whole dir is also `.git/info/exclude`-d). |

## Testing (`tests/init.test.ts`)

- Fresh init writes `.agentloop/.gitignore` containing `state.json`, `loops/*/`, `runs/` and
  the header comment; asserts `research/` is **absent**.
- Re-running init over an existing `.gitignore` marks it skipped.
- Hint: initialize a git fixture, `git add`/track a `.agentloop/state.json` (and/or a
  `runs/` entry), run init, assert `result.perMachineState.trackedPaths` and that
  `untrackCommand` names only the tracked groups.
- No-git fixture: init succeeds and `perMachineState` is undefined.
- `--json` output includes `perMachineState` and honors `--redact-paths`.

## Risks

- **Dotfile extension validation** — mitigated: `endsWith('')` passes; covered by a test.
- **`git ls-files` glob semantics** — `loops/*/` as a pathspec matches tracked files under
  instance dirs; verify in the fixture test rather than assuming.
- **Divergence from the issue on `runs/`** — documented above; deliberate, doc-backed.
