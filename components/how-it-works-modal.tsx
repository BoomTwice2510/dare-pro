'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { glassStyles } from '@/lib/glass-styles';

export function HowItWorksModal() {
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    {
      number: '1',
      title: 'Create a Dare',
      description: 'Define your challenge, set duration, and lock your stake (ETH or ERC20)',
      color: '#60a5fa',
    },
    {
      number: '2',
      title: 'Accept a Dare',
      description: 'Someone accepts by staking the same amount. Now both have skin in the game',
      color: '#06b6d4',
    },
    {
      number: '3',
      title: 'Run the Challenge',
      description: 'Complete the dare during the deadline period. No early claims allowed',
      color: '#facc15',
    },
    {
      number: '4',
      title: 'Submit Proof',
      description: 'After deadline, accepter submits proof of success or failure',
      color: '#8b5cf6',
    },
    {
      number: '5',
      title: 'Dispute Window',
      description: 'Creator can dispute the claim within 24 hours. Otherwise auto-resolves',
      color: '#f87171',
    },
    {
      number: '6',
      title: 'Get Paid + XP',
      description: 'Winner gets 2x stake + XP reputation. Losers learn a lesson',
      color: '#4ade80',
    },
  ];

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={glassStyles.btnGold}
        className="px-6 py-2 text-sm font-bold hover:shadow-lg transition-all"
      >
        📖 How It Works
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div
            className="relative rounded-3xl p-8 max-w-2xl max-h-[90vh] overflow-y-auto w-full"
            style={glassStyles.glassGold}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Header */}
            <div className="text-center mb-10">
              <h2
                className="text-4xl font-black mb-2"
                style={{
                  background: 'linear-gradient(to right, #d4af37, #e6c547)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                How Dare Protocol Works
              </h2>
              <p className="text-white/60">Dare. Stake. Prove it. In 6 steps.</p>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-4"
                  style={{
                    backdropFilter: 'blur(8px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${step.color}40`,
                  }}
                >
                  {/* Step Number */}
                  <div
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg mb-3"
                    style={{
                      backgroundColor: `${step.color}20`,
                      color: step.color,
                      border: `2px solid ${step.color}`,
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Step Title */}
                  <h3 className="text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-sm text-white/70">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Key Features */}
            <div
              className="rounded-xl p-6 mb-8"
              style={{
                backdropFilter: 'blur(8px)',
                backgroundColor: 'rgba(212, 175, 55, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
              }}
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">⚡</span> Key Features
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <span className="text-[#d4af37] text-xl">✓</span>
                  <div>
                    <p className="font-bold text-white">Smart Contract Enforced</p>
                    <p className="text-white/60">No middleman. Rules are code.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#d4af37] text-xl">✓</span>
                  <div>
                    <p className="font-bold text-white">Onchain Reputation (XP)</p>
                    <p className="text-white/60">Win dares to build verifiable credibility.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#d4af37] text-xl">✓</span>
                  <div>
                    <p className="font-bold text-white">Fair Judge Panel</p>
                    <p className="text-white/60">Disputes resolved transparently by judge.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Best For */}
            <div
              className="rounded-xl p-6"
              style={{
                backdropFilter: 'blur(8px)',
                backgroundColor: 'rgba(212, 175, 55, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
              }}
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span> Best For
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {[
                  'Fitness challenges',
                  'Addiction breaks',
                  'Productivity sprints',
                  'Coding goals',
                  'Shipping milestones',
                  'Focus tasks',
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-white/80"
                  >
                    <span className="text-[#d4af37]">→</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
