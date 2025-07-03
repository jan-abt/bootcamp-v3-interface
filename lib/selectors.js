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
                balance:  balances[token.address] ? balances[token.address].wallet : 0
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
                balance:  balances[token.address] ? balances[token.address].exchange : 0
            }
        })
    })