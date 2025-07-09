/*
 * Selectors: query state from the Redux store.
 *            functions that extract and compute derived data from state.
 */

import { createSelector } from "reselect"
import { get, reject, groupBy, maxBy, minBy } from "lodash"
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
export const selectAllCancelledOrders = state => get(state, "exchange.cancelledOrders", [])
export const selectAllFilledOrders = state => get(state, "exchange.filledOrders", [])
export const selectMarket = state => get(state, "exchange.market", [])
export const selectOrderToFill = state => get(state, "exchange.orderToFill", {})

export const selectAllOpenOrders = createSelector(
    selectAllOrders,
    selectAllCancelledOrders,
    selectAllFilledOrders,
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
    selectAllOpenOrders,
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

        //console.log("decorated  orders", orders)

        const buyOrders = get(orders, "buy", [])
        const sellOrders = get(orders, "sell", [])

        return {
            orders,
            buyOrders,
            sellOrders
        }

    }
)

export const selectMyOpenOrders = createSelector(
    selectAllOpenOrders,
    selectAccount,
    selectMarket,
    (orders, account, market) => {

        // Filter orders by selected market
        orders = orders.filter((o) => o.tokenGet === market[0].address || o.tokenGet === market[1].address)
        orders = orders.filter((o) => o.tokenGive === market[0].address || o.tokenGive === market[1].address)

        orders = orders.filter((o) => o.user == account)

        orders = decorateOrders(orders, market)

        return orders

    }

)




export const selectFilledOrders = createSelector(
    selectAllFilledOrders,
    selectMarket,
    (orders, market) => {
        if (!market) return []

        // Filter orders by selected market
        orders = orders.filter((o) => o.tokenGet === market[0].address || o.tokenGet === market[1].address)
        orders = orders.filter((o) => o.tokenGive === market[0].address || o.tokenGive === market[1].address)

        orders = decorateOrders(orders, market)

        return orders

    }

)

export const selectMyFilledOrders = createSelector(
    selectAllFilledOrders,
    selectAccount,
    selectMarket,
    (orders, account, market) => {

        // Filter orders by selected market
        orders = orders.filter((o) => o.tokenGet === market[0].address || o.tokenGet === market[1].address)
        orders = orders.filter((o) => o.tokenGive === market[0].address || o.tokenGive === market[1].address)

        orders = orders.filter((o) => o.user == account)

        orders = decorateOrders(orders, market)

        return orders

    }

)

// ------------------------------------------------------------------------
// PRICECHART

export const selectPriceData = createSelector(
    selectFilledOrders,
    (orders) => {

        // sort by data, ascending order
        orders = orders.sort((a, b) => a.timestamp - b.timestamp)

        // Get the last two orders for finaal price and price change
        let secondLastOrder, lastOrder
        [secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length)

        const lastPrice = get(lastOrder, "price", 0)

        const secondLastPrice = get(secondLastOrder, "price", 0)

        //console.log(buildGraphData(orders))

        return ({
            lastPrice,
            lastPriceChange: (lastPrice >= secondLastPrice) ? "+" : "-",
            series: [{data:buildGraphData(orders)}]
        })
    }
)

const buildGraphData = (orders) => {
    //Group the orders by hour for the graph
    const ordersByHour = groupBy(orders, (o) => moment.unix(o.timestamp).startOf("hour").format())

    // Get the hours where data exists (some trades happened)
    const hours = Object.keys(ordersByHour)


    const graphData = hours.map((hr) => {

        const orders = ordersByHour[hr]

        const open = orders[0]
        const high = maxBy(orders, "price")
        const low = minBy(orders, "price")
        const close = orders[orders.length - 1]

        return ({
            x: new Date(hr),
            y: [open.price, high.price, low.price, close.price]

        })

    })

    return graphData
}



// ------------------------------------------------------------------------
// LOANS

const loans = state => get(state, "exchange.loans", [])

export const selectFlashLoans = createSelector(
    loans,
    (loans)=>{
        return loans.map((loan)=>{
            return {
                token: loan.token,
                amount: loan.amount, 
                date: moment.unix(loan.timestamp).format("D MMM YY h:mm: A")
            }

        })
    }
)



