"use client"

import { useEffect } from "react"
import { ethers } from "ethers"

// Components
import Balances from "../components/Balances";

// Redux
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setToken, setBalance } from "@/lib/features/tokens/tokens"
import {
  selectAccount,
  selectTokens,
  selectWalletBalances,
  selectExchangeBalances
} from "@/lib/selectors"

// Custom hooks
import { useTokens } from "@/app/hooks/useTokens";
import { useExchange } from "../hooks/useExchange";


export default function Home() {

  // Hooks
  const useDispatch = useAppDispatch()
  const { tokens: tokenContracts } = useTokens()
  const { exchange } = useExchange()
  const account = useAppSelector(selectAccount)
  const tokens = useAppSelector(selectTokens)
  const walletBalances = useAppSelector(selectWalletBalances)
  const exchangeBalances = useAppSelector(selectExchangeBalances)



  async function getBalances() {


    Object
      .keys(tokenContracts)
      .forEach(async (address, index) => {
        // Fetch data from each token contract 
        const symbol = await tokenContracts[address].symbol()

        // Dispatch token
        useDispatch(setToken({
          index: index,
          address: address,
          symbol: symbol
        }))

        const walletBalance = await tokenContracts[address].balanceOf(account)
        const exchangeBalance = await exchange.totalBalanceOf(address, account)

        // Dispatch balance
        useDispatch(setBalance({
          address: address,
          wallet: ethers.formatUnits(walletBalance, 18),
          exchange: ethers.formatUnits(exchangeBalance, 18),
        }))

      })




  }

  useEffect(() => {
    if (tokenContracts && account) {
      getBalances()
    }
  }, [tokenContracts, account])

  return (
    <div className="page wallet">

      <h1 className="title">Wallet</h1>
      <section>
        <h2>Wallet Funds</h2>
        {walletBalances.length > 0 ? <Balances balances={walletBalances} /> : <>No Balances Available</>}
      </section>
      <section>
        <h2> Exchange Funds</h2>
        {exchangeBalances.length > 0 ? <Balances balances={exchangeBalances} /> : <>No Balances Available</>}
      </section>
      <section className="deposit">
        <h2>Deposit</h2>
      </section>
      <section className="withdraw">
        <h2>Withdraw</h2>
      </section>
    </div>
  );
}
