# Gate-Bite Cheap Wins (C2 + C3) — Design

- Date: 2026-07-08
- Status: proposed (autonomous; audit reference). Theme C, Features 2 & 3 (small, clear-cut). Targets `1.1.0`; under `## Unreleased`.

## North-star / gaps

Two small, clear-cut trust improvements from the audit:
- **C2 (Back #1):** the `ship` report — the doc carrying the headline review-readiness score — shows `Verification: pass` but NOT which verification commands were **skipped**, so a reviewer reading the ship report alone can't tell whether lint/typecheck/build ran without opening the verification report. (`prepare-pr`/`handoff` already show skipped commands.)
- **C3 (Front #2):** `create-task` only reports contract soft spots when `--harden` is passed; a placeholder contract can exist as a "real" task without the author ever seeing the soft spots. It should report them **by default** (the front-of-loop nudge), so the author sees them at creation time.

## Desired Outcome

- **C2:** the `ship` report includes a "Verification Not Run" section listing the skipped commands (reusing `verificationNotRunItems`), like the PR summary does. `ship --json` is unchanged.
- **C3:** `create-task` reports blocking/advisory soft spots (and the harden hint) by default in human output. The now-redundant `--harden` flag is removed (it was unreleased). `--json` output is unchanged (the report is human-only, after the JSON early-return).

## Non-Goals

- No LLM/network/telemetry. Reuses `verificationNotRunItems` / `analyzeContract`. Deterministic.
- Does not change verification execution, the readiness score, or soft-spot detection.
- C3 does not make create-task FAIL on soft spots (it only reports them — hardening/gating is check-gates' job, C1).

## Architecture

### C2 — ship shows skipped commands
`renderShipMarkdown` (`src/core/ship.ts:158`) gains the verification report markdown (already read as `verificationMarkdown` at ship.ts:252 — thread it into `ShipMarkdownInput`). Add a "Verification Not Run" section rendered from `verificationNotRunItems(verificationMarkdown)` (empty → "No skipped commands were recorded."; no report → "No verification report was available."). Reuse the existing rendering pattern from `pr-summary.ts`'s `renderVerificationNotRun` — extract it to `verification-report-sections.ts` as a shared `renderVerificationNotRun(markdown)` and use it in both `pr-summary` and `ship` (DRY). Markdown-only: `ship --json` shape is unchanged.

### C3 — create-task reports soft spots by default
Remove the `if (options.harden === true)` gate (`create-task.ts:540`) so the soft-spot report + harden hint always print in the human path (which is after the `--json` early-return, so `--json` stays clean). Remove the now-redundant `--harden` option (`create-task.ts:371`) — it was unreleased, so this is not a breaking change; the create-task `--help` snapshot loses that line (deliberate). Update the harden feature's `## Unreleased` changelog bullet accordingly (from "added `create-task --harden`" to "reports soft spots by default").

## Contract / surface

- C2: `ship` report is markdown; `ship --json` shape unchanged (no snapshot change). Confirm.
- C3: removing `--harden` changes `create-task --help` → the `cli-help.contract` snapshot for create-task is updated (deliberate; only the `--harden` line removed). `create-task --json` shape unchanged.

## Testing

- **C2:** a ship run where a verification command was skipped → the ship report's "Verification Not Run" section lists it; a run with nothing skipped → the "No skipped commands" line; the shared `renderVerificationNotRun` is used by both ship and pr-summary (no behavior change to pr-summary's existing tests).
- **C3:** `create-task` (no flag) prints the soft-spot report + hint for a thin contract; `create-task --json` does NOT print the report (clean JSON); the `--harden` flag no longer exists (help snapshot updated).
- Contract: `contract:check` green; the only snapshot change is the removed `--harden` line under create-task `--help`.

## Rollback

C2: revert the ship section + the shared extraction. C3: restore the `--harden` gate + flag. Additive/reversible.
