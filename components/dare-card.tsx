'use client';

import { useState } from 'react';
import { Dare, DareStatus, STATUS_LABELS } from '@/lib/types';
import {
  formatAddress,
  formatStake,
  formatTime,
  getRelativeTime,
  getTokenSymbol,
  isTokenETH,
} from '@/lib/utils-dare';
import { useAccount, useWriteContract } from 'wagmi';
import { ProofSubmissionModal } from '@/components/proof-submission-modal';
import { glassStyles } from '@/lib/glass-styles';
import { DARE_CONTRACT_ADDRESS, DARE_CONTRACT_ABI } from '@/lib/web3-config';

interface DareCardProps {
  dare: Dare;
  onAction?: (action: string, dareId: number) => void;
  isLoading?: boolean;
  onTransactionComplete?: () => void;
}

/* =======================
   STATUS VISUAL SYSTEM
======================= */

const STATUS_UI: Record<
  number,
  {
    color: string;
    border: string;
    glow: string;
    animation?: string;
    subtitle: string;
  }
> = {
  0: {
    color: '#60a5fa',
    border: 'rgba(96,165,250,.4)',
    glow: '0 0 14px rgba(96,165,250,.6)',
    subtitle: 'Waiting for acceptance',
  },
  1: {
    color: '#06b6d4',
    border: 'rgba(6,182,212,.5)',
    glow: '0 0 22px rgba(6,182,212,.9)',
    animation: 'animate-pulse',
    subtitle: 'Challenge in progress',
  },
  2: {
    color: '#facc15',
    border: 'rgba(250,204,21,.5)',
    glow: '0 0 26px rgba(250,204,21,1)',
    animation: 'status-shimmer',
    subtitle: 'Proof submitted',
  },
  3: {
    color: '#ef4444',
    border: 'rgba(239,68,68,.5)',
    glow: '0 0 26px rgba(239,68,68,1)',
    animation: 'animate-pulse',
    subtitle: 'Dispute raised',
  },
  4: {
    color: '#22c55e',
    border: 'rgba(34,197,94,.5)',
    glow: '0 0 18px rgba(34,197,94,.8)',
    subtitle: 'Challenge completed',
  },
  5: {
    color: '#9ca3af',
    border: 'rgba(156,163,175,.4)',
    glow: 'none',
    subtitle: 'Cancelled',
  },
};

