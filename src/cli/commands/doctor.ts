import { Command } from 'commander';
import { resolveAgentLoopWorkspaceCwd } from '../../core/config.js';
import { runDoctor } from '../../core/doctor.js';

export function doctorCommand() {
  return new Command('doctor')
    .description('Check whether this repo is ready for agentic engineering')
    .option('--json', 'print machine-readable output')
    .option('--strict', 'treat warnings as failures')
    .option('--advisory', 'print diagnostics without failing the process')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .action(
      async (options: {
        json?: boolean;
        strict?: boolean;
        advisory?: boolean;
        redactPaths?: boolean;
      }) => {
        const cwd = await resolveAgentLoopWorkspaceCwd(process.cwd());
        const result = await runDoctor({
          cwd,
          strict: options.strict,
          advisory: options.advisory === true,
          redactPaths: options.redactPaths === true,
        });
        if (options.json) {
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log(result.markdown);
        }
        if (!options.advisory && result.overallStatus === 'fail') process.exitCode = 1;
      },
    );
}
