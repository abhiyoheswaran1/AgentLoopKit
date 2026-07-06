# Contract Hardening (`agentloop harden`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a front-of-loop `agentloop harden` pass that detects unresolved "soft spots" in a task contract, lets the agent resolve them back into the contract with an audit log, and relies on existing guard enforcement to check the hardened scope against the diff.

**Architecture:** A pure, LLM-free detection engine (`src/core/harden.ts`) returns `SoftSpot[]` from contract markdown. A resolution module (`src/core/harden-resolve.ts`) writes answers back into contract sections and appends a `## Hardening Log`. A CLI command (`src/cli/commands/harden.ts`) reports soft spots (non-zero exit while blocking spots remain) and applies resolutions. A generated `.agentloop/harden-playbook.md` tells the agent how to interrogate. Forbidden-scope enforcement is **already** provided by `guard` (`forbiddenByTask`), so no new gate engine is built.

**Tech Stack:** TypeScript (ESM, `.js` import specifiers), commander, vitest, tsup. Follows existing `src/core` + `src/cli/commands` patterns.

## Global Constraints

- Node engine floor stays `>=20`.
- No LLM wrapper, no network, no API keys, no telemetry — the agent conducts interrogation; AgentLoopKit only detects, structures, and captures.
- No wall-clock timestamps or randomness in engine/resolution output — `SoftSpot.id`, ordering, and Hardening Log entries must be deterministic so `--json` and contract-lock snapshots are stable.
- All new stable surface (CLI help, `--json` shape) gets a contract-lock snapshot; `npm run contract:check` must stay green.
- Additive and opt-in only — no change to existing command behavior. `check-gates`/`ready` **warn** on open blocking soft spots by default and **fail only under `--strict`**.
- ESM imports use explicit `.js` extensions; errors use `AgentLoopError`.

---

### Task 1: Export the section-lines helper for reuse

**Files:**
- Modify: `src/core/task-contract.ts:95`
- Test: `tests/core/task-contract.test.ts` (add case; create if absent)

**Interfaces:**
- Produces: `extractMarkdownSectionLines(markdown: string, heading: string): string[]` — now exported. Returns trimmed, non-empty lines under `## <heading>` up to the next `## ` heading.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { extractMarkdownSectionLines } from '../../src/core/task-contract.js';

