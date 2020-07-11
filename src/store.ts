import { connectRouter, routerMiddleware, RouterState } from "connected-react-router"
import { createHashHistory } from "history"
import {  Reducer, configureStore, MiddlewareArray } from "@reduxjs/toolkit"
import { companySlice } from "./slicers"
import thunk from "redux-thunk"


export const history = createHashHistory({
  hashType: "slash",
  getUserConfirmation: (message, callback) => callback(window.confirm(message))
})


export const store = configureStore({
  reducer: {
    company: companySlice.reducer,
    router: connectRouter(history) as any as Reducer<RouterState<any>>, // LocationState
  },
  middleware: new MiddlewareArray().concat(routerMiddleware(history), thunk),
  devTools: true
})

export type RootState = ReturnType<typeof store.getState>
