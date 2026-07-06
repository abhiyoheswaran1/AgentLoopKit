import { Command } from 'commander';
import { loadAgentLoopWorkspace } from '../../core/config.js';
import { AgentLoopError, ConfigError } from '../../core/errors.js';
import { checkGates } from '../../core/check-gates.js';
import { printAgentLoopJsonError } from '../json-errors.js';
import { evaluateAgentFlightResult } from '../../core/baseframe.js';
import { inlineCode } from '../../core/markdown-format.js';

function renderAgentFlightGateMarkdown(result: Awaited<ReturnType<typeof evaluateAgentFlightResult>>) {
  const gateLines = result.updatedContract.verificationGates
    .map(
      (gate) =>
        `- [${inlineCode(gate.status)}] ${inlineCode(gate.command)}: ${inlineCode(gate.reason)}${
          gate.required ? ' required' : ' optional'
        }`,
    )
    .join('\n');
  const agentFlightRisks = result.updatedContract.risks.filter((risk) =>
    risk.id.startsWith('AF-'),
  );
  const riskLines = agentFlightRisks.length
    ? agentFlightRisks
        .map((risk) => `- [${inlineCode(risk.severity)}] ${inlineCode(risk.message)}`)
        .join('\n')
    : '- None.';
  const contractPath = `.baseframe/evidence/${result.updatedContract.taskId}/agentloopkit-task.json`;
  const nextAction = result.gatesPassed
    ? 'Required AgentFlight verification gates passed. Keep the native AgentLoopKit task open until human review and handoff are complete.'
    : 'Resolve failed, missing, incomplete, or drifting AgentFlight evidence before treating the task as ready for review.';

  return `# AgentLoopKit AgentFlight Gates

- Gates passed: ${inlineCode(String(result.gatesPassed))}
- Task: ${inlineCode(result.updatedContract.taskId)}
- Contract: ${inlineCode(contractPath)}

## Verification Gates

${gateLines}

## AgentFlight Findings

${riskLines}

## Next Action

${nextAction}
`;
}

export function checkGatesCommand() {
  return new Command('check-gates')
    .description('Check whether task, verification, handoff, harness, policy, and git gates pass')
    .option('--json', 'print machine-readable output')
    .option('--strict', 'treat warning gates as failures')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .option(
      '--baseframe-task-id <task-id>',
      'Baseframe task ID when reconciling AgentFlight results',
    )
    .option('--from-agentflight <path>', 'reconcile gates from an AgentFlight result artifact')
    .action(async (options: {
      json?: boolean;
      strict?: boolean;
      redactPaths?: boolean;
      baseframeTaskId?: string;
      fromAgentflight?: string;
      fromAgentFlight?: string;
    }) => {
      let workspace: Awaited<ReturnType<typeof loadAgentLoopWorkspace>>;
      try {
        workspace = await loadAgentLoopWorkspace(process.cwd());
      } catch (error) {
        if (options.json && error instanceof ConfigError) {
          printAgentLoopJsonError(error);
          return;
        }
        throw error;
      }
      const fromAgentFlight = options.fromAgentflight ?? options.fromAgentFlight;
      if (fromAgentFlight) {
        if (!options.baseframeTaskId) {
          const error = new AgentLoopError(
            '--baseframe-task-id is required with --from-agentflight.',
            'BASEFRAME_TASK_ID_REQUIRED',
          );
          if (options.json) {
            printAgentLoopJsonError(error);
            return;
          }
          throw error;
        }
        try {
          const result = await evaluateAgentFlightResult({
            cwd: workspace.cwd,
            taskId: options.baseframeTaskId,
            resultPath: fromAgentFlight,
          });
          if (options.json) {
            console.log(JSON.stringify(result, null, 2));
          } else {
            console.log(renderAgentFlightGateMarkdown(result));
          }
          if (!result.gatesPassed) process.exitCode = 1;
          return;
        } catch (error) {
          if (options.json && error instanceof AgentLoopError) {
            printAgentLoopJsonError(error);
            return;
          }
          throw error;
        }
      }
      const result = await checkGates({
        cwd: workspace.cwd,
        config: workspace.config,
        strict: options.strict,
        redactPaths: options.redactPaths === true,
      });
      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(result.markdown);
      }
      if (result.overallStatus === 'fail') process.exitCode = 1;
    });
}
