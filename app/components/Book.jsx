"use client"

import { useState } from "react"
import { ethers, formatUnits } from "ethers"

// Redux
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setBalance } from "@/lib/features/tokens/tokens"
import { selectTokenAndBalances } from "@/lib/selectors"

// Cusomthooks
import { useProvider } from "@/app/hooks/useProvider"
import { useTokens } from "@/app/hooks/useTokens"
import { useExchange } from "@/app/hooks/useExchange"
import { add } from "lodash"


function Book({ caption, market, orders }) {

    return (
        <div className="table-wrapper">
            <table>
                <caption>{caption}</caption>
                <thead>
                    <tr>
                        <th>{caption === "Selling" ? market[1].symbol :  market[0].symbol}</th>
                        <th>{market[0].symbol}/{market[1].symbol}</th>
                        <th>{caption === "Buying" ? market[0].symbol :  market[1].symbol}</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={index} role="link" tabIndex={0} aria-label="Fill Order">
                            <td className={caption === "Selling" ? "gray" : undefined}>
                                {ethers.formatUnits(order.amountGet, 18)}
                            </td>
                            <td className={order.type === "buy" ? "green" : "red"}>
                                {order.price}
                            </td>
                            <td className={caption === "Buying" ? "gray" : undefined}>
                                {ethers.formatUnits(order.amountGive, 18)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Book;