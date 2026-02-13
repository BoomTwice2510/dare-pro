'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/header';
import { glassStyles } from '@/lib/glass-styles';
import Link from 'next/link';
import { Award, TrendingUp, Zap, AlertCircle, ArrowRight } from 'lucide-react';

// Types
interface UserStats {
  address: string;
  xp: number;
  rank: string;
  winRate: number;
  totalVolume: number;
  totalEarnings: number;
  rageQuits: number;
  disputesWon: number;
  disputesLost: number;
}

interface DareRecord {
  id: number;
  title: string;
  stake: number;
  result: 'Win' | 'Loss' | 'Pending';
  date: number;
  opponent: string;
}

// Dummy user stats
const generateUserStats = (address: string): UserStats => ({
  address,
  xp: 2450,
  rank: 'Legendary',
  winRate: 78,
  totalVolume: 42.5,
  totalEarnings: 28.3,
  rageQuits: 2,
  disputesWon: 5,
  disputesLost: 1,
});

// Dummy dare records
const DUMMY_ACTIVE_DARES: DareRecord[] = [
  {
    id: 1,
    title: 'Run 50km in 24 hours',
    stake: 5.5,
    result: 'Pending',
    date: Date.now() - 3600000,
    opponent: '0xF1A2...4D6C',
  },
  {
    id: 2,
    title: 'Learn Solidity in 7 days',
    stake: 2.0,
    result: 'Pending',
    date: Date.now() - 7200000,
    opponent: '0x5E2D...8F3A',
  },
];

const DUMMY_PAST_DARES: DareRecord[] = [
  {
    id: 3,
    title: 'Complete 30 days no sugar',
    stake: 3.0,
    result: 'Win',
    date: Date.now() - 2592000000,
    opponent: '0xD3F1...2A8E',
  },
  {
    id: 4,
    title: 'Read 4 books in a month',
    stake: 1.5,
    result: 'Win',
    date: Date.now() - 2678400000,
    opponent: '0x8F9A...1C4B',
  },
  {
    id: 5,
    title: 'Gym 4x per week challenge',
    stake: 2.5,
    result: 'Loss',
    date: Date.now() - 2764800000,
    opponent: '0x2B5C...7E9A',
  },
  {
    id: 6,
    title: 'Build NFT smart contract',
    stake: 4.0,
    result: 'Win',
    date: Date.now() - 2851200000,
    opponent: '0xA9E3...5F2C',
  },
  {
    id: 7,
    title: 'Learn Spanish A1 level',
    stake: 1.8,
    result: 'Win',
    date: Date.now() - 2937600000,
    opponent: '0x7a3E...9B8F',
  },
  {
    id: 8,
    title: 'Run half marathon',
    stake: 6.0,
    result: 'Loss',
    date: Date.now() - 3024000000,
    opponent: '0xC1D5...3E7A',
  },
];

const DUMMY_DISPUTES: DareRecord[] = [
  {
    id: 9,
    title: 'Complete 50 pull-ups test',
    stake: 3.5,
    result: 'Win',
    date: Date.now() - 1209600000,
    opponent: '0xB2F4...6C9D',
  },
  {
    id: 10,
    title: 'Code review challenge',
    stake: 2.0,
    result: 'Loss',
    date: Date.now() - 1296000000,
    opponent: '0x9E3A...2K5L',
  },
];

// Format date helper
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Stat card component
function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div style={glassStyles.glass} className="p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <Icon className="text-yellow-500 w-6 h-6" />
      </div>
    </div>
  );
}

// Dare row component
function DareRow({ dare }: { dare: DareRecord }) {
  const resultColor =
    dare.result === 'Win'
      ? 'text-green-400'
      : dare.result === 'Loss'
        ? 'text-red-400'
        : 'text-yellow-400';

  return (
    <Link href={`/dare/${dare.id}`}>
      <div
        style={glassStyles.glass}
        className="p-4 rounded-lg hover:bg-white/10 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h4 className="text-white font-semibold mb-2 group-hover:text-yellow-400 transition-colors">
              {dare.title}
            </h4>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>vs {dare.opponent}</span>
              <span>Stake: {dare.stake.toFixed(2)} ETH</span>
              <span>{formatDate(dare.date)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`font-bold ${resultColor}`}>{dare.result}</span>
            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ProfilePage() {
  const params = useParams();
  const address = (params.address as string) || '0x742d35Cc6634C0532925a3b844Bc9e7595f42e03';
  const [activeTab, setActiveTab] = useState<'active' | 'past' | 'disputes'>(
    'active'
  );

  const stats = useMemo(() => generateUserStats(address), [address]);

  const displayDares = useMemo(() => {
    switch (activeTab) {
      case 'active':
        return DUMMY_ACTIVE_DARES;
      case 'past':
        return DUMMY_PAST_DARES;
      case 'disputes':
        return DUMMY_DISPUTES;
      default:
        return [];
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 pt-20 pb-12">
        {/* Profile Header Section */}
        <div style={glassStyles.glassGold} className="p-8 rounded-2xl mb-12">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
              <p className="text-gray-300 text-lg font-mono">{address}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-yellow-500 mb-2">
                {stats.xp}
              </div>
              <p className="text-gray-300">XP Points</p>
            </div>
          </div>

          {/* Rank and Badge */}
          <div className="flex items-center gap-3 mb-8">
            <Award className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-400">Rank</p>
              <p className="text-2xl font-bold text-white">{stats.rank}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Win Rate" value={`${stats.winRate}%`} icon={TrendingUp} />
            <StatCard
              label="Total Volume"
              value={`${stats.totalVolume} ETH`}
              icon={Zap}
            />
            <StatCard
              label="Total Earnings"
              value={`${stats.totalEarnings} ETH`}
              icon={Award}
            />
            <StatCard
              label="Rage Quits"
              value={stats.rageQuits}
              icon={AlertCircle}
            />
          </div>

          {/* Disputes Summary */}
          <div className="mt-6 pt-6 border-t border-yellow-500/20">
            <div className="flex gap-8">
              <div>
                <p className="text-sm text-gray-400">Disputes Won</p>
                <p className="text-2xl font-bold text-green-400">
                  {stats.disputesWon}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Disputes Lost</p>
                <p className="text-2xl font-bold text-red-400">
                  {stats.disputesLost}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div>
          <div className="flex gap-4 mb-8 border-b border-gray-700">
            {(['active', 'past', 'disputes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === tab
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Dares
              </button>
            ))}
          </div>

          {/* Dares List */}
          <div className="space-y-4">
            {displayDares.length > 0 ? (
              displayDares.map((dare) => (
                <DareRow key={dare.id} dare={dare} />
              ))
            ) : (
              <div
                style={glassStyles.glass}
                className="p-8 rounded-lg text-center"
              >
                <p className="text-gray-400 text-lg">
                  No {activeTab} dares yet
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
