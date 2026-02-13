'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { ShareableDareCard } from '@/components/shareable-dare-card';
import { XPUtilityDisplay } from '@/components/xp-utility-display';
import { LiveActivityFeed } from '@/components/live-activity-feed';
import { useLiveDareEvents } from '@/hooks/use-live-dare-events';
import { glassStyles } from '@/lib/glass-styles';
import Link from 'next/link';

export default function ComponentsShowcase() {
  const liveEvents = useLiveDareEvents();

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh' }} className="py-12 px-4 sm:px-6 lg:px-8">
      <Header />
      
      <div className="max-w-7xl mx-auto space-y-16 mt-8">
        {/* Title Section */}
        <div className="text-center space-y-4">
          <h1
            className="text-5xl sm:text-6xl font-bold"
            style={{
              background: 'linear-gradient(to right, #d4af37, #e6c547)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Component Showcase
          </h1>
          <p className="text-white/70 text-lg">
            All new components and features are displayed below
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/arena">
            <button style={glassStyles.btnGold} className="px-6 py-2 text-sm font-bold hover:shadow-xl transition-all">
              View Arena
            </button>
          </Link>
          <Link href="/leaderboard">
            <button style={glassStyles.btnGold} className="px-6 py-2 text-sm font-bold hover:shadow-xl transition-all">
              View Leaderboard
            </button>
          </Link>
          <Link href="/profile/0x742d35Cc6634C0532925a3b844Bc9e7595f42e03">
            <button style={glassStyles.btnGold} className="px-6 py-2 text-sm font-bold hover:shadow-xl transition-all">
              View Profile
            </button>
          </Link>
        </div>

        {/* Section 1: Shareable Dare Card */}
        <section className="space-y-6">
          <div className="text-center">
            <h2
              className="text-3xl font-bold mb-2"
              style={{
                background: 'linear-gradient(to right, #d4af37, #e6c547)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              1. Shareable Dare Card
            </h2>
            <p className="text-white/60">Twitter-optimized card (1200x630) for sharing dares</p>
          </div>
          
          <div className="flex justify-center">
            <ShareableDareCard
              title="Run 50km in 24 hours"
              creator="0x742d...42e03"
              opponent="0x8F1A...5C9E"
              stakeAmount={5.5}
              deadline="18 hours"
              status="active"
            />
          </div>
        </section>

        {/* Section 2: XP Utility Display */}
        <section className="space-y-6">
          <div className="text-center">
            <h2
              className="text-3xl font-bold mb-2"
              style={{
                background: 'linear-gradient(to right, #d4af37, #e6c547)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              2. XP Utility Display Component
            </h2>
            <p className="text-white/60">Shows tier level, fee discount, and XP progress</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex justify-center">
              <XPUtilityDisplay currentXP={2450} showProgressBar={true} />
            </div>
            <div className="flex justify-center">
              <XPUtilityDisplay currentXP={8500} showProgressBar={true} />
            </div>
          </div>
        </section>

        {/* Section 3: Live Activity Feed */}
        <section className="space-y-6">
          <div className="text-center">
            <h2
              className="text-3xl font-bold mb-2"
              style={{
                background: 'linear-gradient(to right, #d4af37, #e6c547)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              3. Live Activity Feed Component
            </h2>
            <p className="text-white/60">Real-time activity stream with auto-updating events (right sidebar)</p>
          </div>

          <div className="relative min-h-96 max-w-6xl mx-auto">
            <LiveActivityFeed maxItems={12} autoRefreshInterval={3000} />
          </div>
        </section>

        {/* Section 4: Live Dare Events Hook */}
        <section className="space-y-6">
          <div className="text-center">
            <h2
              className="text-3xl font-bold mb-2"
              style={{
                background: 'linear-gradient(to right, #d4af37, #e6c547)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              4. Live Dare Events Hook
            </h2>
            <p className="text-white/60">useLiveDareEvents hook data (currently {liveEvents.length} events)</p>
          </div>

          <div 
            className="rounded-2xl p-6 overflow-auto max-h-96"
            style={glassStyles.glassGold}
          >
            <div className="space-y-3">
              {liveEvents.length === 0 ? (
                <p className="text-white/60">Loading events...</p>
              ) : (
                liveEvents.map((event, idx) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor: 'rgba(212, 175, 55, 0.1)',
                      borderLeft: '3px solid #d4af37',
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-semibold text-sm">
                          <span className="text-[#d4af37]">{event.type}</span>
                        </p>
                        <p className="text-white/70 text-xs mt-1">
                          {event.actor} • Dare #{event.dareId}
                        </p>
                        <p className="text-white/60 text-xs mt-1">{event.description}</p>
                      </div>
                      <span className="text-[#d4af37] text-xs font-mono">
                        {Math.floor((Date.now() - event.timestamp) / 1000)}s ago
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Section 5: Pages */}
        <section className="space-y-6">
          <div className="text-center">
            <h2
              className="text-3xl font-bold mb-2"
              style={{
                background: 'linear-gradient(to right, #d4af37, #e6c547)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              5. Full Pages
            </h2>
            <p className="text-white/60">Complete pages with all components integrated</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Arena Page */}
            <Link href="/arena" className="group">
              <div
                className="rounded-2xl p-8 text-center cursor-pointer transition-all hover:shadow-2xl"
                style={glassStyles.glass}
              >
                <div className="text-4xl mb-3">🏟️</div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors">
                  Public Arena
                </h3>
                <p className="text-white/60 text-sm mb-4">
                  Browse all active dares with filters and sorting
                </p>
                <div className="text-[#d4af37] text-sm font-semibold">View Page →</div>
              </div>
            </Link>

            {/* Leaderboard Page */}
            <Link href="/leaderboard" className="group">
              <div
                className="rounded-2xl p-8 text-center cursor-pointer transition-all hover:shadow-2xl"
                style={glassStyles.glass}
              >
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors">
                  Leaderboard
                </h3>
                <p className="text-white/60 text-sm mb-4">
                  See top performers across different metrics
                </p>
                <div className="text-[#d4af37] text-sm font-semibold">View Page →</div>
              </div>
            </Link>

            {/* Profile Page */}
            <Link href="/profile/0x742d35Cc6634C0532925a3b844Bc9e7595f42e03" className="group">
              <div
                className="rounded-2xl p-8 text-center cursor-pointer transition-all hover:shadow-2xl"
                style={glassStyles.glass}
              >
                <div className="text-4xl mb-3">👤</div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors">
                  User Profile
                </h3>
                <p className="text-white/60 text-sm mb-4">
                  View user stats, XP, and dare history
                </p>
                <div className="text-[#d4af37] text-sm font-semibold">View Page →</div>
              </div>
            </Link>
          </div>
        </section>

        {/* Summary Section */}
        <section className="space-y-6 border-t border-white/10 pt-12">
          <div className="text-center">
            <h2
              className="text-3xl font-bold mb-4"
              style={{
                background: 'linear-gradient(to right, #d4af37, #e6c547)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Components Summary
            </h2>
          </div>

          <div 
            className="rounded-2xl p-8"
            style={glassStyles.glass}
          >
            <div className="space-y-4 text-white/80">
              <div className="flex items-start gap-4">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-bold text-white">ShareableDareCard</p>
                  <p className="text-sm">Twitter-optimized 1200x630 card for social sharing with dare details</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-bold text-white">XPUtilityDisplay</p>
                  <p className="text-sm">Premium tier display showing XP, fee tier, discount %, and progress bar</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-bold text-white">LiveActivityFeed</p>
                  <p className="text-sm">Right-sidebar activity feed with real-time event updates and animations</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-bold text-white">useLiveDareEvents Hook</p>
                  <p className="text-sm">React hook maintaining live events array (max 20) with mock WebSocket updates</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-bold text-white">Public Arena Page</p>
                  <p className="text-sm">Full dare browsing with stat cards, filters, and dare cards grid</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-bold text-white">Leaderboard Page</p>
                  <p className="text-sm">Multiple sorting tabs with medals for top 3 and responsive table layout</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-bold text-white">User Profile Page</p>
                  <p className="text-sm">Dynamic routing with user stats, tabs for dares, and dispute summary</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-4 py-12">
          <p className="text-white/70">
            All components are fully functional and ready for production use.
          </p>
          <Link href="/landing">
            <button style={glassStyles.btnGold} className="px-10 py-4 text-lg font-bold hover:shadow-2xl transition-all">
              Back to Landing
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
}
