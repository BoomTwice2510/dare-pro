'use client';

import React from 'react';
import { glassStyles } from '@/lib/glass-styles';

interface XPUtilityDisplayProps {
  currentXP: number;
  tier?: 'bronze' | 'silver' | 'gold' | 'elite';
  feeDiscount?: number;
  showProgressBar?: boolean;
}

const XP_THRESHOLDS = {
  bronze: { min: 0, max: 1000, discount: 0 },
  silver: { min: 1000, max: 5000, discount: 5 },
  gold: { min: 5000, max: 15000, discount: 15 },
  elite: { min: 15000, max: Infinity, discount: 25 },
};

const TIER_COLORS = {
  bronze: { primary: '#cd7f32', secondary: '#8b5a2b' },
  silver: { primary: '#c0c0c0', secondary: '#696969' },
  gold: { primary: '#d4af37', secondary: '#aa8c2c' },
  elite: { primary: '#7851a9', secondary: '#4a2c5e' },
};

function getTierFromXP(xp: number): 'bronze' | 'silver' | 'gold' | 'elite' {
  if (xp < 1000) return 'bronze';
  if (xp < 5000) return 'silver';
  if (xp < 15000) return 'gold';
  return 'elite';
}

function getNextTierThreshold(tier: 'bronze' | 'silver' | 'gold' | 'elite'): number {
  const thresholds = {
    bronze: 1000,
    silver: 5000,
    gold: 15000,
    elite: Infinity,
  };
  return thresholds[tier];
}

function getCurrentTierMin(tier: 'bronze' | 'silver' | 'gold' | 'elite'): number {
  const thresholds = {
    bronze: 0,
    silver: 1000,
    gold: 5000,
    elite: 15000,
  };
  return thresholds[tier];
}

export function XPUtilityDisplay({
  currentXP,
  tier: propTier,
  feeDiscount: propDiscount,
  showProgressBar = true,
}: XPUtilityDisplayProps) {
  const tier = propTier || getTierFromXP(currentXP);
  const feeDiscount = propDiscount !== undefined ? propDiscount : XP_THRESHOLDS[tier].discount;
  const colors = TIER_COLORS[tier];

  const nextTierThreshold = getNextTierThreshold(tier);
  const currentTierMin = getCurrentTierMin(tier);
  const progressToNextTier =
    tier === 'elite'
      ? 100
      : ((currentXP - currentTierMin) / (nextTierThreshold - currentTierMin)) * 100;

  const xpToNextTier = tier === 'elite' ? 0 : nextTierThreshold - currentXP;

  return (
    <div className="w-full max-w-md">
      {/* Main Card */}
      <div
        className="p-6 rounded-xl transition-all hover:shadow-lg"
        style={{
          ...glassStyles.glass,
          backgroundColor: `rgba(255, 255, 255, 0.03)`,
          borderColor: `${colors.primary}40`,
          borderWidth: '2px',
        }}
      >
        {/* Header with Tier */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm text-white/60 uppercase tracking-widest mb-1">Current XP</p>
            <p className="text-4xl font-bold text-white">{currentXP.toLocaleString()}</p>
          </div>

          {/* Tier Badge */}
          <div
            className="px-4 py-2 rounded-lg font-bold uppercase text-sm tracking-wider"
            style={{
              backgroundColor: `${colors.primary}20`,
              color: colors.primary,
              border: `1px solid ${colors.primary}60`,
              boxShadow: `0 0 12px ${colors.primary}30`,
            }}
          >
            {tier}
          </div>
        </div>

        {/* Fee Discount Display */}
        <div
          className="p-4 rounded-lg mb-6 border"
          style={{
            backgroundColor: `${colors.primary}10`,
            borderColor: `${colors.primary}30`,
          }}
        >
          <p className="text-xs text-white/60 uppercase tracking-widest mb-1">Transaction Fee Discount</p>
          <p className="text-3xl font-bold" style={{ color: colors.primary }}>
            {feeDiscount}%
          </p>
        </div>

        {/* Progress Bar */}
        {showProgressBar && tier !== 'elite' && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-white/60 uppercase tracking-widest">Progress to Next Tier</p>
              <p className="text-xs font-mono text-white/60">
                {xpToNextTier.toLocaleString()} XP remaining
              </p>
            </div>

            {/* Progress Bar Background */}
            <div
              className="relative h-3 rounded-full overflow-hidden border"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Progress Bar Fill */}
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${progressToNextTier}%`,
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                  boxShadow: `0 0 8px ${colors.primary}80`,
                }}
              />
            </div>

            {/* Percentage Text */}
            <p className="text-xs text-white/60 mt-2 text-center">
              {Math.round(progressToNextTier)}% complete
            </p>
          </div>
        )}

        {/* Elite Tier Message */}
        {tier === 'elite' && (
          <div className="mb-4">
            <div
              className="p-3 rounded-lg text-center border"
              style={{
                backgroundColor: `${colors.primary}15`,
                borderColor: `${colors.primary}40`,
              }}
            >
              <p
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: colors.primary }}
              >
                🏆 Maximum Tier Reached
              </p>
            </div>
          </div>
        )}

        {/* Tier Benefits */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-xs text-white/60 uppercase tracking-widest mb-3">Tier Benefits</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-white/70">
              <span style={{ color: colors.primary }}>✓</span>
              {feeDiscount}% transaction fee discount
            </li>
            <li className="flex items-center gap-2 text-white/70">
              <span style={{ color: colors.primary }}>✓</span>
              Enhanced reputation weight
            </li>
            <li className="flex items-center gap-2 text-white/70">
              <span style={{ color: colors.primary }}>✓</span>
              Priority in dispute resolution
            </li>
          </ul>
        </div>
      </div>

      {/* Mini Tier Info */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {(Object.keys(XP_THRESHOLDS) as Array<'bronze' | 'silver' | 'gold' | 'elite'>).map(
          tierName => {
            const tierColors = TIER_COLORS[tierName];
            const isCurrentTier = tier === tierName;
            return (
              <div
                key={tierName}
                className="p-2 rounded-lg text-center text-xs font-semibold uppercase border transition-all"
                style={{
                  backgroundColor: isCurrentTier ? `${tierColors.primary}20` : 'rgba(255, 255, 255, 0.05)',
                  borderColor: isCurrentTier ? `${tierColors.primary}60` : 'rgba(255, 255, 255, 0.1)',
                  color: isCurrentTier ? tierColors.primary : 'rgba(255, 255, 255, 0.6)',
                  boxShadow: isCurrentTier ? `0 0 12px ${tierColors.primary}40` : 'none',
                }}
              >
                {tierName}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
