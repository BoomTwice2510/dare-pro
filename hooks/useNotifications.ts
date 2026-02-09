'use client';

import { useEffect, useState } from 'react';
import { useAccount, useWatchContractEvent } from 'wagmi';
import { DARE_CONTRACT_ADDRESS, DARE_CONTRACT_ABI } from '@/lib/web3-config';

export type NotificationType =
  | 'CREATED'
  | 'ACCEPTED'
  | 'PROOF'
  | 'RESOLVED'
  | 'DISPUTED';

export type NotificationItem = {
  id: string;
  type: NotificationType;
  dareId: number;
  message: string;
  timestamp: number;
  read: boolean;
};

export function useNotifications() {
  const { address } = useAccount();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const push = (n: NotificationItem) => {
    setNotifications(prev => [n, ...prev].slice(0, 20));
  };

  // DareAccepted
  useWatchContractEvent({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    eventName: 'DareAccepted',
    onLogs(logs) {
      logs.forEach(log => {
        const { id } = log.args as any;
        push({
          id: `accepted-${id}-${Date.now()}`,
          type: 'ACCEPTED',
          dareId: Number(id),
          message: `Your dare #${id} was accepted`,
          timestamp: Date.now(),
          read: false,
        });
      });
    },
  });

  // ProofSubmitted
  useWatchContractEvent({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    eventName: 'ProofSubmitted',
    onLogs(logs) {
      logs.forEach(log => {
        const { id } = log.args as any;
        push({
          id: `proof-${id}-${Date.now()}`,
          type: 'PROOF',
          dareId: Number(id),
          message: `Proof submitted for dare #${id}`,
          timestamp: Date.now(),
          read: false,
        });
      });
    },
  });

  // DareResolved
  useWatchContractEvent({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    eventName: 'DareResolved',
    onLogs(logs) {
      logs.forEach(log => {
        const { id } = log.args as any;
        push({
          id: `resolved-${id}-${Date.now()}`,
          type: 'RESOLVED',
          dareId: Number(id),
          message: `Dare #${id} resolved`,
          timestamp: Date.now(),
          read: false,
        });
      });
    },
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return {
    notifications,
    unreadCount,
    markAllRead,
  };
}
