"use client"

import dynamic from "next/dynamic"
import Image from "next/image"

// Load this Chart component only on the client-side, not during server-side rendering (SSR)
const Chart = dynamic(() => import("react-apexcharts", { ssr: false }))

// Mock data
import { options, series } from "@/app/data/prices"

// Assets
import up from "@/app/assets/arrows/price-up.svg"
import down from "@/app/assets/arrows/price-down.svg"

function PriceChart({ market, data }) {
    return (
        <div className="chart">
            <div className="flex-between">
                <div className="stats">
                    <p className="price">
                        <small>{market[0].symbol}/{market[1].symbol}</small>
                        &nbsp;
                        {data.lastPriceChange === "+" ? (
                            <Image
                                src={up}
                                alt="Up"
                                width={30}
                                height={30}
                            />
                        ) : (
                            <Image
                                src={down}
                                alt="Down"
                                width={30}
                                height={30}
                            />
                        )}

                        &nbsp;
                        {data.lastPrice}
                    </p>
                </div>
                <div className="select">
                    <select name="time" id="time">
                        <option value="0">Last Week</option>
                        <option value="1">Last Month</option>
                        <option value="2">Last Year</option>
                    </select>
                </div>
            </div>
            <Chart
                options={options}
                series={data ? data.series : sampleSeries}
                type="candlestick"
                width="100%"
                height="100%"
            />
        </div>
    );
}

export default PriceChart;