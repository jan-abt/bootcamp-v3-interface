/*
 * Redux Slice for Exchange State
 *
 * This slice manages:
 * 
 * - `market`: The currently selected market (e.g., a trading pair or market object).
 *
 * Reducers:
 *   Pure functions that update the state in response to actions.
 *   - `setMarket`: Sets the active market based on the provided payload.
 *
 * Actions:
 *   Redux Toolkit automatically generates actions from reducer names.
 *   In your component or hook, you might dispatch like this:
 *
 *     dispatch(setMarket(market))
 *
 *   This gets wrapped into an action object like:
 *     {
 *       type: "exchange/setMarket",
 *       payload: market
 *     }
 *
 * Exported:
 *   - Action creator: `setMarket`
 *   - Reducer: `exchangeSlice.reducer` (default export)
 */

import { createSlice } from '@reduxjs/toolkit'

const exchangeSlice = createSlice({
    name: "exchange",
    initialState: {
        market: null        
    },
    // reducers: pure functions that handle state changes
    reducers: {
        setMarket: (state, action)=>{
            state.market = action.payload
        }
    }
})

export const { setMarket } = exchangeSlice.actions
export default exchangeSlice.reducer