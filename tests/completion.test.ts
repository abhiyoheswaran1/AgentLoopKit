import path from 'node:path';
import { execa } from 'execa';
import { describe, expect, test } from 'vitest';
import { TASK_TYPES } from '../src/core/constants.js';
import { renderCompletionScript } from '../src/core/completions.js';
import { releaseProofChannelIds } from '../src/core/release-proof.js';
import { artifactInventoryTypes } from '../src/core/artifacts.js';
import { BADGE_SOURCES } from '../src/core/badge.js';
import { TASK_STATUSES } from '../src/core/task-state.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

describe('completion scripts', () => {
  const artifactTypes = artifactInventoryTypes.join(' ');
  const badgeSources = BADGE_SOURCES.join(' ');
  const outputFormats = 'markdown json';
  const archiveStatuses = 'done';
  const releaseProofChannels = releaseProofChannelIds.join(' ');
  const taskStatuses = TASK_STATUSES.join(' ');

  test('renders zsh completions for commands, task statuses, and agent names', () => {
    const script = renderCompletionScript('zsh');

    expect(script).toContain('#compdef agentloop agentloopkit');
    expect(script).toContain('report:Write a local HTML evidence report');
    expect(script).toContain('badge:Write a local SVG evidence badge');
    expect(script).toContain('ci-summary:Summarize CI context and AgentLoop evidence');
    expect(script).toContain('release-notes:Generate deterministic release notes');
    expect(script).toContain('npm-status:Check npm registry catch-up status');
    expect(script).toContain('next:Show the next recommended loop action');
    expect(script).toContain('policy:List or inspect local AgentLoopKit policies');
    expect(script).toContain('show:Show a local policy');
    expect(script).toContain('status:Show local policy template status');
    expect(script).toContain('packs:List policy packs');
    expect(script).toContain('pack:Inspect or apply a policy pack');
    expect(script).toContain('task:List, inspect, update, complete, or archive task contracts');
    expect(script).toContain('doctor:Check task folder hygiene');
    expect(script).toContain('status:Update a task contract status');
    expect(script).toContain('done:Mark a task contract done');
    expect(script).toContain('in-progress');
    expect(script).toContain('deferred');
    expect(script).toContain("_values 'task type'");
    expect(script).toContain("_values 'release proof channel'");
    expect(script).toContain("_values 'artifact type'");
    expect(script).toContain("_values 'badge source'");
    expect(script).toContain("_values 'output format'");
    expect(script).toContain("_values 'task list status'");
    expect(script).toContain('_values \'archive status\' "done"');
    expect(script).toContain('"research"');
    for (const type of TASK_TYPES) {
      expect(script).toContain(`"${type}"`);
    }
    for (const type of artifactInventoryTypes) {
      expect(script).toContain(`"${type}"`);
    }
    for (const source of BADGE_SOURCES) {
      expect(script).toContain(`"${source}"`);
    }
    for (const channel of releaseProofChannelIds) {
      expect(script).toContain(`"${channel}"`);
    }
    expect(script).toContain('claude-code');
    expect(script).toContain('github-copilot-cli');
  });

  test('renders bash completions for nested task and install-agent values', () => {
    const script = renderCompletionScript('bash');

    expect(script).toContain('_agentloop_completion()');
    expect(script).toContain('COMPREPLY');
    expect(script).toContain('ci-summary');
    expect(script).toContain('release-notes');
    expect(script).toContain('npm-status');
    expect(script).toContain('next');
    expect(script).toContain('list show set status done archive current clear doctor');
    expect(script).toContain('compgen -W "list show status packs pack"');
    expect(script).toContain(`compgen -W "${TASK_TYPES.join(' ')}"`);
    expect(script).toContain('research');
    expect(script).toContain(`compgen -W "${artifactTypes}"`);
    expect(script).toContain(`compgen -W "${badgeSources}"`);
    expect(script).toContain(`compgen -W "${outputFormats}"`);
    expect(script).toContain(`compgen -W "${releaseProofChannels}"`);
    expect(script).toContain(`compgen -W "${taskStatuses}"`);
    expect(script).toContain('list)\n          if [[ "$previous" == "--status" ]]');
    expect(script).toContain(`compgen -W "${archiveStatuses}"`);
    expect(script).toContain(
      'codex claude-code cursor opencode gemini-cli github-copilot-cli generic all',
    );
  });

  test('renders fish completions without mutating shell config', () => {
    const script = renderCompletionScript('fish');

    expect(script).toContain('complete -c agentloop');
    expect(script).toContain("complete -c agentloop -n '__fish_seen_subcommand_from task'");
    expect(script).toContain("complete -c agentloop -n '__fish_seen_subcommand_from policy'");
    expect(script).toContain(
      "complete -c agentloop -n '__fish_seen_subcommand_from policy' -a 'list show status packs pack'",
    );
    expect(script).toContain("complete -c agentloop -n '__fish_seen_subcommand_from create-task'");
    expect(script).toContain(`-a '${TASK_TYPES.join(' ')}'`);
    expect(script).toContain('research');
    expect(script).toContain(
      `complete -c agentloop -n '__fish_seen_subcommand_from release-proof' -a '${releaseProofChannels}'`,
    );
    expect(script).toContain(
      `complete -c agentloopkit -n '__fish_seen_subcommand_from release-proof' -a '${releaseProofChannels}'`,
    );
    expect(script).toContain(
      `complete -c agentloop -n '__fish_seen_subcommand_from artifacts' -a '${artifactTypes}'`,
    );
    expect(script).toContain(
      `complete -c agentloop -n '__fish_seen_subcommand_from badge' -a '${badgeSources}'`,
    );
    expect(script).toContain(
      `complete -c agentloop -n '__fish_seen_subcommand_from summarize' -a '${outputFormats}'`,
    );
    expect(script).toContain(
      `complete -c agentloopkit -n '__fish_seen_subcommand_from handoff' -a '${outputFormats}'`,
    );
    expect(script).toContain(
      `complete -c agentloop -n '__fish_seen_subcommand_from task; and __fish_seen_subcommand_from list' -l status -a '${taskStatuses}'`,
    );
    expect(script).toContain(
      `complete -c agentloopkit -n '__fish_seen_subcommand_from task; and __fish_seen_subcommand_from list' -l status -a '${taskStatuses}'`,
    );
    expect(script).toContain(
      `complete -c agentloop -n '__fish_seen_subcommand_from task; and __fish_seen_subcommand_from archive' -l status -a '${archiveStatuses}'`,
    );
    expect(script).toContain(
      `complete -c agentloopkit -n '__fish_seen_subcommand_from task; and __fish_seen_subcommand_from archive' -l status -a '${archiveStatuses}'`,
    );
    expect(script).not.toContain(
      `complete -c agentloop -n '__fish_seen_subcommand_from archive' -l status -a '${archiveStatuses}'`,
    );
    expect(script).not.toContain(
      `complete -c agentloopkit -n '__fish_seen_subcommand_from archive' -l status -a '${archiveStatuses}'`,
    );
    expect(script).toContain('review');
    expect(script).not.toContain('config.fish');
  });

  test('renders PowerShell completions for commands, nested values, and aliases', () => {
    const script = renderCompletionScript('powershell');
    const aliasScript = renderCompletionScript('pwsh');

    expect(script).toContain('# AgentLoopKit PowerShell completion');
    expect(script).toContain(
      'Register-ArgumentCompleter -Native -CommandName agentloop, agentloopkit',
    );
    expect(script).toContain("'ci-summary'");
    expect(script).toContain("'release-notes'");
    expect(script).toContain("'npm-status'");
    expect(script).toContain("'task'");
    expect(script).toContain("'done'");
    expect(script).toContain("'archive'");
    expect(script).toContain("'doctor'");
    expect(script).toContain("'policy'");
    expect(script).toContain("'status'");
    expect(script).toContain("'in-progress'");
    expect(script).toContain("'deferred'");
    expect(script).toContain('$AgentLoopTaskTypes');
    expect(script).toContain('$AgentLoopArtifactTypes');
    expect(script).toContain('$AgentLoopBadgeSources');
    expect(script).toContain('$AgentLoopOutputFormats');
    expect(script).toContain('$AgentLoopArchiveStatuses');
    expect(script).toContain("$words[2] -eq 'list'");
    expect(script).toContain('$AgentLoopReleaseProofChannels');
    for (const type of TASK_TYPES) {
      expect(script).toContain(`'${type}'`);
    }
    for (const type of artifactInventoryTypes) {
      expect(script).toContain(`'${type}'`);
    }
    for (const source of BADGE_SOURCES) {
      expect(script).toContain(`'${source}'`);
    }
    for (const channel of releaseProofChannelIds) {
      expect(script).toContain(`'${channel}'`);
    }
    expect(script).toContain("'claude-code'");
    expect(script).toContain("'github-copilot-cli'");
    expect(script).toContain("'powershell'");
    expect(script).toContain("'pwsh'");
    expect(script).not.toContain('$PROFILE');
    expect(aliasScript).toBe(script);
  });

  test('rejects unsupported shells', () => {
    expect(() => renderCompletionScript('nushell')).toThrow('Unsupported shell');
  });
});

describe('completion command', () => {
  test('prints a zsh completion script from the CLI', async () => {
    const result = await execa(tsxPath, [cliPath, 'completion', 'zsh']);

    expect(result.stdout).toContain('#compdef agentloop agentloopkit');
    expect(result.stdout).toContain('install-agent');
  });

  test('prints a PowerShell completion script from the CLI', async () => {
    const result = await execa(tsxPath, [cliPath, 'completion', 'powershell']);

    expect(result.stdout).toContain('Register-ArgumentCompleter');
    expect(result.stdout).toContain('agentloopkit');
  });

  test('prints PowerShell completions from the pwsh alias', async () => {
    const result = await execa(tsxPath, [cliPath, 'completion', 'pwsh']);

    expect(result.stdout).toContain('$AgentLoopShells');
    expect(result.stdout).toContain("'powershell'");
    expect(result.stdout).toContain("'pwsh'");
  });

  test('fails clearly for unsupported shells from the CLI', async () => {
    const result = await execa(tsxPath, [cliPath, 'completion', 'nushell'], {
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Unsupported shell');
  });
});
