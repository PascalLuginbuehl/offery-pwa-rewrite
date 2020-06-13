import { Reducer } from "redux"
import { KnownCompanyActions } from "../actions"
import { CompanyModel } from "../models"

export interface CompanyState {
  company: CompanyModel | null
  companyLoading: boolean
}

export const companyInitialState: CompanyState = {
  company: null,
  companyLoading: false,
}

export const companyReducer: Reducer<CompanyState, KnownCompanyActions> = (
  state: CompanyState = companyInitialState, action: KnownCompanyActions): CompanyState => {
  switch (action.type) {
    // me
    case "REQUEST_ME":
      return {
        ...state,
        companyLoading: true,
      }
    case "UPDATE_ME": // same action, this immediatly updates and skips response from fetch request
    case "RECEIVE_ME":
      return {
        ...state,
        company: action.company,
        companyLoading: false,
      }
    case "FAILED_ME":
      return {
        ...state,
        companyLoading: false,
      }

    default:
      return state
  }
}
