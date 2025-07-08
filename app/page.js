"use client"

import { useEffect, useRef, useState } from "react"
import { ethers } from "ethers"

// Import components
import Chart from "@/app/components/Chart"
import Market from "@/app/components/Market"
import Tabs from "@/app/components/Tabs"
import Book from "@/app/components/Book"
import Orders from "@/app/components/Orders"


// Redux
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  setAllOrders,
  setCancelledOrders,
  setFilledOrders,
  addOrder,
  addCancelledOrder,
  addFilledOrder
} from "@/lib/features/exchange/exchange"

// Custom hooks
import { useProvider } from "@/app/hooks/useProvider"
import { useExchange } from "@/app/hooks/useExchange"

// Config
import { config } from "@/app/config.json"

// Selectors
import {
  selectMarket,
  selectOpenOrders,
  selectFilledOrders,
  selectMyOpenOrders,
  selectMyFilledOrders,
  selectPriceData,
  selectAccount
} from "@/lib/selectors"

export default function Home() {

  // Local state
  const [showMyTransactions, setShowMyTransactions] = useState(false)
  const [showBuy, setShowBuy] = useState(true)

  // Redux
  const dispatch = useAppDispatch()
  const market = useAppSelector(selectMarket)
  const account = useAppSelector(selectAccount)
  const openOrders = useAppSelector(selectOpenOrders)
  const filledOrders = useAppSelector(selectFilledOrders)
  const myOpenOrders = useAppSelector(selectMyOpenOrders)
  const myFilledOrders = useAppSelector(selectMyFilledOrders)
  const pricedata = useAppSelector(selectPriceData)

  // Order & Transaction tab references (Trades | Orders)
  const tradeRef = useRef(null)
  const orderRef = useRef(null)

  // Order Form tab references (Buy | Sell)
  const buyRef = useRef(null)
  const sellRef = useRef(null)

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

  // Handlers
  async function orderHandler(form) {
    // Get form inputs
    // Validate inputs
    // Get sifner and format amount
    // Submit to blockchain
    try {

      const amount = form.get("amount")
      const price = form.get("price")


      if (amount == 0) return
      if (price == 0) return

      // Get the Signer meaning, the current account that is connected to the MetaMask
      // and format the amount 
      const signer = await provider.getSigner()
      const amountGetWei = ethers.parseUnits(amount.toString(), 18)
      const amountGiveWei = ethers.parseUnits((amount * price).toString(), 18)

      if (showBuy) {
        await makeOrder(signer, market[0].address, amountGetWei, market[1].address, amountGiveWei)
      } else {
        await makeOrder(signer, market[1].address, amountGetWei, market[0].address, amountGiveWei)
      }


    } catch (error) {
      console.log(error)
      return

    }

  }

  async function makeOrder(signer, tokenGet, amountGetWei, tokenGive, amountGiveWei) {
    const transaction = await exchange.connect(signer).makeOrder(tokenGet, amountGetWei, tokenGive, amountGiveWei)
    await transaction.wait()
  }

  useEffect(() => {
      if (provider && exchange && market) {
        // Fetch all orders
        getAllOrders()

        // Create event listener to listen for new orders created
        exchange.on("OrderCreated", (id, user, tokenGet, amountGet, tokenGive, amountGive, timestamp) => {
          const order = {
            id: Number(id),
            user,
            tokenGet,
            amountGet: amountGet.toString(),
            tokenGive,
            amountGive: amountGive.toString(),
            timestamp: timestamp.toString()
          }

          dispatch(addOrder(order))

        })

        // Create event listener to listen for new orders created
        exchange.on("OrderCancelled", (id, user, tokenGet, amountGet, tokenGive, amountGive, timestamp) => {
          const order = {
            id: Number(id),
            user,
            tokenGet,
            amountGet: amountGet.toString(),
            tokenGive,
            amountGive: amountGive.toString(),
            timestamp: timestamp.toString()
          }

          dispatch(addCancelledOrder(order))
        })

        // Create event listener to listen for new orders created
        exchange.on("OrderFilled", (id, user, tokenGet, amountGet, tokenGive, amountGive, creator, timestamp) => {
          const order = {
            id: Number(id),
            user,
            tokenGet,
            amountGet: amountGet.toString(),
            tokenGive,
            amountGive: amountGive.toString(),
            creator,
            timestamp: timestamp.toString()
          }

          dispatch(addFilledOrder(order))
        })

        // Remove any ducplicate event listeners,
        // that may have been added to Redux due to navigating to and from this page
        return () =>{
          exchange.off("OrderCreated")
          exchange.off("OrderCancelled")
          exchange.off("OrderFilled")
        }

      }
  }, [provider, exchange, market])

  return (
    <div className="page trading">
      <h1 className="title">Trading</h1>
      <section className="insights">
        {market ? (
          <Chart market={market} data={pricedata} />
        ) : (
          <p className="center"> Please select a market</p>
        )}
      </section>

      <section className="market">
        <h2>Select Market</h2>
        <Market />
      </section>

      <section className="order">
        <h2>New Order</h2>
        <Tabs
          tabs={[
            { name: "Buy", ref: buyRef, default: true },
            { name: "Sell", ref: sellRef }
          ]}
          setCondition={setShowBuy}
        />
        {!account ?
          (<p className="center"> Please Connect Wallet</p>)
          : !exchange ?
            (<p className="center"> Exchange Not Deployed</p>)
            : (
              <form action={orderHandler}>
                <label htmlFor="amount">
                  {showBuy ? "Buy " : "Sell "} Amount
                </label>
                <input type="number" name="amount" id="amount" placeholder="0.0000" step="0.0001" />

                <label htmlFor="price">
                  Price Per Unit
                </label>
                <input type="number" name="price" id="price" placeholder="0.0000" step="0.0001" />

                <input type="submit" value={`Create ${showBuy ? "Buy" : "Sell"} Order`} />
              </form>
            )
        }
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
        <h2>{showMyTransactions ? "My Trades" : "My Orders"}</h2>
        <Tabs tabs={[
          { name: "Trades", ref: tradeRef },
          { name: "Orders", ref: orderRef, default: true }
        ]}
          setCondition={setShowMyTransactions}
        ></Tabs>
        <Orders
          market={market}
          orders={showMyTransactions ? myFilledOrders : myOpenOrders}
          type={showMyTransactions ? "filled" : "open"}
        />
      </section>

      <section className="transactions">
        <h2>Trades</h2>
        <Orders
          market={market}
          orders={filledOrders}
        />
      </section>


    </div>
  );
}
