import { ApplicationState } from "../store"
import { KnownCompanyActions } from "./Company"
export * from "./Company"

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => ApplicationState): void
}

export type KnownActions = KnownCompanyActions // | KnownStatusActions | KnwonConfigurationActions
