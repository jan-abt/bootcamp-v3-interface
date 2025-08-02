"use client"

import { useEffect } from "react"

// Redux
import { useAppDispatch } from "@/lib/hooks"
import { setMarket } from "@/lib/features/exchange/exchange"


// Custom Hooks
import { useProvider } from "@/app/hooks/useProvider"
import { useTokens } from "@/app/hooks/useTokens"


// Import config
import { MARKETS } from "@/app/globals.js";




function Market() {
    // Redux
    const dispatch = useAppDispatch()

    // Hooks
    const { chainId } = useProvider()
    const { tokens } = useTokens()

    // Handlers
    async function marketHandler(addresses) {
        const promises = await addresses.map(async (address) => {
            const symbol = await tokens[address].symbol()
            return { address, symbol }
        })

        const market = await Promise.all(promises)
        dispatch(setMarket(market))

    }

    useEffect(() => {
        if (chainId && tokens) {
            marketHandler(MARKETS[0].tokens)
        }
    }, [chainId, tokens])

    return (
        <div className="select">
            {(
                <select
                    name="market"
                    id="market"
                    defaultValue={
                        MARKETS.length > 0 ?
                            `${MARKETS[0].tokens[0]},${MARKETS[0].tokens[1]}` : 0
                    }
                    onChange={(e) => marketHandler(e.target.value.split(","))}
                >
                    <option value="0" disabled>
                        {MARKETS.length > 0 ? "Select Market" : "No Markets Available"}
                    </option>

                    {MARKETS.map((market, index) => (
                        <option
                            key={index}
                            value={`${market.tokens[0]},${market.tokens[1]}`}
                        >
                            {market.name}
                        </option>
                    ))}

                </select>
            )}



        </div>
    );
}

export default Market;