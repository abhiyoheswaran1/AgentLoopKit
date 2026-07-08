import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { Command } from 'commander';
import { resolveAgentLoopWorkspaceCwd } from '../../core/config.js';
import { AgentLoopError } from '../../core/errors.js';
import { resolvesInsidePath, writeTextFile } from '../../core/file-system.js';
import {
  analyzeContract,
  hasBlockingSoftSpots,
  renderSoftSpotsText,
  toHardenJson,
} from '../../core/harden.js';
import { applyResolution } from '../../core/harden-resolve.js';
import { getActiveTaskPath } from '../../core/task-state.js';
import { loadWorkspaceForJsonCommand } from '../json-errors.js';

type ResolveWorkspaceResult = { contractPath: string } | undefined;

async function resolveContractPath(
  taskArg: string | undefined,
  options: { json?: boolean },
): Promise<ResolveWorkspaceResult> {
  if (taskArg) {
    const cwd = process.cwd();
    const absolutePath = path.resolve(cwd, taskArg);
    // An explicit [task] path is otherwise spliced straight into a read +
    // write-back (applyResolution + writeTextFile) with no containment
    // check, so `agentloop harden ../outside/victim.md ...` could read/
    // overwrite any file outside the repo. Require it to stay inside the
    // repo root, mirroring how `verify`/`create-task` validate an explicit
    // --task/--out path via resolveExplicitArtifactPath.
    const repoRoot = await resolveAgentLoopWorkspaceCwd(cwd);
    if (!resolvesInsidePath(repoRoot, absolutePath)) {
      throw new AgentLoopError(
        `Task contract path must stay inside the repo (${repoRoot}): ${taskArg}`,
        'HARDEN_TASK_PATH_OUTSIDE_REPO',
      );
    }
    return { contractPath: absolutePath };
  }

  const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json === true);
  if (!workspace) return undefined;

  const activeTaskPath = await getActiveTaskPath({
    cwd: workspace.cwd,
    config: workspace.config,
  });
  if (!activeTaskPath) {
    throw new AgentLoopError('No task specified and no active task set.', 'HARDEN_NO_TASK');
  }
  return { contractPath: activeTaskPath };
}

export function hardenCommand() {
  return new Command('harden')
    .description('Interrogate a task contract for unresolved soft spots before work starts.')
    .argument('[task]', 'path to the task contract; defaults to the active task')
    .option('--json', 'print machine-readable output')
    .option('--resolve <id>', 'soft-spot id to resolve (repeatable)', (v: string, acc: string[]) => [
      ...acc,
      v,
    ], [] as string[])
    .option(
      '--answer <text>',
      'resolution text (repeatable, paired with --resolve)',
      (v: string, acc: string[]) => [...acc, v],
      [] as string[],
    )
    .action(
      async (
        task: string | undefined,
        options: { json?: boolean; resolve?: string[]; answer?: string[] },
      ) => {
        const resolved = await resolveContractPath(task, { json: options.json === true });
        if (!resolved) return;
        const { contractPath } = resolved;

        let markdown: string;
        try {
          markdown = await readFile(contractPath, 'utf8');
        } catch {
          throw new AgentLoopError(
            `Task contract not found: ${contractPath}`,
            'HARDEN_CONTRACT_NOT_FOUND',
          );
        }

        const ids = options.resolve ?? [];
        const answers = options.answer ?? [];
        if (ids.length !== answers.length) {
          throw new AgentLoopError(
            'Each --resolve <id> needs a matching --answer <text>.',
            'HARDEN_RESOLVE_MISMATCH',
          );
        }
        for (let i = 0; i < ids.length; i += 1) {
          markdown = applyResolution(markdown, ids[i], answers[i]);
        }
        if (ids.length > 0) {
          await writeTextFile(contractPath, markdown);
        }

        const spots = analyzeContract(markdown);
        if (options.json) {
          console.log(JSON.stringify(toHardenJson(spots), null, 2));
        } else {
          console.log(renderSoftSpotsText(spots));
        }
        if (hasBlockingSoftSpots(spots)) {
          process.exitCode = 1;
        }
      },
    );
}
