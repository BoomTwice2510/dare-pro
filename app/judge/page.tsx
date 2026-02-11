'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import Link from 'next/link';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { formatAddress } from '@/lib/utils-dare';
import { DARE_CONTRACT_ADDRESS, DARE_CONTRACT_ABI } from '@/lib/web3-config';
import { glassStyles } from '@/lib/glass-styles';
import { useDares } from '@/hooks/useDares';
import { DareStatus } from '@/lib/types';

export default function JudgePanel() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [mounted, setMounted] = useState(false);
  const [txError, setTxError] = useState('');
  const [txSuccess, setTxSuccess] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  /* --------------------
     CONTRACT READS
  -------------------- */
  const { data: judge } = useReadContract({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    functionName: 'judge',
  });

  const { data: treasury } = useReadContract({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    functionName: 'treasury',
  });

  const { data: feeBps } = useReadContract({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    functionName: 'WIN_FEE_BPS',
  });

  /* --------------------
     FETCH DISPUTED DARES
  -------------------- */
  const { filteredDares } = useDares({
    filterStatus: DareStatus.Disputed,
  });

  const isJudge =
    address &&
    judge &&
    address.toLowerCase() === (judge as string).toLowerCase();

  if (!mounted) return null;

  if (!isConnected) {
    return (
      <main style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
        <Header />
        <section className="pt-32 px-4 text-center">
          <div className="rounded-2xl p-8 max-w-md mx-auto" style={glassStyles.glass}>
            <h1 className="text-2xl font-bold text-white mb-4">Connect Wallet</h1>
            <Link href="/landing">
              <button style={glassStyles.btnGold} className="w-full">
                Go Back Home
              </button>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (!isJudge) {
    return (
      <main style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
        <Header />
        <section className="pt-32 px-4 text-center">
          <div className="rounded-2xl p-8 max-w-md mx-auto" style={glassStyles.glassGold}>
            <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-white/60 mb-4">
              Only the protocol judge can access this panel.
            </p>
            <Link href="/landing">
              <button style={glassStyles.btnGold} className="w-full">
                Go Back Home
              </button>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  /* --------------------
     RESOLVE FUNCTION
  -------------------- */
  const resolveDare = async (id: number, creatorWins: boolean) => {
    setTxError('');
    setTxSuccess('');

    try {
      await writeContractAsync({
        address: DARE_CONTRACT_ADDRESS,
        abi: DARE_CONTRACT_ABI,
        functionName: 'judgeResolve',
        args: [BigInt(id), creatorWins],
      });

      setTxSuccess(`Dare #${id} resolved successfully`);
    } catch (err: any) {
      setTxError(err.message || 'Transaction failed');
    }
  };

  return (
    <main style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
      <Header />

      <section className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-20">
        <div className="space-y-8">
          <div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{
                background: 'linear-gradient(to right, #d4af37, #e6c547)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Judge Panel
            </h1>
            <p className="text-white/60">
              Resolve disputed dares transparently.
            </p>
          </div>

          {/* Protocol Info */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl p-6" style={glassStyles.glassLight}>
              <p className="text-white/60 text-sm mb-2">Judge Address</p>
              <p className="text-white font-mono text-sm break-all">
                {formatAddress(judge as string)}
              </p>
            </div>

            <div className="rounded-2xl p-6" style={glassStyles.glassLight}>
              <p className="text-white/60 text-sm mb-2">Treasury Address</p>
              <p className="text-white font-mono text-sm break-all">
                {formatAddress(treasury as string)}
              </p>
            </div>

            <div className="rounded-2xl p-6" style={glassStyles.glassLight}>
              <p className="text-white/60 text-sm mb-2">Protocol Fee</p>
              <p className="text-[#d4af37] font-bold text-lg">
                {Number(feeBps) / 100}%
              </p>
            </div>
          </div>

          {/* DISPUTED DARES */}
          <div className="rounded-2xl p-8 space-y-6" style={glassStyles.glassGold}>
            <h2 className="text-2xl font-bold text-white">
              Disputed Dares
            </h2>

            {filteredDares.length === 0 && (
              <p className="text-white/60">
                No disputed dares right now.
              </p>
            )}

            {filteredDares.map((dare) => (
              <div
                key={dare.id}
                className="rounded-xl p-6 border border-yellow-500/20 space-y-3"
                style={glassStyles.glassLight}
              >
                <div className="flex justify-between">
                  <span className="text-yellow-400 font-semibold">
                    Dare #{dare.id}
                  </span>
                  <span className="text-red-400 text-sm">
                    Disputed
                  </span>
                </div>

                <p className="text-white">{dare.description}</p>

                <div className="text-sm text-white/70 space-y-1">
                <div className="mt-3 text-xs text-white/60 space-y-1">
  <div>
    Created: {new Date(dare.createdAt).toLocaleString()}
  </div>

  <div>
    Deadline: {new Date(dare.deadline).toLocaleString()}
  </div>

  {dare.proofTime > 0 && (
    <div>
      Proof Submitted: {new Date(dare.proofTime).toLocaleString()}
    </div>
  )}

  {dare.disputeTime > 0 && (
    <div>
      Disputed: {new Date(dare.disputeTime).toLocaleString()}
    </div>
  )}

  {dare.disputeTime > 0 && (
    <div className="text-yellow-400 font-semibold">
      Judge Window Left:{' '}
      {Math.max(
        0,
        72 * 60 * 60 * 1000 -
          (Date.now() - dare.disputeTime)
      ) / (1000 * 60 * 60) > 0
        ? `${Math.floor(
            (72 * 60 * 60 * 1000 -
              (Date.now() - dare.disputeTime)) /
              (1000 * 60 * 60)
          )}h left`
        : 'Expired'}
    </div>
  )}
</div>

                  <div>Creator: {formatAddress(dare.creator)}</div>
                  <div>Accepter: {formatAddress(dare.accepter)}</div>
                  <div>Stake: {dare.stake.toString()}</div>
                  {dare.proofURI && (
                    <div>
                      Proof:{' '}
                      <a
                        href={dare.proofURI}
                        target="_blank"
                        className="text-blue-400 underline"
                      >
                        View
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => resolveDare(dare.id, true)}
                    style={glassStyles.btnGold}
                    className="flex-1"
                  >
                    Creator Wins
                  </button>

                  <button
                    onClick={() => resolveDare(dare.id, false)}
                    className="flex-1 bg-green-600 text-white rounded-lg py-2"
                  >
                    Accepter Wins
                  </button>
                </div>
              </div>
            ))}

            {txError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                {txError}
              </div>
            )}

            {txSuccess && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
                ✓ {txSuccess}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
