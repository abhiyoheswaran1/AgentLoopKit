# Stack Recipes

Use these recipes as starting points for task contracts and `agentloop.config.json`.

AgentLoopKit detects common project shapes, but it does not infer full test coverage. Pick commands that match the repository's own scripts and say what was not verified in the handoff.

## Next.js

Common commands:

```json
{
  "commands": {
    "test": "pnpm test",
    "lint": "pnpm lint",
    "typecheck": "pnpm typecheck",
    "build": "pnpm build",
    "format": "pnpm format"
  }
}
```

Task contract example:

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

- route handlers
- auth callbacks
- middleware
- server actions
- environment variables

## React or Vite

Common commands:

```json
{
  "commands": {
    "test": "pnpm test",
    "lint": "pnpm lint",
    "typecheck": "pnpm typecheck",
    "build": "pnpm build",
    "format": "pnpm format"
  }
}
```

Task contract example:

```bash
agentloop create-task --type feature --title "Add dashboard filter" \
  --likely-file src/components \
  --likely-file src/routes \
  --acceptance "Filter state survives refresh when supported by the app" \
  --acceptance "Keyboard and pointer interaction both work" \
  --verification "pnpm test" \
  --verification "pnpm lint" \
  --verification "pnpm typecheck" \
  --verification "pnpm build"
```

Extra care:

- global state
- router changes
- generated clients
- design-system components
- accessibility behavior

## Remix

Common commands:

```json
{
  "commands": {
    "test": "pnpm test",
    "lint": "pnpm lint",
    "typecheck": "pnpm typecheck",
    "build": "pnpm build",
    "format": "pnpm format"
  }
}
```

Task contract example:

```bash
agentloop create-task --type feature --title "Add account export route" \
  --likely-file app/routes/account.export.tsx \
  --likely-file app/services/account-export.server.ts \
  --forbidden-file app/services/billing.server.ts \
  --acceptance "Only authenticated users can request an export" \
  --acceptance "Loader and action tests cover success and forbidden paths" \
  --verification "pnpm test" \
  --verification "pnpm lint" \
  --verification "pnpm typecheck" \
  --verification "pnpm build"
```

Extra care:

- loaders and actions
- session storage
- auth guards
- server-only modules
- deployment adapters

## SvelteKit

Common commands:

```json
{
  "commands": {
    "test": "pnpm test",
    "lint": "pnpm lint",
    "typecheck": "pnpm check",
    "build": "pnpm build",
    "format": "pnpm format"
  }
}
```

Task contract example:

```bash
agentloop create-task --type feature --title "Add profile preferences" \
  --likely-file src/routes/settings \
  --likely-file src/lib/server/preferences.ts \
  --forbidden-file src/hooks.server.ts \
  --acceptance "Preferences save through a server action" \
  --acceptance "Unauthenticated requests redirect to login" \
  --verification "pnpm test" \
  --verification "pnpm lint" \
  --verification "pnpm check" \
  --verification "pnpm build"
```

Extra care:

- `+page.server.ts` and `+server.ts` files
- `hooks.server.ts`
- form actions
- session cookies
- adapter-specific deployment config

## Node API

Common commands:

```json
{
  "commands": {
    "test": "npm test",
    "lint": "npm run lint",
    "typecheck": "npm run typecheck",
    "build": "npm run build",
    "format": "npm run format"
  }
}
```

Task contract example:

```bash
agentloop create-task --type bugfix --title "Reject invalid API payloads" \
  --likely-file src/routes \
  --likely-file src/validation \
  --forbidden-file migrations \
  --acceptance "Invalid payloads return a 400 response" \
  --acceptance "Existing valid requests still pass" \
  --verification "npm test" \
  --verification "npm run typecheck"
```

Extra care:

- auth middleware
- request validation
- database migrations
- billing or webhook handlers
- deployment config

## Python Service

Common commands:

```json
{
  "commands": {
    "test": "pytest",
    "lint": "ruff check .",
    "typecheck": "mypy .",
    "build": "python -m compileall src",
    "format": "ruff format ."
  }
}
```

Task contract example:

