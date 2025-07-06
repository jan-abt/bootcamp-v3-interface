"use client"

import { useEffect, useRef, useState } from "react"
import { ethers } from "ethers"

// Import components
import Chart from "@/app/components/Chart"
import Market from "@/app/components/Market"
import Tabs from "@/app/components/Tabs"
import Book from "@/app/components/Book"
import Orders from "@/app/components/Orders"

// Mock data
import { myOpenOrders, filledOrders, myFilledOrders } from "@/app/data/orders"

// Redux
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  setAllOrders,
  setCancelledOrders,
  setFilledOrders
} from "@/lib/features/exchange/exchange"

// Custom hooks
import { useProvider } from "@/app/hooks/useProvider"
import { useExchange } from "@/app/hooks/useExchange"

// Config
import { config } from "@/app/config.json"

// 
import {
  selectMarket,
  selectOpenOrders
} from "@/lib/selectors"

export default function Home() {

  // Redux
  const dispatch = useAppDispatch()
  const market = useAppSelector(selectMarket)
  const openOrders = useAppSelector(selectOpenOrders)

  // Hooks
  const { provider, chainId } = useProvider()
  const { exchange } = useExchange()


  async function getAllOrders() {
    const block = await provider.getBlockNumber() // most recent block

    // Fetch orders ever created
    const createdOrdersStream = await exchange.queryFilter("OrderCreated", 0, block)
    const createdOrders = createdOrdersStream.map(event => event.args)
    // Set all orders in Redux
    dispatch(setAllOrders(serializeOrders(createdOrders)))

    // Fetch cancelled orders
    const cancelledOrdersStream = await exchange.queryFilter("OrderCancelled", 0, block)
    const cancelledOrders = cancelledOrdersStream.map(event => event.args)
    
    // Set cancelled orders in Redux
    dispatch(setCancelledOrders(serializeOrders(cancelledOrders)))

    // Fetch filled orders
    const filledOrdersStream = await exchange.queryFilter("OrderFilled", 0, block)
    const filledOrders = filledOrdersStream.map(event => event.args)
    
    // Set filled orders in Redux
    dispatch(setFilledOrders(serializeOrders(filledOrders)))
  }

  /**
   *  Redux can not naturally serialize BigInts(uint256s from Solidity).
   *  Therefore, we serialize them to formatted strings  
   */
  function serializeOrders(orders) {
    let serializedOrders = []

    orders.forEach(o => {
      
      serializedOrders[Number(o.id) - 1] = {
        id: o.id.toString(),
        user: o.user,
        tokenGet: o.tokenGet,
        amountGet: o.amountGet.toString(),
        tokenGive: o.tokenGive,
        amountGive: o.amountGive.toString(),
        timestamp: o.timestamp.toString()
      }
    })
    return serializedOrders

  }

  useEffect(() => {
    if (provider && exchange && market) {
      getAllOrders()

    }

  }, [provider, exchange, market])

  return (
    <div className="page trading">
      <h1 className="title">Trading</h1>
      <section className="insights">
        <Chart />
      </section>

      <section className="market">
        <h2>Select Market</h2>
        <Market />
      </section>

      <section className="order">
        <h2>New Order</h2>
        <Tabs />
        <form>

        </form>
      </section>

      <section className="orderbook">
        <h2>Order Book</h2>
        {/* {console.log(openOrders)} */}
        {market ? (
          <>
            {/* SELLING */}
            <Book caption={"Selling"} market={market} orders={openOrders.sellOrders} />
            {/* BUYING */}
            <Book caption={"Buying"} market={market} orders={openOrders.buyOrders} />
          </>) : (
          <p className="center">Please Select Market</p>
        )}

      </section>

      <section className="orders">
        <h2>My Trades</h2>
        <Orders />
      </section>

      <section className="transactions">
        <h2>My Trades</h2>
        <Orders />
      </section>

    </div>
  );
}
