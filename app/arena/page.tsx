'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/header';
import { glassStyles } from '@/lib/glass-styles';
import Link from 'next/link';
import { ChevronDown, Clock, Users, Zap, TrendingUp } from 'lucide-react';

// Types
interface DareCardData {
  id: number;
  title: string;
  creator: string;
  opponent: string;
  stake: number;
  pool: number;
  endsIn: number; // timestamp
  status: 'Active' | 'Resolved' | 'Disputed';
  createdAt: number;
}

// Dummy Data
const DUMMY_DARES: DareCardData[] = [
  {
    id: 1,
    title: 'Run 50km in 24 hours',
    creator: '0x7a3E...9B8F',
    opponent: '0xF1A2...4D6C',
    stake: 5.5,
    pool: 11.0,
    endsIn: Date.now() + 3600000 * 18, // 18 hours from now
    status: 'Active',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 2,
    title: 'Complete 30 days no sugar challenge',
    creator: '0x2B5C...7E9A',
    opponent: '0xD3F1...2A8E',
    stake: 2.0,
    pool: 4.0,
    endsIn: Date.now() + 3600000 * 720, // 30 days
    status: 'Active',
    createdAt: Date.now() - 604800000,
  },
  {
    id: 3,
    title: 'Learn Solidity basics in 7 days',
    creator: '0x8F9A...1C4B',
    opponent: '0x5E2D...8F3A',
    stake: 3.25,
    pool: 6.5,
    endsIn: Date.now() + 3600000 * 168, // 7 days
    status: 'Active',
    createdAt: Date.now() - 172800000,
  },
  {
    id: 4,
    title: 'Achieve top 1% in Ethereum gas optimization',
    creator: '0x4C1B...9F2E',
    opponent: '0xA9E3...7B5D',
    stake: 8.75,
    pool: 17.5,
    endsIn: Date.now() - 3600000 * 24, // Resolved
    status: 'Resolved',
    createdAt: Date.now() - 1209600000,
  },
  {
    id: 5,
    title: '100 push-ups daily for 30 days',
    creator: '0x6D8E...3C7F',
    opponent: '0x1F4A...9E6B',
    stake: 1.5,
    pool: 3.0,
    endsIn: Date.now() + 3600000 * 480, // 20 days
    status: 'Active',
    createdAt: Date.now() - 432000000,
  },
  {
    id: 6,
    title: 'Write and publish a technical blog post',
    creator: '0x9B2F...5A8D',
    opponent: '0x7E5C...4F2B',
    stake: 2.5,
    pool: 5.0,
    endsIn: Date.now() + 3600000 * 240, // 10 days
    status: 'Active',
    createdAt: Date.now() - 259200000,
  },
  {
    id: 7,
    title: 'Master Web3 security audit',
    creator: '0x3A7D...1E9C',
    opponent: '0xC6F1...8A3E',
    stake: 12.0,
    pool: 24.0,
    endsIn: Date.now() - 3600000 * 48, // Resolved
    status: 'Resolved',
    createdAt: Date.now() - 1814400000,
  },
  {
    id: 8,
    title: 'Build and deploy DApp in 48 hours',
    creator: '0xE2B5...7D4F',
    opponent: '0x4F9A...2C6E',
    stake: 4.0,
    pool: 8.0,
    endsIn: Date.now() + 3600000 * 36, // 36 hours
    status: 'Active',
    createdAt: Date.now() - 86400000,
  },
];

// Stats Component
function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div style={glassStyles.glass} className="flex items-start gap-4 p-6 rounded-xl">
      <div className="p-3 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
        <Icon className="w-6 h-6" style={{ color: '#d4af37' }} />
      </div>
      <div className="flex-1">
        <p className="text-white/60 text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );
}

// Timer Component
function CountdownTimer({ endsIn }: { endsIn: number }) {
  const [timeLeft, setTimeLeft] = useState('');

  useMemo(() => {
    const calculateTime = () => {
      const now = Date.now();
      const diff = endsIn - now;

      if (diff <= 0) {
        setTimeLeft('Ended');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 60000); // Update every minute
    return () => clearInterval(timer);
  }, [endsIn]);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
      <Clock className="w-4 h-4" style={{ color: '#d4af37' }} />
      <span className="text-sm font-medium text-white">{timeLeft || 'Loading...'}</span>
    </div>
  );
}

