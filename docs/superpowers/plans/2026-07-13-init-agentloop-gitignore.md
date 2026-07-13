# `.agentloop/.gitignore` at init — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `agentloop init` write a `.agentloop/.gitignore` that ignores per-machine state (`state.json`, `loops/*/`, `runs/`) while keeping durable evidence tracked, and print a hint when an older init already committed that state.

**Architecture:** Add the ignore patterns as a single constant list, write the file through the existing skip-if-exists `writeGeneratedFile` helper, add a read-only `git ls-files` helper to detect already-tracked state, surface it on `InitResult`, render it in the CLI, and document the split in two generated templates.

**Tech Stack:** TypeScript (ESM), Node `fs/promises`, `execa` for git, Vitest for tests. Package manager: npm (`npm test`, `npm run build`, `npm run typecheck`, `npm run lint`).

## Global Constraints

- Files live under `src/core/` (logic), `src/cli/commands/` (rendering), `src/templates/root/` (docs), `tests/` (Vitest). Match existing style: `execa('git', [...], { cwd, reject: false })`, named exports, no default exports.
- The generated `.gitignore` patterns are relative to `.agentloop/` (git resolves a nested `.gitignore` from its own directory): `state.json`, `loops/*/`, `runs/`. Do **not** prefix them with `.agentloop/`.
- `research/` is explicitly NOT in the ignore set (no CLI command writes it).
- `init` must never run `git rm` — detection is read-only; it only advises.
- Skip-if-exists and dry-run semantics must match every other scaffolded file.
- Preserve `--redact-paths`: any absolute paths added to `InitResult` must pass through the CLI's existing `redact` map.

---

### Task 1: Write `.agentloop/.gitignore` during init

**Files:**
- Modify: `src/core/constants.ts` (add two exports after line 10, `AGENTLOOP_FILE`)
- Modify: `src/core/init.ts` (import constants; register target in `validateInitOutputTargets`; write the file in `initializeAgentLoop`)
- Test: `tests/init.test.ts` (add tests inside the existing `describe('init', ...)`)

**Interfaces:**
- Produces: `AGENTLOOP_GITIGNORE_FILE = '.agentloop/.gitignore'` and `AGENTLOOP_PER_MACHINE_PATTERNS: readonly string[] = ['state.json', 'loops/*/', 'runs/']`, both from `src/core/constants.ts`.
- Consumes: existing `writeGeneratedFile(cwd, requestedPath, expectedDir, expectedExtension, content, result)` and `AGENTLOOP_DIR` from `src/core/init.ts` / `constants.ts`.

- [ ] **Step 1: Write the failing test**

Add to `tests/init.test.ts` inside `describe('init', ...)`:

```ts
test('scaffolds .agentloop/.gitignore for per-machine state', async () => {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await writeJson(path.join(dir, 'package.json'), { name: 'demo' });

  const result = await initializeAgentLoop({ cwd: dir });
  const gitignore = await readFile(path.join(dir, '.agentloop/.gitignore'), 'utf8');

  expect(result.created.some((file) => file.endsWith('.agentloop/.gitignore'))).toBe(true);
  expect(gitignore).toContain('state.json');
  expect(gitignore).toContain('loops/*/');
  expect(gitignore).toContain('runs/');
  expect(gitignore).not.toContain('research/');
  expect(gitignore).toContain('per-machine state');
});

test('.agentloop/.gitignore is skipped when it already exists', async () => {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await writeJson(path.join(dir, 'package.json'), { name: 'demo' });
  await mkdir(path.join(dir, '.agentloop'), { recursive: true });
  await writeFile(path.join(dir, '.agentloop/.gitignore'), 'custom\n');

  const result = await initializeAgentLoop({ cwd: dir });

  expect(result.skipped.some((file) => file.endsWith('.agentloop/.gitignore'))).toBe(true);
  await expect(readFile(path.join(dir, '.agentloop/.gitignore'), 'utf8')).resolves.toBe('custom\n');
});
```

(`mkdir`, `writeFile`, `readFile` are already imported at the top of the file.)

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- tests/init.test.ts -t "gitignore"`
Expected: FAIL — `.agentloop/.gitignore` is not created (ENOENT on readFile / `created` assertion false).

- [ ] **Step 3: Add the constants**

In `src/core/constants.ts`, after line 10 (`export const AGENTLOOP_FILE = 'AGENTLOOP.md';`) add:

```ts
export const AGENTLOOP_GITIGNORE_FILE = '.agentloop/.gitignore';
// Per-machine harness state the CLI regenerates; kept out of git. The .gitignore
// body and the already-tracked check both read this one list so they never drift.
export const AGENTLOOP_PER_MACHINE_PATTERNS = ['state.json', 'loops/*/', 'runs/'] as const;
```

- [ ] **Step 4: Register the validation target and write the file**

In `src/core/init.ts`:

Add to the constants import block (lines 4-14):

```ts
  AGENTLOOP_GITIGNORE_FILE,
  AGENTLOOP_PER_MACHINE_PATTERNS,
