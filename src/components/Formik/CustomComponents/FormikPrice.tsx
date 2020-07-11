import * as React from "react"
import { InputAdornment } from "@material-ui/core"
import FormikTextField, { FormikTextFieldProps } from "../FormikTextField"

export type FormikPriceProps<FormValues> = Omit<FormikTextFieldProps<FormValues>, "type" | "InputProps">

export default function FormikPrice<FormValues>(props: FormikPriceProps<FormValues>) {
  return <FormikTextField<FormValues>
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          CHF
        </InputAdornment>
      ),
    }}

    inputProps={{
      step: 1,
      min: 0,
    }}

    type="number"

    {...props}
  />
}
