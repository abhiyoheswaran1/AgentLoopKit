# AgentLoopKit 1.0 Stability Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship AgentLoopKit 1.0 by turning the full current command surface into a committed public contract that CI enforces, backed by a written SemVer/deprecation policy, a pre-freeze consistency audit, and a guaranteed 0.x→1.0 upgrade path.

**Architecture:** Add contract-lock tests (Vitest snapshots) over the four machine-checkable surfaces — CLI help, config JSON schema, MCP tool definitions, and `--json` output *shapes* — and wire a `contract:check` script into the release flow. Publish `docs/stability.md` and `docs/versioning.md` as the human contract, with doc-drift tests keeping them honest. Run a consistency audit before locking, fix divergences, then regenerate the snapshots so the frozen state is the corrected state. Harden `upgrade-harness` with a historical template-version matrix.

**Tech Stack:** TypeScript (ESM, Node ≥20), Commander (CLI), Zod, Vitest (`toMatchSnapshot`), execa + tsx (CLI process tests), pnpm.

## Global Constraints

- Node engine floor: `>=20` (verbatim from `package.json`).
- No new commands, no new integrations, no scope expansion. Non-Goals from `ROADMAP.md` hold: no hosted SaaS, no LLM wrapper, no telemetry, no database, no IDE replacement.
- Tests run via Vitest. CLI-process tests invoke the CLI as `execa(tsxPath, [cliPath, ...])` where `cliPath = path.resolve('src/cli/index.ts')` and `tsxPath = path.resolve('node_modules/.bin/tsx')` (verbatim pattern from `tests/cli-docs-drift.test.ts`).
- Snapshots are the contract: a failing contract-lock test means a committed surface changed. Updating a snapshot (`vitest -u`) is an intentional, reviewed act that must accompany a deliberate version decision.
- Commit frequently, one deliverable per commit. Co-author trailer on every commit: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- The canonical stable command list lives in ONE place (Task 1) and is imported by every contract test — never duplicate it.
- **Dogfood the whole release through the Baseframe suite (AgentLoopKit + ProjScan + AgentFlight), latest versions.** Every task below runs inside the dogfooding loop defined in the next section. This is a hard requirement, not optional.

---

## Dogfooding Loop (Baseframe Suite) — applies to every task

This release must be built with our own product. Per `.agentloop/harness/autonomous-dogfooding.md`, this repo operates itself through AgentLoopKit and uses ProjScan and AgentFlight as local proof sources. Use **latest** versions of the external tools.

**Version pinning (verbatim):**
- AgentLoopKit: the working tree *is* the latest AgentLoopKit — run it through the source CLI `npx --no-install tsx src/cli/index.ts <cmd>` (aliased below as `agentloop`). Do not `npx agentloopkit@latest` against this repo; the source tree is ahead of npm.
- ProjScan: `npx --yes projscan@latest <cmd>`
- AgentFlight: `npx --yes agentflight@latest <cmd>`

**Per-task loop (wrap each Task N below in these phases):**

1. **Start the session (recorder first, then task contract — never in parallel):**
   ```bash
   npm run dogfood:start -- --title "<Task N title>" --type <feature|tests|docs|refactor|release> \
     --problem "<why this task matters>" --outcome "<what is true when done>"
   ```
   This starts the AgentFlight recorder and creates the AgentLoop task contract through the source CLI. Task type mapping: Tasks 1,3,4,5,9 → `tests`; Tasks 2,7,8,10 → `docs`; Task 6 → `refactor`; Task 11 → `release` (only when explicitly cutting the version).

2. **Risk context before coding:**
   ```bash
   npx --yes projscan@latest doctor --format markdown
   ```
   For tasks that touch risk-relevant source (Task 7b fixes, Task 9 upgrade paths), optionally seed the contract from ProjScan risk:
   ```bash
   npx --no-install tsx src/cli/index.ts create-task --from-projscan
   ```

3. **Implement** the task's TDD steps.

4. **Verify through AgentLoopKit** against the task contract:
   ```bash
   npx --no-install tsx src/cli/index.ts verify --task <task-path> --redact-paths
   ```

5. **Reconcile gates with AgentFlight evidence:**
   ```bash
   npx --yes agentflight@latest status
   npx --yes agentflight@latest report
   npx --no-install tsx src/cli/index.ts check-gates --baseframe-task-id <task-id> --from-agentflight
   ```