// Dare Card Component
function DareCard({ dare }: { dare: DareCardData }) {
  const statusColors = {
    Active: 'rgba(34, 197, 94, 0.2)',
    Resolved: 'rgba(59, 130, 246, 0.2)',
    Disputed: 'rgba(239, 68, 68, 0.2)',
  };

  const statusTextColors = {
    Active: '#22c55e',
    Resolved: '#3b82f6',
    Disputed: '#ef4444',
  };

  return (
    <div
      style={glassStyles.glass}
      className="p-6 rounded-2xl flex flex-col gap-4 group hover:border-white/20 transition-all"
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{dare.title}</h3>
          <p className="text-white/50 text-sm font-mono"># {dare.id}</p>
        </div>
        <div
          className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap"
          style={{ background: statusColors[dare.status], color: statusTextColors[dare.status] }}
        >
          {dare.status}
        </div>
      </div>

      {/* Participants */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-sm">Creator</span>
          <span className="text-white font-mono text-sm">{dare.creator}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-sm">Opponent</span>
          <span className="text-white font-mono text-sm">{dare.opponent}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10" />

      {/* Stakes & Pool */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-white/50 text-xs font-medium mb-1">Your Stake</p>
          <p className="text-xl font-bold text-white">{dare.stake.toFixed(2)} ETH</p>
        </div>
        <div>
          <p className="text-white/50 text-xs font-medium mb-1">Total Pool</p>
          <p className="text-xl font-bold" style={{ color: '#d4af37' }}>
            {dare.pool.toFixed(2)} ETH
          </p>
        </div>
      </div>

      {/* Timer */}
      <div className="flex justify-between items-center">
        <span className="text-white/50 text-sm">Time Remaining</span>
        <CountdownTimer endsIn={dare.endsIn} />
      </div>

      {/* Action Button */}
      <Link
        href={`/dares/${dare.id}`}
        className="w-full py-3 rounded-lg font-semibold text-center transition-all"
        style={glassStyles.btnGold}
      >
        View Details
      </Link>
    </div>
  );
}

export default function ArenaPage() {
  const [sortBy, setSortBy] = useState<'highest-stake' | 'ending-soon' | 'newest'>('highest-stake');

  // Calculate stats
  const stats = useMemo(() => {
    const activeDares = DUMMY_DARES.filter((d) => d.status === 'Active');
    const totalPublic = DUMMY_DARES.length;
    const totalVolume = DUMMY_DARES.reduce((sum, d) => sum + d.pool, 0);
    const successRate = ((DUMMY_DARES.filter((d) => d.status === 'Resolved').length / totalPublic) * 100).toFixed(0);

    return {
      totalPublic,
      activeDares: activeDares.length,
      totalVolume: totalVolume.toFixed(2),
      successRate,
    };
  }, []);

  // Sort dares
  const sortedDares = useMemo(() => {
    const sorted = [...DUMMY_DARES];

    if (sortBy === 'highest-stake') {
      return sorted.sort((a, b) => b.stake - a.stake);
    } else if (sortBy === 'ending-soon') {
      return sorted.sort((a, b) => a.endsIn - b.endsIn);
    } else if (sortBy === 'newest') {
      return sorted.sort((a, b) => b.createdAt - a.createdAt);
    }

    return sorted;
  }, [sortBy]);

  return (
    <main style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
      <Header />

      <section className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-3">
            <h1
              className="text-5xl sm:text-6xl font-bold"
              style={{
                background: 'linear-gradient(to right, #d4af37, #e6c547)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Public Arena
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto">
              Live onchain competitive dares where real stakes back real commitment
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Zap} label="Total Public Dares" value={stats.totalPublic.toString()} />
            <StatCard icon={TrendingUp} label="Active Dares" value={stats.activeDares.toString()} />
            <StatCard icon={Users} label="Total Volume (ETH)" value={stats.totalVolume} />
            <StatCard icon={ChevronDown} label="Success Rate" value={`${stats.successRate}%`} />
          </div>

          {/* Filter & Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto">
              {[
                { id: 'highest-stake', label: 'Highest Stake' },
                { id: 'ending-soon', label: 'Ending Soon' },
                { id: 'newest', label: 'Newest' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSortBy(tab.id as typeof sortBy)}
                  className="px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all text-sm"
                  style={
                    sortBy === tab.id
                      ? { ...glassStyles.glassGold, color: '#d4af37' }
                      : { ...glassStyles.glass, color: 'rgba(255, 255, 255, 0.7)' }
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                className="w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                style={{ ...glassStyles.glass, color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Sort By
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dares Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDares.map((dare) => (
              <DareCard key={dare.id} dare={dare} />
            ))}
          </div>

          {/* CTA Section */}
          <div
            className="p-8 rounded-2xl text-center space-y-4"
            style={glassStyles.glassGold}
          >
            <h2 className="text-2xl font-bold text-white">Ready to Accept a Challenge?</h2>
            <p className="text-white/70">Create your own competitive dare and prove your commitment with real stakes.</p>
            <Link
              href="/create"
              className="inline-block px-6 py-3 rounded-lg font-semibold"
              style={glassStyles.btnGold}
            >
              Create a Dare
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
