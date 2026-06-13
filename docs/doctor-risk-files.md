# Doctor Risk Files

`agentloop doctor` reports files that usually deserve extra review before an agent changes them. These findings are warning-only. They help scope task contracts and reviewer handoffs; they do not block work, score risk, scan secrets, or prove anything about security.

Run:

```bash
agentloop doctor
agentloop doctor --json
agentloop doctor --redact-paths
```

Use `--redact-paths` before sharing doctor output outside the repo. The flag hides the absolute Git root and leaves repo-relative risk-file paths readable.

## Categories

| Category | Examples | Why reviewers care |
| -------- | -------- | ------------------ |
| migrations | `migrations/001-add-users.sql`, `db/migration.ts` | Schema and data changes can be hard to roll back. |
| auth | `src/auth/session.ts`, `oauth/callback.ts` | Session, identity, and login behavior can break access boundaries. |
| security | `security.ts`, `crypto/keyring.ts`, `permissions/policy.ts` | Permissions, crypto, and policy code need narrow review. |
| billing | `billing/stripe.ts`, `payments/invoice.ts` | Payment and invoice changes can affect money movement and customer trust. |
| deployment | `Dockerfile`, `vercel.json`, `.github/workflows/release.yml` | Runtime and CI changes can alter how code ships. |
| lockfiles | `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock` | Dependency graph changes need supply-chain review. |
| env files | `.env`, `.env.local`, `apps/web/.env.example` | Environment files may point to secrets or runtime configuration. |

Doctor shows a capped list of path examples for each category. If a category has more than three files, the message includes a `(+N more)` suffix.

## Env File Handling

AgentLoopKit reports env file paths only. It does not open `.env` files, print values, scan for keys, or upload anything.

If `doctor` reports env files:

- do not paste their contents into task contracts, reports, issues, or chats
- mention only the path and the review concern
- require a human reviewer before changing env files
- use example files such as `.env.example` when documentation needs variable names

## How Agents Should Use Warnings

Warnings should shape the task contract:

```bash
agentloop create-task --type bugfix --title "Fix session timeout" \
  --likely-file src/auth \
  --forbidden-file .env \
  --acceptance "Expired sessions redirect to login" \
  --verification "pnpm test" \
  --rollback "Revert the session timeout change"
```

Use risk-file output to fill:

- likely files or areas
- files or areas not to touch
- constraints
- risk notes
- rollback notes
- reviewer checklist

Do not use a warning as proof that a file is dangerous. Use it as a prompt to make scope and review expectations explicit.

## How Reviewers Should Read Warnings

When a handoff mentions risk files, ask:

- Did the task contract name the sensitive area before implementation?
- Did the diff stay within the expected scope?
- Did verification run for the affected area?
- Did the handoff say which checks did not run?
- Is the rollback note concrete enough for the change?

For auth, billing, deployment, migrations, and dependency changes, request a human review even when verification passes.

## Limits

`doctor` uses simple local file-path heuristics. It does not parse source code, inspect dependency advisories, run audits, detect secrets, understand business impact, or replace security review.

Use it to make risky areas visible early. Use tests, code review, dependency tooling, and human judgment to decide whether the change is safe.
