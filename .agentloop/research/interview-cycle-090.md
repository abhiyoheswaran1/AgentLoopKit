# Interview Cycle 90

## Context

AgentLoopKit has a broad local-first CLI, current GitHub release artifacts, a concise release-status page, and static shell completions for bash, zsh, and fish. npm still serves `0.1.1`, while the repository and GitHub release are at `0.22.0`.

## Personas interviewed

- Platform Engineer
- Small Team CTO
- Agency Developer
- AI-Skeptical Senior Engineer

## Feedback summary

PowerShell support is a small adoption gap. Windows users can still run AgentLoopKit through npm, but completion support currently tells them PowerShell is unsupported. The strongest signal is to add a static PowerShell script generator without profile mutation, installers, or Windows-specific runtime dependencies.

## Raw simulated feedback

### Platform Engineer

- What they liked: Static completions are inspectable and fit locked-down workstations.
- What confused them: Why the shell list stops before PowerShell.
- What they would need before using it: A script they can review, commit to internal setup docs, and install themselves.
- What would make them recommend/star it: Windows-friendly CLI polish without hidden shell edits.
- What would make them abandon it: A command that writes profile files or assumes admin access.

### Small Team CTO

- What they liked: Shell completions make repeated CLI use easier for the team.
- What confused them: Whether Windows users receive the same treatment as macOS and Linux users.
- What they would need before using it: One command that prints the PowerShell completion script.
- What would make them recommend/star it: Cross-platform setup docs that stay short.
- What would make them abandon it: More process than value.

### Agency Developer

- What they liked: The CLI can be installed into different client repos without adding services.
- What confused them: Whether `pwsh` users need to remember `powershell` or a separate name.
- What they would need before using it: `powershell` and `pwsh` aliases.
- What would make them recommend/star it: Familiar command names across shells.
- What would make them abandon it: Shell support that breaks client machines.

### AI-Skeptical Senior Engineer

- What they liked: Printing scripts to stdout is transparent.
- What confused them: Completion polish does not prove the core workflow, so docs should not oversell it.
- What they would need before using it: Tests that show the script contains the real command surface.
- What would make them recommend/star it: Deterministic output and no shell mutation.
- What would make them abandon it: Installer-style behavior hidden behind a helper command.

## Product council debate

- Abhi: Keep this as a CLI polish release. It widens the wedge without turning AgentLoopKit into setup automation.
- Maya: Add one renderer and tests. Do not add dependencies or try to detect Windows.
- Elias: Update README and getting-started docs so GitHub readers see cross-platform care.
- Nora: `agentloop completion powershell` should be obvious, and `pwsh` should work for people who type what they use.
- Samir: Block any profile writes. The command must print text only.
- Lina: Agents on Windows repos benefit from the same command memory support as macOS/Linux agents.
- Tom: This is acceptable if the docs keep it plain and do not frame completion as core value.
- Rachel: Cross-platform polish helps team rollout, but do not make it a policy-management feature.

## Decision

Add PowerShell shell completion support with `powershell` and `pwsh` inputs. Keep the command read-only and static. Update tests and docs.

## Non-decisions

- Do not install scripts into PowerShell profiles.
- Do not detect user shells.
- Do not add a completion daemon.
- Do not add telemetry or shell usage tracking.

## Resulting tasks

- Add failing Vitest coverage for PowerShell completion output and `pwsh` alias behavior.
- Implement a deterministic PowerShell completion renderer.
- Update CLI help and docs shell lists.
- Record dogfooding and verification.

## Success criteria

- `agentloop completion powershell` prints a `Register-ArgumentCompleter` script.
- `agentloop completion pwsh` prints the same PowerShell script.
- The script covers top-level commands, task commands, policy commands, task status values, agent names, and supported shell names.
- Existing bash, zsh, fish, and unsupported-shell behavior remains tested.
