'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/header';
import { glassStyles } from '@/lib/glass-styles';
import Link from 'next/link';
import { Trophy, Zap, TrendingUp, Users } from 'lucide-react';

// Types
interface LeaderboardUser {
  rank: number;
  wallet: string;
  winRate: number;
  totalVolume: number;
  earnings: number;
  daresPlayed: number;
}

// Dummy Data
const DUMMY_USERS: LeaderboardUser[] = [
  {
    rank: 1,
    wallet: '0x742d...42e03',
    winRate: 94.5,
    totalVolume: 2847.5,
    earnings: 156.32,
    daresPlayed: 127,
  },
  {
    rank: 2,
    wallet: '0x8F1A...5C9E',
    winRate: 89.2,
    totalVolume: 2156.8,
    earnings: 128.47,
    daresPlayed: 112,
  },
  {
    rank: 3,
    wallet: '0xB3E7...2F4D',
    winRate: 87.6,
    totalVolume: 1956.3,
    earnings: 115.92,
    daresPlayed: 98,
  },
  {
    rank: 4,
    wallet: '0xD5C2...8A7F',
    winRate: 82.1,
    totalVolume: 1642.9,
    earnings: 94.28,
    daresPlayed: 86,
  },
  {
    rank: 5,
    wallet: '0x1E8B...6D3C',
    winRate: 78.9,
    totalVolume: 1523.4,
    earnings: 87.15,
    daresPlayed: 79,
  },
  {
    rank: 6,
    wallet: '0xA9F2...4E5B',
    winRate: 75.3,
    totalVolume: 1378.2,
    earnings: 78.64,
    daresPlayed: 73,
  },
  {
    rank: 7,
    wallet: '0x7C3E...9D1A',
    winRate: 71.8,
    totalVolume: 1205.6,
    earnings: 68.92,
    daresPlayed: 64,
  },
  {
    rank: 8,
    wallet: '0xF6B1...2C8E',
    winRate: 68.4,
    totalVolume: 1089.3,
    earnings: 61.47,
    daresPlayed: 58,
  },
  {
    rank: 9,
    wallet: '0x3A5D...7E9B',
    winRate: 64.7,
    totalVolume: 956.8,
    earnings: 54.21,
    daresPlayed: 52,
  },
  {
    rank: 10,
    wallet: '0xE2C9...1F4A',
    winRate: 61.2,
    totalVolume: 842.5,
    earnings: 47.38,
    daresPlayed: 48,
  },
];

// Medal styles for top 3
const getMedalStyle = (rank: number): string => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    case 2:
      return 'bg-gradient-to-r from-slate-400 to-slate-500';
    case 3:
      return 'bg-gradient-to-r from-orange-600 to-orange-700';
    default:
      return '';
  }
};

const getMedalEmoji = (rank: number): string => {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return '';
  }
};

