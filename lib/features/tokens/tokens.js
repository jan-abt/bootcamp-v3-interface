import { createSlice } from '@reduxjs/toolkit'

const tokenSlice = createSlice({
    name: "tokens",
    initialState: {
        tokens: [],
        balances: {}
    },
    // actions
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