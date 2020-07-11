import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { authorizedFetch } from "./AuthorizedRequest"
import { CompanyAdminModel, CompanyUpdateModel } from "../models"
import { CompanySettingModel } from "../models/CompanySettingModel"

export const fetchCompanyById = createAsyncThunk<CompanyAdminModel, number>(
  "company/fetchById",
  async (companyId: number) => {
    return await authorizedFetch<CompanyAdminModel>(`company/${companyId}`)
  }
)

export const updateCompany = createAsyncThunk<CompanyAdminModel, CompanyUpdateModel>(
  "company/updateById",
  async (company: CompanyUpdateModel) => {
    return await authorizedFetch<CompanyAdminModel>(`company/${company.CompanyId}`, {
      method: "PUT",
      body: JSON.stringify(company)
    })
  }
)

export const fetchCompanySettingById = createAsyncThunk<CompanySettingModel, number>(
  "company/updateById",
  async (companyId: number) => {
    return await authorizedFetch<CompanySettingModel>(`csettingcondition/company/${companyId}`)
  }
)

interface UpdateCompanySetting {
  companyId: number
  companySetting: CompanySettingModel
}

export const updateCompanySetting = createAsyncThunk<CompanySettingModel, UpdateCompanySetting>(
  "company/updateById",
  async ({companyId, companySetting}: UpdateCompanySetting) => {
    return await authorizedFetch<CompanySettingModel>(`csettingcondition/company/${companyId}`, {
      method: "PUT",
      body: JSON.stringify(companySetting)
    })
  }
)

interface UsersState {
  company: CompanyAdminModel | null
  companyLoading: "idle" | "pending" | "succeeded" | "failed"

  companySetting: CompanySettingModel | null
  companySettingLoading: "idle" | "pending" | "succeeded" | "failed"
}

const initialState: UsersState = {
  company: null,
  companyLoading: "idle",

  companySetting: null,
  companySettingLoading: "idle",
}

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    // fill in primary logic here
  },
  extraReducers: builder => {
    builder.addCase(fetchCompanyById.pending, (state) => {
      state.companyLoading = "pending"
    })

    builder.addCase(fetchCompanyById.fulfilled, (state, action) => {
      state.company = action.payload
      state.companyLoading = "succeeded"
    })

    builder.addCase(fetchCompanyById.rejected, (state) => {
      state.company = null
      state.companyLoading = "failed"
    })

    builder.addCase(updateCompany.fulfilled, (state, { payload }) => {
      state.company = payload
    })

    // CompanySetting
    builder.addCase(fetchCompanySettingById.pending, (state) => {
      state.companySettingLoading = "pending"
    })

    builder.addCase(fetchCompanySettingById.fulfilled, (state, action) => {
      state.companySetting = action.payload
      state.companySettingLoading = "succeeded"
    })

    builder.addCase(fetchCompanySettingById.rejected, (state) => {
      state.companySetting = null
      state.companySettingLoading = "failed"
    })

    builder.addCase(updateCompanySetting.fulfilled, (state, { payload }) => {
      state.companySetting = payload
    })
  }
})
