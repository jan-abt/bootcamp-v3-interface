/*
 * Slice Reducers: Pure functions that handle state changes.
 *                 They define how the app’s state updates in response to actions.
 *
 * Actions:        Plain objects with a `type` field.
 *                 Represent events that describe what happened.
 *                 Dispatched to trigger a state update.
 *
 * Example:
 *   When we "dispatch" data from our React components or custom hooks:
 *     dispatch(setBalance({ address, wallet: 100, exchange: 200 }))
 *
 *   We're only providing the payload.
 *   Behind the scenes, Redux Toolkit wraps it into an action object like:
 *
 *   {
 *     type: "tokens/setBalance",
 *     payload: {
 *       address,
 *       wallet,
 *       exchange
 *     }
 *   }
 */


import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: "user",
    initialState: {
        account: null,
        balance: 0
    },
    // reducers: pure functions that handle state changes
    reducers: {
        setAccount: (state, action)=>{
            state.account = action.payload
        },        
        setBalance: (state, action)=>{
            state.balance = action.payload
        }
    }
})

export const { setAccount, setBalance } = userSlice.actions
export default userSlice.reducer