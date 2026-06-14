# OSS Roadmap Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Address the near-term OSS roadmap without starting Pro work: keep release channels healthy, keep public docs clean, keep policy packs small, keep GitHub metadata optional/read-only, keep SchemaStore support current, and add a local release-proof helper that gathers post-release evidence.

**Architecture:** Add one read-only CLI command, `agentloop release-proof`, backed by a small core module. It should compose existing local release readiness and npm status behavior, then add bounded public proof checks for GitHub release assets, GHCR tags, and MCP Registry metadata. Public-doc hygiene remains a script-level guard used by release gates. Documentation updates stay user-facing and omit internal release chatter.

**Tech Stack:** TypeScript, Commander, Node.js built-ins, execa for existing npm/git checks, Vitest, existing AgentLoopKit evidence files.

---

## Task 1: Baseline And Research

- [x] Confirm current worktree state and active AgentLoop task.
- [x] Create a simulated product research cycle for this batch under `.agentloop/research/`.
- [x] Update `.agentloop/backlog.md` with the selected roadmap items and decisions.
- [x] Record the dogfood entry for this task in `.agentloop/dogfood-log.md`.

## Task 2: Release-Proof Tests First

- [x] Add `tests/release-proof.test.ts`.
- [x] Cover captured fixture modes for npm, GitHub release, GHCR, and MCP proof.
- [x] Cover safe failure modes: missing fixture, invalid JSON, `.env` fixture path, and no credential/token exposure.
- [x] Cover CLI JSON output and Markdown output.
- [x] Add the test file to `package.json` unit/integration script as appropriate.

Expected command:

```bash
npm test -- tests/release-proof.test.ts
```

Expected output before implementation: tests fail because the command/module does not exist.

## Task 3: Release-Proof Core And CLI

- [x] Add `src/core/release-proof.ts`.
- [x] Add `src/cli/commands/release-proof.ts`.
- [x] Register the command in `src/cli/index.ts`.
- [x] Add completion metadata in `src/core/completions.ts`.
- [x] Keep behavior read-only:
  - no publishing
  - no tag creation
  - no GitHub release creation
  - no token reads
  - no `.env` reads
  - no uploads
  - no package metadata mutation
- [x] Support `--json`.
- [x] Support `--redact-paths`.
- [x] Support captured proof fixtures so CI/tests can run without live registries:
  - `--npm-registry-json`
  - `--github-release-json`
  - `--ghcr-tags-json`
  - `--mcp-registry-json`
- [x] Support `--timeout-ms` for live public checks.

## Task 4: Public Docs Hygiene

- [x] Strengthen `runPublicDocsHygiene()` to catch:
  - internal release chatter in README/package docs
  - unsupported channel promises
  - fake adoption/testimonial language
  - premature Pro/SaaS claims
  - Homebrew install claims
- [x] Keep internal files such as `.agentloop/` and maintainer-only docs scoped correctly so useful internal notes do not fail public hygiene.
- [x] Add or extend tests that exercise the hygiene guard directly.

Expected command:

```bash
npm run check:public-docs
```

Expected output: public docs hygiene passes.

## Task 5: Docs And Examples

- [x] Add `docs/release-proof.md`.
- [x] Update `docs/cli-reference.md`.
- [x] Update `docs/npm-publishing.md` and `docs/distribution-channels.md` to use `agentloop release-proof` after release.
- [x] Update README command table with only user-facing release-proof wording.
- [x] Update `docs/release-checklist-example.md` if release proof improves the example.
- [x] Keep copy concise and user-facing.

## Task 6: SchemaStore, GitHub Metadata, Policy Pack Pass

- [x] Confirm SchemaStore docs and generated schema still point to the intended URL and package shape.
- [x] Confirm GitHub metadata docs say local JSON import is optional/read-only and not token-based.
- [x] Confirm policy pack docs stay small and local; avoid remote pack fetching or org-management scope.
- [x] Add focused tests only if an actual guard gap is found.

## Task 7: Bug/Security Pass

- [x] Run targeted tests for release proof and affected docs/hygiene.
- [x] Run a quick source audit for token/env/credential reads.
- [x] Run ProjScan.
- [x] Fix any bug found before broader verification.

## Task 8: Verification And Dogfood Handoff

- [x] Run `npm run lint`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run test:unit`.
- [x] Run `npm run test:integration`.
- [x] Run `npm run check:public-docs`.
- [x] Run `npm run check:links`.
- [x] Run `npm run build`.
- [x] Run `npm run dogfood:strict`.
- [x] Run `node dist/cli/index.js ship --redact-paths`.
- [x] Run `node dist/cli/index.js prepare-pr --stdout --redact-paths`.
- [ ] Commit and push after the work is verified.
- [ ] Do not cut a release until the user explicitly approves.
