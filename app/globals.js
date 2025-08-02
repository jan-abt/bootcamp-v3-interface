// app/config.js
import { ethers } from "ethers";

// Contract Addresses (see@ ignition/deployments/chain-31337/deployed_addresses.json)
export const EXCHANGE_ADDRESS = process.env.NEXT_PUBLIC_EXCHANGE_ADDRESS;
export const FLASHLOAN_USER_ADDRESS = process.env.NEXT_PUBLIC_FLASHLOAN_USER_ADDRESS;
export const DAPP_ADDRESS = process.env.NEXT_PUBLIC_DAPP_ADDRESS;
export const MUSDC_ADDRESS = process.env.NEXT_PUBLIC_MUSDC_ADDRESS;
export const MLINK_ADDRESS = process.env.NEXT_PUBLIC_MLINK_ADDRESS;

export const TOKENS = [
  { name: "DAPP", address: DAPP_ADDRESS },
  { name: "mUSDC", address: MUSDC_ADDRESS },
  { name: "mLINK", address: MLINK_ADDRESS },
];

export const MARKETS = [
  { name: "DAPP / mUSDC", tokens: [DAPP_ADDRESS, MUSDC_ADDRESS] },
  { name: "DAPP / mLINK", tokens: [DAPP_ADDRESS, MLINK_ADDRESS] },
];

const RPC_URLS = {
  "0x7a69": process.env.NEXT_PUBLIC_RPC_URL_HARDHAT, // Hardhat
  "0xaa36a7": process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA// Sepolia
};

export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

export const getRPCUrl = (chainId) => RPC_URLS[chainId] || null;

export const toHexademical = (num) => ethers.toBeHex(parseInt(num)); // v6 compatible