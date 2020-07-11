import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { authorizedFetch } from "./AuthorizedRequest"
import { AdminCompanyModel } from "../models"

export const fetchCompanyById = createAsyncThunk<
  // Return type of the payload creator
  AdminCompanyModel,
  // First argument to the payload creator
  number
>(
  "users/fetchById",
  // if you type your function argument here
  async (companyId: number) => {
    return await authorizedFetch<AdminCompanyModel>(`company/${companyId}`)
  }
)

interface UsersState {
  company: AdminCompanyModel | null
  loading: "idle" | "pending" | "succeeded" | "failed"
}

const initialState: UsersState = {
  company: null,
  loading: "idle"
}

export const companySlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // fill in primary logic here
  },
  extraReducers: builder => {
    builder.addCase(fetchCompanyById.pending, (state, action) => {
      state.loading = "pending"
    })

    builder.addCase(fetchCompanyById.fulfilled, (state, action) => {
      state.company = action.payload
      state.loading = "succeeded"
    })

    builder.addCase(fetchCompanyById.rejected, (state, action) => {
      state.company = null
      state.loading = "failed"
    })
  }
})