```bash
agentloop create-task --type refactor --title "Extract billing client" \
  --likely-file src/billing \
  --likely-file tests/billing \
  --forbidden-file migrations \
  --acceptance "Billing tests cover success and failure responses" \
  --acceptance "Public service interface stays compatible" \
  --verification "pytest" \
  --verification "ruff check ." \
  --verification "mypy ."
```

Extra care:

- migrations
- secrets handling
- background jobs
- external service clients
- deployment manifests

## Django

Common commands:

```json
{
  "commands": {
    "test": "python manage.py test",
    "lint": "ruff check .",
    "typecheck": "mypy .",
    "build": "python manage.py check --deploy",
    "format": "ruff format ."
  }
}
```

Task contract example:

```bash
agentloop create-task --type bugfix --title "Fix invite permission check" \
  --likely-file accounts/views.py \
  --likely-file accounts/tests/test_invites.py \
  --forbidden-file migrations \
  --acceptance "Users cannot invite members to organizations they do not own" \
  --acceptance "Existing owner invite flow still passes" \
  --verification "python manage.py test accounts" \
  --verification "ruff check ." \
  --verification "python manage.py check"
```

Extra care:

- migrations
- permissions and decorators
- middleware
- settings files
- management commands that mutate data

## FastAPI

Common commands:

```json
{
  "commands": {
    "test": "pytest",
    "lint": "ruff check .",
    "typecheck": "mypy .",
    "build": "python -m compileall app",
    "format": "ruff format ."
  }
}
```

Task contract example:

```bash
agentloop create-task --type feature --title "Add API key rotation endpoint" \
  --likely-file app/routes/api_keys.py \
  --likely-file app/services/api_keys.py \
  --likely-file tests/test_api_keys.py \
  --forbidden-file alembic/versions \
  --acceptance "Only the key owner can rotate an API key" \
  --acceptance "Old keys stop working after rotation" \
  --verification "pytest tests/test_api_keys.py" \
  --verification "ruff check ." \
  --verification "mypy ."
```

Extra care:

- dependency injection overrides
- auth dependencies
- background tasks
- Alembic migrations
- OpenAPI contract changes

## Docs-Only Repo

Common commands:

```json
{
  "commands": {
    "test": "",
    "lint": "npx markdownlint-cli2 \"**/*.md\"",
    "typecheck": "",
    "build": "npx prettier --check \"**/*.md\"",
    "format": "npx prettier --write \"**/*.md\""
  }
}
```

Task contract example:

```bash
agentloop create-task --type docs --title "Document release process" \
  --likely-file docs \
  --likely-file README.md \
  --acceptance "Release steps include verification and rollback notes" \
  --acceptance "Links resolve locally" \
  --verification "npx markdownlint-cli2 \"**/*.md\"" \
  --verification "npx prettier --check \"**/*.md\""
```

Extra care:

- command snippets
- local links
- screenshots
- generated docs
- public claims about adoption or support

## Empty or Early Repo

Start with the loop before the stack is chosen:

```bash
agentloop init
agentloop create-task --type feature --title "Choose project stack" \
  --acceptance "Stack decision is recorded" \
  --acceptance "Initial verification command is documented" \
  --verification "agentloop doctor"
```

As tooling appears, update `agentloop.config.json` and task contracts with real commands. Until then, use `agentloop verify --command "..."` for explicit one-off checks.

## Monorepo

Root checks are useful when the repo defines them as full coverage. If a change touches one package, add package-level commands to the task contract.

Examples:

```bash
agentloop create-task --type feature --title "Update web settings flow" \
  --likely-file apps/web \
  --forbidden-file packages/billing \
  --verification "pnpm --filter web test" \
  --verification "pnpm --filter web lint" \
  --verification "pnpm --filter web typecheck" \
  --verification "pnpm --filter web build"
```

Other package-manager patterns:

```bash
npm --workspace api test
yarn workspace web test
cd packages/api && npm test
```

In the handoff, separate:

- root checks run
- package checks run
- checks skipped
- packages not touched

Do not claim full monorepo verification from a root-only command unless the repository documents that coverage.
