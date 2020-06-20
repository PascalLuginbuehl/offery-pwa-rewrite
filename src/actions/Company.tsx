import { ThunkAction } from "redux-thunk"

import { ApplicationState } from "../store"
import { authorizedFetch } from "./AuthorizedRequest"
import { AdminCompanyModel } from "../models"


interface RequestMeAction {
  type: "REQUEST_COMPANY"
}

interface ReceiveMeAction {
  type: "RECEIVE_COMPANY"
  company: AdminCompanyModel
}
interface UpdateMeAction {
  type: "UPDATE_ME"
  company: AdminCompanyModel
}
interface FailedMeAction {
  type: "FAILED_REQUEST"
  error: Error
}

export type KnownCompanyActions = RequestMeAction | ReceiveMeAction | FailedMeAction | UpdateMeAction

type AppThunk<ReturnType = void> = ThunkAction<ReturnType, ApplicationState, null, KnownCompanyActions>

export const CompanyActionCreators = {
  // me
  requestCompany: (companyId: number): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const { company } = getState()

    console.info("Request Company...")
    dispatch({ type: "REQUEST_COMPANY" })
    try {
      const data = await authorizedFetch<AdminCompanyModel>(`company/${companyId}`)
      dispatch({ type: "RECEIVE_COMPANY", company: data })

      return
    } catch (e) {
      dispatch({ type: "FAILED_REQUEST", error: e })
      throw e
    }
  }
}
