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

type NotificationItem = {
  id: string;
  message: string;
  timestamp: number;
  read: boolean;
};

export function Header() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  /* 🔔 Notification State */
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ======================
     🔔 HELPERS
  ====================== */
  const pushNotification = (message: string) => {
    setNotifications(prev => [
      {
        id: crypto.randomUUID(),
        message,
        timestamp: Date.now(),
        read: false,
      },
      ...prev,
    ]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  /* ======================
     🔔 CONTRACT EVENTS
  ====================== */

  useWatchContractEvent({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    eventName: 'DareAccepted',
    onLogs(logs) {
      logs.forEach((log: any) => {
        const msg = `Dare #${log.args.id} accepted`;
        toast.info(msg);
        pushNotification(msg);
      });
    },
  });

  useWatchContractEvent({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    eventName: 'ProofSubmitted',
    onLogs(logs) {
      logs.forEach((log: any) => {
        const msg = `Proof submitted for Dare #${log.args.id}`;
        toast.warning(msg);
        pushNotification(msg);
      });
    },
  });

  useWatchContractEvent({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    eventName: 'DareResolved',
    onLogs(logs) {
      logs.forEach((log: any) => {
        const msg = `Dare #${log.args.id} resolved 🎉`;
        toast.success(msg);
        pushNotification(msg);
      });
    },
  });

  useWatchContractEvent({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    eventName: 'DareCancelled',
    onLogs(logs) {
      logs.forEach((log: any) => {
        const msg = `Dare #${log.args.id} cancelled`;
        toast.error(msg);
        pushNotification(msg);
      });
    },
  });

  if (!mounted) return null;

  /* ====================== */

  const navLinks = [
    { label: 'Explore', href: '/dares' },
    { label: 'Create', href: '/create' },
    { label: 'My Dares', href: '/my-dares' },
    { label: 'Reputation', href: '/reputation' },
    { label: 'Judge Panel', href: '/judge' },
  ];

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-black/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/landing" className="flex items-center gap-2">
            <img src="/images/logo.png" className="h-8 w-8" />
            <span className="hidden sm:inline font-bold text-[#d4af37]">
              DARE PROTOCOL
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden lg:flex gap-1">
            {navLinks.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm text-white/70 hover:text-[#d4af37]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3 relative">

            {/* 🔔 Bell */}
            <button
              onClick={() => setPanelOpen(v => !v)}
              className="relative text-xl"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* 🔔 Notification Panel */}
            {panelOpen && (
              <div className="absolute right-0 top-12 w-80 bg-black/90 border border-white/10 rounded-xl p-3 space-y-2 z-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">Notifications</span>
                  <button
                    onClick={markAllRead}
                    className="text-xs text-[#d4af37]"
                  >
                    Mark all read
                  </button>
                </div>

                {notifications.length === 0 && (
                  <p className="text-xs text-white/50 text-center py-4">
                    No notifications yet
                  </p>
                )}

                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`text-xs p-2 rounded ${
                      n.read ? 'bg-white/5' : 'bg-[#d4af37]/20'
                    }`}
                  >
                    <p>{n.message}</p>
                    <p className="text-[10px] text-white/40 mt-1">
                      {new Date(n.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Wallet */}
            {isConnected && address ? (
              <>
                <span className="text-sm text-[#d4af37] font-mono">
                  {formatAddress(address)}
                </span>
                <button
                  onClick={() => disconnect()}
                  className="text-xs px-3 py-1 border border-white/20 rounded"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={() => connect({ connector: connectors[0] })}
                className="px-4 py-1 rounded bg-[#d4af37] text-black text-sm"
              >
                Connect
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
