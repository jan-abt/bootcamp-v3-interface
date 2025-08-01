"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSDK } from "@metamask/sdk-react";
import Jazzicon from "react-jazzicon";
import { ethers } from "ethers";

// Redux
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setAccount, setBalance } from "@/lib/features/user/user";
import { selectAccount, selectETHBalance } from "@/lib/selectors";

// Import hooks
import { useProvider } from "@/app/hooks/useProvider";

// Import assets
import network from "@/app/assets/other/network.svg";

// Import config
import { getRpcUrl, hexed } from "@/app/globals.js";

function TopNav() {
  const { sdk, provider: metamask, chainId:hexChainId } = useSDK();
  const { provider, chainId:networkChainId, error } = useProvider();
  const [selectedChainId, setSelectedChainId] = useState(hexChainId || "0");

  const dispatch = useAppDispatch();
  const account = useAppSelector(selectAccount);
  const balance = useAppSelector(selectETHBalance);

  async function connectHandler() {
    try {
      const accounts = await sdk.connectAndSign({ msg: "Sign in to DAPP Exchange" });
      if (accounts && accounts.length > 0) {
        await syncAccountInfo();
      } else {
        console.log("No accounts returned from connection");
      }
    } catch (error) {
      console.log("Connection error:", error);
    }
  }

  async function networkHandler(e) {
    const selectedChainId = e.target.value;
    setSelectedChainId(selectedChainId); // Update local state immediately
    console.log("Network changed to:", selectedChainId);
    const rpcUrl = getRpcUrl(hexed(selectedChainId));
    if (rpcUrl) {
      await metamask.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexed(selectedChainId) }],
      }).catch((err) => {
        if (err.code === 4902) {
          window.ethereum?.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: hexed(selectedChainId),
                chainName: selectedChainId === "31337" ? "Hardhat" : "Sepolia",
                rpcUrls: [rpcUrl],
              },
            ],
          });
        }
        console.error("Network switch failed:", err);
      });
    } else {
      console.error("No RPC URL configured for chain ID:", selectedChainId);
    }
  }

  async function syncAccountInfo() {
    try {
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      dispatch(setAccount(address));
      dispatch(setBalance(ethers.formatUnits(balance, 18)));
    } catch (error) {
      console.error("Sync account info error:", error);
    }
  }

  useEffect(() => {
    if (sdk && metamask) {
      const handleChainChanged = (selectedChainId) => {
        setSelectedChainId(selectedChainId); // Sync with MetaMask chainId
        window.location.reload(); // Keep reload for now, refine later
      };

      metamask.on("accountsChanged", async (accounts) => {
        if (accounts.length === 0) {
          dispatch(setAccount(null));
          dispatch(setBalance(0));
        } else {
          await syncAccountInfo();
        }
      });

      metamask.on("chainChanged", handleChainChanged);

      return () => {
        metamask.removeAllListeners("chainChanged", handleChainChanged);
        metamask.removeAllListeners("accountsChanged");
      };
    }
  }, [sdk, metamask, provider]);

  return (
    <nav className="topnav">
      <div className="network">
        <label className="icon" htmlFor="network">
          <Image src={network} alt="Select Network" />
        </label>
        <div className="select">
          <select
            onChange={networkHandler}
            name="network"
            id="network"
            value={selectedChainId}
            disabled={!networkChainId}
          >
            <option value="0">Network</option>
            <option value="31337">Hardhat</option>
            <option value="11155111">Sepolia</option>
          </select>
          {networkChainId && selectedChainId && networkChainId !== parseInt(hexChainId, 16) && (
            <span style={{ color: "orange" }}>
              (Mismatch: Expected {networkChainId})
            </span>
          )}
        </div>
      </div>
      <div className="account">
        {account && (
          <div className="balance">
            <p>
              My Balance <span>{Number(balance).toFixed(2)} ETH</span>
            </p>
          </div>
        )}
        {account ? (
          <a
            href={`https://${hexChainId === "0xaa36a7" ? "sepolia." : ""}etherscan.io/address/${account}`}
            target="_blank"
            className="link"
          >
            {account.slice(0, 6) + "..." + account.slice(38, 42)}
            <Jazzicon diameter={44} seed={parseInt(account.slice(2, 10), 16)} />
          </a>
        ) : (
          <button className="button" onClick={connectHandler} disabled={!!error}>
            Connect
          </button>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </nav>
  );
}

export default TopNav;