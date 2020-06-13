import { ThunkAction } from "redux-thunk"

import { ApplicationState } from "../store"
import { authorizedFetch } from "./AuthorizedRequest"
import { CompanyModel } from "../models"


interface RequestMeAction {
  type: "REQUEST_ME"
}

interface ReceiveMeAction {
  type: "RECEIVE_ME"
  company: CompanyModel
}
interface UpdateMeAction {
  type: "UPDATE_ME"
  company: CompanyModel
}
interface FailedMeAction {
  type: "FAILED_ME"
  error: Error
}

export type KnownCompanyActions = RequestMeAction | ReceiveMeAction | FailedMeAction | UpdateMeAction

type AppThunk<ReturnType = void> = ThunkAction<ReturnType, ApplicationState, null, KnownCompanyActions>

export const CompanyActionCreators = {
  // me
  requestMe: (): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const { company } = getState()

    console.info("Request Me...")
    dispatch({ type: "REQUEST_ME" })
    try {
      const data = await authorizedFetch<CompanyModel>(`user/me`)
      dispatch({ type: "RECEIVE_ME", company: data })
      return
    } catch (e) {
      dispatch({ type: "FAILED_ME", error: e })
      throw e
    }
  }
}
