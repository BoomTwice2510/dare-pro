'use client';

import { toast } from "sonner";
import { useWaitForTransactionReceipt } from "wagmi";
import { useEffect } from "react";

export function useTxLifecycle(
  hash?: `0x${string}`,
  label?: string
) {
  const { isLoading, isSuccess, isError } =
    useWaitForTransactionReceipt({
      hash,
      enabled: !!hash,
    });

  useEffect(() => {
    if (!hash) return;

    toast.loading(`${label ?? "Transaction"} submitted...`, {
      id: hash,
    });
  }, [hash]);

  useEffect(() => {
    if (!hash) return;

    if (isLoading) {
      toast.loading("Waiting for confirmation...", {
        id: hash,
      });
    }

    if (isSuccess) {
      toast.success(`${label ?? "Transaction"} confirmed!`, {
        id: hash,
      });
    }

    if (isError) {
      toast.error(`${label ?? "Transaction"} failed.`, {
        id: hash,
      });
    }
  }, [hash, isLoading, isSuccess, isError]);
}
