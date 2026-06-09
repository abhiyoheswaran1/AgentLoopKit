export const PRODUCT_NAME = 'AgentLoopKit';
export const PACKAGE_NAME = 'agentloopkit';
export const CLI_NAME = 'agentloop';
export const TAGLINE = 'A drop-in engineering loop for coding agents.';
export const CONFIG_FILE = 'agentloop.config.json';
export const AGENTLOOP_DIR = '.agentloop';
export const AGENTS_FILE = 'AGENTS.md';
export const AGENTLOOP_FILE = 'AGENTLOOP.md';

export const LOOP_STEPS = [
  'Specify',
  'Constrain',
  'Plan',
  'Implement',
  'Verify',
  'Review',
  'Handoff',
] as const;

export const TEMPLATE_GROUPS = [
  'loops',
  'gates',
  'handoffs',
  'agents',
  'policies',
  'tasks',
  'harness',
] as const;

export const SUPPORTED_AGENTS = [
  'codex',
  'claude-code',
  'cursor',
  'opencode',
  'gemini-cli',
  'github-copilot-cli',
  'generic',
] as const;

export const TASK_TYPES = [
  'feature',
  'bugfix',
  'refactor',
  'tests',
  'docs',
  'release',
  'security-review',
  'dependency-upgrade',
  'migration',
] as const;

export const DEFAULT_COMMAND_KEYS = ['test', 'lint', 'typecheck', 'build', 'format'] as const;
