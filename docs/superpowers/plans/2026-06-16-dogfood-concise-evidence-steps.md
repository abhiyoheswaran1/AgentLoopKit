# Dogfood Concise Evidence Steps

## Context

Normal `npm run dogfood` output currently streams `artifacts --json` and `maintainer-check --json --redact-paths`. That keeps the commands script-friendly, but makes local dogfood logs harder for maintainers and long-running agents to scan.

## Constraints

- Keep `dogfood --json` as one structured summary with child output suppressed.
- Do not change `artifacts` or `maintainer-check` JSON schemas.
- Do not remove evidence steps or change their failure behavior.
- Do not touch dependencies, release tooling, package versions, tags, or publishing behavior.

## Plan

1. Update tests first so `createDogfoodSteps` expects `artifacts` without `--json` and `maintainer-check --redact-paths` without `--json`.
2. Verify the focused dogfood tests fail on the current step arguments.
3. Change only the dogfood step arguments in `scripts/dogfood.mjs`.
4. Update CLI docs to describe human artifact, maintainer, and review-context output in normal dogfood logs.
5. Run focused tests, `node scripts/dogfood.mjs --json`, normal dogfood, then the task verification commands and strict dogfood gate.

## Review Notes

The risk is log-shape churn in normal dogfood output. The structured dogfood summary remains available through `--json`, so automation should keep using that mode.
