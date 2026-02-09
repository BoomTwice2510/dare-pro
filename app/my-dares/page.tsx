'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { DareCard } from '@/components/dare-card';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { glassStyles } from '@/lib/glass-styles';
import { useDares } from '@/hooks/useDares';

export default function MyDares() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'created' | 'accepted'>('created');

  // Fetch created dares (where user is creator)
  const {
    filteredDares: createdDares,
    loading: createdLoading,
    hasError: createdError,
  } = useDares(address ? { filterCreator: address } : undefined);

  // Fetch accepted dares (where user is accepter)
  const {
    filteredDares: acceptedDares,
    loading: acceptedLoading,
    hasError: acceptedError,
  } = useDares(address ? { filterAccepter: address } : undefined);

  const loading = createdLoading || acceptedLoading;
  const hasError = createdError || acceptedError;
  const daresToShow = activeTab === 'created' ? createdDares : acceptedDares;

  const handleAction = async (action: string, dareId: number) => {
    console.log(`Action: ${action}, Dare: ${dareId}`);
  };

  const handleTransactionComplete = () => {
    console.log('[v0] Transaction completed in My Dares');
  };

  if (!isConnected) {
    return (
      <main style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
        <Header />
        <section className="pt-32 px-4 text-center">
          <div className="rounded-2xl p-8 max-w-md mx-auto" style={glassStyles.glass}>
            <h1 className="text-2xl font-bold text-white mb-4">Connect Wallet</h1>
            <p className="text-white/60 mb-6">You must connect your wallet to view your dares.</p>
            <Link href="/landing">
              <button style={glassStyles.btnGold} className="w-full">Go Back Home</button>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
      <Header />

      <section className="pt-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-20">
        <div className="space-y-8">
          <div className="flex justify-between items-center gap-4">
            <h1
              className="text-3xl font-bold"
              style={{
                background: 'linear-gradient(to right, #d4af37, #e6c547)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              My Dares
            </h1>
            <Link href="/create">
              <button style={glassStyles.btnGold}>+ Create Dare</button>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('created')}
              style={
                activeTab === 'created'
                  ? { ...glassStyles.glassGold, color: '#d4af37' }
                  : { ...glassStyles.glass, color: 'rgba(255, 255, 255, 0.7)' }
              }
              className="px-6 py-3 rounded-lg font-medium transition-all hover:text-white"
            >
              Created ({createdDares.length})
            </button>
            <button
              onClick={() => setActiveTab('accepted')}
              style={
                activeTab === 'accepted'
                  ? { ...glassStyles.glassGold, color: '#d4af37' }
                  : { ...glassStyles.glass, color: 'rgba(255, 255, 255, 0.7)' }
              }
              className="px-6 py-3 rounded-lg font-medium transition-all hover:text-white"
            >
              Accepted ({acceptedDares.length})
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-white/60">Loading your dares...</p>
            </div>
          ) : daresToShow.length === 0 ? (
            <div className="text-center py-12 rounded-2xl" style={glassStyles.glass}>
              <p className="text-white/60 mb-4">
                No {activeTab === 'created' ? 'created' : 'accepted'} dares yet
              </p>
              <Link href={activeTab === 'created' ? '/create' : '/'}>
                <button style={glassStyles.btnGold}>
                  {activeTab === 'created' ? 'Create a Dare' : 'Explore & Accept'}
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {daresToShow.map(dare => (
                <DareCard
                  key={dare.id}
                  dare={dare}
                  onAction={handleAction}
                  isLoading={loading}
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
