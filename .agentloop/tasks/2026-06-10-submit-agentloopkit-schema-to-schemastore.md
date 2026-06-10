# Submit AgentLoopKit config schema to SchemaStore

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement

AgentLoopKit ships a config schema, but editors that use SchemaStore cannot auto-discover it for agentloop.config.json yet.

## Desired Outcome

Open a SchemaStore pull request that registers agentloop.config.json against AgentLoopKit's hosted JSON schema, then document the submission status locally.

## Constraints

- Use the existing raw GitHub schema URL; do not move schema hosting.
- Only add a SchemaStore catalog entry unless their validation requires more.
- Do not claim SchemaStore acceptance until the external PR is merged.

## Non-Goals

- Do not add a custom schema domain.
- Do not change AgentLoopKit runtime behavior.

## Assumptions

- SchemaStore accepts external raw GitHub schema URLs in `src/api/json/catalog.json`.
- The generated `$schema` URL remains the canonical schema location until a dedicated schema host exists.

## Likely Files or Areas

- schema/agentloop.config.schema.json
- docs/configuration.md
- ROADMAP.md

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- Confirm AgentLoopKit is not already in SchemaStore's live catalog.
- Prepare a SchemaStore catalog entry for agentloop.config.json using the raw schema URL.
- Run relevant SchemaStore validation if feasible.
- Open or prepare a PR against SchemaStore/schemastore and record its URL/status.

## External PR Status

- SchemaStore PR: https://github.com/SchemaStore/schemastore/pull/5783
- Status: merged on 2026-06-10 at 17:54:33Z.
- Merge commit: 3ce5ba3d87e5c21616aa38c637f7e79efaf14c65.
- Scope: one catalog entry in `src/api/json/catalog.json`.

## Evidence

- Live SchemaStore catalog check found no existing AgentLoopKit entry.
- Raw schema URL returned HTTP 200 and schema title `AgentLoopKit Configuration`.
- SchemaStore `npm run typecheck`: pass.
- SchemaStore targeted Prettier check for `src/api/json/catalog.json`: pass.
- SchemaStore `git diff --check`: pass.
- Local JSON parse confirmed exactly one AgentLoopKit entry for `agentloop.config.json`.
- Upstream SchemaStore checks passed: pre-commit, schema validation, codeowners, triage, and pre-commit.ci.
- Raw SchemaStore master contains the AgentLoopKit entry.
- Live SchemaStore catalog contains the AgentLoopKit entry.

## Verification Commands

- node dist/cli/index.js npm-status --expect-current
- npx --yes pnpm@10.12.1 check:links
- git diff --check

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

- If the upstream PR is rejected or needs a different URL, update the PR branch or close PR #5783.
- No AgentLoopKit runtime rollback is needed because this task does not change CLI behavior.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
