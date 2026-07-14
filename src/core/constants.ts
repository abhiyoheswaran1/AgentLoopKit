export const PRODUCT_NAME = 'AgentLoopKit';
export const PACKAGE_NAME = 'agentloopkit';
export const CLI_NAME = 'agentloop';
export const TAGLINE = 'A drop-in engineering loop for software agents.';
export const CONFIG_FILE = 'agentloop.config.json';
export const AGENTLOOP_DIR = '.agentloop';
export const AGENTLOOP_MANIFEST_FILE = '.agentloop/manifest.json';
export const CURRENT_TEMPLATE_VERSION = 2;
export const AGENTS_FILE = 'AGENTS.md';
export const AGENTLOOP_FILE = 'AGENTLOOP.md';
export const AGENTLOOP_GITIGNORE_FILE = '.agentloop/.gitignore';
// Per-machine harness state the CLI regenerates; kept out of git. The .gitignore
// body and the already-tracked check both read this one list so they never drift.
export const AGENTLOOP_PER_MACHINE_PATTERNS = ['state.json', 'loops/*/', 'runs/'] as const;

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
  'test-generation',
  'research',
  'docs',
  'release',
  'security-review',
  'dependency-upgrade',
  'migration',
] as const;

export const DEFAULT_COMMAND_KEYS = ['test', 'lint', 'typecheck', 'build', 'format'] as const;
