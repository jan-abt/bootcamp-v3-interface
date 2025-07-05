/*
 * Selectors: query state from the Redux store.
 *            functions that extract and compute derived data from state.
 */

import { get } from "lodash"
import { createSelector } from "reselect"


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


