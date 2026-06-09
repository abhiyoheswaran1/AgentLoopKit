export class AgentLoopError extends Error {
  constructor(
    message: string,
    public readonly code = 'AGENTLOOP_ERROR',
  ) {
    super(message);
    this.name = 'AgentLoopError';
  }
}

export class ConfigError extends AgentLoopError {
  constructor(message: string) {
    super(message, 'CONFIG_ERROR');
    this.name = 'ConfigError';
  }
}
