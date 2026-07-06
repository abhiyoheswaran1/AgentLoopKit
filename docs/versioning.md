# Versioning Policy

This document is the SemVer, deprecation, and experimental-tier policy for
the surface committed in [`docs/stability.md`](./stability.md).

## The SemVer promise

AgentLoopKit follows semantic versioning against the six axes named in
`docs/stability.md` (CLI commands + flags, config schema, MCP tool surface,
JSON output shapes, exit codes, generated harness format + package API).

- **Patch and minor releases (1.x)** never make a breaking change to any of
  those axes. Existing commands, flags, config fields, MCP tools, JSON
  fields, and exit codes keep their documented names, shapes, and semantics.
  Additions are fine — new commands, new optional flags, new optional config
  fields, new JSON fields — as long as nothing already committed changes or
  disappears.
- **Breaking changes wait for 2.0.** Renaming or removing a stable command or
  flag, changing a JSON field's meaning or type, changing an exit code's
  meaning, or reshaping the generated harness format are all major-version
  events. They are batched into the next major release, not slipped into a
  1.x minor or patch.

If a change looks breaking under this definition, it does not ship in 1.x
as-is — it either waits for 2.0 or ships as an experimental feature (see
below), which is explicitly excluded from the guarantee.

## Deprecation policy

When a stable surface needs to go away, it is deprecated before it is
removed:

- **Minimum one-minor deprecation window.** A surface marked deprecated in
  `1.N` stays functional, unchanged, through at least `1.(N+1)`. It is never
  removed in the same minor it was deprecated in.
- **`DEPRECATED` warnings go to stderr.** Once a command, flag, or field is
  deprecated, using it prints a message prefixed `DEPRECATED` to stderr. This
  keeps stdout and `--json` output clean for scripts and CI while still
  surfacing the warning to a human or log.
- **Nothing frozen is removed before 2.0.** Deprecation marks intent; actual
  removal of anything covered by the stability contract is itself a breaking
  change and happens only at a major version boundary.

## Experimental tier

1.0 freezes everything currently shipped as a stable contract. The
experimental tier is how 1.x keeps growing without every new idea instantly
becoming a frozen promise.

- **New capabilities may ship as experimental.** A maintainer can add a new
  command, flag, or JSON field in a 1.x minor and mark it experimental
  instead of stable.
- **Experimental surface is excluded from the stability guarantee.**
  Anything marked experimental can change shape or behavior, or be removed
  entirely, in any later 1.x release without that counting as a breaking
  change. It is not listed in `STABLE_COMMANDS`
  (`src/core/stable-surface.ts`) and not covered by `docs/stability.md`.
- **Experimental surface is marked as such, visibly, in both output modes:**
  - `--json` output includes `experimental: true` on the relevant object.
  - `--help` output includes an `(experimental)` note next to the command or
    flag description.
- **How a maintainer marks something experimental:** add the
  `experimental: true` field to the command's `--json` payload and append
  `(experimental)` to its `--help` description; do not add the command to
  `STABLE_COMMANDS`, and do not add contract-lock coverage for it.
- **Promotion to stable happens in a later minor.** When a feature is ready
  to commit to, a maintainer drops the `experimental: true` marker and the
  `(experimental)` note, adds the command to `STABLE_COMMANDS`, documents it
  in `docs/stability.md`, and adds it to the contract-lock snapshots. From
  that release forward, it is covered by the same SemVer promise as
  everything else.

As of 1.0, the consistency audit found no existing command that needs this
tier — this section documents the convention for features added after 1.0,
not a reclassification of anything currently shipped.

## What a contract-lock snapshot failure means

Contract-lock tests (`contract:check`) snapshot `--help` output, the config
JSON schema, MCP tool schemas, and representative `--json` output for every
stable command. A failing snapshot means the frozen surface changed.

That failure is not a bug to silence by updating the snapshot — it is a
signal that requires a deliberate version decision:

- If the change is additive and backward-compatible, update the snapshot and
  ship it in the next 1.x release.
- If the change alters or removes something committed, it is a breaking
  change: either revert it, redesign it as additive, ship it as experimental
  instead, or hold it for 2.0.

A green `contract:check` means the committed 1.x surface is unchanged since
the last intentional snapshot update.
