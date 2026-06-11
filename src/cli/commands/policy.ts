import { Command } from 'commander';
import {
  PolicyDirectoryMissingError,
  getPolicyStatus,
  listPolicies,
  PolicyNotFoundError,
  readPolicy,
} from '../../core/policy.js';
import { inlineCode } from '../../core/markdown-format.js';
import type { ListedPolicy, PolicyDocument, PolicyStatusReport } from '../../core/policy.js';
import { loadWorkspaceForJsonCommand } from '../json-errors.js';

function printJsonError(error: Error & { code?: string }, details: Record<string, unknown> = {}) {
  console.log(
    JSON.stringify(
      {
        error: {
          code: error.code ?? 'AGENTLOOP_ERROR',
          message: error.message,
          ...details,
        },
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
}

function printMissingPolicyDirectoryError(error: unknown, options: { json?: boolean }) {
  if (options.json && error instanceof PolicyDirectoryMissingError) {
    printJsonError(error, {
      policiesDir: error.policiesDir,
      nextCommand: error.nextCommand,
    });
    return true;
  }
  return false;
}

function printPolicyList(policies: ListedPolicy[], options: { json?: boolean }) {
  if (options.json) {
    console.log(JSON.stringify({ policies }, null, 2));
    return;
  }

  if (policies.length === 0) {
    console.log('No AgentLoopKit policies found.');
    console.log('Run `agentloop init` to generate .agentloop/policies/.');
    return;
  }

  console.log('AgentLoopKit policies:');
  for (const policy of policies) {
    console.log(`- ${inlineCode(policy.title)}`);
    console.log(`  ${inlineCode(policy.path)}`);
  }
}

function printPolicy(policy: PolicyDocument, options: { json?: boolean }) {
  if (options.json) {
    console.log(JSON.stringify({ policy }, null, 2));
    return;
  }

  process.stdout.write(policy.content);
}

function printPolicyStatus(report: PolicyStatusReport, options: { json?: boolean }) {
  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log('AgentLoopKit policy status:');
  console.log(
    `Summary: ${report.summary.current} current, ${report.summary.modified} modified, ${report.summary.missing} missing, ${report.summary.extra} extra`,
  );

  for (const policy of report.policies) {
    console.log(`- ${inlineCode(policy.status)}: ${inlineCode(policy.title)}`);
    console.log(`  ${inlineCode(policy.path)}`);
  }

  const hasDrift =
    report.summary.modified > 0 || report.summary.missing > 0 || report.summary.extra > 0;
  if (hasDrift) {
    console.log('');
    console.log('Next step: review policy differences before changing repo rules.');
  }
}

export function policyCommand() {
  const command = new Command('policy').description('List or inspect local AgentLoopKit policies');

  command
    .command('list')
    .description('List local policies under .agentloop/policies')
    .option('--json', 'print machine-readable output')
    .action(async (options: { json?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      let policies: ListedPolicy[];
      try {
        policies = await listPolicies({ cwd: workspace.cwd, config: workspace.config });
      } catch (error) {
        if (printMissingPolicyDirectoryError(error, options)) return;
        throw error;
      }
      printPolicyList(policies, options);
    });

  command
    .command('status')
    .description('Show local policy template status')
    .option('--json', 'print machine-readable output')
    .action(async (options: { json?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      let status: PolicyStatusReport;
      try {
        status = await getPolicyStatus({ cwd: workspace.cwd, config: workspace.config });
      } catch (error) {
        if (printMissingPolicyDirectoryError(error, options)) return;
        throw error;
      }
      printPolicyStatus(status, options);
    });

  command
    .command('show')
    .argument('<policy>', 'policy name, such as security or security-policy.md')
    .description('Show a local policy')
    .option('--json', 'print machine-readable output')
    .action(async (policyName: string, options: { json?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      let policy: PolicyDocument;
      try {
        policy = await readPolicy({ cwd: workspace.cwd, config: workspace.config, policyName });
      } catch (error) {
        if (printMissingPolicyDirectoryError(error, options)) return;
        if (options.json && error instanceof PolicyNotFoundError) {
          printJsonError(error, {
            requestedPolicy: error.requestedPolicy,
            availablePolicies: error.availablePolicies,
          });
          return;
        }
        throw error;
      }
      printPolicy(policy, options);
    });

  return command;
}
