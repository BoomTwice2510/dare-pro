'use client';

import { useEffect, useRef, useState } from 'react';

interface ActivityEntry {
  id: string;
  walletAddress: string;
  action: 'created' | 'won' | 'lost' | 'disputed';
  ethAmount?: number;
  timestamp: number;
}

const mockActivityData: ActivityEntry[] = [
  {
    id: '1',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f42e03',
    action: 'created',
    ethAmount: 2.5,
    timestamp: Date.now() - 2 * 60000,
  },
  {
    id: '2',
    walletAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    action: 'won',
    ethAmount: 1.75,
    timestamp: Date.now() - 5 * 60000,
  },
  {
    id: '3',
    walletAddress: '0x1234567890123456789012345678901234567890',
    action: 'lost',
    ethAmount: 0.5,
    timestamp: Date.now() - 8 * 60000,
  },
  {
    id: '4',
    walletAddress: '0x9876543210987654321098765432109876543210',
    action: 'disputed',
    timestamp: Date.now() - 12 * 60000,
  },
  {
    id: '5',
    walletAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    action: 'created',
    ethAmount: 3.2,
    timestamp: Date.now() - 15 * 60000,
  },
  {
    id: '6',
    walletAddress: '0x1111111111111111111111111111111111111111',
    action: 'won',
    ethAmount: 2.1,
    timestamp: Date.now() - 20 * 60000,
  },
  {
    id: '7',
    walletAddress: '0x2222222222222222222222222222222222222222',
    action: 'created',
    ethAmount: 1.5,
    timestamp: Date.now() - 25 * 60000,
  },
  {
    id: '8',
    walletAddress: '0x3333333333333333333333333333333333333333',
    action: 'disputed',
    timestamp: Date.now() - 30 * 60000,
  },
];

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function getActionText(action: ActivityEntry['action']): string {
  const actionMap = {
    created: 'created a dare',
    won: 'won a dare',
    lost: 'lost a dare',
    disputed: 'disputed a dare',
  };
  return actionMap[action];
}

function getActionColor(action: ActivityEntry['action']): string {
  const colorMap = {
    created: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    won: 'bg-green-500/20 text-green-300 border-green-500/30',
    lost: 'bg-red-500/20 text-red-300 border-red-500/30',
    disputed: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  };
  return colorMap[action];
}

function getActionDotColor(action: ActivityEntry['action']): string {
  const colorMap = {
    created: 'bg-blue-500',
    won: 'bg-green-500',
    lost: 'bg-red-500',
    disputed: 'bg-yellow-500',
  };
  return colorMap[action];
}

interface LiveActivityFeedProps {
  maxItems?: number;
  autoRefreshInterval?: number;
}

export function LiveActivityFeed({
  maxItems = 8,
  autoRefreshInterval = 5000,
}: LiveActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityEntry[]>(mockActivityData);
  const [newItemCount, setNewItemCount] = useState(0);
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const lastRefreshRef = useRef<number>(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new activity arriving
      const randomAction = ['created', 'won', 'lost', 'disputed'][
        Math.floor(Math.random() * 4)
      ] as ActivityEntry['action'];

      const randomWallet = `0x${Math.random().toString(16).slice(2, 42)}`;
      const newActivity: ActivityEntry = {
        id: `${Date.now()}`,
        walletAddress: randomWallet,
        action: randomAction,
        ethAmount: randomAction !== 'disputed' ? Math.random() * 5 : undefined,
        timestamp: Date.now(),
      };

      setActivities(prev => [newActivity, ...prev.slice(0, maxItems - 1)]);
      setNewItemCount(prev => prev + 1);

      // Auto-scroll to top
      if (feedContainerRef.current) {
        feedContainerRef.current.scrollTop = 0;
      }
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, [maxItems, autoRefreshInterval]);

  const displayActivities = activities.slice(0, maxItems);

  return (
    <div
      className="w-full h-full flex flex-col"
      style={{
        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '1rem',
      }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Live Activity</h2>
        {newItemCount > 0 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
            +{newItemCount} new
          </span>
        )}
      </div>

      {/* Scrollable Feed Container */}
      <div
        ref={feedContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-3"
      >
        {displayActivities.length > 0 ? (
          displayActivities.map((activity, index) => (
            <div
              key={activity.id}
              className="animate-in fade-in slide-in-from-top-2 duration-500"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div className="flex gap-3 items-start p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors hover:bg-white/5">
                {/* Status Indicator */}
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${getActionDotColor(activity.action)}`} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-mono text-sm text-white/80">
                      {formatAddress(activity.walletAddress)}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-md border font-medium ${getActionColor(activity.action)}`}
                    >
                      {getActionText(activity.action)}
                    </span>
                  </div>

                  {/* Amount + Timestamp */}
                  <div className="flex items-center gap-2 mt-2">
                    {activity.ethAmount !== undefined && (
                      <span className="text-xs font-semibold text-[#d4af37]">
                        {activity.ethAmount.toFixed(2)} ETH
                      </span>
                    )}
                    <span className="text-xs text-white/50">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-center py-8">
            <p className="text-white/50 text-sm">No activity yet. Be the first to act!</p>
          </div>
        )}
      </div>
    </div>
  );
}
