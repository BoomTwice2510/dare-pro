'use client';

import { useMemo, useState } from 'react';
import { Header } from '@/components/header';
import { DareCard } from '@/components/dare-card';
import { HowItWorksModal } from '@/components/how-it-works-modal';
import Link from 'next/link';
import { useReadContract, useReadContracts } from 'wagmi';
import { Dare, DareStatus } from '@/lib/types';
import { DARE_CONTRACT_ADDRESS, DARE_CONTRACT_ABI } from '@/lib/web3-config';
import { glassStyles } from '@/lib/glass-styles';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';

// Helper to convert contract tuple response to Dare object
function parseDareResponse(index: number, data: any): Dare {
  if (!data || !Array.isArray(data)) {
    throw new Error(`Invalid dare response for index ${index}`);
  }

const [
  creator,
  accepter,
  description,
  token,
  stake,
  createdAt,
  deadline,
  proofSubmitted,
  proofURI,
  proofTime,
  disputeTime,
  status,
] = data;

if (
  !creator ||
  stake === undefined ||
  status === undefined
) {
  throw new Error(`Incomplete dare data for index ${index}`);
}

return {
  id: index,
  creator,
  accepter,
  description,
  token,
  stake,
  createdAt: Number(createdAt) * 1000,
  deadline: Number(deadline) * 1000,
  proofSubmitted,
  proofURI,
  proofTime: Number(proofTime) * 1000,
  disputeTime: Number(disputeTime) * 1000,
  status: Number(status),
};
}

