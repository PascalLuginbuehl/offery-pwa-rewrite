import { connectRouter, routerMiddleware, RouterState } from "connected-react-router"
import { createHashHistory } from "history"
import {  Reducer, configureStore } from "@reduxjs/toolkit"
import { companySlice } from "./slicers"
import thunk from "redux-thunk"
import { useDispatch } from "react-redux"


export const history = createHashHistory({
  hashType: "slash",
  getUserConfirmation: (message, callback) => callback(window.confirm(message))
})


export const store = configureStore({
  reducer: {
    company: companySlice.reducer,
    router: connectRouter(history) as any as Reducer<RouterState<any>>, // LocationState
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(routerMiddleware(history))
      .concat(thunk),
  devTools: true
})

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export type RootState = ReturnType<typeof store.getState>

