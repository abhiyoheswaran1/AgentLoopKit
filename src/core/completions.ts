import { AgentLoopError } from './errors.js';

export const COMPLETION_SHELLS = ['bash', 'zsh', 'fish', 'powershell', 'pwsh'] as const;

export type CompletionShell = (typeof COMPLETION_SHELLS)[number];

const topLevelCommands = [
  ['init', 'Generate the repo harness and config'],
  ['doctor', 'Check setup health'],
  ['create-task', 'Create a task contract'],
  ['verify', 'Run configured verification commands'],
  ['summarize', 'Preview a reviewer summary'],
  ['handoff', 'Write a reviewer handoff'],
  ['status', 'Show current loop state'],
  ['next', 'Show the next recommended loop action'],
  ['check-gates', 'Check review gate evidence'],
  ['report', 'Write a local HTML evidence report'],
  ['badge', 'Write a local SVG evidence badge'],
  ['ci-summary', 'Summarize CI context and AgentLoop evidence'],
  ['release-notes', 'Generate deterministic release notes'],
  ['npm-status', 'Check npm registry catch-up status'],
  ['mcp-server', 'Start the read-only MCP stdio server'],
  ['policy', 'List or inspect local AgentLoopKit policies'],
  ['task', 'List, inspect, update, or archive task contracts'],
  ['install-agent', 'Install agent-specific instructions'],
  ['list-templates', 'List bundled templates'],
  ['completion', 'Print shell completion scripts'],
  ['version', 'Print the CLI version'],
] as const;

const taskCommandSpecs = [
  ['list', 'List task contracts'],
  ['show', 'Show a task contract'],
  ['set', 'Set the active task contract'],
  ['status', 'Update a task contract status'],
  ['archive', 'Archive a task contract'],
  ['current', 'Print the active task contract'],
  ['clear', 'Clear the active task pointer'],
  ['doctor', 'Check task folder hygiene'],
] as const;

const taskCommands = taskCommandSpecs.map(([name]) => name);
const policyCommandSpecs = [
  ['list', 'List local policies'],
  ['show', 'Show a local policy'],
  ['status', 'Show local policy template status'],
] as const;
const policyCommands = policyCommandSpecs.map(([name]) => name);
const taskStatuses = ['proposed', 'in-progress', 'blocked', 'review', 'done'] as const;
const agentNames = [
  'codex',
  'claude-code',
  'cursor',
  'opencode',
  'gemini-cli',
  'github-copilot-cli',
  'generic',
  'all',
] as const;

function parseShell(shell: string): CompletionShell {
  const clean = shell.trim().toLowerCase();
  if ((COMPLETION_SHELLS as readonly string[]).includes(clean)) return clean as CompletionShell;
  throw new AgentLoopError(
    `Unsupported shell "${shell}". Use one of: ${COMPLETION_SHELLS.join(', ')}.`,
  );
}

function renderBash() {
  const commands = topLevelCommands.map(([name]) => name).join(' ');
  return `# AgentLoopKit bash completion
# Save with: agentloop completion bash > ~/.agentloop-completion.bash
# Then source it from your shell profile.
_agentloop_completion() {
  local current previous
  COMPREPLY=()
  current="\${COMP_WORDS[COMP_CWORD]}"
  previous="\${COMP_WORDS[COMP_CWORD-1]}"

  case "\${COMP_WORDS[1]}" in
    task)
      case "\${COMP_WORDS[2]}" in
        status)
          if [[ \${COMP_CWORD} -eq 4 ]]; then
            COMPREPLY=( $(compgen -W "${taskStatuses.join(' ')}" -- "$current") )
            return 0
          fi
          ;;
        *)
          if [[ \${COMP_CWORD} -eq 2 ]]; then
            COMPREPLY=( $(compgen -W "${taskCommands.join(' ')}" -- "$current") )
            return 0
          fi
          ;;
      esac
      ;;
    policy)
      if [[ \${COMP_CWORD} -eq 2 ]]; then
        COMPREPLY=( $(compgen -W "${policyCommands.join(' ')}" -- "$current") )
        return 0
      fi
      ;;
    install-agent)
      COMPREPLY=( $(compgen -W "${agentNames.join(' ')}" -- "$current") )
      return 0
      ;;
    completion)
      COMPREPLY=( $(compgen -W "${COMPLETION_SHELLS.join(' ')}" -- "$current") )
      return 0
      ;;
  esac

  if [[ \${COMP_CWORD} -eq 1 ]]; then
    COMPREPLY=( $(compgen -W "${commands}" -- "$current") )
  fi
}

complete -F _agentloop_completion agentloop
complete -F _agentloop_completion agentloopkit
`;
}

