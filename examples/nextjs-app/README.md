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
agentloop handoff
agentloop check-gates --strict
```

Task contract starter:

```bash
agentloop create-task --type feature --title "Add account settings" \
  --likely-file app/settings \
  --likely-file components/settings \
  --forbidden-file migrations \
  --acceptance "Settings page renders on desktop and mobile" \
  --acceptance "Settings form validates invalid input" \
  --verification "pnpm test" \
  --verification "pnpm lint" \
  --verification "pnpm typecheck" \
  --verification "pnpm build"
```

Extra care:

- middleware
- route handlers
- server actions
- auth callbacks
- environment variables
