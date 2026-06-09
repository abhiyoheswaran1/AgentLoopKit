# Next.js App Example

This example shows the kind of harness AgentLoopKit generates for a Next.js project.

Detected commands:

- test: `pnpm run test`
- lint: `pnpm run lint`
- typecheck: `pnpm run typecheck`
- build: `pnpm run build`

Use:

```bash
npx agentloopkit init
agentloop create-task --type feature --title "Add account settings"
agentloop verify
agentloop summarize --write
```
