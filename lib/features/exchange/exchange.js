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
import { act } from 'react'

const exchangeSlice = createSlice({
    name: "exchange",
    initialState: {
        market: null,
        allOrders: [],
        filledOrders: [],
        cancelledOrders: [],        
    },
    // reducers: pure functions that handle state changes
    reducers: {
        setMarket: (state, action) => {
            state.market = action.payload
        },
        setAllOrders: (state, action) => {
            state.allOrders = action.payload
        },
        setFilledOrders: (state, action) => {
            state.filledOrders = action.payload
        },
        setCancelledOrders: (state, action) => {
            state.cancelledOrders = action.payload
        },
        addOrder: (state, action) =>{
            /**
             * Since the id for an order is uique, we can add new orders by their id.
             * We could just do .push(), however, this could result in duplicate orders
             * and would cause the event listener to fire multiple times.
             */
            state.allOrders[action.payload.id -1] = action.payload
        },
        addCancelledOrder: (state, action) =>{
            state.cancelledOrders[action.payload.id -1] = action.payload
        }
    }
})

export const {
    setMarket,
    setAllOrders,
    setFilledOrders,
    setCancelledOrders  ,
    addOrder,
    addCancelledOrder
} = exchangeSlice.actions
export default exchangeSlice.reducer