export default function DaresPage() {
  const [filter, setFilter] = useState<'all' | 'open' | 'active' | 'resolved'>('all');
  const [error, setError] = useState<string>('');
  const { isConnected } = useAccount();

  // Read dareCount
  const { data: dareCount } = useReadContract({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    functionName: 'dareCount',
    query: { enabled: true },
  });

  // Build contracts array for multiread
  const contracts = useMemo(() => {
    if (!dareCount) {
      console.log('[v0] dareCount not ready');
      return [];
    }

    const count = Number(dareCount);
    console.log('[v0] dareCount:', count);

    if (count === 0) {
      console.log('[v0] No dares in contract');
      return [];
    }

    const contractsList = Array.from({ length: count }, (_, i) => ({
      address: DARE_CONTRACT_ADDRESS,
      abi: DARE_CONTRACT_ABI,
      functionName: 'getDare' as const,
      args: [BigInt(i)], // CRITICAL: Must be BigInt, not number
    }));

    console.log('[v0] contracts.length:', contractsList.length);
    return contractsList;
  }, [dareCount]);

  // Read all dares using multicall
  const { data: rawDares, isLoading, isError, error: readError } = useReadContracts({
    contracts,
    query: { enabled: contracts.length > 0 },
  });

  // Parse the raw responses into Dare objects
  const dares = useMemo(() => {
    if (!rawDares || rawDares.length === 0) {
      console.log('[v0] No raw dare data');
      return [];
    }

    console.log('[v0] Processing raw dare responses, count:', rawDares.length);

    const daresList: Dare[] = [];
    const errors: string[] = [];

    rawDares.forEach((result, index) => {
      try {
        if (result.status === 'success' && result.result) {
          const dare = parseDareResponse(index, result.result);
          console.log(
            `[v0] Dare ${index}: status=${dare.status}, accepter=${dare.accepter}, description="${dare.description.slice(0, 30)}..."`
          );
          daresList.push(dare);
        } else if (result.status === 'failure') {
          errors.push(`Failed to fetch dare ${index}: ${result.error?.message}`);
          console.error(`[v0] Failed to fetch dare ${index}:`, result.error);
        }
      } catch (err) {
        errors.push(`Error parsing dare ${index}`);
        console.error(`[v0] Error parsing dare ${index}:`, err);
      }
    });

    if (errors.length > 0) {
      setError(errors[0]);
    }

    console.log('[v0] Successfully parsed dares:', daresList.length);
    return daresList;
  }, [rawDares]);

  // Apply filters
  const filteredDares = useMemo(() => {
    if (filter === 'all') return dares;

    if (filter === 'open') {
      return dares.filter(
        (dare) =>
          dare.status === DareStatus.Open &&
          dare.accepter === '0x0000000000000000000000000000000000000000'
      );
    }

    if (filter === 'active') {
      return dares.filter(
        (dare) =>
          dare.status === DareStatus.Running ||
          dare.status === DareStatus.ProofSubmitted ||
          dare.status === DareStatus.Disputed
      );
    }

    if (filter === 'resolved') {
      return dares.filter(
        (dare) => dare.status === DareStatus.Resolved || dare.status === DareStatus.Cancelled
      );
    }

    return dares;
  }, [dares, filter]);

  // Define loading state: data-driven, not flag-driven
  // CRITICAL: loading = true ONLY when we're still waiting for data
  const loading = dareCount === undefined || (contracts.length > 0 && rawDares === undefined);
  const hasError = isError || (dareCount && Number(dareCount) > 0 && dares.length === 0);

  console.log('[v0] Render state:', { 
    loading, 
    dareCount: dareCount ? Number(dareCount) : 'undefined',
    contractsCount: contracts.length, 
    rawDaresCount: rawDares?.length,
    parsedDaresCount: dares.length,
    hasError,
  });

  const handleAction = async (dareId: number, action: string) => {
    console.log(`[v0] Action: ${action} on dare ${dareId}`);
  };

  const handleTransactionComplete = () => {
    console.log('[v0] Transaction completed, refetching dares');
    // Trigger a refetch by invalidating the query
    // The useReadContracts hook will automatically refetch when contracts array changes
    // For now, we just log - the parent component should handle refetch
  };

  return (
    <main style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
      <Header />

      <section className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="space-y-8">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <h1
              className="text-3xl font-bold"
              style={{
                background: 'linear-gradient(to right, #d4af37, #e6c547)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Explore Dares
            </h1>
            <div className="flex gap-3 items-center">
              <HowItWorksModal />
              <Link href="/create">
                <button style={glassStyles.btnGold}>+ Create Dare</button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'open', 'active', 'resolved'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as 'all' | 'open' | 'active' | 'resolved')}
                style={
                  filter === f
                    ? { ...glassStyles.glassGold, color: '#d4af37' }
                    : { ...glassStyles.glass, color: 'rgba(255, 255, 255, 0.7)' }
                }
                className="px-4 py-2 rounded-lg font-medium transition-all hover:text-white"
              >
                {f === 'all' ? 'All Dares' : f === 'open' ? 'Open' : f === 'active' ? 'Active' : 'Resolved'}
              </button>
            ))}
          </div>

          {/* Error State */}
          {hasError && !loading && (
            <div className="text-center py-12 rounded-2xl border-2 border-red-500/50" style={{ ...glassStyles.glass }}>
              <p className="text-red-400 mb-2 text-lg font-semibold">Error Loading Dares</p>
              <p className="text-white/60 mb-6">
                {error || `Failed to load dares (dareCount: ${dareCount ? Number(dareCount) : 0}, loaded: ${dares.length})`}
              </p>
              <button
                onClick={() => window.location.reload()}
                style={glassStyles.btnGold}
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-white/60">Loading dares...</p>
            </div>
          )}

          {/* Empty State - No dares created */}
          {!loading && !hasError && dareCount && Number(dareCount) === 0 && (
            <div className="text-center py-12 rounded-2xl" style={glassStyles.glass}>
              <p className="text-white mb-2 text-lg font-semibold">No dares yet</p>
              <p className="text-white/60 mb-6">Be the first to create a dare and put real stakes behind your commitment</p>
              <Link href="/create">
                <button style={glassStyles.btnGold}>Create the First Dare</button>
              </Link>
            </div>
          )}

          {/* Filter Result Empty State */}
          {!loading && !hasError && dares.length > 0 && filteredDares.length === 0 && (
            <div className="text-center py-12 rounded-2xl" style={glassStyles.glass}>
              <p className="text-white mb-2 text-lg font-semibold">
                {filter === 'open' ? 'No Open Dares' : filter === 'active' ? 'No Active Dares' : 'No Resolved Dares'}
              </p>
              <p className="text-white/60 mb-6">
                {filter === 'open' 
                  ? 'All dares have been accepted. Create a new one or check active dares'
                  : filter === 'active'
                  ? 'No dares in progress. Check open dares or create a new one'
                  : 'No resolved dares yet. Complete an active dare to see it here'}
              </p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setFilter('all')}
                  style={glassStyles.glass}
                  className="px-4 py-2 rounded-lg text-white/70 hover:text-white"
                >
                  View All Dares
                </button>
                <Link href="/create">
                  <button style={glassStyles.btnGold}>Create Dare</button>
                </Link>
              </div>
            </div>
          )}

          {/* Dares Grid */}
          {!loading && !hasError && filteredDares.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDares.map(dare => (
                <DareCard
                  key={dare.id}
                  dare={dare}
                  onAction={handleAction}
                  isLoading={false}
                  onTransactionComplete={handleTransactionComplete}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
