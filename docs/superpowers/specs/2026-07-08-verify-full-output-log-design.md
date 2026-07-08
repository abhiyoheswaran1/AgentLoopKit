# Full Untruncated Verify Output Log — Design

- Date: 2026-07-08
- Status: proposed (autonomous execution; audit reference)
- Theme A, Feature 4 (small) of the reviewer-trust north-star program. Targets `1.1.0`; under `## Unreleased`.

## North-star this serves

Closes audit gap **M1**: verification command output is truncated to head+tail (`excerpt`, 5000 chars), so mid-log evidence (a coverage summary, a skipped-test line) silently vanishes, forcing a reviewer to re-run the command locally instead of trusting the report.

## Problem Statement

`renderCommandEvidence` (`src/core/verification.ts:485-492`) embeds `excerpt(result.output)` — first 2500 + last 2500 chars. The full `result.output` is available at render time but discarded. A reviewer cannot see the middle of a long log from the report alone.

## Desired Outcome

When any command's output is truncated in the report, the full untruncated output for all commands is written to one sibling raw-log file next to the report, and the report links it. The report itself stays readable (still shows the excerpt); the full evidence is one click away, locally.

## Non-Goals

- No LLM/network/telemetry. Local file write only.
- Don't remove the excerpt (report readability). Don't write a raw log when nothing was truncated (avoid noise).
- No new command/flag.

## Architecture

In `runVerification` (`src/core/verification.ts`), after `reportResults` and `reportPath` are known:
- `const truncated = reportResults.some((r) => (r.output ?? '').length > VERIFY_OUTPUT_EXCERPT_LIMIT);` (extract the `5000` in `excerpt` into a named `VERIFY_OUTPUT_EXCERPT_LIMIT` constant used by both `excerpt` and this check).
- If `truncated`: build the full-output content — a header plus, per command, `## <key>: <command>` / `Exit code / Status` / the full `result.output` — and write it to `fullOutputPath = reportPath.replace(/\.md$/, '.full-output.log')` via `writeTextFile`. Compute its repo-relative posix path.
- Pass an optional `fullOutputRelPath` into `renderMarkdown`; when present, the report header gains a line `- Full untruncated output: ` + inlineCode(relPath) (near the Overall status line). When absent, the report is byte-identical to today.

The raw-log file lives under `.agentloop/reports/` (already AgentLoopKit evidence: excluded from the verified-state fingerprint and classified as evidence, so it doesn't self-invalidate or show as unexplained).

## Error Handling / Determinism

`writeTextFile` errors propagate as today (report writing already can throw on IO). The content is deterministic given the command outputs (no timestamps beyond what the outputs contain). The link path is repo-relative (no absolute-path leak).

## Testing

- **Truncation → log written + linked:** a verify run with a command whose output exceeds the excerpt limit → a `*.full-output.log` sibling exists containing the FULL output (including the middle that the report excerpt omits), and the report contains `- Full untruncated output: ...` pointing at it.
- **No truncation → no log, report unchanged:** a run with only short outputs → no `.full-output.log` file, and the report has no full-output line.
- **Content completeness:** the raw log contains the mid-log content that the report's excerpt drops (assert a marker placed in the middle of a long output appears in the log but not in the report body).

## Rollback

Additive: a constant extraction, a conditional sibling-file write, one optional report header line. Revert by removing the write + the header line; `excerpt` behavior is unchanged.
