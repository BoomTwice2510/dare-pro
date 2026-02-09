'use client';

import { useCallback, useEffect, useState } from 'react';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { DARE_CONTRACT_ADDRESS, DARE_CONTRACT_ABI } from '@/lib/web3-config';
import { Dare, DareStatus } from '@/lib/types';
import { parseEther } from 'viem';

export function useDareCount() {
  const { data } = useReadContract({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    functionName: 'dareCount',
  });

  return data ? Number(data) : 0;
}

export function useDareDetails(dareId: number | undefined) {
  const { data: dareData } = useReadContract({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    functionName: 'dares',
    args: dareId !== undefined ? [BigInt(dareId)] : undefined,
    query: { enabled: dareId !== undefined },
  });

  return dareData
    ? ({
        id: dareId,
        creator: dareData[0],
        accepter: dareData[1],
        description: dareData[2],
        token: dareData[3],
        stake: dareData[4],
        createdAt: Number(dareData[5]),
        deadline: Number(dareData[6]),
        accepted: dareData[7],
        proofSubmitted: dareData[8],
        proofURI: dareData[9],
        proofTime: Number(dareData[10]),
        resolved: dareData[11],
        status: dareData[12] as DareStatus,
      } as Dare)
    : null;
}

export function useUserXP(address: string | undefined) {
  const { data } = useReadContract({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    functionName: 'xp',
    args: address ? [address as `0x${string}`] : undefined,
    query: { enabled: !!address },
  });

  return data ? Number(data) : 0;
}

export function useUserBadge(address: string | undefined) {
  const { data } = useReadContract({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    functionName: 'badge',
    args: address ? [address as `0x${string}`] : undefined,
    query: { enabled: !!address },
  });

  return data ? Number(data) : 0;
}

export function useProtocolParams() {
  const { data: judge } = useReadContract({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    functionName: 'judge',
  });

  const { data: treasury } = useReadContract({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    functionName: 'treasury',
  });

  const { data: feeBps } = useReadContract({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    functionName: 'protocolFeeBps',
  });

  const { data: confirmWindow } = useReadContract({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    functionName: 'CONFIRM_WINDOW',
  });

  const { data: xpWin } = useReadContract({
    address: DARE_CONTRACT_ADDRESS,
    abi: DARE_CONTRACT_ABI,
    functionName: 'XP_WIN',
  });

  return {
    judge: judge as `0x${string}` | undefined,
    treasury: treasury as `0x${string}` | undefined,
    protocolFeeBps: feeBps ? Number(feeBps) : 0,
    confirmWindow: confirmWindow ? Number(confirmWindow) : 86400,
    xpWin: xpWin ? Number(xpWin) : 100,
  };
}

export function useDareActions() {
  const { writeContract, isPending } = useWriteContract();
  const { address } = useAccount();

  const createDare = useCallback(
    async (description: string, duration: number, token: string, stake: string) => {
      const isETH = token === '0x0000000000000000000000000000000000000000';
      const stakeAmount = parseEther(stake);

      return new Promise((resolve, reject) => {
        writeContract(
          {
            address: DARE_CONTRACT_ADDRESS,
            abi: DARE_CONTRACT_ABI,
            functionName: 'createDare',
            args: [description, BigInt(duration), token as `0x${string}`, stakeAmount],
            value: isETH ? stakeAmount : undefined,
          },
          {
            onSuccess: resolve,
            onError: reject,
          }
        );
      });
    },
    [writeContract]
  );

  const acceptDare = useCallback(
    async (dareId: number, stake: string, isETH: boolean) => {
      const stakeAmount = parseEther(stake);

      return new Promise((resolve, reject) => {
        writeContract(
          {
            address: DARE_CONTRACT_ADDRESS,
            abi: DARE_CONTRACT_ABI,
            functionName: 'acceptDare',
            args: [BigInt(dareId)],
            value: isETH ? stakeAmount : undefined,
          },
          {
            onSuccess: resolve,
            onError: reject,
          }
        );
      });
    },
    [writeContract]
  );

  const submitProof = useCallback(
    async (dareId: number, proofURI: string) => {
      return new Promise((resolve, reject) => {
        writeContract(
          {
            address: DARE_CONTRACT_ADDRESS,
            abi: DARE_CONTRACT_ABI,
            functionName: 'submitProof',
            args: [BigInt(dareId), proofURI],
          },
          {
            onSuccess: resolve,
            onError: reject,
          }
        );
      });
    },
    [writeContract]
  );

  const approveProof = useCallback(
    async (dareId: number) => {
      return new Promise((resolve, reject) => {
        writeContract(
          {
            address: DARE_CONTRACT_ADDRESS,
            abi: DARE_CONTRACT_ABI,
            functionName: 'approveProof',
            args: [BigInt(dareId)],
          },
          {
            onSuccess: resolve,
            onError: reject,
          }
        );
      });
    },
    [writeContract]
  );

  const disputeProof = useCallback(
    async (dareId: number) => {
      return new Promise((resolve, reject) => {
        writeContract(
          {
            address: DARE_CONTRACT_ADDRESS,
            abi: DARE_CONTRACT_ABI,
            functionName: 'disputeProof',
            args: [BigInt(dareId)],
          },
          {
            onSuccess: resolve,
            onError: reject,
          }
        );
      });
    },
    [writeContract]
  );

  const autoResolve = useCallback(
    async (dareId: number) => {
      return new Promise((resolve, reject) => {
        writeContract(
          {
            address: DARE_CONTRACT_ADDRESS,
            abi: DARE_CONTRACT_ABI,
            functionName: 'autoResolve',
            args: [BigInt(dareId)],
          },
          {
            onSuccess: resolve,
            onError: reject,
          }
        );
      });
    },
    [writeContract]
  );

  const cancelDare = useCallback(
    async (dareId: number) => {
      return new Promise((resolve, reject) => {
        writeContract(
          {
            address: DARE_CONTRACT_ADDRESS,
            abi: DARE_CONTRACT_ABI,
            functionName: 'cancelDare',
            args: [BigInt(dareId)],
          },
          {
            onSuccess: resolve,
            onError: reject,
          }
        );
      });
    },
    [writeContract]
  );

  const judgeResolve = useCallback(
    async (dareId: number, winner: string) => {
      return new Promise((resolve, reject) => {
        writeContract(
          {
            address: DARE_CONTRACT_ADDRESS,
            abi: DARE_CONTRACT_ABI,
            functionName: 'judgeResolve',
            args: [BigInt(dareId), winner as `0x${string}`],
          },
          {
            onSuccess: resolve,
            onError: reject,
          }
        );
      });
    },
    [writeContract]
  );

  return {
    createDare,
    acceptDare,
    submitProof,
    approveProof,
    disputeProof,
    autoResolve,
    cancelDare,
    judgeResolve,
    isPending,
  };
}
