import { Command } from 'commander';
import {
  buildResumePack,
  RESUME_PACK_TARGETS,
  type ResumePackTarget,
} from '../../core/resume-pack.js';
import {
  CliOptionError,
  loadWorkspaceForJsonCommand,
  printAgentLoopJsonError,
} from '../json-errors.js';

function parseTarget(value: unknown): ResumePackTarget {
  const target = typeof value === 'string' && value.trim() ? value.trim() : 'generic';
  if ((RESUME_PACK_TARGETS as readonly string[]).includes(target)) {
    return target as ResumePackTarget;
  }
  throw new CliOptionError(`Unsupported resume-pack target: ${target}.`, 'RESUME_PACK_TARGET_INVALID', {
    option: 'for',
    value: target,
    supportedTargets: [...RESUME_PACK_TARGETS],
  });
}

export function resumePackCommand() {
  return new Command('resume-pack')
    .description('Generate a compact continuation brief from local AgentLoopKit evidence')
    .option('--for <target>', 'target reader: codex, claude, cursor, generic, or human', 'generic')
    .option('--json', 'print machine-readable output')
    .option(
      '--redact-paths',
      'redact local absolute paths in public output; resume-pack paths are repo-relative by default',
    )
    .action(async (options: { for?: string; json?: boolean; redactPaths?: boolean }) => {
      let target: ResumePackTarget;
      try {
        target = parseTarget(options.for);
      } catch (error) {
        if (options.json && error instanceof CliOptionError) {
          printAgentLoopJsonError(error);
          return;
        }
        throw error;
      }

      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      const result = await buildResumePack({
        cwd: workspace.cwd,
        config: workspace.config,
        target,
      });

      if (options.json) console.log(JSON.stringify(result, null, 2));
      else console.log(result.markdown);
    });
}
