# Decisions

## 2026-06-09: Ship As A Boring npm CLI

AgentLoopKit ships as a TypeScript Node CLI distributed through npm and npx. The package has no postinstall script, telemetry, cloud backend, database, or API key requirement.

## 2026-06-09: Keep Summaries Deterministic

`agentloop summarize` uses git status, diff stats, task contracts, verification reports, and config. It does not call an LLM. Reviewers should be able to reproduce the summary from repo state.

## 2026-06-09: Preserve Existing AGENTS.md

`init` appends a marked AgentLoopKit section when `AGENTS.md` already exists. It does not overwrite user instructions.

## 2026-06-09: Use Superpowers As Discipline, Not Branding

This repo used Superpowers-style discipline during implementation. AgentLoopKit does not copy Superpowers content, claim affiliation, or position itself as a replacement. It focuses on repo-level engineering loops, task contracts, verification evidence, and handoff artifacts.

## 2026-06-09: Dogfood projscan In This Repo

Implementation work in this repository runs `projscan` as a repo health check. AgentLoopKit does not require projscan for end users, and generated templates do not add that requirement to other repositories.

## 2026-06-09: Use README-Native Launch Visuals

Launch visuals live in `docs/assets/readme/` with source HTML and a VHS tape so maintainers can regenerate them locally. The README references raw GitHub asset URLs so npm can render images without adding screenshot files to the package tarball.

## 2026-06-09: Patch Release For README Polish

`agentloopkit@0.1.0` was published before README visuals landed. README image polish, release workflow safety, and launch docs ship as `0.1.1` instead of mutating the first npm release.

## 2026-06-09: Status Is Read-Only

`agentloop status` reads config, git status, latest task, and latest verification report. It does not execute configured commands, read environment file contents, call a model, or mutate files. The command exists to orient agents and reviewers, not to replace `verify`.

## 2026-06-09: Failed Verification Blocks Handoff Suggestions

`agentloop status` treats a failed latest verification report as a blocker for handoff suggestions. The next action remains `agentloop verify` until the user fixes failures and reruns verification.

## 2026-06-09: Verification Excerpts Preserve Failure Tails

`agentloop verify` keeps both the beginning and ending output when a command log is too long for a report. This preserves setup context and final error lines while keeping reports reviewable. The CLI does not summarize, redact, or reinterpret command output.

## 2026-06-09: Handoff Writes, Summarize Previews

`agentloop handoff` is the clear command for writing reviewer handoff files. It reuses the deterministic summary core instead of introducing a second summary implementation. `agentloop summarize` remains read-only by default for preview use and existing scripts can keep using `agentloop summarize --write`.

## 2026-06-09: Active Task State Is Transparent

`agentloop task set` stores the active task pointer in `.agentloop/state.json`. The file contains only a version and a relative task path. `status` and handoff summaries use that pointer when it references an existing Markdown task inside `.agentloop/tasks/`; otherwise they fall back to the newest task contract. This keeps task lifecycle local and auditable without adding a database, daemon, or hosted service.

## 2026-06-09: Verification Reports Use Allowlisted CI Context

`agentloop verify` may include CI provenance in generated reports, but only from a small allowlist of CI variables. GitHub Actions reports can include workflow, event, ref, commit, run URL, and run attempt. Generic CI reports only identify `Generic CI`. AgentLoopKit does not read `.env` files, print arbitrary environment variables, call CI APIs, or upload artifacts.

## 2026-06-09: Doctor Reports Risk Paths, Not Secrets

`agentloop doctor` reports potential risk files by category with capped path examples. It keeps these findings as warnings, not failures. The scanner does not read file contents, inspect credentials, score risk, or claim secret detection.

## 2026-06-09: Config Schema URL Uses GitHub Until A Domain Exists

Generated configs use the GitHub raw URL for `schema/agentloop.config.schema.json`. The package also ships the schema locally, and CLI validation uses local TypeScript/Zod rules. AgentLoopKit does not fetch the schema URL at runtime. A custom `agentloopkit.dev` schema URL can replace it after that domain serves the file.

## 2026-06-10: HTML Reports Are Local Static Evidence

`agentloop report` writes a static HTML file from existing local task, verification, handoff, git, and deterministic summary artifacts. It does not run project commands, call an LLM, fetch external assets, upload files, or read `.env` contents. The renderer escapes Markdown-derived and git-derived text and uses inline CSS instead of a Markdown parser or browser app.

## 2026-06-10: Evidence Badges Are Local SVG Files

`agentloop badge` writes SVG badges from existing local verification or gate evidence. It does not run project verification commands, call remote badge services, fetch assets, upload files, or read `.env` contents. Badges are status pointers for reports and CI artifacts; the Markdown and HTML evidence remains the source of truth.

## 2026-06-10: Use 0.16.0 For npm Catch-Up

