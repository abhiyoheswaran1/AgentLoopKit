# Contributing

Thanks for improving AgentLoopKit.

## Setup

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm check:links
pnpm build
npx projscan doctor --format markdown
```

If `pnpm` is not installed globally, use:

```bash
npx pnpm@10.12.1 install
```

## Development Rules

- Keep changes small.
- Add Vitest tests for behavior changes.
- Do not add telemetry, postinstall scripts, hidden network calls, or credential access.
- Do not claim exact support for third-party agent config conventions unless the repo implements them.
- Update docs when commands or generated files change.
- Put future work in `ROADMAP.md` instead of scattering TODO comments.

## First Contributions

Start with issues labeled `good first issue` or `docs`. A good first change should name the files it touches, avoid package publishing changes, and include the verification commands you ran.

Maintainers can use `docs/contributor-playbook.md` for copyable issue examples, label guidance, and first-PR expectations.

Before editing, run:

```bash
npx agentloopkit status
```

If the repo has an active task contract, read it first. For behavior changes, add or update a Vitest test before changing production code.

Good first contribution areas:

- docs pages and examples
- generated template wording
- doctor or status output copy
- small tests for existing behavior
- issue, PR, and contributor guidance

Avoid these areas for a first PR unless a maintainer points you there:

- npm publishing workflow
- dependency upgrades
- security policy changes
- public CLI command contracts
- large refactors

## Pull Requests

Include:

- summary
- changed files
- tests run
- risks
- rollback notes

Run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm check:links
pnpm build
```
