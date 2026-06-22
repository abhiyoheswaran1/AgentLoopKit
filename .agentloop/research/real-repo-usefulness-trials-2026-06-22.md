# Real-Repo Usefulness Trials - 2026-06-22

Internal AgentLoopKit trial notes. These notes are simulated/internal decision support from local dogfooding and must not be presented as real user interviews, adoption proof, testimonials, compliance evidence, or public usage claims.

## Scope

- Goal: stabilize the unreleased Evidence Map, `explain-diff`, `resume-pack`, Guard, context-budget, research-task, and doctor monorepo improvements before maintainer-approved release prep.
- Trial boundary: local temporary Git repositories using the freshly built `dist/cli/index.js`.
- Excluded: releases, version bumps, tags, publishing, network services, telemetry, GitHub posting, token reads, sibling repository mutation, and provider prompt interception.

## Commands Exercised

Each repo shape exercised:

- `agentloop init`
- `agentloop doctor --redact-paths`
- `agentloop create-task`
- `agentloop task status`
- `agentloop verify --task-commands --only-task-commands --redact-paths`
- `agentloop explain-diff --redact-paths`
- `agentloop guard --json --redact-paths`
- `agentloop review-context --redact-paths`
- `agentloop resume-pack --for codex --redact-paths`

## Repo Shapes

### Monorepo

Shape: root npm package with nested `apps/web`, `functions`, and `firestore-tests` package manifests and no root verification scripts.

Useful:

- `doctor` detected the nested package layout and warned that root checks may not cover every package.
- The monorepo guidance stayed bounded and did not scan broadly.
- Clean-harness `explain-diff`, Guard, `review-context`, and `resume-pack` used fresh task verification and compact context-budget output.

Friction:

- If the generated AgentLoopKit harness is not committed after first init, the evidence map correctly shows many generated harness files as unexplained local work. This is truthful but noisy for first-run demos.

### App Repo

Shape: Next-style app package with root `test`, `lint`, `typecheck`, and `build` scripts.

Useful:

- `doctor` detected `nextjs`, configured commands, and no monorepo.
- After committing the harness baseline, `explain-diff` became reviewable for a single app source change.
- `resume-pack` showed a compact continuation surface with context-budget estimates.

Friction:

- A custom task output path such as `.agentloop/tasks/app-trial.md` was initially treated as unexplained non-evidence, along with `.agentloop/state.json`.

Fix:

- Classified `.agentloop/state.json` and non-README task Markdown files under `.agentloop/tasks/` as AgentLoop evidence.
- Added regression coverage in `tests/evidence-map.test.ts`.

### Library Repo

Shape: TypeScript package with root `test`, `lint`, `typecheck`, and `build` scripts.

Useful:

- `doctor` detected `typescript-package` and configured commands.
- Clean-harness `explain-diff`, Guard, `review-context`, and `resume-pack` behaved the same as the app repo.
- Context-budget output remained readable and bounded.

Friction:

- Same first-init harness-baseline noise as the other repos when the harness was not committed before feature work.

## Clean-Harness Trial Result

After committing the generated harness baseline, the focused app trial produced:

- Evidence map: `4` changed files; `1` non-evidence, `3` AgentLoop evidence.
- Coverage: `1` covered, `0` unexplained.
- Verification: `fresh`.
- Reviewability: `reviewable`.
- Resume-pack context budget: `32` estimated changed-file-list tokens and `49` estimated resume-pack tokens for the small app trial.

The current AgentLoopKit repo's larger dirty batch produced:

- `83` changed files.
- `967` estimated changed-file-list tokens.
- `101` estimated resume-pack tokens.
- About `90%` less estimated continuation context when using `resume-pack` instead of broad changed-file context.

These are transparent character-count heuristic estimates, not provider tokenizer counts or billing claims.

## Decision

Keep the unreleased command surfaces. Fix the AgentLoop evidence classification bug, document the first-init harness-baseline expectation, and add README visual evidence for the Guard/resume-pack context-budget value.

## Non-Decisions

- Do not add the future explicit `agentloop context` command in this task.
- Do not change `init` flags.
- Do not hide generated harness files from evidence maps before they are committed.
- Do not claim real user research or external adoption from these trials.
- Do not release, tag, publish, or bump versions.
