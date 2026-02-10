'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FlashTaskModal, FlashTaskTemplate, FlashTaskCategory } from '@/components/flash-task-modal';
import Link from 'next/link';
import { useAccount, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { DARE_CONTRACT_ADDRESS, DARE_CONTRACT_ABI } from '@/lib/web3-config';
import { glassStyles } from '@/lib/glass-styles';

export default function CreateDare() {
  const { isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [form, setForm] = useState({
    description: '',
    durationValue: 1,
    durationUnit: 'days',
    stake: '',
    useETH: true,
    tokenAddress: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleFlashTaskSelect = (template: FlashTaskTemplate, category: FlashTaskCategory) => {
    setForm(prevForm => ({
      ...prevForm,
      description: template.description,
      durationValue: Math.ceil(template.deadline / 86400),
      durationUnit: 'days',
      stake: prevForm.stake || '0.01',
    }));
  };

  const getDurationInSeconds = () => {
    const { durationValue, durationUnit } = form;
    const multipliers: Record<string, number> = {
      hours: 3600,
      days: 86400,
      weeks: 604800,
    };
    return durationValue * (multipliers[durationUnit] || 86400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.description.trim()) {
      setError('Please enter a dare description');
      return;
    }

    const stakeAmount = parseFloat(form.stake);
    if (!form.stake || stakeAmount <= 0) {
      setError('Please enter a valid stake amount');
      return;
    }

    const MIN_STAKE = 0.0001; // Minimum 0.0001 ETH or equivalent
    if (stakeAmount < MIN_STAKE) {
      setError(`Minimum stake is ${MIN_STAKE} ETH or equivalent ERC20 token`);
      return;
    }

    if (!form.useETH && !form.tokenAddress) {
      setError('Please enter a token address');
      return;
    }

    try {
      const durationSeconds = getDurationInSeconds();
      const stakeAmount = parseEther(form.stake);

      writeContract(
        {
          address: DARE_CONTRACT_ADDRESS,
          abi: DARE_CONTRACT_ABI,
          functionName: 'createDare',
          args: [
            form.description,
            BigInt(durationSeconds),
            form.useETH ? '0x0000000000000000000000000000000000000000' : form.tokenAddress,
            stakeAmount,
          ],
          value: form.useETH ? stakeAmount : undefined,
        },
        {
          onSuccess: () => {
            setSubmitted(true);
            setForm({
              description: '',
              durationValue: 1,
              durationUnit: 'days',
              stake: '',
              useETH: true,
              tokenAddress: '',
            });
          },
          onError: (err) => {
            setError(err.message || 'Transaction failed');
          },
        }
      );
    } catch (err: any) {
      setError(err.message || 'Failed to create dare');
    }
  };
  
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
            <p className="text-white/60 mb-6">You must connect your wallet to create a dare.</p>
            <Link href="/landing">
              <button style={glassStyles.btnGold} className="w-full">Go Back</button>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
      <Header />

      <section className="pt-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto pb-20">
        <div className="space-y-8">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h1
                className="text-4xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(to right, #d4af37, #e6c547)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Create a Dare
              </h1>
              <p className="text-white/60">
                Put real stakes behind real commitments. Define your challenge.
              </p>
            </div>
            <FlashTaskModal onSelectTemplate={handleFlashTaskSelect} />
          </div>

          {submitted ? (
            <div className="rounded-2xl p-8 text-center space-y-4" style={glassStyles.glassGold}>
              <div className="text-4xl">✓</div>
              <h2 className="text-2xl font-bold text-white">Dare Created!</h2>
              <p className="text-white/80">Your dare is now live and waiting for accepters.</p>
              <div className="flex gap-2 justify-center">
                <Link href="/dares">
                  <button style={glassStyles.btnGold}>View All Dares</button>
                </Link>
                <Link href="/my-dares">
                  <button style={glassStyles.btnGlass}>My Dares</button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl p-8 space-y-6" style={glassStyles.glassGold}>
              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Dare Description</label>
                <Textarea
                  placeholder="Describe your dare in detail. Be specific about what needs to be accomplished."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  style={{ ...glassStyles.glassLight, color: 'white' }}
                  className="rounded-lg p-3 placeholder-white/40 min-h-24"
                />
              </div>

              {/* Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Duration</label>
                  <Input
                    type="number"
                    min="1"
                    value={form.durationValue}
                    onChange={e => setForm({ ...form, durationValue: parseInt(e.target.value) })}
                    style={{ ...glassStyles.glassLight, color: 'white' }}
                    className="rounded-lg p-3"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Unit</label>
                  <select
                    value={form.durationUnit}
                    onChange={e => setForm({ ...form, durationUnit: e.target.value })}
                    style={{ ...glassStyles.glassLight, color: 'white', backgroundColor: 'transparent' }}
                    className="rounded-lg p-3 w-full"
                  >
                    <option value="hours" style={{ backgroundColor: '#0a0e27', color: 'white' }}>
                      Hours
                    </option>
                    <option value="days" style={{ backgroundColor: '#0a0e27', color: 'white' }}>
                      Days
                    </option>
                    <option value="weeks" style={{ backgroundColor: '#0a0e27', color: 'white' }}>
                      Weeks
                    </option>
                  </select>
                </div>
              </div>

              {/* Stake */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  Stake Amount <span className="text-[#d4af37]">*</span>
                </label>
                <Input
                  type="number"
                  step="0.0001"
                  min="0.0001"
                  placeholder="0.0001"
                  value={form.stake}
                  onChange={e => setForm({ ...form, stake: e.target.value })}
                  style={{ ...glassStyles.glassLight, color: 'white' }}
                  className="rounded-lg p-3 placeholder-white/40"
                />
                <div className="flex flex-col gap-2 text-xs">
                  <p className="text-white/60">
                    {form.useETH ? 'ETH' : 'ERC20'} - Your stake + accepter&apos;s stake = pool
                  </p>
                  <p className="text-[#d4af37] font-semibold">
                    Minimum stake: 0.0001 {form.useETH ? 'ETH' : 'ERC20 token'}
                  </p>
                </div>
              </div>

              {/* Token Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-white">Payment Method</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, useETH: true })}
                    style={
                      form.useETH
                        ? { ...glassStyles.glassGold, color: '#d4af37', border: '1px solid rgba(212, 175, 55, 0.5)' }
                        : { ...glassStyles.glass, color: 'rgba(255, 255, 255, 0.7)' }
                    }
                    className="flex-1 p-3 rounded-lg transition-all hover:text-white"
                  >
                    Use ETH
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, useETH: false })}
                    style={
                      !form.useETH
                        ? { ...glassStyles.glassGold, color: '#d4af37', border: '1px solid rgba(212, 175, 55, 0.5)' }
                        : { ...glassStyles.glass, color: 'rgba(255, 255, 255, 0.7)' }
                    }
                    className="flex-1 p-3 rounded-lg transition-all hover:text-white"
                  >
                    Use ERC20
                  </button>
                </div>
              </div>

              {/* Token Address */}
              {!form.useETH && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Token Address</label>
                  <Input
                    type="text"
                    placeholder="0x..."
                    value={form.tokenAddress}
                    onChange={e => setForm({ ...form, tokenAddress: e.target.value })}
                    style={{ ...glassStyles.glassLight, color: 'white' }}
                    className="rounded-lg p-3 placeholder-white/40"
                  />
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                style={glassStyles.btnGold}
                className="w-full py-3 text-lg font-bold"
              >
                {isPending ? 'Creating...' : 'Create Dare'}
              </button>

              {/* Disclaimer */}
              <p className="text-xs text-white/50 text-center">
                Once accepted, dares cannot be cancelled. Ensure your dare is clear and achievable.
              </p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
