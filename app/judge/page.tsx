'use client';

import React from "react";

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { formatAddress } from '@/lib/utils-dare';
import { DARE_CONTRACT_ADDRESS, DARE_CONTRACT_ABI } from '@/lib/web3-config';
import { glassStyles } from '@/lib/glass-styles';

export default function JudgePanel() {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  /* --------------------
     HYDRATION FIX
  -------------------- */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* --------------------
     FORM STATE
  -------------------- */
  const [dareId, setDareId] = useState('');
  const [winner, setWinner] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const { data: protocolFeeBps } = useReadContract({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    functionName: 'protocolFeeBps',
  });

  const isJudge =
    address &&
    judge &&
    address.toLowerCase() === (judge as string).toLowerCase();

  /* --------------------
     EARLY RETURNS (ORDER MATTERS)
  -------------------- */
  if (!mounted) {
    return null;
  }

  if (!isConnected) {
    return (
      <main style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
        <Header />
        <section className="pt-32 px-4 text-center">
          <div className="rounded-2xl p-8 max-w-md mx-auto" style={glassStyles.glass}>
            <h1 className="text-2xl font-bold text-white mb-4">Connect Wallet</h1>
            <p className="text-white/60 mb-6">
              You must connect your wallet to access judge panel.
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
            <div className="rounded-lg p-4 text-left text-sm mb-6" style={glassStyles.glassLight}>
              <p className="text-white/60 mb-2">Current Judge:</p>
              <p className="text-white font-mono">
                {judge ? formatAddress(judge as string) : 'Unknown'}
              </p>
            </div>
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
     ACTION HANDLER
  -------------------- */
  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!dareId || !winner) {
      setError('Please fill in all fields');
      return;
    }

    try {
      writeContract(
        {
          address: DARE_CONTRACT_ADDRESS,
          abi: DARE_CONTRACT_ABI,
          functionName: 'judgeResolve',
          args: [BigInt(dareId), winner as `0x${string}`],
        },
        {
          onSuccess: () => {
            setSuccess(
              `Dare #${dareId} resolved with winner: ${formatAddress(winner)}`
            );
            setDareId('');
            setWinner('');
          },
          onError: (err) => {
            setError(err.message || 'Failed to resolve dare');
          },
        }
      );
    } catch (err: any) {
      setError(err.message || 'Failed to resolve dare');
    }
  };

  /* --------------------
     MAIN PANEL
  -------------------- */
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
                {Number(protocolFeeBps) / 100}%
              </p>
            </div>
          </div>

          {/* Resolve Form */}
          <div className="rounded-2xl p-8 space-y-6" style={glassStyles.glassGold}>
            <h2 className="text-2xl font-bold text-white">
              Resolve Disputed Dare
            </h2>

            <form onSubmit={handleResolve} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  Dare ID
                </label>
                <Input
                  type="number"
                  min="0"
                  value={dareId}
                  onChange={(e) => setDareId(e.target.value)}
                  style={glassStyles.glassLight}
                  className="rounded-lg p-3 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  Winner Address
                </label>
                <Input
                  type="text"
                  value={winner}
                  onChange={(e) => setWinner(e.target.value)}
                  style={glassStyles.glassLight}
                  className="rounded-lg p-3 text-white"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
                  ✓ {success}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                style={glassStyles.btnGold}
                className="w-full py-3 text-lg"
              >
                {isPending ? 'Resolving...' : 'Resolve Dare'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
