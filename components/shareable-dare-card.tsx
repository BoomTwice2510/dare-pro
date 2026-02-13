'use client';

import React from 'react';
import { glassStyles } from '@/lib/glass-styles';

interface ShareableDareCardProps {
  title: string;
  creator: string;
  opponent: string;
  stakeAmount: number;
  deadline: string;
  status: 'active' | 'resolved' | 'disputed';
  logoUrl?: string;
}

export function ShareableDareCard({
  title,
  creator,
  opponent,
  stakeAmount,
  deadline,
  status,
  logoUrl = '/images/logo.png',
}: ShareableDareCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  const statusColors = {
    active: '#10b981',
    resolved: '#3b82f6',
    disputed: '#f59e0b',
  };

  const statusLabel = {
    active: 'Active',
    resolved: 'Resolved',
    disputed: 'Disputed',
  };

  const handleShareToX = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `Check out this dare on Dare Protocol: "${title}" 💎\n\n👤 ${creator} vs ${opponent}\n💰 ${stakeAmount} ETH at stake\n\n#DareProtocol #Web3 #Dares`;
    const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(xUrl, '_blank');
  };

  return (
    <div className="w-full max-w-4xl">
      {/* Twitter Optimized Card (1200x630) */}
      <div
        ref={cardRef}
        className="relative w-full bg-black overflow-hidden flex flex-col justify-between"
        style={{
          aspectRatio: '1200 / 630',
          ...glassStyles.glass,
          backgroundColor: 'rgba(10, 14, 39, 0.95)',
          border: '2px solid rgba(212, 175, 55, 0.3)',
        }}
      >
        {/* Background gradient overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(135deg, #d4af37 0%, #1a1f3a 100%)`,
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 p-12 h-full flex flex-col justify-between">
          {/* Top Section */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-5xl font-bold text-white mb-4 leading-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                {title}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <img
                  src={logoUrl}
                  alt="Dare Protocol Logo"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-lg font-semibold text-white">Dare Protocol</span>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className="px-6 py-3 rounded-lg font-bold text-white text-lg"
              style={{
                backgroundColor: statusColors[status],
                boxShadow: `0 0 20px ${statusColors[status]}40`,
              }}
            >
              {statusLabel[status]}
            </div>
          </div>

          {/* Middle Section - Competitors */}
          <div className="grid grid-cols-3 gap-6 items-center my-8">
            <div className="text-center">
              <div className="text-sm text-white/60 mb-2 uppercase tracking-wider">Creator</div>
              <div
                className="text-2xl font-mono font-bold px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  color: '#d4af37',
                }}
              >
                {creator.slice(0, 6)}...{creator.slice(-4)}
              </div>
            </div>

            <div className="text-center">
              <div className="text-xl font-bold text-white/40">VS</div>
            </div>

            <div className="text-center">
              <div className="text-sm text-white/60 mb-2 uppercase tracking-wider">Opponent</div>
              <div
                className="text-2xl font-mono font-bold px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  color: '#d4af37',
                }}
              >
                {opponent.slice(0, 6)}...{opponent.slice(-4)}
              </div>
            </div>
          </div>

          {/* Bottom Section - Stake & Deadline */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-sm text-white/60 mb-2 uppercase tracking-wider">Stake Amount</div>
              <div className="text-4xl font-bold" style={{ color: '#d4af37' }}>
                {stakeAmount} ETH
              </div>
            </div>

            <div>
              <div className="text-sm text-white/60 mb-2 uppercase tracking-wider">Deadline</div>
              <div className="text-3xl font-bold text-white">{deadline}</div>
            </div>
          </div>
        </div>

        {/* Decorative corner elements */}
        <div
          className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #d4af37, transparent)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-40 h-40 opacity-10 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #d4af37, transparent)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* Share Button */}
      <button
        onClick={handleShareToX}
        className="w-full mt-6 py-3 px-6 font-bold text-lg rounded-lg transition-all hover:scale-105 active:scale-95"
        style={{
          ...glassStyles.btnGold,
          width: '100%',
        }}
      >
        Share to 𝕏
      </button>
    </div>
  );
}
