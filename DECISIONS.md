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
