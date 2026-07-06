# AgentLoopKit Stability Contract

Starting at 1.0, AgentLoopKit's entire shipped surface is a committed public
contract. If you build CI, an agent workflow, or an integration on this
surface, a 1.x release will not break you.

## What 1.0 guarantees

The stability guarantee covers exactly six axes. Each is frozen and
additive-only within the 1.x line; removing or changing any of them is a 2.0
event.

1. **CLI commands + flags** — every command listed below and its documented
   flags. Flag names, semantics, and defaults are frozen.
2. **`agentloop.config.json` config schema** — the config file shape under
   `schema/`. Existing fields are frozen; new fields must be optional and
   backward-compatible.
3. **MCP tool surface** — tool names and input/output schemas exposed by
   `agentloop mcp-server`.
4. **JSON output shapes** — the `--json` envelope and field set for every
   command that supports it. Changes are additive only.
5. **Exit codes** — the meaning of 0 / non-zero exit codes, consistent across
   all commands.
6. **Generated harness format + package API** — the layout and template of
   generated files (`AGENTS.md`, `AGENTLOOP.md`, `.agentloop/`) and the public
   package API exports (`dist/index.js` / `dist/index.d.ts`).

## JSON field conventions

These conventions are part of the frozen JSON contract (axis 4).

- **Next action.** A command that recommends a single next step exposes it as
  `nextAction: { command, reason }` (`status`, `next`, `start`, `check-gates`,
  `ready`). `guard` exposes `nextActions: [ { command, reason }, ... ]` — a
  genuinely plural list, a distinct field, not the singular form.
- **Aggregate verdict.** The top-level pass/warn/fail verdict is named
  `status` on `ready`, `guard`, `maintainer-check`, `start`,
  `upgrade-harness`, and `npm-status`, and `overallStatus` on `verify`,
  `check-gates`, `doctor`, `release-check`, `release-proof`, and
  `ci-summary`. This split is frozen for 1.x: the `overallStatus` name is
  load-bearing across the persisted run/verification data model, so it is not
  renamed. Always read the field named for the specific command you are
  calling rather than assuming one name across commands.
- **Error envelope.** Every `--json`-capable command emits errors as
  `{ error: { code, message, ...details } }` on failure.

## Exit codes

`0` means success. Any non-zero exit means failure; AgentLoopKit uses `1`
for all failures and does not use exit code `2`. Checker commands (`doctor`,
`verify`, `check-gates`, `release-check`, `release-proof`, `maintainer-check`,
`ship`) exit `1` on a failing verdict; `guard` and `ready` are advisory by
default and exit non-zero only under `--strict`.

## Stable command reference

Every row below is a stable, frozen command. Its committed behavior is the
one-line description; flags may gain new optional additions, but existing
behavior does not change without a major version bump.

| Command | Committed behavior |
| --- | --- |
| `agentloop init` | Generate the repo harness and config. |
| `agentloop doctor` | Check setup health, agent readiness, commands, git state, and risk files. |
| `agentloop create-task` | Create a scoped task contract. |
| `agentloop verify` | Run configured checks and write a verification report. |
| `agentloop summarize` | Preview a deterministic reviewer summary. |
| `agentloop handoff` | Write a reviewer handoff summary. |
| `agentloop status` | Show active task, latest report, latest run, dirty files, and next step. |
| `agentloop next` | Print only the next recommended loop action. |
| `agentloop start` | Run a repo-native agent preflight with task, evidence, risk, proof, and impact. |
| `agentloop review-context` | Show one read-only reviewability context snapshot. |
| `agentloop context` | List handles, build context budgets and packs, and expand source truth. |
| `agentloop ready` | Check task, scope, verification, and context-budget readiness. |
| `agentloop harden` | Interrogate a task contract for unresolved soft spots before work starts. |
| `agentloop loop` | Record local loop goals, guarded runner passes, scorecards, token receipts, iteration decisions, and stop reasons. |
| `agentloop guard` | Check local drift, proof debt, and context-budget pressure. |
| `agentloop check-gates` | Check review evidence without running tests. |
| `agentloop ship` | Score review readiness, write a ship report, and optionally print a PR comment. |
| `agentloop prepare-pr` | Generate a PR title, grouped body, and optional GitHub comment. |
| `agentloop runs` | Show local ship, verify, or handoff run ledger entries. |
| `agentloop show-run` | Show one local run ledger entry. |
| `agentloop intent` | Show bounded newest-first run matches for one file and why. |
| `agentloop maintainer-check` | Check whether an agent-assisted PR is reviewable. |
| `agentloop report` | Write a local static HTML evidence report. |
| `agentloop badge` | Write a local SVG evidence badge. |
| `agentloop artifacts` | Inventory local tasks, reports, ship reports, badges, and run evidence. |
| `agentloop upgrade-harness` | Inspect older generated guidance without overwriting local edits. |
| `agentloop ci-summary` | Summarize CI context and existing AgentLoop evidence. |
| `agentloop release-notes` | Draft local release notes from repo evidence. |
| `agentloop release-check` | Check local release readiness without publishing. |
| `agentloop release-proof` | Check post-release proof across public release channels. |
| `agentloop npm-status` | Check npm registry status without publishing. |
| `agentloop mcp-server` | Start the read-only MCP stdio server. |
| `agentloop schemastore` | Print the config schema catalog entry. |
| `agentloop github` | Import explicit local GitHub issue or PR JSON. |
| `agentloop policy` | Read and compare local safety policies. |
| `agentloop task` | List, show, pin, update, archive, and inspect task state. |
| `agentloop install-agent` | Add agent-specific instructions. |
| `agentloop list-templates` | List bundled templates. |
| `agentloop completion` | Print shell completion scripts. |
| `agentloop version` | Print the CLI version. |

This table has one row per entry in `STABLE_COMMANDS`
(`src/core/stable-surface.ts`), which is the authoritative list. Any command
not in that list is internal and not covered by this contract.

## What is NOT covered

The following are free to change in any 1.x release without a major version
bump:

- Human-readable log text (wording, phrasing, formatting of console output).
- The exact wording of generated Markdown reports.
- Internal module paths and any export not listed in the package API
  (`dist/index.js` / `dist/index.d.ts`).

## How stability is enforced

The contract above is not just documentation — it is enforced by contract-lock
tests that snapshot CLI `--help` output, the config JSON schema, MCP tool
schemas, and representative `--json` output per command. Run `contract:check`
to verify the current surface against those locked snapshots; CI fails the
build if any committed surface drifts without an intentional version bump.

## Versioning

See [`docs/versioning.md`](./versioning.md) for the SemVer and deprecation
policy that governs changes to this contract.
