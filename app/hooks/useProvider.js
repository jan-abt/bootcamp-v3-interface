import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getRpcUrl, CHAIN_ID } from "@/app/config.js";

export function useProvider() {
  const [provider, setProvider] = useState(null);
  const [selectedChainId, setSelectedChainId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const newProvider = new ethers.BrowserProvider(window.ethereum); // Prioritize MetaMask
      setProvider(newProvider);

      newProvider.getNetwork().then((network) => {
        const newChainId = Number(network.chainId);
        setSelectedChainId(newChainId);
        const expectedChainId = parseInt(CHAIN_ID || "31337");
        if (newChainId !== expectedChainId) {
          console.warn("Chain ID mismatch, expected:", expectedChainId, "got:", newChainId);
          setError("Please switch to the expected network (chain ID " + expectedChainId + ")");
          window.ethereum
            ?.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: ethers.toBeHex(expectedChainId) }],
            })
            .catch((err) => {
              if (err.code === 4902) {
                window.ethereum?.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: ethers.toBeHex(expectedChainId),
                      chainName: expectedChainId === 31337 ? "Hardhat" : "Sepolia",
                      rpcUrls: [getRpcUrl(ethers.toBeHex(expectedChainId))],
                    },
                  ],
                });
              } else {
                setError(`Chain switch failed: ${err.message}. Please switch manually.`);
                setProvider(null);
              }
            });
        } else {
          setError(null);
        }
      }).catch((err) => setError(`Network error: ${err.message}`));
    } else {
      setError("MetaMask not detected");
    }
  }, []);

  return { provider, selectedChainId, error };
}