6. **Confirm review-readiness, then commit** (the commit shown in each task's final step):
   ```bash
   npx --no-install tsx src/cli/index.ts ready --redact-paths
   ```

7. **Close the session:** ensure `agentloop status` shows the task complete and AgentFlight proof is written before starting the next task.

**Dogfood integrity check (run once, mid-plan and before release):**
```bash
npm run dogfood:strict
```
Any dogfood failure is a real finding — fix it before continuing, the same as a failing test. Keep `.agentloop/dogfood-log.md` updated per the Dogfood Steward role.

---

## File Structure

**New files:**
- `docs/stability.md` — the human-readable public contract (WS1).
- `docs/versioning.md` — SemVer promise, deprecation policy, experimental tier (WS4).
- `docs/1.0-consistency-audit.md` — audit findings + triage (WS2).
- `src/core/stable-surface.ts` — the single canonical list of stable command names + `--json`-supporting commands, exported for tests and docs-drift checks.
- `tests/contract/cli-help.contract.test.ts` — CLI `--help` snapshot lock (WS3).
- `tests/contract/config-schema.contract.test.ts` — config schema snapshot lock (WS3).
- `tests/contract/mcp-tools.contract.test.ts` — MCP tool definitions snapshot lock (WS3).
- `tests/contract/json-shape.contract.test.ts` — `--json` output *shape* snapshot lock (WS3).
- `tests/contract/shape.ts` — `shapeOf()` helper that reduces a value to its key/type skeleton (WS3).
- `tests/stability-docs.test.ts` — asserts `docs/stability.md` and `docs/versioning.md` cover the surface (WS1/WS4).
- `tests/upgrade-harness-matrix.test.ts` — historical template-version → 1.0 migration matrix (WS5).

**Modified files:**
- `package.json` — add `contract:check` script; wire into `release-flow`; bump to `1.0.0`.
- `README.md` — stability section + versioning guarantees + 0.x→1.0 migration pointer.
- `ROADMAP.md`, `CHANGELOG.md` — 1.0 entries.
- Command source files under `src/cli/commands/` — only as WS2 audit fixes require.

---

## Task 1: Canonical stable-surface list (WS1 foundation)

**Files:**
- Create: `src/core/stable-surface.ts`
- Modify: `tests/cli-docs-drift.test.ts` (import the shared list instead of its local copy)
- Test: `tests/stable-surface.test.ts`

**Interfaces:**
- Produces: `export const STABLE_COMMANDS: readonly string[]` (top-level command names) and `export const JSON_COMMANDS: readonly string[]` (subset of `STABLE_COMMANDS` that support `--json`). Consumed by every contract test and the docs-drift test.

- [ ] **Step 1: Write the failing test**

```ts
// tests/stable-surface.test.ts
import path from 'node:path';
import { execa } from 'execa';
import { describe, expect, test } from 'vitest';
import { STABLE_COMMANDS, JSON_COMMANDS } from '../src/core/stable-surface.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

describe('stable surface', () => {
  test('every stable command appears in top-level --help', async () => {
    const { stdout } = await execa(tsxPath, [cliPath, '--help']);
    for (const command of STABLE_COMMANDS) {
      expect(stdout).toContain(command);
    }
  });

  test('JSON_COMMANDS is a subset of STABLE_COMMANDS', () => {
    for (const command of JSON_COMMANDS) {
      expect(STABLE_COMMANDS).toContain(command);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run tests/stable-surface.test.ts`
Expected: FAIL — cannot resolve `../src/core/stable-surface.js`.

- [ ] **Step 3: Write minimal implementation**

Create `src/core/stable-surface.ts`. Copy the 40-entry command array verbatim from the existing `publicCommands` list in `tests/cli-docs-drift.test.ts` (init, doctor, create-task, verify, summarize, handoff, status, next, start, review-context, context, ready, loop, guard, check-gates, ship, prepare-pr, runs, show-run, intent, maintainer-check, report, badge, artifacts, upgrade-harness, ci-summary, release-notes, release-check, release-proof, npm-status, mcp-server, schemastore, github, policy, task, install-agent, list-templates, completion, version).

```ts
// src/core/stable-surface.ts
export const STABLE_COMMANDS = [
  'init', 'doctor', 'create-task', 'verify', 'summarize', 'handoff',
  'status', 'next', 'start', 'review-context', 'context', 'ready', 'loop',
  'guard', 'check-gates', 'ship', 'prepare-pr', 'runs', 'show-run', 'intent',
  'maintainer-check', 'report', 'badge', 'artifacts', 'upgrade-harness',
  'ci-summary', 'release-notes', 'release-check', 'release-proof', 'npm-status',
  'mcp-server', 'schemastore', 'github', 'policy', 'task', 'install-agent',
  'list-templates', 'completion', 'version',
] as const;

// Commands that expose a `--json` output surface. Verify each entry against its
// command source in src/cli/commands/ before adding it here; this list is the
// contract for Task 5. Start with the confirmed set below and extend during WS2.
export const JSON_COMMANDS = [
  'status', 'next', 'start', 'ready', 'guard', 'check-gates',
  'review-context', 'artifacts',
] as const;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run tests/stable-surface.test.ts`
Expected: PASS.

- [ ] **Step 5: De-duplicate the drift test**

In `tests/cli-docs-drift.test.ts`, delete the local `const publicCommands = [...]` array and replace usages with an import: `import { STABLE_COMMANDS as publicCommands } from '../src/core/stable-surface.js';`.

- [ ] **Step 6: Run the drift test to confirm no regression**

Run: `pnpm exec vitest run tests/cli-docs-drift.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/core/stable-surface.ts tests/stable-surface.test.ts tests/cli-docs-drift.test.ts
git commit -m "feat: add canonical stable-surface command list

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Publish the stability contract doc (WS1)

**Files:**
- Create: `docs/stability.md`
- Test: `tests/stability-docs.test.ts`

**Interfaces:**
- Consumes: `STABLE_COMMANDS` from Task 1.

- [ ] **Step 1: Write the failing test**

```ts
// tests/stability-docs.test.ts
import { readFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';
import { STABLE_COMMANDS } from '../src/core/stable-surface.js';

describe('stability docs', () => {
  test('stability.md documents every stable command', async () => {
    const doc = await readFile('docs/stability.md', 'utf8');
    for (const command of STABLE_COMMANDS) {
      expect(doc).toContain(`agentloop ${command}`);
    }
  });

  test('stability.md names all six committed axes', async () => {
    const doc = await readFile('docs/stability.md', 'utf8');
    for (const axis of [
      'CLI commands',
      'config',
      'MCP',
      'JSON output',
      'exit code',
      'harness format',
    ]) {
      expect(doc.toLowerCase()).toContain(axis.toLowerCase());
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run tests/stability-docs.test.ts`
Expected: FAIL — `docs/stability.md` does not exist.

- [ ] **Step 3: Write the doc**

Create `docs/stability.md` with these sections:
1. **What 1.0 guarantees** — the six committed axes (copy the "public contract" list from the spec: CLI commands + flags; `agentloop.config.json` config schema; MCP tool surface; `--json` output shapes; exit codes; generated harness format + package API).
2. **Stable command reference** — a table with one row per entry in `STABLE_COMMANDS`, each row containing the literal string `agentloop <command>` plus a one-line description of its committed behavior.
3. **What is NOT covered** — human-readable log text, exact wording of Markdown reports, internal module paths.
4. **How stability is enforced** — points to the contract-lock tests (Task 3–6) and `contract:check`.
5. A link to `docs/versioning.md` (created in Task 8).

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run tests/stability-docs.test.ts`
Expected: PASS (the versioning link will resolve after Task 8; the test does not require it yet).

- [ ] **Step 5: Commit**

```bash
git add docs/stability.md tests/stability-docs.test.ts
git commit -m "docs: publish 1.0 stability contract

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Lock CLI help output (WS3)

**Files:**
- Create: `tests/contract/cli-help.contract.test.ts`

**Interfaces:**
- Consumes: `STABLE_COMMANDS` from Task 1.

- [ ] **Step 1: Write the test that generates the lock**

```ts
// tests/contract/cli-help.contract.test.ts
import path from 'node:path';
import { execa } from 'execa';
import { describe, expect, test } from 'vitest';
import { STABLE_COMMANDS } from '../../src/core/stable-surface.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

describe('CLI help contract', () => {
  test('top-level --help is locked', async () => {
    const { stdout } = await execa(tsxPath, [cliPath, '--help']);
    expect(stdout).toMatchSnapshot();
  });

  for (const command of STABLE_COMMANDS) {
    test(`help for "${command}" is locked`, async () => {
      const { stdout } = await execa(tsxPath, [cliPath, command, '--help']);
      expect(stdout).toMatchSnapshot();
    });
  }
});
```

- [ ] **Step 2: Generate the initial snapshot**

Run: `pnpm exec vitest run tests/contract/cli-help.contract.test.ts`
Expected: PASS, writing `tests/contract/__snapshots__/cli-help.contract.test.ts.snap`. If any command errors on `--help` (e.g. requires a subcommand), note it — that is a WS2 audit finding; record it in Task 7 rather than working around it here.

- [ ] **Step 3: Prove the lock catches drift**

Temporarily change a command's `.description(...)` string in its `src/cli/commands/*.ts` file, re-run the test, and confirm it FAILS with a snapshot diff. Then revert the change and confirm it PASSES again. (This step verifies the guard works; make no committed change.)

- [ ] **Step 4: Commit**

```bash
git add tests/contract/cli-help.contract.test.ts tests/contract/__snapshots__/cli-help.contract.test.ts.snap
git commit -m "test: lock CLI help output as 1.0 contract

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Lock config schema and MCP tool definitions (WS3)

**Files:**
- Create: `tests/contract/config-schema.contract.test.ts`
- Create: `tests/contract/mcp-tools.contract.test.ts`

**Interfaces:**
- Consumes: `listMcpTools()` from `src/core/mcp-tools.js` (returns the array of MCP tool definitions).

- [ ] **Step 1: Write the config-schema lock test**

```ts
// tests/contract/config-schema.contract.test.ts
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

describe('config schema contract', () => {
  test('agentloop.config.schema.json is locked', async () => {
    const raw = await readFile(
      path.resolve('schema/agentloop.config.schema.json'),
      'utf8',
    );
    expect(JSON.parse(raw)).toMatchSnapshot();
  });
});
```

- [ ] **Step 2: Write the MCP tools lock test**

```ts
// tests/contract/mcp-tools.contract.test.ts
import { describe, expect, test } from 'vitest';
import { listMcpTools } from '../../src/core/mcp-tools.js';

describe('MCP tool contract', () => {
  test('MCP tool definitions are locked', () => {
    expect(listMcpTools()).toMatchSnapshot();
  });
});
```

- [ ] **Step 3: Generate the snapshots**

Run: `pnpm exec vitest run tests/contract/config-schema.contract.test.ts tests/contract/mcp-tools.contract.test.ts`
Expected: PASS, writing both `.snap` files under `tests/contract/__snapshots__/`.

- [ ] **Step 4: Prove each lock catches drift**

Temporarily add a dummy property to `schema/agentloop.config.schema.json` and a dummy tool `name` in `src/core/mcp-tools.ts`; re-run; confirm both FAIL with diffs; revert both; confirm PASS. (No committed change.)

- [ ] **Step 5: Commit**

```bash
git add tests/contract/config-schema.contract.test.ts tests/contract/mcp-tools.contract.test.ts tests/contract/__snapshots__/config-schema.contract.test.ts.snap tests/contract/__snapshots__/mcp-tools.contract.test.ts.snap
git commit -m "test: lock config schema and MCP tools as 1.0 contract

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Lock `--json` output shapes (WS3)

**Files:**
- Create: `tests/contract/shape.ts`
- Create: `tests/contract/json-shape.contract.test.ts`

**Interfaces:**
- Consumes: `JSON_COMMANDS` from Task 1; `makeTempDir`, `removeTempDir` from `tests/helpers.ts`.
- Produces: `export function shapeOf(value: unknown): unknown` — reduces any value to its key/type skeleton so the snapshot locks field names and types, not volatile values (timestamps, paths).

- [ ] **Step 1: Write the shape helper and its test**

```ts
// tests/contract/shape.ts
export function shapeOf(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.length > 0 ? [shapeOf(value[0])] : [];
  }
  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(record)
        .sort()
        .map((key) => [key, shapeOf(record[key])]),
    );
  }
  return value === null ? 'null' : typeof value;
}
```

```ts
// tests/contract/shape.test.ts
import { describe, expect, test } from 'vitest';
import { shapeOf } from './shape.js';

describe('shapeOf', () => {
  test('reduces values to a stable key/type skeleton', () => {
    const input = {
      command: 'agentloop verify',
      count: 3,
      ok: true,
      items: [{ path: '/tmp/x', n: 1 }],
      missing: null,
    };
    expect(shapeOf(input)).toEqual({
      command: 'string',
      count: 'number',
      items: [{ n: 'number', path: 'string' }],
      missing: 'null',
      ok: 'boolean',
    });
  });
});
```

- [ ] **Step 2: Run the helper test**

Run: `pnpm exec vitest run tests/contract/shape.test.ts`
Expected: PASS.

- [ ] **Step 3: Write the `--json` shape lock test**

The test initializes a temp repo once, then for each command in `JSON_COMMANDS` runs `<command> --json --redact-paths` (drop `--redact-paths` for any command that does not offer it — the WS2 audit in Task 7 should have made this uniform) inside that repo and snapshots `shapeOf(JSON.parse(stdout))`.

```ts
// tests/contract/json-shape.contract.test.ts
import path from 'node:path';
import { execa } from 'execa';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { JSON_COMMANDS } from '../../src/core/stable-surface.js';
import { makeTempDir, removeTempDir } from '../helpers.js';
import { shapeOf } from './shape.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let repo: string;

beforeAll(async () => {
  repo = await makeTempDir();
  await execa('git', ['init'], { cwd: repo });
  await execa(tsxPath, [cliPath, 'init'], { cwd: repo });
});

afterAll(async () => {
  await removeTempDir(repo);
});

describe('JSON output shape contract', () => {
  for (const command of JSON_COMMANDS) {
    test(`--json shape for "${command}" is locked`, async () => {
      const { stdout } = await execa(
        tsxPath,
        [cliPath, command, '--json', '--redact-paths'],
        { cwd: repo, reject: false },
      );
      const parsed = JSON.parse(stdout);
      expect(shapeOf(parsed)).toMatchSnapshot();
    });
  }
});
```

- [ ] **Step 4: Generate the snapshot**

Run: `pnpm exec vitest run tests/contract/json-shape.contract.test.ts`
Expected: PASS. If any `JSON_COMMANDS` entry emits non-JSON on stdout or rejects `--redact-paths`, that is a WS2 finding — record it in Task 7, and either fix the command (preferred, so the surface is uniform before freeze) or remove that entry from `JSON_COMMANDS` with a note in the audit report. Do not silently drop it.

- [ ] **Step 5: Prove the lock catches a field change**

Pick one command whose `--json` builder is easy to locate in `src/cli/commands/` or `src/core/`, temporarily add a field to its payload, re-run, confirm the snapshot FAILS, revert, confirm PASS.

- [ ] **Step 6: Commit**

```bash
git add tests/contract/shape.ts tests/contract/shape.test.ts tests/contract/json-shape.contract.test.ts tests/contract/__snapshots__/json-shape.contract.test.ts.snap
git commit -m "test: lock --json output shapes as 1.0 contract

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Wire `contract:check` into the release flow (WS3)

**Files:**
- Modify: `package.json:51-74` (scripts block)

**Interfaces:**
- Consumes: the four contract test files from Tasks 3–5.

- [ ] **Step 1: Add the script**

In `package.json` `scripts`, add:

```json
"contract:check": "vitest run tests/contract tests/stable-surface.test.ts tests/stability-docs.test.ts",
```

- [ ] **Step 2: Wire it into `release-flow`**

Edit the `release-flow` script value so `contract:check` runs after `test:release` and before `build`. The updated value:

```
node scripts/prepublish-check.mjs && npm run lint && npm run typecheck && npm run test:release && npm run contract:check && npm run build && npm run check:public-docs && npm run check:links && npm run dogfood && npm run smoke:release
```

- [ ] **Step 3: Run the contract check**

Run: `pnpm run contract:check`
Expected: PASS — all contract snapshots and doc checks green.

- [ ] **Step 4: Run the package-scripts test (guards the scripts block)**

Run: `pnpm exec vitest run tests/package-scripts.test.ts`
Expected: PASS. If this test asserts an exact `release-flow` string, update its expectation to include `contract:check` in the same commit.

- [ ] **Step 5: Commit**

```bash
git add package.json tests/package-scripts.test.ts
git commit -m "build: enforce contract:check in release-flow

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Consistency audit report (WS2)

This task is investigative. Its deliverable is a written, triaged report — not code. Fixes it identifies become their own follow-up commits (Task 7b) scoped from the findings, so the fix cost is visible before the freeze.

**Files:**
- Create: `docs/1.0-consistency-audit.md`
- Test: extend `tests/stability-docs.test.ts` with a presence check.

- [ ] **Step 1: Produce the audit**

Sweep all `STABLE_COMMANDS` and record findings under these headings in `docs/1.0-consistency-audit.md`:
- **Flag naming** — is path redaction always `--redact-paths`? Is JSON always `--json`? Is strict mode always `--strict`? Is task selection always `--task`? List every deviation as `command | flag | expected | actual`.
- **JSON envelope** — do `--json` outputs share a top-level shape (e.g. consistent error field, metadata placement)? List outliers, referencing the snapshots from Task 5.
- **Exit codes** — does 0/1/2 mean the same thing everywhere? Note any command that exits 0 on failure or 2 where 1 is expected.
- **Path redaction** — where `--redact-paths` exists, is behavior uniform? Note commands that leak absolute roots.
- **Newest surfaces** — a dedicated section giving `loop*`, `baseframe/*` (via `create-task --from-projscan` and `check-gates --from-agentflight`), and `release-*` the hardest look, since freezing them is the highest-risk part of "commit everything."

Each finding gets a triage tag: **fix-before-1.0**, **accept-as-is**, or **defer-to-experimental** (reclassify the surface as experimental per the versioning policy rather than freezing it).

- [ ] **Step 2: Add the presence test**

Append to `tests/stability-docs.test.ts`:

```ts
test('consistency audit exists and is triaged', async () => {
  const audit = await readFile('docs/1.0-consistency-audit.md', 'utf8');
  expect(audit).toMatch(/fix-before-1\.0|accept-as-is|defer-to-experimental/);
});
```

- [ ] **Step 3: Run the test**

Run: `pnpm exec vitest run tests/stability-docs.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add docs/1.0-consistency-audit.md tests/stability-docs.test.ts
git commit -m "docs: 1.0 consistency audit report

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7b: Apply audit fixes (WS2)

Variable-size task driven by Task 7's **fix-before-1.0** findings. For each such finding, make a focused, separately-committed change. This task has no pre-written code because the fixes depend on the audit; each fix follows the same loop.

- [ ] **Per finding — Step 1: Write/adjust a test** capturing the corrected behavior (e.g. a test asserting `command --redact-paths` no longer emits an absolute path).
- [ ] **Per finding — Step 2: Run it, confirm it fails.**
- [ ] **Per finding — Step 3: Apply the minimal source fix** in the relevant `src/cli/commands/*.ts` or `src/core/*.ts`.
- [ ] **Per finding — Step 4: Run the test, confirm it passes.**
- [ ] **Per finding — Step 5: Regenerate affected contract snapshots** with `pnpm exec vitest run tests/contract -u`, review the diff to confirm it matches only the intended change, and re-run without `-u` to confirm green.
- [ ] **Per finding — Step 6: Commit** with `fix:` describing the specific correction and the co-author trailer.
- [ ] **After all fixes — Step 7: Update `docs/1.0-consistency-audit.md`** marking each fixed finding resolved; commit.

**Gate:** After Task 7b, the stable tier must have zero open **fix-before-1.0** findings. Any finding downgraded to **defer-to-experimental** must be reflected in `docs/versioning.md` (Task 8) and removed from the frozen surface.

---

## Task 8: Versioning policy + experimental tier (WS4)

**Files:**
- Create: `docs/versioning.md`
- Modify: `tests/stability-docs.test.ts`

- [ ] **Step 1: Write the failing test**

Append to `tests/stability-docs.test.ts`:

```ts
test('versioning.md states the SemVer, deprecation, and experimental policy', async () => {
  const doc = await readFile('docs/versioning.md', 'utf8');
  expect(doc.toLowerCase()).toContain('semver');
  expect(doc.toLowerCase()).toContain('deprecat');
  expect(doc.toLowerCase()).toContain('experimental');
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `pnpm exec vitest run tests/stability-docs.test.ts`
Expected: FAIL — `docs/versioning.md` missing.

- [ ] **Step 3: Write the doc**

Create `docs/versioning.md` covering:
1. **SemVer promise** — no breaking change to any surface in `docs/stability.md` within 1.x; breaking changes wait for 2.0.
2. **Deprecation policy** — minimum one-minor deprecation window; deprecations print a `DEPRECATED` warning to stderr; nothing frozen is removed before 2.0.
3. **Experimental tier** — the escape hatch: NEW features may ship in 1.x as experimental, are excluded from the stability guarantee, and are marked as such (an `experimental: true` marker in `--json` output and a "(experimental)" note in `--help`). Promotion to stable happens in a later minor, at which point they join the contract-lock tests. Document how a maintainer marks something experimental.
4. **What a snapshot failure means** — a contract-lock failure signals a surface change requiring a deliberate version decision.

- [ ] **Step 4: Run the test, confirm it passes**

Run: `pnpm exec vitest run tests/stability-docs.test.ts`
Expected: PASS.

- [ ] **Step 5: Cross-link** `docs/stability.md` → `docs/versioning.md` (the link referenced in Task 2).

- [ ] **Step 6: Commit**

```bash
git add docs/versioning.md docs/stability.md tests/stability-docs.test.ts
git commit -m "docs: publish SemVer, deprecation, and experimental-tier policy

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Upgrade-harness version matrix (WS5)

**Files:**
- Create: `tests/upgrade-harness-matrix.test.ts`
- Modify: `src/core/*` / `src/cli/commands/upgrade-harness.ts` only if the matrix exposes a gap.

**Interfaces:**
- Consumes: the `upgrade-harness` command and existing harness template versions (template version 2 is current per `CHANGELOG.md` 0.42.0).

- [ ] **Step 1: Write the matrix test**

For each historical harness template version (v1 and v2 at minimum), the test writes a minimal fixture repo carrying that version's marker into a temp dir, runs `agentloop upgrade-harness`, and asserts a clean, non-error migration to the current format.

```ts
// tests/upgrade-harness-matrix.test.ts
import path from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { makeTempDir, removeTempDir } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let dirs: string[] = [];
afterEach(async () => {
  await Promise.all(dirs.map(removeTempDir));
  dirs = [];
});

// Extend this list with every historical template version the audit finds.
const templateVersions = ['1', '2'];

describe('upgrade-harness migration matrix', () => {
  for (const version of templateVersions) {
    test(`migrates template version ${version} without error`, async () => {
      const repo = await makeTempDir();
      dirs.push(repo);
      await execa('git', ['init'], { cwd: repo });
      // Seed a minimal harness marked as `version`. Use the actual marker
      // upgrade-harness reads (confirm the exact field/path in
      // src/cli/commands/upgrade-harness.ts before finalizing this fixture).
      await mkdir(path.join(repo, '.agentloop'), { recursive: true });
      await writeFile(
        path.join(repo, 'agentloop.config.json'),
        JSON.stringify({ templateVersion: Number(version) }, null, 2),
      );
      const result = await execa(tsxPath, [cliPath, 'upgrade-harness'], {
        cwd: repo,
        reject: false,
      });
      expect(result.exitCode).toBe(0);
    });
  }
});
```

- [ ] **Step 2: Run it**

Run: `pnpm exec vitest run tests/upgrade-harness-matrix.test.ts`
Expected: PASS. If a version fails to migrate, that is a real gap — fix `upgrade-harness` (write a focused failing test first, then the fix) before proceeding. If the seed marker differs from the assumption above, correct the fixture to match `src/cli/commands/upgrade-harness.ts`.

- [ ] **Step 3: Commit**

```bash
git add tests/upgrade-harness-matrix.test.ts
git commit -m "test: guarantee 0.x harness upgrade path across version matrix

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Positioning — README stability section (WS5)

**Files:**
- Modify: `README.md`
- Test: `tests/product-positioning.test.ts` (extend if it exists; otherwise add a small check to `tests/stability-docs.test.ts`).

- [ ] **Step 1: Write the failing check**

Add to `tests/stability-docs.test.ts`:

```ts
test('README links the stability and versioning guarantees', async () => {
  const readme = await readFile('README.md', 'utf8');
  expect(readme).toContain('docs/stability.md');
  expect(readme).toContain('docs/versioning.md');
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `pnpm exec vitest run tests/stability-docs.test.ts`
Expected: FAIL — README lacks the links.

- [ ] **Step 3: Update README**

Add a "Stability" section stating: at 1.0 the documented surface is a committed public contract under SemVer; links to `docs/stability.md` and `docs/versioning.md`; a one-line 0.x→1.0 upgrade pointer (`agentloop upgrade-harness`). Keep it aligned with the existing README voice (concise, no release-operations detail per ROADMAP.md "Near Term").

- [ ] **Step 4: Run the check + docs tests**

Run: `pnpm exec vitest run tests/stability-docs.test.ts tests/cli-docs-drift.test.ts tests/public-docs-hygiene.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add README.md tests/stability-docs.test.ts
git commit -m "docs: add README stability and versioning section

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Cut 1.0.0 (release)

**Files:**
- Modify: `package.json:3` (version), `CHANGELOG.md`, `ROADMAP.md`

- [ ] **Step 1: Full green gate**

Run: `pnpm run release-flow`
Expected: PASS end-to-end, including the newly wired `contract:check`. Fix anything red before continuing.

- [ ] **Step 2: Bump version**

Set `package.json` `"version"` to `1.0.0`.

- [ ] **Step 3: Update CHANGELOG**

Replace the `## Unreleased` block with a `## 1.0.0` entry summarizing: committed public contract (six axes), contract-lock CI (`contract:check`), consistency audit + fixes, SemVer/deprecation policy with experimental tier, guaranteed upgrade path. Add a fresh empty `## Unreleased`.

- [ ] **Step 4: Update ROADMAP**

Move the relevant items to **Shipped**, update **Current State** to `1.0.0`, and add the versioning guarantee to the top-of-file description.

- [ ] **Step 5: Run version + metadata tests**

Run: `pnpm exec vitest run tests/version.test.ts tests/package-metadata.test.ts`
Expected: PASS. Update any exact-version assertions to `1.0.0` in the same commit.

- [ ] **Step 6: Commit**

```bash
git add package.json CHANGELOG.md ROADMAP.md tests/version.test.ts tests/package-metadata.test.ts
git commit -m "chore(release): release v1.0.0

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 7: Hand off to the existing release process**

Follow the repo's published GitHub-release → npm trusted-publishing flow (ROADMAP.md "Near Term"). Do not publish manually. Confirm the release tag, npm, GHCR, and MCP Registry proof steps per the existing release checklist.

---

## Self-Review

**Spec coverage:**
- WS1 (define contract) → Tasks 1, 2. ✓
- WS2 (audit & fix) → Tasks 7, 7b. ✓
- WS3 (contract-lock tests) → Tasks 3, 4, 5, 6. ✓
- WS4 (versioning + experimental) → Task 8. ✓
- WS5 (upgrade + positioning) → Tasks 9, 10. ✓
- Release cut + success metrics → Task 11 (release-flow green, docs published, upgrade matrix, contract:check wired). ✓
- Spec risk "freeze newest surfaces too early" → Task 7 newest-surfaces section + defer-to-experimental triage + Task 8 escape hatch. ✓
- Dogfooding requirement (AgentLoopKit + ProjScan + AgentFlight, latest) → the "Dogfooding Loop" section wraps every task; `dogfood:strict` gate mid-plan and `dogfood` already inside `release-flow` (Task 11). ✓

**Placeholder scan:** No "TBD"/"handle edge cases" left. The two intentionally variable spots — Task 7b (fixes depend on audit findings) and the `JSON_COMMANDS`/template-version lists — carry explicit instructions to confirm against source and record gaps rather than guess, which is correct for investigative work.

**Type consistency:** `STABLE_COMMANDS` / `JSON_COMMANDS` names used identically in Tasks 1, 2, 3, 5. `shapeOf` signature defined in Task 5 and used only there. `listMcpTools()` consumed as-is (whole return value snapshotted, no field assumptions). `contract:check` script name consistent between Tasks 6 and 11.
