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

## 2026-06-09: Verification Excerpts Preserve Failure Tails

`agentloop verify` keeps both the beginning and ending output when a command log is too long for a report. This preserves setup context and final error lines while keeping reports reviewable. The CLI does not summarize, redact, or reinterpret command output.