function renderZsh() {
  const commandSpecs = topLevelCommands.map(([name, description]) => `${name}:${description}`);
  return `#compdef agentloop agentloopkit
# AgentLoopKit zsh completion
# Save with: agentloop completion zsh > ~/.zsh/completions/_agentloop

_agentloop() {
  local context state line
  typeset -A opt_args

  _arguments -C \\
    '1:command:->commands' \\
    '*::arg:->args'

  case "$state" in
    commands)
      _describe 'agentloop command' commandSpecs
      ;;
    args)
      case "$words[2]" in
        task)
          if [[ "$words[3]" == "status" && CURRENT -eq 5 ]]; then
            _values 'task status' ${taskStatuses.map((status) => `"${status}"`).join(' ')}
          else
            _describe 'task command' taskCommandSpecs
          fi
          ;;
        policy)
          _describe 'policy command' policyCommandSpecs
          ;;
        install-agent)
          _values 'agent' ${agentNames.map((agent) => `"${agent}"`).join(' ')}
          ;;
        completion)
          _values 'shell' ${COMPLETION_SHELLS.map((shell) => `"${shell}"`).join(' ')}
          ;;
      esac
      ;;
  esac
}

commandSpecs=(
${commandSpecs.map((spec) => `  '${spec}'`).join('\n')}
)

taskCommandSpecs=(
${taskCommandSpecs.map(([name, description]) => `  '${name}:${description}'`).join('\n')}
)

policyCommandSpecs=(
${policyCommandSpecs.map(([name, description]) => `  '${name}:${description}'`).join('\n')}
)

_agentloop "$@"
`;
}

function fishLine(command: string, args: string[], description: string) {
  return `complete -c agentloop -n '${command}' -a '${args.join(' ')}' -d '${description}'`;
}

function renderFish() {
  const topCommands = topLevelCommands.map(([name]) => name);
  return `# AgentLoopKit fish completion
# Save with: agentloop completion fish > ~/.config/fish/completions/agentloop.fish

complete -c agentloop -f
complete -c agentloopkit -f
${fishLine('__fish_use_subcommand', topCommands, 'AgentLoopKit command')}
complete -c agentloop -n '__fish_seen_subcommand_from task' -a '${taskCommands.join(' ')}' -d 'Task command'
complete -c agentloop -n '__fish_seen_subcommand_from policy' -a '${policyCommands.join(' ')}' -d 'Policy command'
complete -c agentloop -n '__fish_seen_subcommand_from status' -a '${taskStatuses.join(' ')}' -d 'Task status'
complete -c agentloop -n '__fish_seen_subcommand_from install-agent' -a '${agentNames.join(' ')}' -d 'Agent name'
complete -c agentloop -n '__fish_seen_subcommand_from completion' -a '${COMPLETION_SHELLS.join(' ')}' -d 'Shell'
complete -c agentloopkit -n '__fish_use_subcommand' -a '${topCommands.join(' ')}' -d 'AgentLoopKit command'
complete -c agentloopkit -n '__fish_seen_subcommand_from task' -a '${taskCommands.join(' ')}' -d 'Task command'
complete -c agentloopkit -n '__fish_seen_subcommand_from policy' -a '${policyCommands.join(' ')}' -d 'Policy command'
complete -c agentloopkit -n '__fish_seen_subcommand_from status' -a '${taskStatuses.join(' ')}' -d 'Task status'
complete -c agentloopkit -n '__fish_seen_subcommand_from install-agent' -a '${agentNames.join(' ')}' -d 'Agent name'
complete -c agentloopkit -n '__fish_seen_subcommand_from completion' -a '${COMPLETION_SHELLS.join(' ')}' -d 'Shell'
`;
}

function powerShellArray(values: readonly string[]) {
  return `@(${values.map((value) => `'${value}'`).join(', ')})`;
}

function renderPowerShell() {
  const topCommands = topLevelCommands.map(([name]) => name);
  return `# AgentLoopKit PowerShell completion
# Save with: agentloop completion powershell > agentloop-completion.ps1
# Review the script before dot-sourcing it from your PowerShell startup file.

$AgentLoopCommands = ${powerShellArray(topCommands)}
$AgentLoopTaskCommands = ${powerShellArray(taskCommands)}
$AgentLoopPolicyCommands = ${powerShellArray(policyCommands)}
$AgentLoopTaskStatuses = ${powerShellArray(taskStatuses)}
$AgentLoopAgents = ${powerShellArray(agentNames)}
$AgentLoopShells = ${powerShellArray(COMPLETION_SHELLS)}

Register-ArgumentCompleter -Native -CommandName agentloop, agentloopkit -ScriptBlock {
  param($wordToComplete, $commandAst, $cursorPosition)

  $words = @($commandAst.CommandElements | ForEach-Object { $_.Extent.Text })
  $prefix = if ($null -eq $wordToComplete) { '' } else { $wordToComplete }
  $values = $AgentLoopCommands

  if ($words.Count -gt 1) {
    switch ($words[1]) {
      'task' {
        if ($words.Count -gt 2 -and $words[2] -eq 'status') {
          $values = $AgentLoopTaskStatuses
        } else {
          $values = $AgentLoopTaskCommands
        }
      }
      'policy' { $values = $AgentLoopPolicyCommands }
      'install-agent' { $values = $AgentLoopAgents }
      'completion' { $values = $AgentLoopShells }
    }
  }

  $values |
    Where-Object { $_.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase) } |
    ForEach-Object { [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_) }
}
`;
}

export function renderCompletionScript(shell: string) {
  switch (parseShell(shell)) {
    case 'bash':
      return renderBash();
    case 'zsh':
      return renderZsh();
    case 'fish':
      return renderFish();
    case 'powershell':
    case 'pwsh':
      return renderPowerShell();
  }
}