GitHub already has public releases from `v0.2.0` through `v0.15.1`, and `main` now contains badge behavior that is not in `v0.15.1`. The next npm catch-up release must use a new version, `0.16.0`, so npm package contents, the GitHub tag, and release notes describe the same source. Do not backfill old npm versions with newer code, and do not keep creating higher versions only because npm authorization was previously blocked.

## 2026-06-10: Template Versioning Uses A Local Manifest

Generated harness provenance lives in `.agentloop/manifest.json`, not in `agentloop.config.json`. The manifest records the generated template version and generator name without changing config validation for existing users. `doctor` can warn about missing, invalid, old, or newer manifests, but AgentLoopKit does not automatically rewrite edited harness files.

## 2026-06-10: Policy Inspection Is Read-Only

`agentloop policy` lists and reads local Markdown files under `.agentloop/policies/`. It does not enforce policy, scan source code, fetch remote policy packs, mutate policy files, or claim compliance. The command exists so humans and agents can find repo guidance before risky edits while keeping policies as plain files.

## 2026-06-10: Policy Status Compares Templates, Not Compliance

`agentloop policy status` compares local `.agentloop/policies/*.md` files with bundled AgentLoopKit policy templates. It reports `current`, `modified`, `missing`, and `extra` so agents and maintainers can review local policy drift. It does not score compliance, scan source code, rewrite policies, fetch remote packs, or decide whether a local customization is correct.

## 2026-06-10: CI Summary Is Read-Only Evidence

`agentloop ci-summary` reads allowlisted CI provenance and local AgentLoop artifacts, then prints Markdown or JSON. It writes a Markdown file only when `--write` is passed. It does not call CI provider APIs, read secrets, print arbitrary environment variables, upload files, run verification commands, or replace `*-verification-report.md` as the verification source of truth.

## 2026-06-10: Release Notes Are Local Handoff Evidence

`agentloop release-notes` drafts release notes from local package metadata, changelog sections, git history, task contracts, verification reports, and CI summaries. It writes a Markdown file only when `--write` is passed. It does not create tags, publish packages, call GitHub or npm APIs, read tokens, upload files, rewrite changelogs, or infer semantic changes it cannot prove.

## 2026-06-10: npm Status Is A Read-Only Registry Check

`agentloop npm-status` compares local `package.json` metadata with `npm view <package> version versions --json`. It can read captured registry JSON with `--registry-json` for CI or handoff replay, and `--expect-current` can fail post-publish smoke checks when npm latest does not match the local version. The command does not publish packages, create tags, create GitHub releases, read npm tokens, read `.env` files, upload files, or change package metadata.

## 2026-06-10: Use 0.24.0 For npm-status Release

`main` contains `agentloop npm-status` after the public `v0.23.0` GitHub release. Current source must release as `0.24.0` so package metadata, changelog, tag, tarball, and release notes describe the same code. Do not publish `0.23.0` from current `main`; use the existing `v0.23.0` tag or tarball if that old line must be reproduced.

## 2026-06-10: npm Catch-Up Is A One-Time Alignment Step

npm still serves `agentloopkit@0.1.1` while public GitHub releases already exist through `v0.19.0`. The next npm publish should catch up to the current GitHub release line once, then AgentLoopKit should return to normal semver. Do not backfill old npm versions from newer source, and do not keep creating higher versions only because npm authorization remains blocked.

## 2026-06-10: Next Reuses Status Decisions

`agentloop next` wraps `getAgentLoopStatus` and prints the same `nextAction` that `agentloop status` computes. It should remain a read-only shortcut for humans, agents, and scripts, not a second planner. Keeping one decision source prevents `status` and `next` from disagreeing as the loop grows.

## 2026-06-10: Prepublish Fails With Unreleased Changelog Entries

Current `main` may contain work after the latest GitHub release tag. `prepublishOnly` should fail while `CHANGELOG.md` has real entries under `## Unreleased`, so npm cannot publish contents that do not match package metadata. Release prep must move those entries into a versioned section and reset `Unreleased` before publishing from `main`.

## 2026-06-10: Keep README User-Facing

The README is part of the npm package and should explain user value, install commands, CLI usage, examples, and safety. It must not include local npm auth state, publish failures, catch-up history, or trusted-publishing operations. Maintainer release process belongs in `docs/npm-publishing.md`, `docs/release-status.md`, `docs/launch-checklist.md`, and internal AgentLoop handoffs.

## 2026-06-10: Stage Distribution Channels After npm

npm/npx and GitHub Releases are the primary release channels. Homebrew, Docker/GHCR, GitHub Action, MCP Registry, VS Code/Open VSX, Scoop, and WinGet should be added as separate, verifiable tasks. MCP Registry is blocked until AgentLoopKit has a real MCP server; do not claim support from metadata alone.
