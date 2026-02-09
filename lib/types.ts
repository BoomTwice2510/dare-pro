export enum DareStatus {
  Open = 0,
  Running = 1,
  ProofSubmitted = 2,
  Disputed = 3,
  Resolved = 4,
  Cancelled = 5,
}

export enum Badge {
  NONE = 0,
  BRONZE = 1,
  SILVER = 2,
  GOLD = 3,
}

export interface Dare {
  id: number;
  creator: string;
  accepter: string;
  description: string;
  token: string;
  stake: bigint;
  createdAt: number;
  deadline: number;
  accepted: boolean;
  proofSubmitted: boolean;
  proofURI: string;
  proofTime: number;
  resolved: boolean;
  status: DareStatus;
}

export const STATUS_LABELS: Record<DareStatus, string> = {
  [DareStatus.Open]: 'Open',
  [DareStatus.Running]: 'Running',
  [DareStatus.ProofSubmitted]: 'Proof Submitted',
  [DareStatus.Disputed]: 'Disputed',
  [DareStatus.Resolved]: 'Resolved',
  [DareStatus.Cancelled]: 'Cancelled',
};

export const BADGE_LABELS: Record<Badge, string> = {
  [Badge.NONE]: 'None',
  [Badge.BRONZE]: 'Bronze',
  [Badge.SILVER]: 'Silver',
  [Badge.GOLD]: 'Gold',
};
