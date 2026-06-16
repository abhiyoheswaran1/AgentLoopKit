# Maintenance Guards

AgentLoopKit's near-term work is maintenance discipline, adoption polish, and trust. Use these guards before changing release, docs, schema, policy, or GitHub metadata behavior.

## Release Pipeline

The supported release path is:

```text
GitHub Release -> npm trusted publishing -> GHCR -> MCP Registry
```

Keep these checks healthy:

```bash
npm run release-flow
agentloop npm-status --agentloopkit --expect-current
agentloop release-proof
npm run smoke:published -- --version <version>
```

Do not publish manually unless the maintainer approves the fallback. Do not put local auth failures, token state, or temporary registry repair notes in the README.

## Public Docs

README/public docs should explain what users need:

- install with npm or npx
- initialize a repo
- create a task
- verify work
- run `ship`
- prepare a PR
- inspect release proof when needed

Run:

```bash
npm run check:public-docs
npm run check:links
```

Public docs must avoid internal process notes, fake adoption claims, unsupported release channels, and premature paid-plan copy.

The hygiene check blocks examples such as:

- unsupported marketplace or package-manager availability claims
- install commands for channels AgentLoopKit has not verified and documented as supported
- adoption or customer-proof copy without public evidence
- premature Pro, SaaS, hosted-dashboard, or paid-plan copy

Design notes may discuss deferred channels when they clearly frame them as future work and validation gates.

## Release Proof

After release workflows finish, run:

```bash
agentloop release-proof
```

This checks npm, GitHub Releases, GHCR, and MCP Registry evidence. It does not publish, create tags, upload files, post comments, read tokens, or read `.env` contents.

## SchemaStore

If `agentloop.config.json` schema shape or URL changes, update:

- `schema/agentloop.config.schema.json`
- `schema/schemastore/agentloopkit.json`
- `src/core/schemastore.ts`
- SchemaStore docs
- tests around `agentloop schemastore`

Run:

```bash
npm test -- tests/schemastore.test.ts
```

## Policy Packs

Keep policy packs small and local.

Rules:

- Bundled packs should cover common review and safety behavior.
- Local org packs must live in the repo.
- `policy pack apply` writes missing files only.
- Existing policy files are skipped.
- There is no overwrite flag.
- Do not download remote policy packs.

Run:

```bash
npm test -- tests/policy-packs.test.ts
agentloop policy packs
agentloop policy status
```

## GitHub Metadata

GitHub metadata import remains optional and read-only.

Rules:

- Users pass explicit local JSON files.
- AgentLoopKit does not call GitHub APIs.
- AgentLoopKit does not read GitHub tokens.
- AgentLoopKit does not read `.env` files.
- Missing metadata is neutral.
- Invalid local metadata is a warning.
- Imported issue and PR text must not affect `ship` scoring unless a future task proves that behavior is safe.

Run:

```bash
npm test -- tests/github-metadata.test.ts
agentloop review-context --redact-paths
agentloop maintainer-check --redact-paths
```

## Regular Maintenance Check

Use the maintenance gate during ongoing development when release proof, public docs, SchemaStore, policy packs, GitHub metadata, AgentFlight, or ProjScan behavior changes:

```bash
npm run maintenance:check
```

That gate runs unit tests, public-doc hygiene, link checks, live release proof, SchemaStore output, policy-pack inventory, the read-only GitHub metadata import surface, focused GitHub metadata safety tests, AgentFlight version, ProjScan health, and the non-strict dogfood self-check.

Run `npm run dogfood:strict` after fresh verification when review gates should block the final handoff.

Use the full release gate only for approved releases:

```bash
npm run release-flow
```
