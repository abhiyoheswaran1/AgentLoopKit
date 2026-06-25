export type RunCommand = 'ship' | 'verify' | 'handoff';

export type RunMetadata = {
  id: string;
  command: RunCommand;
  createdAt: string;
  createdAtEpochMs?: number;
  task: {
    path: string;
    title: string;
    status: string;
  } | null;
  verificationReportPath?: string;
  shipReportPath?: string;
  handoffPath?: string;
  score?: number;
  overallStatus?: string;
  changedFileCount: number;
};

export type RunSummary = Pick<
  RunMetadata,
  | 'id'
  | 'command'
  | 'createdAt'
  | 'task'
  | 'score'
  | 'overallStatus'
  | 'changedFileCount'
  | 'verificationReportPath'
  | 'shipReportPath'
  | 'handoffPath'
>;
