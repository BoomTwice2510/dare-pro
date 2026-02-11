'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useAccount, useReadContract } from 'wagmi';
import { BADGE_LABELS, Badge } from '@/lib/types';
import { formatAddress } from '@/lib/utils-dare';
import { DARE_CONTRACT_ADDRESS, DARE_CONTRACT_ABI } from '@/lib/web3-config';
import { glassStyles } from '@/lib/glass-styles';

export default function Reputation() {
  const { address } = useAccount();
  const [searchAddress, setSearchAddress] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  // ✅ HYDRATION FIX (SAFE — DOES NOT BREAK HOOK ORDER)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const checkAddress = searchAddress || selectedAddress || address;

  const { data: xp } = useReadContract({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    functionName: 'xp',
    args: [checkAddress || '0x0000000000000000000000000000000000000000'],
    query: { enabled: !!checkAddress },
  });

  const { data: badgeData } = useReadContract({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    functionName: 'badge',
    args: [checkAddress || '0x0000000000000000000000000000000000000000'],
    query: { enabled: !!checkAddress },
  });

  const { data: confirmWindow } = useReadContract({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    functionName: 'CONFIRM_WINDOW',
  });

  const { data: xpWin } = useReadContract({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    functionName: 'XP_WIN',
  });

  const badgeNumber =
  badgeData !== undefined && badgeData !== null
    ? Number(badgeData)
    : Badge.NONE;

const xpValue =
  xp !== undefined && xp !== null
    ? Number(xp)
    : 0;

  const getBadgeColor = (badge: Badge) => {
    switch (badge) {
      case Badge.BRONZE:
        return 'from-orange-600 to-orange-400';
      case Badge.SILVER:
        return 'from-slate-400 to-slate-200';
      case Badge.GOLD:
        return 'from-yellow-500 to-yellow-300';
      default:
        return 'from-gray-600 to-gray-400';
    }
  };

  const getNextBadgeRequirement = (currentBadge: Badge, currentXP: number) => {
    const requirements = {
      [Badge.NONE]: { xp: 100, badge: Badge.BRONZE },
      [Badge.BRONZE]: { xp: 500, badge: Badge.SILVER },
      [Badge.SILVER]: { xp: 1000, badge: Badge.GOLD },
      [Badge.GOLD]: { xp: null, badge: null },
    };

    const next = requirements[currentBadge];
    if (!next || next.xp === null) return null;

    return {
      badge: next.badge,
      xpNeeded: next.xp - currentXP,
      xpRequired: next.xp,
    };
  };

  const nextBadge = getNextBadgeRequirement(badgeNumber, xpValue);

  // ✅ IMPORTANT: return null AFTER hooks (does not break hook order)
  if (!mounted) return null;

  return (
    <main style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
      <Header />

      <section className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-20">
        <div className="space-y-8">
          <h1
            className="text-3xl font-bold"
            style={{
              background: 'linear-gradient(to right, #d4af37, #e6c547)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Reputation System
          </h1>

          {/* XP and Badge Info */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Current Profile */}
            <div className="rounded-2xl p-8 space-y-6" style={glassStyles.glassGold}>
              <h2 className="text-2xl font-bold text-white">Your Profile</h2>

              <div className="space-y-4">
                {address && (
                  <div className="rounded-lg p-4" style={glassStyles.glassLight}>
                    <p className="text-white/60 text-sm mb-2">Wallet</p>
                    <p className="text-white font-mono text-sm">
                      {formatAddress(address)}
                    </p>
                  </div>
                )}

                <div
                  className={`bg-gradient-to-br ${getBadgeColor(
                    badgeNumber
                  )} rounded-lg p-6 text-center`}
                >
                  <p className="text-white/80 text-sm mb-2">Current Badge</p>
                  <p className="text-2xl font-bold text-white">
                    {BADGE_LABELS[badgeNumber]}
                  </p>
                </div>

                <div className="rounded-lg p-4" style={glassStyles.glassLight}>
                  <p className="text-white/60 text-sm mb-2">Total XP</p>
                  <p
                    className="text-3xl font-bold"
                    style={{
                      background: 'linear-gradient(to right, #d4af37, #e6c547)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {xpValue}
                  </p>
                </div>

                {nextBadge && (
                  <div className="rounded-lg p-4" style={glassStyles.glassLight}>
                    <p className="text-white/60 text-sm mb-2">
                      Next Badge: {BADGE_LABELS[nextBadge.badge!]}
                    </p>

                    <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          background:
                            'linear-gradient(to right, #d4af37, #e6c547)',
                          width: `${Math.min(
                            (xpValue / nextBadge.xpRequired) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>

                    <p className="text-white/60 text-xs mt-2">
                      {nextBadge.xpNeeded} XP needed ({nextBadge.xpRequired} total)
                    </p>
                  </div>
                )}
              </div>

              {address && (
                <Link href="/my-dares">
                  <button style={glassStyles.btnGold} className="w-full">
                    View Your Dares
                  </button>
                </Link>
              )}
            </div>

            {/* Protocol Info */}
            <div className="rounded-2xl p-8 space-y-4" style={glassStyles.glassGold}>
              <h2 className="text-2xl font-bold text-white">How XP Works</h2>

              <div className="space-y-4 text-sm text-white/80">
                <div className="rounded-lg p-3" style={glassStyles.glassLight}>
                  <p className="font-semibold text-[#d4af37] mb-1">
                    Win a Dare
                  </p>
                  <p>
                    +{Number(xpWin)} XP for successfully completing a dare
                  </p>
                </div>

                <div className="rounded-lg p-3" style={glassStyles.glassLight}>
                  <p className="font-semibold text-[#d4af37] mb-1">
                    Confirmation Window
                  </p>
                  <p>
                    {Number(confirmWindow) / 3600} hours to auto-resolve proofs
                  </p>
                </div>

                <div className="rounded-lg p-3" style={glassStyles.glassLight}>
                  <p className="font-semibold text-[#d4af37] mb-1">
                    Badge Thresholds
                  </p>
                  <ul className="space-y-1 ml-2">
                    <li>🥉 Bronze: 100 XP</li>
                    <li>🥈 Silver: 500 XP</li>
                    <li>🥇 Gold: 1,000 XP</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Search Other Profiles */}
          <div className="rounded-2xl p-8 space-y-6" style={glassStyles.glassGold}>
            <h2 className="text-2xl font-bold text-white">
              Check Other Profiles
            </h2>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-white">
                Wallet Address
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="0x..."
                  value={searchAddress}
                  onChange={e => setSearchAddress(e.target.value)}
                  style={glassStyles.glassLight}
                  className="rounded-lg p-3 text-white placeholder-white/40 flex-1"
                />
                <button
                  onClick={() => setSelectedAddress(searchAddress)}
                  style={glassStyles.btnGold}
                  className="px-6"
                >
                  Search
                </button>
              </div>
            </div>

            {selectedAddress && (
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="rounded-lg p-4" style={glassStyles.glassLight}>
                  <p className="text-white/60 text-sm mb-2">Address</p>
                  <p className="text-white font-mono text-sm">
                    {formatAddress(selectedAddress)}
                  </p>
                </div>

                <div
                  style={{
                    background: `linear-gradient(to bottom right, ${
                      getBadgeColor(badgeNumber).split(' ')[0]
                    } 0%, ${
                      getBadgeColor(badgeNumber).split(' ')[1]
                    } 100%)`,
                  }}
                  className="rounded-lg p-4"
                >
                  <p className="text-white/80 text-sm mb-1">Badge</p>
                  <p className="text-lg font-bold text-white">
                    {BADGE_LABELS[badgeNumber]}
                  </p>
                </div>

                <div className="rounded-lg p-4" style={glassStyles.glassLight}>
                  <p className="text-white/60 text-sm mb-2">Total XP</p>
                  <p
                    className="text-2xl font-bold"
                    style={{
                      background: 'linear-gradient(to right, #d4af37, #e6c547)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {xpValue}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSearchAddress('');
                    setSelectedAddress(null);
                  }}
                  style={glassStyles.glassLight}
                  className="rounded-lg p-4 text-white/70 hover:text-white transition-colors text-center font-medium"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>

          {/* FAQ */}
          <div className="rounded-2xl p-8 space-y-4" style={glassStyles.glassGold}>
            <h2 className="text-2xl font-bold text-white">FAQ</h2>

            <div className="space-y-3 text-sm text-white/80">
              <div className="rounded-lg p-3" style={glassStyles.glassLight}>
                <p className="font-semibold text-[#d4af37] mb-1">What is XP?</p>
                <p>
                  XP is your onchain reputation. It increases when you win dares,
                  showing your commitment and honesty.
                </p>
              </div>

              <div className="rounded-lg p-3" style={glassStyles.glassLight}>
                <p className="font-semibold text-[#d4af37] mb-1">
                  Can I lose XP?
                </p>
                <p>
                  In the current version, you gain XP when you win. Future
                  versions may penalize false claims.
                </p>
              </div>

              <div className="rounded-lg p-3" style={glassStyles.glassLight}>
                <p className="font-semibold text-[#d4af37] mb-1">
                  Is XP tradeable?
                </p>
                <p>
                  No. XP is a non-transferable reputation metric. It&apos;s tied
                  to your address and your actions.
                </p>
              </div>

              <div className="rounded-lg p-3" style={glassStyles.glassLight}>
                <p className="font-semibold text-[#d4af37] mb-1">
                  What are badges for?
                </p>
                <p>
                  Badges are visual indicators of your reputation level. They
                  signal trustworthiness to other users.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