```

Add a module-level helper near the other `const` declarations (e.g. after `LOCAL_ONLY_NOTICE`, ~line 78):

```ts
const AGENTLOOP_GITIGNORE_CONTENT = `# AgentLoopKit per-machine state — the CLI regenerates these; safe to ignore.
# Durable evidence stays tracked: tasks/, reports/, handoffs/, policies/,
# loops/*.md, manifest.json. See .agentloop/README.md for the full split.
${AGENTLOOP_PER_MACHINE_PATTERNS.join('\n')}
`;
```

In `validateInitOutputTargets`, add to the `rootTargets` array (after the `reports/README.md` entry, ~line 139):

```ts
    {
      requestedPath: AGENTLOOP_GITIGNORE_FILE,
      expectedDir: AGENTLOOP_DIR,
      expectedExtension: '',
    },
```

In `initializeAgentLoop`, after the `reports/README.md` write block (ends ~line 439, before the `agentsContent` line) add:

```ts
  await writeGeneratedFile(
    cwd,
    AGENTLOOP_GITIGNORE_FILE,
    AGENTLOOP_DIR,
    '',
    AGENTLOOP_GITIGNORE_CONTENT,
    result,
  );
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test -- tests/init.test.ts -t "gitignore"`
Expected: PASS (both tests).

- [ ] **Step 6: Run the full init suite + typecheck to catch regressions**

Run: `npm test -- tests/init.test.ts && npm run typecheck`
Expected: PASS. (The empty-string `expectedExtension` passes because the resolver validates with `absolutePath.endsWith('')`, which is always true.)

- [ ] **Step 7: Commit**

```bash
git add src/core/constants.ts src/core/init.ts tests/init.test.ts
git commit -m "feat(init): scaffold .agentloop/.gitignore for per-machine state

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: `listTrackedPaths` git helper

**Files:**
- Modify: `src/core/git.ts` (add exported function)
- Test: `tests/git.test.ts` — check first whether this file exists (`ls tests/git.test.ts`); if it does, add the test there; if not, add a focused `describe('listTrackedPaths', ...)` test to `tests/init.test.ts` (it already has git fixtures via `initGitRepository`).

**Interfaces:**
- Produces: `listTrackedPaths(cwd: string, pathspecs: string[]): Promise<string[]>` — returns repo-relative paths that git currently tracks matching any pathspec; `[]` when outside a repo, on git error, or when `pathspecs` is empty.
- Consumes: `execa` (already imported at top of `git.ts`).

- [ ] **Step 1: Write the failing test**

Add (see file-choice note above; example assumes `tests/init.test.ts` with its imports):

```ts
test('listTrackedPaths returns only git-tracked matches', async () => {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await initGitRepository(dir);
  await mkdir(path.join(dir, '.agentloop'), { recursive: true });
  await writeFile(path.join(dir, '.agentloop/state.json'), '{}\n');
  await writeFile(path.join(dir, '.agentloop/untracked.txt'), 'x\n');
  await execFileAsync('git', ['add', '.agentloop/state.json'], { cwd: dir });

  const tracked = await listTrackedPaths(dir, ['.agentloop/state.json', '.agentloop/runs/']);
  expect(tracked).toEqual(['.agentloop/state.json']);

  const none = await listTrackedPaths(dir, ['.agentloop/runs/']);
  expect(none).toEqual([]);
});

test('listTrackedPaths returns [] outside a git repo', async () => {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  expect(await listTrackedPaths(dir, ['.agentloop/state.json'])).toEqual([]);
});
```

Add the import at the top of the test file:

```ts
import { listTrackedPaths } from '../src/core/git.js';
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- tests/init.test.ts -t "listTrackedPaths"`
Expected: FAIL — `listTrackedPaths` is not exported.

- [ ] **Step 3: Implement the helper**

In `src/core/git.ts`, add after `getGitStatus` (~line 52):