describe('extractMarkdownSectionLines', () => {
  it('returns trimmed non-empty lines under a heading', () => {
    const md = ['## Non-Goals', '- No SaaS', '', '- No telemetry', '## Assumptions', '- x'].join('\n');
    expect(extractMarkdownSectionLines(md, 'Non-Goals')).toEqual(['- No SaaS', '- No telemetry']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/core/task-contract.test.ts -t extractMarkdownSectionLines`
Expected: FAIL — `extractMarkdownSectionLines is not exported`.

- [ ] **Step 3: Add the export keyword**

In `src/core/task-contract.ts`, change line 95 from `function extractMarkdownSectionLines(` to `export function extractMarkdownSectionLines(`. No other change.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/core/task-contract.test.ts -t extractMarkdownSectionLines`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/core/task-contract.ts tests/core/task-contract.test.ts
git commit -m "refactor: export extractMarkdownSectionLines for reuse"
```

---

### Task 2: Soft-spot types and the engine skeleton

**Files:**
- Create: `src/core/harden.ts`
- Test: `tests/core/harden.test.ts`

**Interfaces:**
- Consumes: `extractMarkdownSectionLines` (Task 1), `findPlaceholderTaskSections`, `TaskType` from `task-contract.js`.
- Produces:
  - `type SoftSpotType = 'placeholder' | 'untestable-acceptance' | 'unbounded-scope' | 'unstated-assumption' | 'contradiction'`
  - `type SoftSpotSeverity = 'blocking' | 'advisory'`
  - `interface SoftSpot { id: string; type: SoftSpotType; section: string; question: string; severity: SoftSpotSeverity }`
  - `function analyzeContract(markdown: string): SoftSpot[]` — deterministic; returns spots ordered by a fixed rule order then section order.
  - `function makeSoftSpotId(type: SoftSpotType, section: string, ordinal: number): string` → `` `${type}:${slug(section)}:${ordinal}` `` where slug lowercases and replaces non-alphanumerics with `-`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { analyzeContract, makeSoftSpotId } from '../../src/core/harden.js';

describe('harden engine skeleton', () => {
  it('builds deterministic ids', () => {
    expect(makeSoftSpotId('placeholder', 'Non-Goals', 0)).toBe('placeholder:non-goals:0');
  });
  it('returns an empty array for an already-hardened contract', () => {
    const md = [
      '## Problem Statement', 'Real problem.',
      '## Non-Goals', '- No SaaS',
      '## Assumptions', '- Vitest is the snapshot primitive',
      '## Files or Areas Not to Touch', '- Published tarballs',
      '## Acceptance Criteria', '- `npm test` passes',
    ].join('\n');
    expect(analyzeContract(md)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/core/harden.test.ts`
Expected: FAIL — cannot find module `harden.js`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/core/harden.ts
// (imports from ./task-contract.js are added in Task 3 when the rules need them)

export type SoftSpotType =
  | 'placeholder'
  | 'untestable-acceptance'
  | 'unbounded-scope'
  | 'unstated-assumption'
  | 'contradiction';

export type SoftSpotSeverity = 'blocking' | 'advisory';

export interface SoftSpot {
  id: string;
  type: SoftSpotType;
  section: string;
  question: string;
  severity: SoftSpotSeverity;
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function makeSoftSpotId(type: SoftSpotType, section: string, ordinal: number): string {
  return `${type}:${slug(section)}:${ordinal}`;
}

// Detection rules are added in later tasks and pushed in this fixed order.
export function analyzeContract(markdown: string): SoftSpot[] {
  const spots: SoftSpot[] = [];
  return spots;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/core/harden.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/core/harden.ts tests/core/harden.test.ts
git commit -m "feat: add soft-spot types and harden engine skeleton"
```

---

### Task 3: Placeholder + unbounded-scope + unstated-assumption rules

**Files:**
- Modify: `src/core/harden.ts`
- Test: `tests/core/harden.test.ts`

**Interfaces:**
- Consumes: `findPlaceholderTaskSections`, `extractMarkdownSectionLines`, `TaskType`.
- Produces: `analyzeContract` now emits these three rule types. Helper `readTaskType(markdown: string): TaskType | undefined` parses the `- Task type: <x>` line.

- [ ] **Step 1: Write the failing test**

```ts
import { analyzeContract } from '../../src/core/harden.js';

it('flags empty Files-Not-To-Touch as blocking unbounded-scope', () => {
  const md = ['## Files or Areas Not to Touch', '- None recorded yet.'].join('\n');
  const spots = analyzeContract(md);
  expect(spots.some((s) => s.type === 'unbounded-scope' && s.severity === 'blocking')).toBe(true);
});

it('flags empty Assumptions as advisory for a feature task', () => {
  const md = ['- Task type: feature', '## Assumptions', '- None recorded yet.'].join('\n');
  const spots = analyzeContract(md);
  expect(spots.some((s) => s.type === 'unstated-assumption' && s.severity === 'advisory')).toBe(true);
});

it('emits a placeholder spot per unresolved review-critical section', () => {
  const md = ['## Acceptance Criteria', '- Add acceptance criteria before implementation starts.'].join('\n');
  expect(analyzeContract(md).some((s) => s.type === 'placeholder')).toBe(true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/core/harden.test.ts`
Expected: FAIL — assertions false (rules not implemented).

- [ ] **Step 3: Write minimal implementation**

Add to `src/core/harden.ts` (import `findPlaceholderTaskSections`, `TaskType` at top; implement the rules and call them from `analyzeContract` in this fixed order):

```ts
import {
  extractMarkdownSectionLines,
  findPlaceholderTaskSections,
  type TaskType,
} from './task-contract.js';

const ASSUMPTION_SENSITIVE_TYPES: TaskType[] = ['feature', 'refactor', 'migration', 'dependency-upgrade'];
const EMPTY_MARKERS = new Set(['none recorded yet.', 'none.', '']);

function readTaskType(markdown: string): TaskType | undefined {
  const match = markdown.match(/^- Task type:\s*(.+)$/m);
  return match ? (match[1].trim() as TaskType) : undefined;
}

function isEmptySection(markdown: string, heading: string): boolean {
  const lines = extractMarkdownSectionLines(markdown, heading)
    .map((l) => l.replace(/^-\s*/, '').trim().toLowerCase());
  return lines.length === 0 || lines.every((l) => EMPTY_MARKERS.has(l));
}

function placeholderRule(markdown: string): SoftSpot[] {
  return findPlaceholderTaskSections(markdown).map((heading, i) => ({
    id: makeSoftSpotId('placeholder', heading, i),
    type: 'placeholder',
    section: heading,
    question: `"${heading}" still holds its template placeholder — fill it in with real content.`,
    severity: 'blocking',
  }));
}

function unboundedScopeRule(markdown: string): SoftSpot[] {
  const section = 'Files or Areas Not to Touch';
  if (!isEmptySection(markdown, section)) return [];
  return [{
    id: makeSoftSpotId('unbounded-scope', section, 0),
    type: 'unbounded-scope',
    section,
    question: 'Which files or areas must this change NOT touch? An empty list means guard cannot flag scope creep.',
    severity: 'blocking',
  }];
}

function unstatedAssumptionRule(markdown: string): SoftSpot[] {
  const type = readTaskType(markdown);
  if (!type || !ASSUMPTION_SENSITIVE_TYPES.includes(type)) return [];
  if (!isEmptySection(markdown, 'Assumptions')) return [];
  return [{
    id: makeSoftSpotId('unstated-assumption', 'Assumptions', 0),
    type: 'unstated-assumption',
    section: 'Assumptions',
    question: `This is a "${type}" task with no assumptions listed — what are you taking for granted that could be wrong?`,
    severity: 'advisory',
  }];
}
```

Then replace the body of `analyzeContract`:

```ts
export function analyzeContract(markdown: string): SoftSpot[] {
  return [
    ...placeholderRule(markdown),
    ...unboundedScopeRule(markdown),
    ...unstatedAssumptionRule(markdown),
  ];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/core/harden.test.ts`
Expected: PASS (including the Task 2 "already-hardened" test — a contract with all sections filled yields `[]`).

- [ ] **Step 5: Commit**

```bash
git add src/core/harden.ts tests/core/harden.test.ts
git commit -m "feat: add placeholder, scope, and assumption soft-spot rules"
```

---

### Task 4: Untestable-acceptance + contradiction rules

**Files:**
- Modify: `src/core/harden.ts`
- Test: `tests/core/harden.test.ts`

**Interfaces:**
- Produces: `analyzeContract` additionally emits `untestable-acceptance` (per non-verifiable acceptance line) and `contradiction` (acceptance line sharing a significant token with a non-goal line).

- [ ] **Step 1: Write the failing test**

```ts
import { analyzeContract } from '../../src/core/harden.js';

it('flags an acceptance line with no verifiable predicate', () => {
  const md = ['## Acceptance Criteria', '- The feature works well'].join('\n');
  expect(analyzeContract(md).some((s) => s.type === 'untestable-acceptance')).toBe(true);
});

it('does not flag an acceptance line that names a command', () => {
  const md = ['## Acceptance Criteria', '- `npm test` passes'].join('\n');
  expect(analyzeContract(md).some((s) => s.type === 'untestable-acceptance')).toBe(false);
});

it('flags a contradiction between acceptance and non-goals', () => {
  const md = [
    '## Non-Goals', '- No authentication changes',
    '## Acceptance Criteria', '- New authentication flow works',
  ].join('\n');
  expect(analyzeContract(md).some((s) => s.type === 'contradiction' && s.severity === 'blocking')).toBe(true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/core/harden.test.ts`
Expected: FAIL — new rule types not emitted.

- [ ] **Step 3: Write minimal implementation**

Add to `src/core/harden.ts`:

```ts
const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'this', 'that', 'from', 'into', 'when', 'must',
  'works', 'work', 'new', 'add', 'adds', 'change', 'changes', 'flow', 'well', 'feature',
]);

// A line is "verifiable" if it references a command, path, number/comparison, or a proof verb.
const PROOF_HINTS = /`[^`]+`|\bnpm\b|\bnpx\b|\.(ts|js|md|json)\b|\/|\d|passes|returns|exit|output|snapshot|matches|equals|>=|<=|<|>/i;

function significantTokens(line: string): Set<string> {
  return new Set(
    line.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
      .filter((w) => w.length > 3 && !STOPWORDS.has(w)),
  );
}

function acceptanceLines(markdown: string): string[] {
  return extractMarkdownSectionLines(markdown, 'Acceptance Criteria')
    .map((l) => l.replace(/^-\s*/, '').trim())
    .filter(Boolean)
    .filter((l) => l.toLowerCase() !== 'add acceptance criteria before implementation starts.');
}

function untestableAcceptanceRule(markdown: string): SoftSpot[] {
  return acceptanceLines(markdown)
    .map((line, i) => ({ line, i }))
    .filter(({ line }) => !PROOF_HINTS.test(line))
    .map(({ line, i }) => ({
      id: makeSoftSpotId('untestable-acceptance', 'Acceptance Criteria', i),
      type: 'untestable-acceptance' as const,
      section: 'Acceptance Criteria',
      question: `"${line}" has no checkable predicate — what command or observable output proves it?`,
      severity: 'blocking' as const,
    }));
}

function contradictionRule(markdown: string): SoftSpot[] {
  const nonGoalTokens = extractMarkdownSectionLines(markdown, 'Non-Goals')
    .flatMap((l) => [...significantTokens(l)]);
  const nonGoalSet = new Set(nonGoalTokens);
  if (nonGoalSet.size === 0) return [];
  const spots: SoftSpot[] = [];
  acceptanceLines(markdown).forEach((line, i) => {
    const shared = [...significantTokens(line)].find((t) => nonGoalSet.has(t));
    if (shared) {
      spots.push({
        id: makeSoftSpotId('contradiction', 'Acceptance Criteria', i),
        type: 'contradiction',
        section: 'Acceptance Criteria',
        question: `Acceptance criterion "${line}" overlaps Non-Goals on "${shared}" — which one wins?`,
        severity: 'blocking',
      });
    }
  });
  return spots;
}
```

Update `analyzeContract` to append both rules (keep the fixed order):

```ts
export function analyzeContract(markdown: string): SoftSpot[] {
  return [
    ...placeholderRule(markdown),
    ...unboundedScopeRule(markdown),
    ...unstatedAssumptionRule(markdown),
    ...untestableAcceptanceRule(markdown),
    ...contradictionRule(markdown),
  ];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/core/harden.test.ts`
Expected: PASS (all rule tests, plus the Task 2 hardened-contract test still returns `[]`).

- [ ] **Step 5: Commit**

```bash
git add src/core/harden.ts tests/core/harden.test.ts
git commit -m "feat: add untestable-acceptance and contradiction soft-spot rules"
```

---

### Task 5: Rendering (text + JSON) and blocking summary

**Files:**
- Modify: `src/core/harden.ts`
- Test: `tests/core/harden.test.ts`

**Interfaces:**
- Produces:
  - `function hasBlockingSoftSpots(spots: SoftSpot[]): boolean`
  - `function renderSoftSpotsText(spots: SoftSpot[]): string` — human report grouped by severity; deterministic.
  - `function toHardenJson(spots: SoftSpot[]): { blocking: number; advisory: number; softSpots: SoftSpot[] }` — the `--json` payload shape.

- [ ] **Step 1: Write the failing test**

```ts
import { analyzeContract, hasBlockingSoftSpots, toHardenJson, renderSoftSpotsText } from '../../src/core/harden.js';

it('summarises blocking vs advisory counts', () => {
  const md = ['- Task type: feature', '## Assumptions', '- None recorded yet.',
    '## Files or Areas Not to Touch', '- None recorded yet.'].join('\n');
  const spots = analyzeContract(md);
  expect(hasBlockingSoftSpots(spots)).toBe(true);
  const json = toHardenJson(spots);
  expect(json.blocking).toBeGreaterThanOrEqual(1);
  expect(json.advisory).toBeGreaterThanOrEqual(1);
  expect(renderSoftSpotsText(spots)).toContain('blocking');
});

it('renders a clean report when there are no soft spots', () => {
  expect(renderSoftSpotsText([])).toContain('No soft spots');
  expect(hasBlockingSoftSpots([])).toBe(false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/core/harden.test.ts`
Expected: FAIL — functions not exported.

- [ ] **Step 3: Write minimal implementation**

Add to `src/core/harden.ts`:

```ts
export function hasBlockingSoftSpots(spots: SoftSpot[]): boolean {
  return spots.some((s) => s.severity === 'blocking');
}

export function toHardenJson(spots: SoftSpot[]) {
  return {
    blocking: spots.filter((s) => s.severity === 'blocking').length,
    advisory: spots.filter((s) => s.severity === 'advisory').length,
    softSpots: spots,
  };
}

export function renderSoftSpotsText(spots: SoftSpot[]): string {
  if (spots.length === 0) return 'No soft spots — this contract is hardened.';
  const group = (sev: SoftSpotSeverity) =>
    spots.filter((s) => s.severity === sev)
      .map((s) => `  [${s.id}] ${s.question}`)
      .join('\n');
  const blocking = spots.filter((s) => s.severity === 'blocking');
  const advisory = spots.filter((s) => s.severity === 'advisory');
  const parts: string[] = [];
  if (blocking.length) parts.push(`${blocking.length} blocking soft spot(s):\n${group('blocking')}`);
  if (advisory.length) parts.push(`${advisory.length} advisory soft spot(s):\n${group('advisory')}`);
  return parts.join('\n\n');
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/core/harden.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/core/harden.ts tests/core/harden.test.ts
git commit -m "feat: add harden rendering and blocking summary helpers"
```

---

### Task 6: Resolution write-back and Hardening Log

**Files:**
- Create: `src/core/harden-resolve.ts`
- Test: `tests/core/harden-resolve.test.ts`

**Interfaces:**
- Consumes: `SoftSpot`, `analyzeContract` from `harden.js`; `extractMarkdownSectionLines` from `task-contract.js`.
- Produces:
  - `class HardenResolutionError extends AgentLoopError` (code `HARDEN_UNKNOWN_SPOT`).
  - `function applyResolution(markdown: string, spotId: string, answer: string): string` — validates `spotId` is a currently-open spot (else throws), appends `- <answer>` to that spot's section (replacing an empty/placeholder line if present), and appends a `## Hardening Log` entry `- [<spotId>] <answer>`. Returns new markdown. Deterministic (no timestamps).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { applyResolution, HardenResolutionError } from '../../src/core/harden-resolve.js';
import { analyzeContract } from '../../src/core/harden.js';

const base = ['- Task type: feature',
  '## Files or Areas Not to Touch', '- None recorded yet.',
  '## Acceptance Criteria', '- `npm test` passes'].join('\n');

describe('applyResolution', () => {
  it('writes the answer into the section and logs it', () => {
    const id = analyzeContract(base).find((s) => s.type === 'unbounded-scope')!.id;
    const out = applyResolution(base, id, 'Published release tarballs');
    expect(out).toContain('- Published release tarballs');
    expect(out).not.toContain('None recorded yet.');
    expect(out).toContain('## Hardening Log');
    expect(out).toContain(`- [${id}] Published release tarballs`);
  });

  it('throws on an unknown spot id', () => {
    expect(() => applyResolution(base, 'placeholder:nope:0', 'x')).toThrow(HardenResolutionError);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/core/harden-resolve.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/core/harden-resolve.ts
import { AgentLoopError } from './errors.js';
import { analyzeContract, type SoftSpot } from './harden.js';

const EMPTY_LINE = /^-\s*(none recorded yet\.|none\.|add acceptance criteria before implementation starts\.)?\s*$/i;

export class HardenResolutionError extends AgentLoopError {
  constructor(message: string) {
    super(message, 'HARDEN_UNKNOWN_SPOT');
    this.name = 'HardenResolutionError';
  }
}

function appendToSection(markdown: string, heading: string, entry: string): string {
  const lines = markdown.split('\n');
  const headingIndex = lines.findIndex((l) => l.trim() === `## ${heading}`);
  if (headingIndex === -1) {
    return `${markdown.trimEnd()}\n\n## ${heading}\n${entry}\n`;
  }
  let end = headingIndex + 1;
  while (end < lines.length && !/^##\s+/.test(lines[end])) end += 1;
  const body = lines.slice(headingIndex + 1, end);
  const placeholderIndex = body.findIndex((l) => EMPTY_LINE.test(l.trim()) && l.trim() !== '');
  if (placeholderIndex >= 0) {
    body[placeholderIndex] = entry;
  } else {
    while (body.length && body[body.length - 1].trim() === '') body.pop();
    body.push(entry);
  }
  return [...lines.slice(0, headingIndex + 1), ...body, ...lines.slice(end)].join('\n');
}

export function applyResolution(markdown: string, spotId: string, answer: string): string {
  const spot: SoftSpot | undefined = analyzeContract(markdown).find((s) => s.id === spotId);
  if (!spot) {
    throw new HardenResolutionError(`No open soft spot with id "${spotId}".`);
  }
  const clean = answer.trim();
  const withAnswer = appendToSection(markdown, spot.section, `- ${clean}`);
  return appendToSection(withAnswer, 'Hardening Log', `- [${spotId}] ${clean}`);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/core/harden-resolve.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/core/harden-resolve.ts tests/core/harden-resolve.test.ts
git commit -m "feat: resolve soft spots back into the contract with a hardening log"
```

---

### Task 7: The `agentloop harden` CLI command

**Files:**
- Create: `src/cli/commands/harden.ts`
- Modify: `src/cli/index.ts` (register the command — follow the existing `registerXxxCommand` pattern used for sibling commands)
- Test: `tests/cli/harden.command.test.ts`

**Interfaces:**
- Consumes: `analyzeContract`, `renderSoftSpotsText`, `toHardenJson`, `hasBlockingSoftSpots` (harden.js); `applyResolution` (harden-resolve.js); active-task resolution via `getActiveTask` (`task-state.js`) and config loading via the same helper `create-task.ts` uses (`loadWorkspaceForJsonCommand`); `readFile`/`writeTextFile` for the contract; `AgentLoopError`.
- Produces: `function registerHardenCommand(program: Command): void`. Behavior: `agentloop harden [task]` prints the report and exits `1` if `hasBlockingSoftSpots`; `--json` prints `toHardenJson`; `--resolve <id> --answer <text>` (repeatable) writes via `applyResolution` then re-reports.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

// Integration-style: exercise the built CLI against a temp contract.
describe('agentloop harden', () => {
  it('exits non-zero and reports blocking soft spots', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'harden-'));
    const contract = path.join(dir, 'task.md');
    await fs.writeFile(contract, ['# T', '- Task type: feature',
      '## Files or Areas Not to Touch', '- None recorded yet.'].join('\n'));
    let code = 0, out = '';
    try {
      out = execFileSync('node', ['dist/cli/index.js', 'harden', contract], { encoding: 'utf8' });
    } catch (e: any) {
      code = e.status; out = `${e.stdout}${e.stderr}`;
    }
    expect(code).toBe(1);
    expect(out).toContain('blocking');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build && npx vitest run tests/cli/harden.command.test.ts`
Expected: FAIL — `harden` is not a known command (build succeeds, CLI errors on unknown command).

- [ ] **Step 3: Write minimal implementation**

Create `src/cli/commands/harden.ts` (mirror the option/parsing style of `create-task.ts`; resolve the target contract, run the engine, honor `--json` and `--resolve`):

```ts
import { readFile } from 'node:fs/promises';
import { Command } from 'commander';
import { writeTextFile } from '../../core/file-system.js';
import { AgentLoopError } from '../../core/errors.js';
import {
  analyzeContract,
  hasBlockingSoftSpots,
  renderSoftSpotsText,
  toHardenJson,
} from '../../core/harden.js';
import { applyResolution } from '../../core/harden-resolve.js';
import { getActiveTask } from '../../core/task-state.js';
import { loadWorkspaceForJsonCommand } from '../json-errors.js';

async function resolveContractPath(taskArg: string | undefined): Promise<string> {
  if (taskArg) return taskArg;
  const workspace = await loadWorkspaceForJsonCommand();
  const active = await getActiveTask(workspace.root);
  if (!active) throw new AgentLoopError('No task specified and no active task set.', 'HARDEN_NO_TASK');
  return active.path;
}

export function registerHardenCommand(program: Command): void {
  program
    .command('harden [task]')
    .description('Interrogate a task contract for unresolved soft spots before work starts.')
    .option('--json', 'Emit the soft-spot list as JSON.')
    .option('--resolve <id>', 'Soft-spot id to resolve (repeatable).', (v: string, acc: string[]) => [...acc, v], [] as string[])
    .option('--answer <text>', 'Resolution text (repeatable, paired with --resolve).', (v: string, acc: string[]) => [...acc, v], [] as string[])
    .action(async (task: string | undefined, options: Record<string, unknown>) => {
      const contractPath = await resolveContractPath(task);
      let markdown = await readFile(contractPath, 'utf8');

      const ids = (options.resolve as string[]) ?? [];
      const answers = (options.answer as string[]) ?? [];
      if (ids.length !== answers.length) {
        throw new AgentLoopError('Each --resolve <id> needs a matching --answer <text>.', 'HARDEN_RESOLVE_MISMATCH');
      }
      for (let i = 0; i < ids.length; i += 1) {
        markdown = applyResolution(markdown, ids[i], answers[i]);
      }
      if (ids.length > 0) await writeTextFile(contractPath, markdown);

      const spots = analyzeContract(markdown);
      if (options.json) {
        process.stdout.write(`${JSON.stringify(toHardenJson(spots), null, 2)}\n`);
      } else {
        process.stdout.write(`${renderSoftSpotsText(spots)}\n`);
      }
      if (hasBlockingSoftSpots(spots)) process.exitCode = 1;
    });
}
```

Then register it in `src/cli/index.ts` alongside the other `registerXxxCommand(program)` calls: add `import { registerHardenCommand } from './commands/harden.js';` and `registerHardenCommand(program);`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build && npx vitest run tests/cli/harden.command.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/cli/commands/harden.ts src/cli/index.ts tests/cli/harden.command.test.ts
git commit -m "feat: add agentloop harden command"
```

---

### Task 8: Generated `harden-playbook.md` template + init wiring

**Files:**
- Create: `src/templates/harden/harden-playbook.md`
- Modify: `src/core/init.ts` (register the `harden` template group in `TEMPLATE_GROUPS`; the existing `for (const group of TEMPLATE_GROUPS)` loops at lines ~107 and ~387 then generate it automatically)
- Test: `tests/core/init.test.ts` (add case; follow existing init test setup)

**Interfaces:**
- Consumes: existing `writeRenderedTemplateGroup` group-generation path.
- Produces: `init` writes `.agentloop/harden-playbook.md`.

- [ ] **Step 1: Write the failing test**

```ts
// In tests/core/init.test.ts, using the file's existing init-in-tmpdir helper:
it('generates the harden playbook', async () => {
  const { root } = await runInitInTempRepo(); // existing helper in this test file
  const playbook = await fs.readFile(path.join(root, '.agentloop', 'harden-playbook.md'), 'utf8');
  expect(playbook).toContain('soft spot');
});
```

(If the test file names its helper differently, use that helper — the assertion is what matters: `.agentloop/harden-playbook.md` exists and mentions soft spots.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/core/init.test.ts -t "harden playbook"`
Expected: FAIL — file not generated.

- [ ] **Step 3: Write the template and register the group**

Create `src/templates/harden/harden-playbook.md`:

```markdown
# Contract Hardening Playbook

Before implementation starts, harden the task contract until it has no blocking soft spots.

## The loop

1. Run `agentloop harden` to list open soft spots.
2. For each blocking soft spot, interrogate the human — one question at a time. Do not accept vague answers; a resolution must be concrete enough to write into the contract and to check a diff against.
3. Record each answer: `agentloop harden --resolve <id> --answer "<concrete answer>"`.
4. Repeat until `agentloop harden` reports zero blocking soft spots.

## Stance

This is interrogation, not agreement. Push back. Advisory soft spots may remain unresolved, but record a reason.

## Why it pays off

Resolved scope (Non-Goals, Files or Areas Not to Touch) is enforced later: `agentloop guard` flags a diff that touches forbidden scope. Hardening the contract now turns front-of-loop alignment into evidence the loop checks against.
```

In `src/core/init.ts`, add `'harden'` to the `TEMPLATE_GROUPS` array (locate its declaration near the top of the file). The two existing loops over `TEMPLATE_GROUPS` will pick it up.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/core/init.test.ts -t "harden playbook"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/templates/harden/harden-playbook.md src/core/init.ts tests/core/init.test.ts
git commit -m "feat: generate harden playbook on init"
```

---

### Task 9: `create-task --harden` hint and readiness warn integration

**Files:**
- Modify: `src/cli/commands/create-task.ts` (add `--harden` flag; after writing the contract, if set, run `analyzeContract` and print the report + next-step hint)
- Modify: `src/core/check-gates.ts:289` (in `checkGates`, add open blocking soft spots as a **warning**; only a failure when the caller passes strict)
- Test: `tests/core/check-gates.test.ts` (add case), `tests/cli/create-task.command.test.ts` (add `--harden` case)

**Interfaces:**
- Consumes: `analyzeContract`, `hasBlockingSoftSpots` (harden.js); the existing `checkGates` options object and its `strict` flag (confirm the exact flag name in `check-gates.ts:289` and reuse it).
- Produces: `checkGates` result includes a soft-spot warning; strict mode escalates it to a failure. `create-task --harden` prints the initial soft-spot report.

- [ ] **Step 1: Write the failing test**

```ts
// tests/core/check-gates.test.ts
import { checkGates } from '../../src/core/check-gates.js';
it('warns on open blocking soft spots without failing by default', async () => {
  // Arrange a workspace whose active contract has an empty Files-Not-To-Touch section
  // using this test file's existing workspace fixture helper.
  const result = await checkGates({ /* ...existing required options..., */ strict: false });
  expect(JSON.stringify(result)).toMatch(/soft spot/i);
  expect(result.ok).toBe(true); // warn, not fail
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/core/check-gates.test.ts -t "soft spot"`
Expected: FAIL — no soft-spot signal in the result.

- [ ] **Step 3: Write minimal implementation**

In `check-gates.ts`, inside `checkGates`, after the active contract markdown is loaded, compute `const softSpots = analyzeContract(markdown);` and, when `hasBlockingSoftSpots(softSpots)`, push a warning entry into the result's warning list (match the existing result shape — reuse whatever warning/issue array `checkGates` already returns). Only mark the result failed when `hasBlockingSoftSpots(softSpots) && options.strict`. Import both helpers from `./harden.js`.

In `create-task.ts`, add `.option('--harden', 'Report contract soft spots after creation.')`; after the contract file is written, if `options.harden`, read it back, run `analyzeContract`, and `process.stdout.write(renderSoftSpotsText(spots) + '\n')` plus a one-line hint to run `agentloop harden --resolve`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/core/check-gates.test.ts -t "soft spot" && npx vitest run tests/cli/create-task.command.test.ts -t harden`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/cli/commands/create-task.ts src/core/check-gates.ts tests/core/check-gates.test.ts tests/cli/create-task.command.test.ts
git commit -m "feat: surface soft spots in create-task and check-gates (warn by default)"
```

---

### Task 10: Contract-lock snapshots and full verification

**Files:**
- Create: `tests/contract/harden.contract.test.ts` (follow the existing `tests/contract/**` snapshot pattern)
- Modify: docs surface if `contract:check` requires the command be listed (mirror how a sibling command is registered in the stable surface — e.g. `src/core/stable-surface.ts` and `tests/cli-docs-drift.test.ts`)

**Interfaces:**
- Consumes: the built CLI and the `--json` shape from Task 5/7.

- [ ] **Step 1: Write the failing test**

```ts
// tests/contract/harden.contract.test.ts
import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';

describe('harden contract lock', () => {
  it('locks the --help text', () => {
    const help = execFileSync('node', ['dist/cli/index.js', 'harden', '--help'], { encoding: 'utf8' });
    expect(help).toMatchSnapshot();
  });
  it('locks the --json shape', () => {
    const out = execFileSync('node', ['dist/cli/index.js', 'harden', '--help'], { encoding: 'utf8' });
    // Replace with a fixture-contract --json invocation if the suite has a temp-contract helper.
    expect(typeof out).toBe('string');
  });
});
```

- [ ] **Step 2: Run test / verify current surface**

Run: `npm run build && npx vitest run tests/contract/harden.contract.test.ts`
Expected: First run writes the snapshot (green). Then run `npm run contract:check` and address any stable-surface drift it reports for the new `harden` command (add `harden` wherever the audit lists stable commands, e.g. `src/core/stable-surface.ts` / `tests/cli-docs-drift.test.ts`).

- [ ] **Step 3: Reconcile stable-surface listings**

Add `harden` to the authoritative command list the drift/audit tests read, matching how an existing command appears there. Re-run until `contract:check` is green.

- [ ] **Step 4: Full verification**

Run, expecting all green:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run contract:check
```

- [ ] **Step 5: Commit**

```bash
git add tests/contract/harden.contract.test.ts src/core/stable-surface.ts tests/cli-docs-drift.test.ts
git commit -m "test: contract-lock the harden command surface"
```

---

## Self-Review

**Spec coverage:**
- Engine + soft-spot taxonomy (all 5 types) → Tasks 2–4. ✓
- Playbook generated by init → Task 8. ✓
- `harden` command + `--resolve` + Hardening Log → Tasks 6–7. ✓
- Gate-assertion emission → satisfied by **existing** guard `forbiddenByTask` enforcement (spec's "reuse the existing gate/guard evaluation path — no new gate engine"); harden's job is populating the section, and the playbook (Task 8) states the enforcement link. ✓
- `create-task --harden` integration + warn-by-default / strict-blocks → Task 9. ✓
- Error handling (`AgentLoopError`, unknown-id) → Tasks 6–7. ✓
- Testing incl. contract-lock, vague-vs-hardened fixtures → Tasks 2–5, 10. ✓
- Deterministic ids/output (no timestamps) → enforced in Tasks 2 & 6. ✓

**Placeholder scan:** No TBD/TODO. Two tasks reference "the test file's existing helper" (init, check-gates) because those suites have established fixture helpers the implementer must reuse rather than duplicate — the assertion and target file are concrete in each case.

**Type consistency:** `SoftSpot`, `SoftSpotType`, `SoftSpotSeverity`, `analyzeContract`, `makeSoftSpotId`, `hasBlockingSoftSpots`, `toHardenJson`, `renderSoftSpotsText`, `applyResolution`, `HardenResolutionError`, `registerHardenCommand` are named identically across all tasks that reference them.

## Notes for the implementer

- Before Task 9, open `src/core/check-gates.ts:289` and confirm the exact result shape and the strict-flag name; reuse them rather than inventing new fields.
- Before Task 10, open one file under `tests/contract/**` and `tests/cli-docs-drift.test.ts` to copy the exact snapshot/surface-listing convention.
