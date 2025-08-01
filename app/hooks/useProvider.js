import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getRpcUrl, CHAIN_ID } from "@/app/config.js";

export function useProvider() {
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const newProvider = new ethers.BrowserProvider(window.ethereum); // Prioritize MetaMask
      setProvider(newProvider);

      newProvider.getNetwork().then((network) => {
        const networkChainId = Number(network.chainId);
        if (networkChainId !== parseInt(CHAIN_ID)) {
          console.warn("Chain ID mismatch, expected:", parseInt(CHAIN_ID), "got:", networkChainId);
          setError("Please switch to the expected network (chain ID " + parseInt(CHAIN_ID) + ")");
          window.ethereum
            ?.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: ethers.toBeHex(parseInt(CHAIN_ID)) }],
            })
            .catch((err) => {
              if (err.code === 4902) {
                window.ethereum?.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: ethers.toBeHex(parseInt(CHAIN_ID)),
                      chainName: parseInt(CHAIN_ID) === 31337 ? "Hardhat" : "Sepolia",
                      rpcUrls: [getRpcUrl(ethers.toBeHex(parseInt(CHAIN_ID)))],
                    },
                  ],
                });
              } else {
                setError(`Chain switch failed: ${err.message}. Please switch manually.`);
                setProvider(null);
              }
            });
        } else {
          setChainId(networkChainId);
          setError(null);

        }
      }).catch((err) => setError(`Network error: ${err.message}`));
    } else {
      setError("MetaMask not detected");
    }
  }, []);

  return { provider, chainId, error };
}