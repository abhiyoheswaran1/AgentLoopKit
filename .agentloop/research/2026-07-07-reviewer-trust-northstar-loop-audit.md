# Reviewer-Trust North-Star & Loop Audit

Date: 2026-07-07
Type: strategy / research (not a product artifact — reference for goal-directed roadmap)

## North-star (derived from AgentLoopKit's own materials)

> **A reviewer can trust an agent's work from local evidence alone — approving or rejecting in a single pass, without reconstructing what the agent did, re-deriving its reasoning, or taking anything on faith.**

Hard invariant (from Non-Goals): trust must come from **deterministic local evidence** — no SaaS, no LLM-in-the-loop, no telemetry, no GitHub posting. This constraint is the moat: anyone can build a cloud reviewer; almost no one makes agent work trustworthy from local, auditable evidence.

Trust subject: the **human reviewer / maintainer** at the handoff/PR boundary (chosen over operator-first / dual). "Weakest link" = wherever the reviewer is forced to reconstruct, re-run, or take on faith.

Anchors (verbatim): README — "reviewable, verifiable, and merge-ready", "a local acceptance layer", "Agentic engineering produces auditable work", "Ship only when the work is reviewable". DECISIONS.md — recurring "trust boundary" language ("harder to trust", "cannot be trusted", "auditable without a database, daemon, or hosted service", "untrusted").

## The strategic insight

Almost every trust gap traces to **two root causes**:

1. **Evidence is time-addressed / path-addressed, but trust requires content-addressed.** "Fresh / covered / verified" can be TRUE for STALE content — the deepest, most-repeated break.
2. **The diff is never reconciled against intent.** The packet hands the reviewer the contract and the changed files but never cross-references them — the reviewer's central job (does the diff do what was promised?) is exactly what the packet doesn't answer.

## Goal-directed roadmap (sequenced by north-star threat)

### Theme C — Make the gates bite + close false-pass holes (cheap, immediate)
- `ship` report omits which verification commands were **skipped** (`renderShipMarkdown` lacks `verificationNotRunItems`, unlike `prepare-pr`/`pr-summary`). Reviewer can't tell from the headline score doc whether lint/typecheck/build ran. [Back #1, HIGH-cheap]
- Run `harden` at `create-task` by default (currently only on `--harden`); a placeholder contract can exist as a "real" task. [Front #2]
- TENSION to decide: audit argues blocking soft spots should **fail** `check-gates` by default, not just warn — contradicts the deliberately-shipped warn-by-default. Product decision, not an obvious fix. [Front #1]

### Theme A — Content-addressed trust (the foundation)
Pin "fresh/covered/verified" to git content hashes; fail **closed** to "stale" on drift. One reusable "verified-state fingerprint" primitive.
- Verification freshness is mtime-based (`evidence.ts` ~L140-158 compares mtimes). Agent can verify→pass→edit→still "fresh". FIX: fingerprint verified state (hash of `git status --porcelain` + `git diff`) at verify time; require match with current git state for "fresh"; else "stale". [Mid H1, HIGH]
- Run coverage is path-presence-based (`findRunCoverage`/`changed-files.json`). FIX: store `git hash-object` per file at run time; compare to current tree; downgrade to unexplained on mismatch. [Mid M2]
- Handoff coverage is path-membership (`handoff-coverage.ts` `dirtyCoveredByLatestHandoffRun`). FIX: include content hash per covered path; compare, not just presence. [Back M3]
- Verify output truncation (head+tail 5000 chars) hides mid-log evidence. FIX: write full raw log to a sibling file, link its path. [Mid M1]

### Theme B — Intent↔change reconciliation (the capstone; built on A)
The ship/PR packet cross-references the contract against the changed files it already computes.
- No cross-reference of acceptance criteria / scope vs actual changed files; reviewer must open the raw diff and reconcile. FIX: surface satisfied criteria, unmatched criteria, and unexplained files side by side (path/text-based, local). [Back #2, HIGH]
- No structural link between Acceptance Criteria and Verification Commands. FIX: let each command reference an AC id; group pass/fail by AC; add a `harden` soft spot for unreferenced AC. [Front #3, Mid H3]
- Scope coverage is directory-glob not file-exact; distinguish `covered:directory-glob` vs `covered:exact-file` in the flag/explanation. [Mid H2]

### Lower-priority / flag-don't-fix
- Forbidden/likely paths unvalidated free text (validate against worktree at create-task). [Front #4]
- Maintainer risk checks are coarse path-regex; label as "heuristic, not exhaustive" rather than definitive pass. [Back #5]
- `review-context --json` / compact evidence-map hide the full changed-file list for >5 files; let non-MCP `--json` include the full list. [Back #4]
- `--write-run` opt-in; default on or flag when no run recorded. [Mid L1]

## Suggested execution order
Theme C cheap wins → **Theme A** (verified-state fingerprint first — the foundation) → **Theme B** (capstone). Each feature still goes through brainstorm→spec→plan→subagent-build→review, but now pulling toward one north-star. All land under `## Unreleased` toward 1.1.0 (or a later minor if the batch grows).
