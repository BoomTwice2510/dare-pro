'use client';

import React from "react"

import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { Dare } from '@/lib/types';
import { formatAddress, formatStake } from '@/lib/utils-dare';
import { glassStyles } from '@/lib/glass-styles';
import { DARE_CONTRACT_ADDRESS, DARE_CONTRACT_ABI } from '@/lib/web3-config';

type ProofType = 'TX_HASH' | 'LINK' | 'SELF_PROOF';
type VerificationStatus = 'pending' | 'challenged' | 'verified' | 'failed';

interface ProofSubmissionModalProps {
  dare: Dare;
  proofType: ProofType;
  onClose: () => void;
  onSubmit?: (proof: string, type: ProofType) => void;
  onTransactionComplete?: () => void;
}

export function ProofSubmissionModal({
  dare,
  proofType,
  onClose,
  onSubmit,
  onTransactionComplete,
}: ProofSubmissionModalProps) {
  const [proof, setProof] = useState('');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [useAttestation, setUseAttestation] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('pending');
  const [detectedChain, setDetectedChain] = useState('Base Sepolia');
  const [txError, setTxError] = useState<string>('');
  const [isPending, setIsPending] = useState(false);
  
  const { writeContractAsync } = useWriteContract();

  
  // 🔥 FIXED: normalize deadline to milliseconds

const deadlineMs =
  Number(dare.deadline) < 10_000_000_000
    ? Number(dare.deadline) * 1000
    : Number(dare.deadline);

const PROOF_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h

const now = Date.now();

// submission allowed until deadline + proof window
const proofCutoff = deadlineMs + PROOF_WINDOW_MS;

const timeRemaining = Math.max(0, proofCutoff - now);
const isDeadlinePassed = now > proofCutoff;

const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
const hoursRemaining = Math.floor(
  (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
);

  const isProofComplete = () => {
    if (proofType === 'TX_HASH') return proof.length === 66 && proof.startsWith('0x');
    if (proofType === 'LINK') return proof.startsWith('http');
    if (proofType === 'SELF_PROOF') return proofImage || useAttestation;
    return false;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofImage(file);
    }
  };

  const handleSubmitProof = async () => {
    if (!isProofComplete()) return;

    setTxError('');
    setIsPending(true);

    try {
      // Determine the proof URI to submit
      let proofURI = proof;
      if (proofType === 'SELF_PROOF') {
        proofURI = proofImage?.name || 'self-attestation';
      }

      console.log('[v0] Submitting proof to chain:', {
        dareId: dare.id,
        proofURI,
        proofType,
      });

      // Call submitProof contract function
      const hash = await writeContractAsync({
        address: DARE_CONTRACT_ADDRESS,
        abi: DARE_CONTRACT_ABI,
        functionName: 'submitProof',
        args: [BigInt(dare.id), proofURI],
      });

      console.log('[v0] Submit proof tx hash:', hash);

      // Mark as submitted and show verification status
      setSubmitted(true);
      
      // Simulate auto-verification for TX_HASH
      if (proofType === 'TX_HASH') {
        setTimeout(() => {
          setVerificationStatus('verified');
        }, 2000);
      } else if (proofType === 'LINK') {
        setVerificationStatus('challenged');
      } else {
        setVerificationStatus('pending');
      }

      // Callback
      onSubmit?.(proofURI, proofType);
      
      // Trigger refetch
      if (onTransactionComplete) {
        setTimeout(() => {
          onTransactionComplete();
        }, 2000);
      }
    } catch (error: any) {
      console.error('[v0] Submit proof error:', error);
      setTxError(error?.message || 'Failed to submit proof');
      setIsPending(false);
    }
  };

  const getVerificationColor = () => {
    const colors: Record<VerificationStatus, string> = {
      verified: '#4ade80',
      pending: '#facc15',
      challenged: '#f87171',
      failed: '#ef4444',
    };
    return colors[verificationStatus];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={glassStyles.glass}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2
              className="text-3xl font-bold mb-2"
              style={{
                background: 'linear-gradient(to right, #d4af37, #e6c547)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Submit Proof
            </h2>
            <p className="text-white/60">Complete your dare challenge</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Error Display */}
        {txError && (
          <div className="mb-4 p-4 rounded-lg bg-red-900/20 border border-red-500/50">
            <p className="text-red-400 text-sm font-semibold">{txError}</p>
          </div>
        )}

        {/* Dare Details */}
        <div className="space-y-4 mb-8">
          <div
            className="p-4 rounded-xl space-y-3"
            style={glassStyles.glassLight}
          >
            <div>
              <p className="text-white/60 text-sm">Dare Title</p>
              <p className="text-white font-semibold text-lg">{dare.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-white/60 text-xs">Opponent</p>
                <p className="text-white font-mono text-sm">
                  {formatAddress(dare.accepter || dare.creator)}
                </p>
              </div>
              <div>
                <p className="text-white/60 text-xs">Total Stake</p>
                <p className="text-[#d4af37] font-bold text-sm">
                  {formatStake(dare.stake)} ETH
                </p>
              </div>
              <div>
                <p className="text-white/60 text-xs">Time Remaining</p>
                <p className="text-white font-semibold text-sm">
                  {daysRemaining}d {hoursRemaining}h
                </p>
              </div>
            </div>
          </div>

          {/* Deadline Warning */}
          {isDeadlinePassed && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <p className="text-red-300 font-semibold">
                Deadline has passed. You cannot submit proof.
              </p>
            </div>
          )}
        </div>

        {/* Proof Input Section */}
        {!submitted && (
          <div className="space-y-6 mb-8">
            {proofType === 'TX_HASH' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Transaction Hash
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={proof}
                    onChange={(e) => setProof(e.target.value)}
                    style={glassStyles.glassLight}
                    className="w-full rounded-lg p-3 text-white placeholder-white/40 font-mono text-sm"
                  />
                </div>
                <div
                  className="p-3 rounded-lg flex items-center justify-between"
                  style={glassStyles.glassLight}
                >
                  <span className="text-white/60 text-sm">Detected Chain</span>
                  <span className="text-white font-semibold">{detectedChain}</span>
                </div>
                {proof && proof.startsWith('0x') && proof.length === 66 && (
                  <div className="p-3 rounded-lg flex items-center gap-2 bg-green-500/10 border border-green-500/30">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    <span className="text-green-300 text-sm">Valid transaction hash format</span>
                  </div>
                )}
              </div>
            )}

            {proofType === 'LINK' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Proof Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={proof}
                    onChange={(e) => setProof(e.target.value)}
                    style={glassStyles.glassLight}
                    className="w-full rounded-lg p-3 text-white placeholder-white/40 text-sm"
                  />
                </div>
                <div
                  className="p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10"
                >
                  <p className="text-yellow-300 text-sm">
                    Link must be public and created before the deadline
                  </p>
                </div>
              </div>
            )}

            {proofType === 'SELF_PROOF' && (
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    Upload Evidence (Optional)
                  </label>
                  <div
                    className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors hover:border-white/30"
                    style={{ borderColor: 'rgba(255, 255, 255, 0.15)' }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="proof-image"
                    />
                    <label htmlFor="proof-image" className="cursor-pointer block">
                      {proofImage ? (
                        <div>
                          <p className="text-white font-semibold">{proofImage.name}</p>
                          <p className="text-white/60 text-sm">Click to change</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-white/60 text-sm">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-white/40 text-xs mt-1">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Self-Attestation */}
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useAttestation}
                      onChange={(e) => setUseAttestation(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-white text-sm">
                      I confirm I completed this dare
                    </span>
                  </label>
                </div>

                {/* Warning Banner */}
                <div
                  className="p-4 rounded-lg border border-red-500/30 bg-red-500/10"
                >
                  <p className="text-red-300 text-sm font-semibold">
                    Warning: Opponent can challenge this proof
                  </p>
                  <p className="text-red-300/80 text-xs mt-1">
                    Provide clear evidence to avoid disputes
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submitted State */}
        {submitted && (
          <div className="space-y-6 mb-8">
            {/* Verification Status */}
            <div
              className="p-6 rounded-xl border-2 text-center"
              style={{
                borderColor: `${getVerificationColor()}40`,
                backgroundColor: `${getVerificationColor()}10`,
              }}
            >
              <div className="flex justify-center mb-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${getVerificationColor()}30` }}
                >
                  {verificationStatus === 'verified' && (
                    <span className="text-2xl">✓</span>
                  )}
                  {verificationStatus === 'pending' && (
                    <span className="text-2xl animate-spin">⏳</span>
                  )}
                  {verificationStatus === 'challenged' && (
                    <span className="text-2xl">⚠</span>
                  )}
                  {verificationStatus === 'failed' && (
                    <span className="text-2xl">✗</span>
                  )}
                </div>
              </div>
              <p
                className="font-bold text-lg mb-1"
                style={{ color: getVerificationColor() }}
              >
                {verificationStatus === 'verified' && 'Proof Verified'}
                {verificationStatus === 'pending' && 'Verification Pending'}
                {verificationStatus === 'challenged' && 'Proof Challenged'}
                {verificationStatus === 'failed' && 'Verification Failed'}
              </p>
              <p className="text-white/60 text-sm">
                {verificationStatus === 'verified' &&
                  'Your proof has been automatically verified'}
                {verificationStatus === 'pending' &&
                  'Your proof is awaiting manual verification'}
                {verificationStatus === 'challenged' &&
                  'Your opponent can challenge this proof'}
                {verificationStatus === 'failed' &&
                  'Your proof could not be verified'}
              </p>
            </div>

            {/* Proof Summary */}
            <div
              className="p-4 rounded-xl space-y-2"
              style={glassStyles.glassLight}
            >
              <p className="text-white/60 text-sm">Submitted Proof</p>
              <p className="text-white font-mono text-sm break-all">
                {proof || proofImage?.name || 'Self-attestation'}
              </p>
            </div>

            {/* Challenge Window */}
            {verificationStatus !== 'verified' && (
              <div
                className="p-4 rounded-xl"
                style={glassStyles.glassLight}
              >
                <p className="text-white/60 text-sm mb-1">Challenge Window</p>
                <p className="text-white font-semibold">24 hours</p>
                <p className="text-white/60 text-xs mt-2">
                  Opponent has 24 hours to challenge this proof
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            style={glassStyles.glassLight}
            className="px-6 py-3 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            Close
          </button>
          {!submitted && (
            <button
              onClick={handleSubmitProof}
              disabled={isDeadlinePassed || !isProofComplete() || isPending}
              style={glassStyles.btnGold}
              className="px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Submitting...' : 'Submit Proof'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
