/*
 * Selectors: query state from the Redux store.
 *            functions that extract and compute derived data from state.
 */

import { createSelector } from "reselect"
import { get, reject, groupBy } from "lodash"
import moment from "moment"


// ------------------------------------------------------------------------
// USER

// Account 
export const selectAccount = state => get(state, "user.account", null)
export const selectETHBalance = state => get(state, "user.balance", null)

// Tokens
export const selectTokens = state => get(state, "tokens.tokens", [])

// Token balances
export const selectTokenBalances = state => get(state, "tokens.balances", [])


export const selectWalletBalances = createSelector(
    selectTokens,
    selectTokenBalances,
    (tokens, balances) => {
        return tokens.map((token) => {
            return {
                symbol: token.symbol,
                balance: balances[token.address] ? balances[token.address].wallet : 0
            }
        })
    })

export const selectExchangeBalances = createSelector(
    selectTokens,
    selectTokenBalances,
    (tokens, balances) => {
        return tokens.map((token) => {
            return {
                symbol: token.symbol,
                balance: balances[token.address] ? balances[token.address].exchange : 0
            }
        })
    })


export const selectTokenAndBalances = createSelector(
    selectTokens,
    selectTokenBalances,
    (state, address) => address,
    (tokens, balances, address) => {

        if (address === null)
            return { token: null, balance: { wallet: 0, exchange: 0 } }

        const token = tokens.find(t => t.address === address) || null
        const wallet = balances[address] ? balances[address].wallet : 0
        const exchange = balances[address] ? balances[address].exchange : 0

        return { token, balance: { wallet, exchange } }
    }

)

// ------------------------------------------------------------------------
// ORDERS

export const selectAllOrders = state => get(state, "exchange.allOrders", [])
export const selectCancelledOrders = state => get(state, "exchange.cancelledOrders", [])
export const selectFilledOrders = state => get(state, "exchange.filledOrders", [])
export const selectMarket = state => get(state, "exchange.market", [])
export const selectOpenOrders_ = createSelector(
    selectAllOrders,
    selectCancelledOrders,
    selectFilledOrders,
    (allOrders, cancelledOrders, filledOrders) => {
        return reject(allOrders, (order) => {
            const orderFilled = filledOrders.some((o) => o.id.toString() === order.id)
            const orderCancelled = cancelledOrders.some((o) => o.id.toString() === order.id)
            return (orderFilled || orderCancelled)
        })

    }
)

const decorateOrders = (orders, market) => {
    return orders.map((order) => {
        // Calculate the token prive to 5 decimal places
        const precision = 100000
        const price = Math.round((order.amountGive / order.amountGet) * precision) / precision
        const type = order.tokenGet === market[0].address ? "buy" : "sell"
        const date = moment.unix(order.timestamp).format("D MMM YY h:mm A")
        return {
            ...order,
            price,
            type,
            date
        }
    })
}

export const selectOpenOrders = createSelector(
    selectOpenOrders_,
    selectMarket,
    (orders, market) => {

        if (!market) {
            return {
                orders: [],
                buyOrders: [],
                sellOrders: []
            }
        }

        // Filter orders by selected market
        orders = orders.filter((o) => o.tokenGet === market[0].address || o.tokenGet === market[1].address)
        orders = orders.filter((o) => o.tokenGive === market[0].address || o.tokenGive === market[1].address)

        orders = decorateOrders(orders, market)
        orders = groupBy(orders, "type")

        console.log("decorated  orders", orders)

        const buyOrders = get(orders, "buy", [])
        const sellOrders = get(orders, "sell", [])

        return {
            orders,
            buyOrders,
            sellOrders
        }

    }
)