export function DareCard({
  dare,
  onAction,
  isLoading = false,
  onTransactionComplete,
}: DareCardProps) {
  const { address } = useAccount();
  const [showProofModal, setShowProofModal] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const status = STATUS_UI[dare.status];

  const isCreator =
    address && dare.creator.toLowerCase() === address.toLowerCase();
  const isAccepter =
    address && dare.accepter.toLowerCase() === address.toLowerCase();

  const isOpen = dare.status === DareStatus.Open;
  const isZeroAccepter =
    dare.accepter === '0x0000000000000000000000000000000000000000';

  const now = Math.floor(Date.now() / 1000);
  const isDeadlinePassed = now > dare.deadline;

  const glassLightStyle = {
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
  };

  return (
    <div
      className="rounded-2xl p-6 space-y-4 transition-all"
      style={{
        ...glassStyles.glassGold,
        boxShadow: status.glow,
        opacity: dare.status === DareStatus.Cancelled ? 0.55 : 1,
      }}
    >
      {/* HEADER */}
      <div className="flex justify-between gap-4">
        <div>
          <p className="text-[#d4af37] text-sm font-mono">#{dare.id}</p>
          <h3 className="text-xl font-bold text-white line-clamp-2">
            {dare.description}
          </h3>
        </div>

        <div className="text-right">
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-widest uppercase ${
              status.animation ?? ''
            }`}
            style={{
              color: status.color,
              border: `1px solid ${status.border}`,
              background: 'rgba(0,0,0,0.65)',
              boxShadow: status.glow,
            }}
          >
            {STATUS_LABELS[dare.status]}
          </span>
          <p className="text-xs mt-1 text-white/60">{status.subtitle}</p>
        </div>
      </div>

      {/* STAKE */}
      <div className="flex gap-4 text-sm">
        <div className="rounded-lg px-3 py-2" style={glassLightStyle}>
          <p className="text-white/60">Stake</p>
          <p className="text-[#d4af37] font-bold">
            {formatStake(dare.stake)} {getTokenSymbol(dare.token)}
          </p>
        </div>
        <div className="rounded-lg px-3 py-2" style={glassLightStyle}>
          <p className="text-white/60">Pool</p>
          <p className="text-white font-bold">
            {formatStake(dare.stake * 2n)} {getTokenSymbol(dare.token)}
          </p>
        </div>
      </div>

      {/* PARTICIPANTS */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg px-3 py-2" style={glassLightStyle}>
          <p className="text-white/60">Creator</p>
          <p className="text-white font-mono">
            {formatAddress(dare.creator, 6)}
          </p>
        </div>
        <div className="rounded-lg px-3 py-2" style={glassLightStyle}>
          <p className="text-white/60">Accepter</p>
          <p className="text-white font-mono">
            {isZeroAccepter ? 'Waiting…' : formatAddress(dare.accepter, 6)}
          </p>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg px-3 py-2" style={glassLightStyle}>
          <p className="text-white/60">Created</p>
          <p className="text-white">{formatTime(dare.createdAt)}</p>
          <p className="text-white/40">
            {getRelativeTime(dare.createdAt)}
          </p>
        </div>
        <div className="rounded-lg px-3 py-2" style={glassLightStyle}>
          <p className="text-white/60">Deadline</p>
          <p className="text-white">{formatTime(dare.deadline)}</p>
          <p className="text-white/40">
            {getRelativeTime(dare.deadline)}
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
        {/* ACCEPT (only before deadline) */}
        {isOpen && isZeroAccepter && !isCreator && !isDeadlinePassed && (
          <button
            onClick={async () => {
              setIsPending(true);
              await writeContractAsync({
                address: DARE_CONTRACT_ADDRESS,
                abi: DARE_CONTRACT_ABI,
                functionName: 'acceptDare',
                args: [BigInt(dare.id)],
                value: isTokenETH(dare.token) ? dare.stake : undefined,
              });
              setIsPending(false);
              onTransactionComplete?.();
            }}
            style={glassStyles.btnGold}
            className="px-4 py-1.5 text-sm rounded-lg"
          >
            Accept Dare
          </button>
        )}

        {/* RECLAIM (creator + deadline passed + no accepter) */}
        {isOpen && isZeroAccepter && isCreator && isDeadlinePassed && (
          <button
            onClick={async () => {
              setIsPending(true);
              await writeContractAsync({
                address: DARE_CONTRACT_ADDRESS,
                abi: DARE_CONTRACT_ABI,
                functionName: 'reclaimUnacceptedDare',
                args: [BigInt(dare.id)],
              });
              setIsPending(false);
              onTransactionComplete?.(); // optimistic refresh
            }}
            style={glassStyles.btnGold}
            className="px-4 py-1.5 text-sm rounded-lg"
          >
            Reclaim Stake
          </button>
        )}

        {/* SUBMIT PROOF */}
{dare.status === DareStatus.Running &&
  isAccepter &&
  isDeadlinePassed && (
    <button
      onClick={() => setShowProofModal(true)}
      style={glassStyles.btnGold}
      className="px-4 py-1.5 text-sm rounded-lg"
    >
      Submit Proof
    </button>
)}
</div>

{showProofModal && (
  <ProofSubmissionModal
    dare={dare}
    proofType="LINK"
    onClose={() => setShowProofModal(false)}
    onSubmit={() => setShowProofModal(false)}
    onTransactionComplete={onTransactionComplete}
  />
)}
</div>
);
}
