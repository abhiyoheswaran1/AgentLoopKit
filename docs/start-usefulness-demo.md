# Start Usefulness Demo

This demo creates a temporary repo with many changed files, one task contract, and one forbidden-path change. It shows how `agentloop start` turns broad repo noise into a compact preflight with a usefulness proof.

The numbers come from the repo state you create. AgentLoopKit estimates tokens as `ceil(character_count / 4)` for planning. It does not measure provider tokens, bills, or model input cost.

This page follows the current `main` branch. Before the next release, run it from a local checkout with `AGENTLOOP="node /absolute/path/to/AgentLoopKit/dist/cli/index.js"` after `npm run build`. After the next publish, `AGENTLOOP="npx --yes agentloopkit@latest"` is enough.

## Run The Demo

```bash
tmp="$(mktemp -d)"
cd "$tmp"
git init -q
git config user.email demo@example.invalid
git config user.name "AgentLoopKit Demo"
npm init -y >/dev/null
npm pkg set scripts.test="echo test suite passed" >/dev/null
AGENTLOOP="${AGENTLOOP:-npx --yes agentloopkit@latest}"

$AGENTLOOP init
git add .
git commit -m "AgentLoop baseline" >/dev/null

$AGENTLOOP create-task \
  --type bugfix \
  --title "Tighten auth copy" \
  --problem "Auth copy is unclear across the sign-in flow." \
  --outcome "Auth copy reads consistently without touching billing." \
  --likely-file "src/auth" \
  --forbidden-file "src/billing" \
  --acceptance "Auth copy files are updated" \
  --verification "npm test" \
  --rollback "Revert the auth copy files"

mkdir -p src/auth src/billing
for n in $(seq 1 40); do
  printf 'export const authCopy%s = "new";\n' "$n" > "src/auth/copy-$n.ts"
done
printf 'export const billingCopy = "new";\n' > src/billing/copy.ts

$AGENTLOOP doctor --redact-paths
$AGENTLOOP start --for codex --goal implement --redact-paths
```

## What To Look For

Doctor prints the Agent Readiness Matrix. In a freshly initialized repo, it should show Doctor readiness guidance, Start preflight guidance, context-handle expansion, broad-read avoidance, MCP guidance, and generated agent instructions as documented or ready.

The useful proof appears near the top:

```text
## Usefulness Proof

- Preflight state: `scope-drift`
- Context avoided: `...` estimated token(s)
- Broad changed files avoided: `41`
- Stale proof caught: `...`
- Scope drift caught: `true`
- Source handles available: `task:active`, `evidence-map:current`, ...
- Next safe command: `agentloop ...`
```

Then inspect only the source truth the agent needs:

```bash
$AGENTLOOP context show task:active --redact-paths
$AGENTLOOP context show evidence-map:current --redact-paths
$AGENTLOOP context show context-budget:current --redact-paths
```

This is the product promise in one loop: the agent sees the task, the forbidden-path change, stale or missing proof, context pressure, and the exact handles to expand. It does not need a pasted transcript or a broad file dump before it can decide what to read next.

## Safe Claims

You can say:

- AgentLoopKit estimated a smaller compact briefing than broad changed-file context for this repo state.
- AgentLoopKit caught out-of-scope work before review.
- AgentLoopKit gave source handles for local truth.

Do not say:

- The estimate equals provider tokenizer output.
- The percentage equals billable-token savings.
- This demo proves real user adoption, interview results, or production accuracy.
