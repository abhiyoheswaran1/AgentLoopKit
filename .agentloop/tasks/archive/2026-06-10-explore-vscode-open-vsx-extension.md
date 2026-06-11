# Explore VS Code and Open VSX extension

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement

Editor-first users may want AgentLoopKit actions inside VS Code-compatible editors, but an extension adds maintenance cost and should not be built without a scoped UX.

## Desired Outcome

A short design evaluates whether a thin extension should wrap existing CLI commands for task, verify, status, and handoff workflows.

## Constraints

- Do not build the extension until the design is accepted.
- Reuse the CLI.
- Do not add telemetry.
- Do not store credentials.

## Non-Goals

- Do not build a full IDE replacement.
- Do not add an LLM wrapper.

## Likely Files or Areas

- docs/distribution-channels.md
- docs/designs/vscode-open-vsx-extension.md
- ROADMAP.md

## Acceptance Criteria

- Design lists target workflows, maintenance cost, and release path.
- Decision is recorded as build, defer, or reject.

## Verification Commands

- npx pnpm@10.12.1 check:links

## Rollback Notes

Remove the extension plan if it distracts from the CLI and CI workflows.
