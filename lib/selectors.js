import { get } from "lodash"
import { createSelector } from "reselect"


// ------------------------------------------------------------------------
// USER

// Account 
export const selectAccount = state => get(state, "user.account", null)
export const selectETHBalance = state => get(state, "user.balance", null)