```ts
export async function listTrackedPaths(cwd: string, pathspecs: string[]): Promise<string[]> {
  if (pathspecs.length === 0) return [];
  const result = await execa('git', ['ls-files', '-z', '--', ...pathspecs], {
    cwd,
    reject: false,
  });
  if (result.exitCode !== 0) return [];
  return result.stdout.split('\0').filter((entry) => entry.length > 0);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- tests/init.test.ts -t "listTrackedPaths"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/core/git.ts tests/init.test.ts
git commit -m "feat(git): add listTrackedPaths helper

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Detect already-tracked per-machine state in init

**Files:**
- Modify: `src/core/init.ts` (extend `InitResult`; compute `perMachineState`)
- Test: `tests/init.test.ts`

**Interfaces:**
- Consumes: `listTrackedPaths` (Task 2), `AGENTLOOP_PER_MACHINE_PATTERNS` and `AGENTLOOP_DIR` (Task 1), and the existing `result.git.isRepository` computed in `initializeAgentLoop`.
- Produces: on `InitResult`, an optional field:

```ts
perMachineState?: {
  trackedPaths: string[];   // sorted, repo-relative (e.g. ".agentloop/state.json")
  untrackCommand: string;   // ready-to-run `git rm -r --cached ...` for tracked groups only
};
```

- [ ] **Step 1: Write the failing test**

```ts
test('init flags per-machine state that git already tracks', async () => {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await initGitRepository(dir);
  await writeJson(path.join(dir, 'package.json'), { name: 'demo' });
  await mkdir(path.join(dir, '.agentloop'), { recursive: true });
  await writeFile(path.join(dir, '.agentloop/state.json'), '{}\n');
  await execFileAsync('git', ['add', '.agentloop/state.json'], { cwd: dir });

  const result = await initializeAgentLoop({ cwd: dir });

  expect(result.perMachineState?.trackedPaths).toEqual(['.agentloop/state.json']);
  expect(result.perMachineState?.untrackCommand).toContain('git rm -r --cached');
  expect(result.perMachineState?.untrackCommand).toContain('.agentloop/state.json');
  expect(result.perMachineState?.untrackCommand).not.toContain('.agentloop/runs/');
});

