import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: "user",
    initialState: {
        account: null,
        balance: 0
    },
    // actions
    reducers: {
        setAccount: (state, action)=>{
            state.account = action.payload
        },        
        setBalance: (state, action)=>{
            state.balance = action.payload
        }
    }
})
// actions handled by the slice reducer
export const { setAccount, setBalance } = userSlice.actions
export default userSlice.reducer