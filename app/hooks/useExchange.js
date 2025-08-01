import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useProvider } from "@/app/hooks/useProvider";
import EXCHANGE_ABI from "@/app/abis/Exchange.json";
import { CHAIN_ID, EXCHANGE_ADDRESS } from "@/app/config.js";

export function useExchange() {
  const { provider, chainId, isLoading } = useProvider();
  const [exchange, setExchange] = useState(null);

  useEffect(() => {
    async function initializeExchange() {
      if (provider && chainId && CHAIN_ID && EXCHANGE_ADDRESS && !isLoading) {
        if (Number(CHAIN_ID) !== chainId) {
          console.warn(`Chain ID mismatch: expected ${CHAIN_ID}, got ${chainId}`);
          return;
        }
        try {
          // Initialize with provider for read-only calls
          const exchangeContract = new ethers.Contract(EXCHANGE_ADDRESS, EXCHANGE_ABI, provider);
          const address = await exchangeContract.getAddress();
          console.log(`Exchange Contract Initialized - Address: ${address}`);
          setExchange(exchangeContract);
        } catch (error) {
          console.error("Failed to initialize exchange contract:", error);
        }
      }
    }
    initializeExchange();
  }, [provider, chainId, isLoading]);


  return { exchange };
}