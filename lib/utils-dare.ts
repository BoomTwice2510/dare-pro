import { Dare, DareStatus } from './types';

export function formatAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatTime(timestamp: number): string {
  // Handle both milliseconds and seconds
  const ms = timestamp > 1000000000000 ? timestamp : timestamp * 1000;
  const date = new Date(ms);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const ms = timestamp > 1000000000000 ? timestamp : timestamp * 1000;
  const diffMs = ms - now;
  const diffSecs = diffMs / 1000;

  if (diffMs < 0) {
    const absDiff = -diffSecs;
    if (absDiff < 60) return 'just now';
    if (absDiff < 3600) return `${Math.floor(absDiff / 60)}m ago`;
    if (absDiff < 86400) return `${Math.floor(absDiff / 3600)}h ago`;
    return `${Math.floor(absDiff / 86400)}d ago`;
  }

  if (diffSecs < 60) return 'in <1m';
  if (diffSecs < 3600) return `in ${Math.floor(diffSecs / 60)}m`;
  if (diffSecs < 86400) return `in ${Math.floor(diffSecs / 3600)}h`;
  return `in ${Math.floor(diffSecs / 86400)}d`;
}

export function formatStake(stake: bigint, decimals = 18): string {
  const divisor = BigInt(10 ** decimals);
  const whole = stake / divisor;
  const remainder = (stake % divisor).toString().padStart(decimals, '0');
  const trimmed = remainder.replace(/0+$/, '');

  if (trimmed === '') return whole.toString();
  return `${whole}.${trimmed}`;
}

export function isTokenETH(address: string): boolean {
  return address === '0x0000000000000000000000000000000000000000';
}

export function getTokenSymbol(address: string): string {
  return isTokenETH(address) ? 'ETH' : 'ERC20';
}

export function getDareActions(dare: Dare, walletAddress: string | undefined) {
  if (!walletAddress) return [];

  const isCreator = dare.creator.toLowerCase() === walletAddress.toLowerCase();
  const isAccepter = dare.accepter.toLowerCase() === walletAddress.toLowerCase();

  const now = Math.floor(Date.now() / 1000);
  const isExpired = now > dare.deadline;
  const isZeroAccepter =
    dare.accepter === '0x0000000000000000000000000000000000000000';

  const actions: {
    id: string;
    label: string;
    color: 'default' | 'success' | 'warning' | 'destructive';
  }[] = [];

  /* ======================
     OPEN STATE (FIXED)
  ====================== */

  if (dare.status === DareStatus.Open) {
    if (isCreator) {
      // ✅ deadline ke baad + no accepter → reclaim
      if (isExpired && isZeroAccepter) {
        actions.push({
          id: 'reclaim',
          label: 'Reclaim Stake',
          color: 'success',
        });
      } else {
        actions.push({
          id: 'cancel',
          label: 'Cancel Dare',
          color: 'destructive',
        });
      }
    } else {
      // ❌ accept sirf deadline se pehle
      if (!isExpired) {
        actions.push({
          id: 'accept',
          label: 'Accept Dare',
          color: 'success',
        });
      }
    }
  }

  /* ======================
     RUNNING STATE
  ====================== */

  if (dare.status === DareStatus.Running && isAccepter) {
    if (now >= dare.deadline) {
      actions.push({
        id: 'submit-proof',
        label: 'Submit Proof',
        color: 'default',
      });
    }
  }

  /* ======================
     PROOF SUBMITTED
  ====================== */

  if (dare.status === DareStatus.ProofSubmitted && isCreator) {
    actions.push(
      { id: 'approve-proof', label: 'Approve Proof', color: 'success' },
      { id: 'dispute-proof', label: 'Dispute Proof', color: 'warning' }
    );
  }

  if (dare.status === DareStatus.ProofSubmitted) {
    const confirmWindow = 24 * 60 * 60;
    if (now > dare.proofTime + confirmWindow) {
      actions.push({
        id: 'auto-resolve',
        label: 'Auto Resolve',
        color: 'default',
      });
    }
  }

  return actions;
}
