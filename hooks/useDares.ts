'use client';

import { useMemo } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';
import { Dare, DareStatus } from '@/lib/types';
import { DARE_CONTRACT_ADDRESS, DARE_CONTRACT_ABI } from '@/lib/web3-config';

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
    accepted,
    proofSubmitted,
    proofURI,
    proofTime,
    resolved,
    status,
  ] = data;

  if (!creator || stake === undefined || status === undefined) {
    throw new Error(`Incomplete dare data for index ${index}`);
  }

  return {
    id: index,
    creator: creator as string,
    accepter: accepter as string,
    description: description as string,
    token: token as string,
    stake: stake as bigint,
    createdAt: Number(createdAt) * 1000,
    deadline: Number(deadline) * 1000,
    accepted: accepted as boolean,
    proofSubmitted: proofSubmitted as boolean,
    proofURI: proofURI as string,
    proofTime: Number(proofTime) * 1000,
    resolved: resolved as boolean,
    status: Number(status) as DareStatus,
  };
}

interface UseDaresOptions {
  filterCreator?: string;
  filterAccepter?: string;
  filterStatus?: DareStatus;
}

/**
 * Hook to fetch all dares from the smart contract and optionally filter them.
 * Filters are applied client-side from already-fetched data.
 */
export function useDares(options?: UseDaresOptions) {
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
      return [];
    }

    const count = Number(dareCount);

    if (count === 0) {
      return [];
    }

    return Array.from({ length: count }, (_, i) => ({
      address: DARE_CONTRACT_ADDRESS,
      abi: DARE_CONTRACT_ABI,
      functionName: 'getDare' as const,
      args: [BigInt(i)],
    }));
  }, [dareCount]);

  // Read all dares using multicall
  const { data: rawDares, isLoading, isError, error: readError } = useReadContracts({
    contracts,
    query: { enabled: contracts.length > 0 },
  });

  // Parse the raw responses into Dare objects
  const allDares = useMemo(() => {
    if (!rawDares || rawDares.length === 0) {
      return [];
    }

    const daresList: Dare[] = [];

    rawDares.forEach((result, index) => {
      try {
        if (result.status === 'success' && result.result) {
          const dare = parseDareResponse(index, result.result);
          daresList.push(dare);
        }
      } catch (err) {
        console.error(`[v0] Error parsing dare ${index}:`, err);
      }
    });

    return daresList;
  }, [rawDares]);

  // Apply filters
  const filteredDares = useMemo(() => {
    let results = allDares;

    if (options?.filterCreator) {
      results = results.filter(
        (dare) => dare.creator.toLowerCase() === options.filterCreator!.toLowerCase()
      );
    }

    if (options?.filterAccepter) {
      results = results.filter(
        (dare) => dare.accepter.toLowerCase() === options.filterAccepter!.toLowerCase()
      );
    }

    if (options?.filterStatus !== undefined) {
      results = results.filter((dare) => dare.status === options.filterStatus);
    }

    return results;
  }, [allDares, options?.filterCreator, options?.filterAccepter, options?.filterStatus]);

  const loading = dareCount === undefined || (contracts.length > 0 && rawDares === undefined);
  const hasError = isError;

  return {
    allDares,
    filteredDares,
    dareCount: Number(dareCount || 0),
    loading,
    hasError,
    error: readError?.message || '',
  };
}
