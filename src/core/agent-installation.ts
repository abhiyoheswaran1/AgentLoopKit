import path from 'node:path';
import { resolveOutputArtifactPath } from './artifacts.js';
import { SUPPORTED_AGENTS } from './constants.js';
import { readTextIfExists, writeTextFile } from './file-system.js';
import { readTemplate } from './template-renderer.js';

export type SupportedAgent = (typeof SUPPORTED_AGENTS)[number];

export function isSupportedAgent(value: string): value is SupportedAgent {
  return (SUPPORTED_AGENTS as readonly string[]).includes(value);
}

const displayNames: Record<SupportedAgent, string> = {
  codex: 'Codex',
  'claude-code': 'Claude Code',
  cursor: 'Cursor',
  opencode: 'OpenCode',
  'gemini-cli': 'Gemini CLI',
  'github-copilot-cli': 'GitHub Copilot CLI',
  generic: 'Generic Coding Agent',
};

export async function installAgentInstructions(options: { cwd: string; agent: SupportedAgent }) {
  const agentFilePath = resolveOutputArtifactPath({
    cwd: options.cwd,
    artifactType: 'agent-instructions',
    requestedPath: path.join('.agentloop', 'agents', `${options.agent}.md`),
    expectedDir: path.join('.agentloop', 'agents'),
    expectedExtension: '.md',
  });
  const agentsPath = resolveOutputArtifactPath({
    cwd: options.cwd,
    artifactType: 'agents-md',
    requestedPath: 'AGENTS.md',
    expectedDir: '.',
    expectedExtension: '.md',
  });
  const content = await readTemplate(`agents/${options.agent}.md`, {
    agentName: displayNames[options.agent],
  });
  await writeTextFile(agentFilePath, content);

  const existing = await readTextIfExists(agentsPath);
  const marker = `<!-- agentloopkit-agent:${options.agent} -->`;
  if (!existing.includes(marker)) {
    const block = `

${marker}
## AgentLoopKit: ${displayNames[options.agent]}

- Agent instructions: .agentloop/agents/${options.agent}.md
- Read AGENTLOOP.md before changing code.
- Use task contracts, verification reports, and handoff summaries.
<!-- /agentloopkit-agent:${options.agent} -->
`;
    await writeTextFile(
      agentsPath,
      existing ? `${existing.trimEnd()}\n${block}` : block.trimStart(),
    );
  }

  return { agentFilePath, agentsPath };
}

export async function installAllAgentInstructions(options: { cwd: string }) {
  const results = [];
  for (const agent of SUPPORTED_AGENTS) {
    results.push(await installAgentInstructions({ cwd: options.cwd, agent }));
  }
  return results;
}
