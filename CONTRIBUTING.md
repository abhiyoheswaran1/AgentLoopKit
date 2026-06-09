# Contributing

Thanks for improving AgentLoopKit.

## Setup

```bash
pnpm install
pnpm test
pnpm typecheck
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
pnpm build
```
