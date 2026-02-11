'use client';

import { useWatchContractEvent } from 'wagmi';
import { toast } from 'sonner';
import { useCallback } from 'react';
import { DARE_CONTRACT_ADDRESS, DARE_CONTRACT_ABI } from '@/lib/web3-config';

export function useDareNotifications() {
  const handleEvent = useCallback((type: string, logs: any[]) => {
    logs.forEach((log) => {
      const id = log.args?.id?.toString();

      switch (type) {
        case 'accepted':
          toast.info(`Dare #${id} accepted`);
          break;
        case 'submitted':
          toast.warning(`Proof submitted for Dare #${id}`);
          break;
        case 'resolved':
          toast.success(`Dare #${id} resolved 🎉`);
          break;
        case 'cancelled':
          toast.error(`Dare #${id} cancelled`);
          break;
      }
    });
  }, []);

  useWatchContractEvent({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    eventName: 'DareAccepted',
    onLogs: (logs) => handleEvent('accepted', logs),
  });

  useWatchContractEvent({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    eventName: 'ProofSubmitted',
    onLogs: (logs) => handleEvent('submitted', logs),
  });

  useWatchContractEvent({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    eventName: 'DareResolved',
    onLogs: (logs) => handleEvent('resolved', logs),
  });

  useWatchContractEvent({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    eventName: 'DareCancelled',
    onLogs: (logs) => handleEvent('cancelled', logs),
  });
}
