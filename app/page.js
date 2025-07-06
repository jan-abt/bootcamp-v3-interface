"use client"


import { useEffect, useRef, useState } from "react"
import { ethers } from "ethers"

// Import components
import Chart from "./components/Chart"
import Market from "./components/Market"
import Tabs from "./components/Tabs"
import Book from "./components/Book"
import Orders from "./components/Orders"

export default function Home() {
  return (
    <div className="page trading">
      <h1 className="title">Trading</h1>
      <section className="insights">
        <Chart/>
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
        <Book />
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
