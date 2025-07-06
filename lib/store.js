/*
    Centralized State Container
    Holds the entire state of the bootcamp-v3-interface app in one object tree.
*/

import { configureStore } from '@reduxjs/toolkit'
import user from "./features/user/user"
import tokens from "./features/tokens/tokens"
import exchange from "./features/exchange/exchange"


/*
    Creates the store with two reducers: user, tokens.
*/
export const makeStore = () => {
    return configureStore({
        reducer: {
            user,
            tokens,
            exchange
        }
    })
}