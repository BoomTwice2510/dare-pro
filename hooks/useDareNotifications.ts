'use client';

import { useWatchContractEvent } from 'wagmi';
import { DARE_CONTRACT_ADDRESS, DARE_CONTRACT_ABI } from '@/lib/web3-config';

export function useDareNotifications(userAddress?: string) {
  // Dare Accepted
  useWatchContractEvent({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    eventName: 'DareAccepted',
    onLogs(logs) {
      logs.forEach(log => {
        const accepter = (log.args as any)?.accepter;
        if (
          accepter &&
          userAddress &&
          accepter.toLowerCase() === userAddress.toLowerCase()
        ) {
          alert('🔥 Your dare has been accepted');
        }
      });
    },
  });

  // Proof Submitted
  useWatchContractEvent({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    eventName: 'ProofSubmitted',
    onLogs() {
      alert('📸 Proof submitted successfully');
    },
  });

  // Dare Resolved
  useWatchContractEvent({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    eventName: 'DareResolved',
    onLogs() {
      alert('🏆 Dare resolved! Check result');
    },
  });
}
