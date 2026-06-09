import { Command } from 'commander';
import { loadAgentLoopConfig } from '../../core/config.js';
import { listPolicies, readPolicy } from '../../core/policy.js';
import type { ListedPolicy, PolicyDocument } from '../../core/policy.js';

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
    console.log(`- ${policy.title}`);
    console.log(`  ${policy.path}`);
  }
}

function printPolicy(policy: PolicyDocument, options: { json?: boolean }) {
  if (options.json) {
    console.log(JSON.stringify({ policy }, null, 2));
    return;
  }

  process.stdout.write(policy.content);
}

export function policyCommand() {
  const command = new Command('policy').description('List or inspect local AgentLoopKit policies');

  command
    .command('list')
    .description('List local policies under .agentloop/policies')
    .option('--json', 'print machine-readable output')
    .action(async (options: { json?: boolean }) => {
      const config = await loadAgentLoopConfig(process.cwd());
      const policies = await listPolicies({ cwd: process.cwd(), config });
      printPolicyList(policies, options);
    });

  command
    .command('show')
    .argument('<policy>', 'policy name, such as security or security-policy.md')
    .description('Show a local policy')
    .option('--json', 'print machine-readable output')
    .action(async (policyName: string, options: { json?: boolean }) => {
      const config = await loadAgentLoopConfig(process.cwd());
      const policy = await readPolicy({ cwd: process.cwd(), config, policyName });
      printPolicy(policy, options);
    });

  return command;
}
