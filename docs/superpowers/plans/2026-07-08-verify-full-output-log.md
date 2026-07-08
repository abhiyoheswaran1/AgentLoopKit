# Full Untruncated Verify Output Log Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Checkbox steps.

**Goal:** When a verification command's report output is truncated, write the full untruncated output for all commands to one sibling `*.full-output.log` next to the report and link it from the report header.

**Architecture:** In `runVerification` (`src/core/verification.ts`), extract the excerpt limit to a constant, detect truncation, write a sibling log when truncated, and add an optional report-header line linking it.

**Tech Stack:** TypeScript (ESM `.js`), vitest.

## Global Constraints
- No LLM/network/telemetry; local file write only. Deterministic (no new timestamps). ESM `.js`.
- Additive/non-breaking: no truncation → no log file, report byte-identical to today.
- Link path is repo-relative posix (no absolute-path leak). Raw log lives under `.agentloop/reports/`.
- Vitest focused/sequential (parallel OOM-kills this machine); read `contract:check` output IN FULL.

---

### Task 1: Write and link the full-output log

**Files:**
- Modify: `src/core/verification.ts`
- Test: `tests/verification.test.ts`

**Interfaces:**
- Produces: a `<report>.full-output.log` sibling written only when truncation occurs; report header line `- Full untruncated output: \`<repo-relative path>\``.

- [ ] **Step 1: Write failing tests**

In `tests/verification.test.ts` (reuse its verify fixture that configures a command and reads the report):

```ts
test('writes a full-output log and links it when command output is truncated', async () => {
  // Arrange a verify run with a command that prints > 5000 chars, including a UNIQUE marker in the MIDDLE
  // (e.g. print 3000 'a', then 'MIDDLE_MARKER_XYZ', then 3000 'b').
  // Act: run the same verify entrypoint the other tests use; read the report markdown + the sibling log.
  expect(reportMarkdown).toMatch(/^- Full untruncated output: `.*\.full-output\.log`$/m);
  const logRel = reportMarkdown.match(/Full untruncated output: `([^`]+)`/)![1];
  const logContent = await readFile(path.join(cwd, logRel), 'utf8');
  expect(logContent).toContain('MIDDLE_MARKER_XYZ');      // full log has the middle
  expect(reportMarkdown).not.toContain('MIDDLE_MARKER_XYZ'); // report excerpt dropped it
});

test('does not write a full-output log when nothing is truncated', async () => {
  // Arrange a verify run whose command prints a short output.
  expect(reportMarkdown).not.toMatch(/Full untruncated output:/);
  // and no *.full-output.log sibling exists next to the report
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run tests/verification.test.ts -t "full-output log"`
Expected: FAIL — no log line/file.

- [ ] **Step 3: Implement**

In `src/core/verification.ts`:
- Extract the limit: replace `function excerpt(output: string, limit = 5000)` so it uses a module const `const VERIFY_OUTPUT_EXCERPT_LIMIT = 5000;` (i.e. `function excerpt(output: string, limit = VERIFY_OUTPUT_EXCERPT_LIMIT)`).
- In `runVerification`, after `reportResults` and `reportPath` are computed and BEFORE `renderMarkdown` is called (around line 682-704), add:

```ts
  const outputTruncated = reportResults.some(
    (result) => (result.output ?? '').length > VERIFY_OUTPUT_EXCERPT_LIMIT,
  );
  let fullOutputRelPath: string | undefined;
  if (outputTruncated) {
    const fullOutputPath = reportPath.replace(/\.md$/, '.full-output.log');
    const fullOutputContent = `# Full Verification Command Output\n\n${reportResults
      .map(
        (result) =>
          `## ${result.key}: ${result.command}\n- Exit code: ${result.exitCode}\n- Status: ${
            result.passed ? 'pass' : 'fail'
          }\n\n${result.output || '(no output)'}`,
      )
      .join('\n\n')}\n`;
    await writeTextFile(fullOutputPath, fullOutputContent);
    fullOutputRelPath = path.relative(options.cwd, fullOutputPath).split(path.sep).join('/');
  }
```

- Thread `fullOutputRelPath` into `renderMarkdown` (add it to the `renderMarkdown` options/closure). In the report header template, right after the `- Overall status: ...` line, add:

```ts
${fullOutputRelPath ? `- Full untruncated output: ${inlineCode(fullOutputRelPath)}\n` : ''}
```

(Match the existing header-line style; `inlineCode` and `path` are already imported. If `renderMarkdown` is a closure over outer vars, referencing `fullOutputRelPath` directly is fine since it is computed before `renderMarkdown` is invoked; if it is passed via the options object, add the field.)

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run tests/verification.test.ts -t "full-output log"`
Expected: PASS (both tests).

- [ ] **Step 5: Full verification (focused/sequential; read contract:check IN FULL)**

- `npx vitest run tests/verification.test.ts` (whole file green — confirms no existing report-shape assertion broke).
- `npx vitest run tests/check-gates.test.ts tests/status.test.ts` individually (report consumers, unaffected).
- `npm run typecheck`, `npm run lint`, `npm run contract:check` — all green (read the FULL contract:check output; the report is markdown, not `--json`, so no shape drift expected, but confirm).

- [ ] **Step 6: Commit**

```bash
git add src/core/verification.ts tests/verification.test.ts
git commit -m "feat: write full untruncated verify output to a sibling log when truncated"
```

---

## Self-Review

**Spec coverage:** constant extraction (Step 3); truncation detection + sibling write when truncated (Step 3); report link line (Step 3); no-truncation → no file/line (Step 1 test + conditional); repo-relative path (Step 3); content completeness incl. mid-log (Step 1 marker test). ✓

**Placeholder scan:** No TBD/TODO; the verify fixture is a real, reused suite; code + assertions concrete.

**Type consistency:** `VERIFY_OUTPUT_EXCERPT_LIMIT`, `fullOutputRelPath`, `outputTruncated` used consistently; `path`/`inlineCode`/`writeTextFile` already imported.

## Notes for the implementer
- Confirm `renderMarkdown`'s structure (closure vs options object) at ~line 649-704 and thread `fullOutputRelPath` whichever way matches; it is computed before `renderMarkdown` is called.
- The initial report write and the post-verification-gates re-write both call `renderMarkdown`; ensure the full-output line survives the re-write (compute `fullOutputRelPath` once, before both).