type TabType = 'earners' | 'winrate' | 'active' | 'risktakers';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  sortFn: (users: LeaderboardUser[]) => LeaderboardUser[];
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('earners');

  const tabs: TabConfig[] = [
    {
      id: 'earners',
      label: 'Top Earners',
      icon: <TrendingUp size={18} />,
      sortFn: (users) =>
        [...users].sort((a, b) => b.earnings - a.earnings).slice(0, 10),
    },
    {
      id: 'winrate',
      label: 'Highest Win Rate',
      icon: <Trophy size={18} />,
      sortFn: (users) =>
        [...users].sort((a, b) => b.winRate - a.winRate).slice(0, 10),
    },
    {
      id: 'active',
      label: 'Most Active',
      icon: <Users size={18} />,
      sortFn: (users) =>
        [...users].sort((a, b) => b.daresPlayed - a.daresPlayed).slice(0, 10),
    },
    {
      id: 'risktakers',
      label: 'Biggest Risk Takers',
      icon: <Zap size={18} />,
      sortFn: (users) =>
        [...users].sort((a, b) => b.totalVolume - a.totalVolume).slice(0, 10),
    },
  ];

  const displayedUsers = useMemo(() => {
    const activeTabConfig = tabs.find((t) => t.id === activeTab);
    if (!activeTabConfig) return [];
    return activeTabConfig.sortFn(DUMMY_USERS).map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Trophy
              size={32}
              style={{
                background: 'linear-gradient(135deg, #d4af37, #e6c547)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            />
            <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
          </div>
          <p className="text-white/60">
            Top performers in the Dare Protocol ecosystem
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 md:gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-black'
                  : 'text-white/70 hover:text-white/90'
              }`}
              style={
                activeTab === tab.id
                  ? {
                      background: 'linear-gradient(to right, #d4af37, #e6c547)',
                    }
                  : {
                      ...glassStyles.glass,
                    }
              }
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden text-xs">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={glassStyles.glass}
        >
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">
                    Wallet
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">
                    Win Rate
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">
                    Total Volume
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">
                    Earnings
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">
                    Dares Played
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map((user, index) => {
                  const medalStyle = getMedalStyle(user.rank);
                  const medal = getMedalEmoji(user.rank);

                  return (
                    <tr
                      key={user.wallet}
                      className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
                        user.rank <= 3
                          ? 'bg-white/5'
                          : index % 2 === 0
                            ? 'bg-transparent'
                            : 'bg-white/[0.02]'
                      }`}
                    >
                      {/* Rank with Medal */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.rank <= 3 ? (
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-white ${medalStyle}`}
                            >
                              {medal}
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white/60 bg-white/5">
                              #{user.rank}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Wallet */}
                      <td className="px-6 py-4">
                        <Link
                          href={`/profile/${user.wallet}`}
                          className="font-mono text-[#d4af37] hover:text-[#e6c547] transition-colors text-sm sm:text-base"
                        >
                          {user.wallet}
                        </Link>
                      </td>

                      {/* Win Rate */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#d4af37] to-[#e6c547]"
                              style={{
                                width: `${user.winRate}%`,
                              }}
                            />
                          </div>
                          <span className="text-white font-semibold min-w-12">
                            {user.winRate.toFixed(1)}%
                          </span>
                        </div>
                      </td>

                      {/* Total Volume */}
                      <td className="px-6 py-4 text-right text-white">
                        <span className="font-mono text-sm sm:text-base">
                          {user.totalVolume.toFixed(1)} ETH
                        </span>
                      </td>

                      {/* Earnings */}
                      <td className="px-6 py-4 text-right">
                        <span
                          className="font-mono font-semibold text-sm sm:text-base"
                          style={{
                            background: 'linear-gradient(to right, #d4af37, #e6c547)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {user.earnings.toFixed(2)} ETH
                        </span>
                      </td>

                      {/* Dares Played */}
                      <td className="px-6 py-4 text-right text-white/80">
                        {user.daresPlayed}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden p-4 space-y-3">
            {displayedUsers.map((user) => {
              const medalStyle = getMedalStyle(user.rank);
              const medal = getMedalEmoji(user.rank);

              return (
                <div
                  key={user.wallet}
                  className={`p-4 rounded-lg border border-white/10 transition-colors ${
                    user.rank <= 3 ? 'bg-white/5' : 'bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {user.rank <= 3 ? (
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-white ${medalStyle}`}
                        >
                          {medal}
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white/60 bg-white/5">
                          #{user.rank}
                        </div>
                      )}
                      <Link
                        href={`/profile/${user.wallet}`}
                        className="font-mono text-[#d4af37] hover:text-[#e6c547] transition-colors text-sm"
                      >
                        {user.wallet}
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div>
                      <p className="text-white/60 mb-1">Win Rate</p>
                      <p className="text-white font-semibold">
                        {user.winRate.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 mb-1">Volume</p>
                      <p className="text-white font-semibold">
                        {user.totalVolume.toFixed(1)} ETH
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 mb-1">Earnings</p>
                      <p
                        className="font-semibold"
                        style={{
                          background:
                            'linear-gradient(to right, #d4af37, #e6c547)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {user.earnings.toFixed(2)} ETH
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 mb-1">Dares</p>
                      <p className="text-white font-semibold">
                        {user.daresPlayed}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer CTA */}
        <div
          className="mt-12 p-8 rounded-2xl text-center"
          style={glassStyles.glassGold}
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Ready to climb the ranks?
          </h2>
          <p className="text-white/70 mb-6">
            Join thousands of competitors in the Dare Protocol arena
          </p>
          <Link
            href="/create"
            className="inline-block px-8 py-3 rounded-lg font-semibold text-black transition-all hover:shadow-lg"
            style={{
              background: 'linear-gradient(to right, #d4af37, #e6c547)',
            }}
          >
            Create Your First Dare
          </Link>
        </div>
      </main>
    </div>
  );
}