test('init omits perMachineState when nothing per-machine is tracked', async () => {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await initGitRepository(dir);
  await writeJson(path.join(dir, 'package.json'), { name: 'demo' });

  const result = await initializeAgentLoop({ cwd: dir });

  expect(result.perMachineState).toBeUndefined();
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- tests/init.test.ts -t "per-machine state"`
Expected: FAIL — `perMachineState` is undefined in the first test (field not implemented).

- [ ] **Step 3: Extend the `InitResult` type**

In `src/core/init.ts`, add to the `InitResult` type (after the `localOnly?` block, ~line 44):

```ts
  perMachineState?: {
    trackedPaths: string[];
    untrackCommand: string;
  };
```

- [ ] **Step 4: Add the import**

In `src/core/init.ts`, add `listTrackedPaths` to the existing `./git.js` import (line 18):

```ts
import { getGitAbsoluteDir, getGitRoot, isInsideGitRepo, listTrackedPaths } from './git.js';
```

- [ ] **Step 5: Add a detection helper**

In `src/core/init.ts`, add near the other module helpers (e.g. after `AGENTLOOP_GITIGNORE_CONTENT`):

```ts
function perMachinePathspecs() {
  return AGENTLOOP_PER_MACHINE_PATTERNS.map((pattern) => `${AGENTLOOP_DIR}/${pattern}`);
}

function buildUntrackCommand(trackedPaths: string[]) {
  const groups = perMachinePathspecs().filter((spec) => {
    const prefix = spec.replace(/\*\/$/, '').replace(/\/$/, '');
    return trackedPaths.some((tracked) => tracked === prefix || tracked.startsWith(`${prefix}/`));
  });
  const quoted = groups.map((spec) => (spec.includes('*') ? `'${spec}'` : spec));
  return `git rm -r --cached ${quoted.join(' ')}`;
}
```

Note on `prefix`: `.agentloop/state.json` → `.agentloop/state.json`; `.agentloop/loops/*/` → `.agentloop/loops`; `.agentloop/runs/` → `.agentloop/runs`. A tracked path is attributed to a group when it equals the prefix or sits under it.

- [ ] **Step 6: Compute the field in `initializeAgentLoop`**

In `src/core/init.ts`, just before `return result;` (~line 471) add:

```ts
  if (result.git.isRepository) {
    const trackedPaths = (await listTrackedPaths(cwd, perMachinePathspecs())).sort();
    if (trackedPaths.length > 0) {
      result.perMachineState = {
        trackedPaths,
        untrackCommand: buildUntrackCommand(trackedPaths),
      };
    }
  }
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npm test -- tests/init.test.ts -t "per-machine state"`
Expected: PASS (both tests).

- [ ] **Step 8: Run the full init suite + typecheck**

Run: `npm test -- tests/init.test.ts && npm run typecheck`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/core/init.ts tests/init.test.ts
git commit -m "feat(init): flag already-tracked per-machine state

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Render the hint in the CLI

**Files:**
- Modify: `src/cli/commands/init.ts`
- Test: `tests/init.test.ts` (CLI-invocation tests via `execa(tsxPath, [cliPath, 'init', ...])`)

**Interfaces:**
- Consumes: `result.perMachineState` (Task 3). The field already flows into `--json` via the existing `...result` spread; this task adds human rendering and path redaction.

- [ ] **Step 1: Write the failing tests**

```ts
test('human init output notes already-tracked per-machine state', async () => {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await initGitRepository(dir);
  await writeJson(path.join(dir, 'package.json'), { name: 'demo' });
  await mkdir(path.join(dir, '.agentloop'), { recursive: true });
  await writeFile(path.join(dir, '.agentloop/state.json'), '{}\n');
  await execFileAsync('git', ['add', '.agentloop/state.json'], { cwd: dir });

  const result = await execa(tsxPath, [cliPath, 'init'], { cwd: dir, reject: false });

  expect(result.exitCode).toBe(0);
  expect(result.stdout).toContain('per-machine state is already git-tracked');
  expect(result.stdout).toContain('git rm -r --cached');
  expect(result.stdout).toContain('.agentloop/state.json');
});

test('human init output omits the note when no state is tracked', async () => {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await initGitRepository(dir);
  await writeJson(path.join(dir, 'package.json'), { name: 'demo' });

  const result = await execa(tsxPath, [cliPath, 'init'], { cwd: dir, reject: false });

  expect(result.exitCode).toBe(0);
  expect(result.stdout).not.toContain('per-machine state is already git-tracked');
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- tests/init.test.ts -t "per-machine state is already"`
Expected: FAIL — the note is not printed.

- [ ] **Step 3: Redact the field's paths for JSON output**

In `src/cli/commands/init.ts`, inside the `if (options.json)` block (~line 78), replace the spread object so `perMachineState` paths are redacted. Change:

```ts
              {
                ...result,
                targetDirectory,
                git: { ...result.git, root: gitRoot },
                created,
                updated,
                skipped,
              },
```

to:

```ts
              {
                ...result,
                targetDirectory,
                git: { ...result.git, root: gitRoot },
                created,
                updated,
                skipped,
                perMachineState: result.perMachineState
                  ? {
                      ...result.perMachineState,
                      trackedPaths: result.perMachineState.trackedPaths.map(redact),
                    }
                  : undefined,
              },
```

(`untrackCommand` uses repo-relative `.agentloop/...` paths, so it needs no redaction.)

- [ ] **Step 4: Print the human note**

In `src/cli/commands/init.ts`, after the `result.localOnly` block (ends ~line 130) and before `if (!options.dryRun)` add:

```ts
        if (result.perMachineState) {
          logger.info(
            `\nNote: per-machine state is already git-tracked (${result.perMachineState.trackedPaths
              .map(redact)
              .join(', ')}).`,
          );
          logger.info(`      Run: ${result.perMachineState.untrackCommand}`);
          logger.info('      then commit, so the new .agentloop/.gitignore takes effect.');
        }
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test -- tests/init.test.ts -t "per-machine state is already"`
Expected: PASS (both tests).

- [ ] **Step 6: Run the full init suite + typecheck + lint**

Run: `npm test -- tests/init.test.ts && npm run typecheck && npm run lint`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/cli/commands/init.ts tests/init.test.ts
git commit -m "feat(init): surface untrack hint in CLI output

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Document the committed-vs-ignored split in templates

**Files:**
- Modify: `src/templates/root/agentloop-directory-readme.md` (insert a section after the `## Directories` list, ~line 188)
- Modify: `src/templates/root/AGENTLOOP.md` (insert a note after the `## Repo Layout` list, ~line 25)
- Test: `tests/init.test.ts`

**Interfaces:**
- Consumes: nothing new. Templates render verbatim through the existing init flow into `.agentloop/README.md` and `AGENTLOOP.md`.

- [ ] **Step 1: Write the failing test**

```ts
test('generated docs describe the committed vs ignored split', async () => {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await writeJson(path.join(dir, 'package.json'), { name: 'demo' });

  await initializeAgentLoop({ cwd: dir });
  const readme = await readFile(path.join(dir, '.agentloop/README.md'), 'utf8');
  const agentloop = await readFile(path.join(dir, 'AGENTLOOP.md'), 'utf8');

  expect(readme).toContain('Committed vs ignored');
  expect(readme).toContain('.agentloop/.gitignore');
  expect(readme).toContain('state.json');
  expect(agentloop).toContain('.agentloop/.gitignore');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/init.test.ts -t "committed vs ignored"`
Expected: FAIL — the phrase is not in the generated docs.

- [ ] **Step 3: Add the README section**

In `src/templates/root/agentloop-directory-readme.md`, after the `## Directories` list (after the `- \`harness/\`` line, ~line 188) insert:

```markdown

## Committed vs ignored

`agentloop init` writes `.agentloop/.gitignore` so per-machine state stays out of git while durable evidence is versioned.

- **Committed (durable evidence):** `tasks/`, `reports/`, `handoffs/`, `policies/`, `gates/`, `agents/`, `harness/`, `loops/*.md`, `manifest.json`.
- **Ignored (per-machine state the CLI regenerates):** `state.json`, `loops/<timestamp>/` instance directories, and the local `runs/` ledger.

If an older init already committed that state, run `git rm -r --cached .agentloop/state.json '.agentloop/loops/*/' .agentloop/runs/` and commit, so the ignore file takes effect.
```

- [ ] **Step 4: Add the AGENTLOOP.md note**

In `src/templates/root/AGENTLOOP.md`, after the `.agentloop/state.json:` line (~line 25) insert:

```markdown
- .agentloop/.gitignore: keeps per-machine state (state.json, loops/*/, runs/) out of git; durable evidence stays tracked.
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- tests/init.test.ts -t "committed vs ignored"`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/templates/root/agentloop-directory-readme.md src/templates/root/AGENTLOOP.md tests/init.test.ts
git commit -m "docs(init): document committed vs ignored .agentloop split

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Full verification and build

**Files:** none (verification only).

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS (all suites, including the new init tests).

- [ ] **Step 2: Typecheck, lint, and build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: PASS. Build regenerates `dist/templates/...`, so the shipped templates carry the new docs.

- [ ] **Step 3: Manual smoke check**

```bash
cd "$(mktemp -d)" && git init -q && echo '{"name":"smoke"}' > package.json \
  && node "<repo>/dist/cli/index.js" init && cat .agentloop/.gitignore
```
Expected: init succeeds; `.agentloop/.gitignore` contains `state.json`, `loops/*/`, `runs/`; no `research/`.

- [ ] **Step 4: Commit any build artifacts if the repo tracks `dist/`**

```bash
git status --short dist/
# If dist/ is tracked and changed:
git add dist/ && git commit -m "build: regenerate dist for .agentloop/.gitignore

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```
(If `dist/` is gitignored, skip — nothing to commit.)

---

## Self-Review

**Spec coverage:**
- `.gitignore` contents (`state.json`, `loops/*/`, `runs/`; no `research/`) → Task 1. ✓
- Single-source pattern list → Task 1 (`AGENTLOOP_PER_MACHINE_PATTERNS`). ✓
- Dotfile extension validation → Task 1 Step 6 note + skip-if-exists test. ✓
- `listTrackedPaths` helper → Task 2. ✓
- Already-tracked detection + `InitResult.perMachineState` + narrowed untrack command → Task 3. ✓
- CLI human render + `--json` + `--redact-paths` → Task 4. ✓
- Docs in both templates → Task 5. ✓
- Behavior table (fresh/re-run/dry-run/no-git/local-only) → covered by Task 1 & 3 tests (fresh, skip, no-git-implies-no-field); dry-run and local-only inherit existing behavior and need no new code. ✓
- Build regenerates `dist/templates` → Task 6. ✓

**Placeholder scan:** No TBD/TODO; every code step shows complete code and exact commands. ✓

**Type consistency:** `AGENTLOOP_PER_MACHINE_PATTERNS` / `AGENTLOOP_GITIGNORE_FILE` used identically in Tasks 1 & 3; `listTrackedPaths(cwd, pathspecs)` signature matches between Task 2 definition and Task 3 use; `perMachineState.{trackedPaths,untrackCommand}` shape matches between Task 3 (produce) and Task 4 (consume). ✓
