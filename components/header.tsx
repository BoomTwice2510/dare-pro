'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useWatchContractEvent,
} from 'wagmi';
import { formatAddress } from '@/lib/utils-dare';
import { Toaster, toast } from 'sonner';
import {
  DARE_CONTRACT_ADDRESS,
  DARE_CONTRACT_ABI,
} from '@/lib/web3-config';

export function Header() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* ======================
     ✅ HYDRATION FIX
  ====================== */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ======================
     🔔 NOTIFICATION STATE
  ====================== */
  const [unreadCount, setUnreadCount] = useState(0);

  const incrementUnread = () =>
    setUnreadCount(c => Math.min(c + 1, 99));

  /* ======================
     🔔 CONTRACT EVENTS
  ====================== */

  useWatchContractEvent({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    eventName: 'DareAccepted',
    onLogs(logs) {
      logs.forEach((log: any) => {
        toast.info(`Dare #${log.args.id} accepted`);
        incrementUnread();
      });
    },
  });

  useWatchContractEvent({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    eventName: 'ProofSubmitted',
    onLogs(logs) {
      logs.forEach((log: any) => {
        toast.warning(`Proof submitted for Dare #${log.args.id}`);
        incrementUnread();
      });
    },
  });

  useWatchContractEvent({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    eventName: 'DareResolved',
    onLogs(logs) {
      logs.forEach((log: any) => {
        toast.success(`Dare #${log.args.id} resolved 🎉`);
        incrementUnread();
      });
    },
  });

  useWatchContractEvent({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    eventName: 'DareCancelled',
    onLogs(logs) {
      logs.forEach((log: any) => {
        toast.error(`Dare #${log.args.id} cancelled`);
        incrementUnread();
      });
    },
  });

  const navLinks = [
    { label: 'Explore', href: '/dares' },
    { label: 'Create', href: '/create' },
    { label: 'My Dares', href: '/my-dares' },
    { label: 'Reputation', href: '/reputation' },
    { label: 'Judge Panel', href: '/judge' },
  ];

  const glassStyle = {
    backdropFilter: 'blur(12px)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const glassLightStyle = {
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  };

  const btnGlassStyle = {
    backdropFilter: 'blur(12px)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    color: 'white',
    cursor: 'pointer',
  };

  const btnGoldStyle = {
    padding: '0.5rem 1rem',
    fontWeight: 500,
    borderRadius: '0.75rem',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(to right, #d4af37, #e6c547)',
    color: '#0a0e27',
    border: 'none',
    cursor: 'pointer',
  };

  if (!mounted) return null;

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{ ...glassStyle, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/landing" className="flex items-center gap-2 group">
              <img
                src="/images/logo.png"
                alt="Dare Protocol Logo"
                className="h-8 w-8 group-hover:animate-glow transition-all"
              />
              <span
                className="hidden sm:inline text-lg font-bold"
                style={{
                  background: 'linear-gradient(to right, #d4af37, #e6c547)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                DARE PROTOCOL
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-white/70 hover:text-[#d4af37] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Wallet + Notifications */}
            <div className="flex items-center gap-2">
              {/* 🔔 Notification Bell */}
              <button
                onClick={() => setUnreadCount(0)}
                className="relative"
                style={btnGlassStyle}
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isConnected && address ? (
                <div className="flex items-center gap-2">
                  <div
                    className="px-4 py-2 rounded-lg text-sm font-mono text-[#d4af37]"
                    style={glassLightStyle}
                  >
                    {formatAddress(address)}
                  </div>
                  <button onClick={() => disconnect()} className="text-xs" style={btnGlassStyle}>
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    const connector = connectors[0];
                    if (connector) connect({ connector });
                  }}
                  className="text-sm"
                  style={btnGoldStyle}
                >
                  Connect Wallet
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-lg"
                style={btnGlassStyle}
              >
                ☰
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <nav className="lg:hidden pb-4 flex flex-col gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-white/70 hover:text-[#d4af37] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
