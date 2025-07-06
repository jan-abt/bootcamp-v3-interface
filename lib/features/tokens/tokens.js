/*
 * Redux Slice for Token and Balance State
 *
 * This slice manages:
 *
 * - `tokens`:     An array of token metadata, indexed by `payload.index`.
 * - `balances`:   An object mapping each address to its wallet and exchange balances.
 *
 * Reducers:
 *   Pure functions that modify the state in response to dispatched actions.
 *   - `setToken`:     Inserts or updates a token at a specific index.
 *   - `setBalance`:   Updates the wallet and exchange balances for a specific address.
 *
 * Actions:
 *   Redux Toolkit auto-generates actions based on the reducer names.
 *   When dispatched from React components or hooks, they look like:
 *
 *     dispatch(setBalance({
 *         address: "0xabc...",
 *         wallet: 100,
 *         exchange: 200
 *     }))
 *
 *   Redux Toolkit wraps this payload into an action object like:
 *     {
 *       type: "tokens/setBalance",
 *       payload: {
 *         address: "0xabc...",
 *         wallet: 100,
 *         exchange: 200
 *       }
 *     }
 *
 * Exported:
 *   - Action creators: `setToken`, `setBalance`
 *   - Reducer: `tokenSlice.reducer` (default export)
 */


import { createSlice } from '@reduxjs/toolkit'

const tokenSlice = createSlice({
    name: "tokens",
    initialState: {
        tokens: [],
        balances: {}
    },
    // reducers: pure functions that handle state changes 
    reducers: {
        setToken: (state, action) => {
            state.tokens[action.payload.index] =
                action.payload
        },
        setBalance: (state, action) => {
            state.balances[action.payload.address] = {
                wallet: action.payload.wallet,
                exchange: action.payload.exchange
            }
        }
    }
})
// actions handled by the slice reducer
export const { setToken, setBalance } = tokenSlice.actions
export default tokenSlice.reducer