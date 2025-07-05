/**
 * Hooks: Connect components to the Redux store.
 *        - useAppDispatch: dispatch actions
 *        - useAppSelector: read from state
 *        - useAppStore: access the store instance
 *
 * These wrappers include type definitions for consistent usage across the app.
 */


import { useDispatch, useSelector, useStore } from 'react-redux'

// Use throughout your app instead of plain 'useDispatch' and 'useSelector'
export const useAppDispatch = useDispatch.withTypes()
export const useAppSelector = useSelector.withTypes()
export const useAppStore = useStore.withTypes()