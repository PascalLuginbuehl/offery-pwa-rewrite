import { applyMiddleware, combineReducers, compose, createStore, Store, Middleware, Reducer } from "redux"
import thunk from "redux-thunk"
import { connectRouter, routerMiddleware, RouterState, LocationChangeAction } from "connected-react-router"
import { History } from "history"
import { reducers, CompanyState, companyInitialState } from "./reducers"


export interface ApplicationState {
  company: CompanyState
}

export default function configureStore(history?: History): Store<ApplicationState> {
  const middleware: Middleware<unknown>[] = [thunk]

  const prepareReducers: typeof reducers & { router?: Reducer<RouterState, LocationChangeAction> } = {
    ...reducers
  }

  // Disable react router in legacy code
  if (history) {
    middleware.push(routerMiddleware(history))

    prepareReducers.router = connectRouter(history)
  }

  const rootReducer = combineReducers(prepareReducers)

  const enhancers = []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const windowIfDefined = typeof window === "undefined" ? null : (window as any)

  if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__())
  }

  const initialState = {
    company: companyInitialState,
  }

  return createStore(rootReducer, initialState, compose(applyMiddleware(...middleware), ...enhancers))
}
