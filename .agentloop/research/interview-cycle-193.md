# Interview Cycle 193: Package Metadata Positioning Guard

Date: 2026-06-21

## Panel

- Elias, product maintainer
- Samir, security reviewer
- Dogfood steward

## Simulated Signals

- Package metadata is often the first text a developer sees in npm and repository indexes.
- Description and keywords should follow the same product language rules as README and generated guidance.
- A lightweight test is enough; release automation and publish scripts should not change for a copy guard.

## Decision

Reuse the unsupported-positioning checker in package metadata tests. Assert that the current package description and keywords use software-agent and agent-assisted engineering language, and that unsupported metadata text fails.

## Non-Goals

- No package version, dependency, publish script, prepublish, release, command behavior, schema, tag, or publishing changes.
- Do not present this simulated panel as real user feedback or adoption evidence.
