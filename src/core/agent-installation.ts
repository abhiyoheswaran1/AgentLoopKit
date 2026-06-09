import path from 'node:path';
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
  const agentFilePath = path.join(options.cwd, '.agentloop', 'agents', `${options.agent}.md`);
  const content = await readTemplate(`agents/${options.agent}.md`, {
    agentName: displayNames[options.agent],
  });
  await writeTextFile(agentFilePath, content);

  const agentsPath = path.join(options.cwd, 'AGENTS.md');
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
