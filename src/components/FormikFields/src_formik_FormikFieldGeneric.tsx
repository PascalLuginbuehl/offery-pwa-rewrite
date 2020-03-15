import * as React from "react"

import { Breakpoint } from "@material-ui/core/styles/createBreakpoints"
import { GridSize, Grid } from "@material-ui/core"
import { Field, FieldConfig } from "formik"

import FormikTextField, { FormikTextFieldProps } from "./FormikTextField"
import FormikSimpleSelect, { FormikSelectProps } from "./FormikSimpleSelect"
import FormikDatePicker, { FormikDatePickerProps } from "./FormikDateTimePicker"
import FormikSwitch, { SwitchProps } from "./Switch"
import Select, { SelectProps } from "./Select"

type Props<FormValues> = {
    name: keyof FormValues

    disableGrid?: boolean
    overrideGrid?: Partial<Record<Breakpoint, boolean | GridSize>>
} & Omit<FieldConfig, "name" | "component">

type KnownProps<FormValues> =
| ({ component: typeof FormikTextField } & FormikTextFieldProps & Props<FormValues>)
  | ({ component: typeof FormikSimpleSelect } & FormikSelectProps & Props<FormValues>)
  | ({ component: typeof FormikDatePicker } & FormikDatePickerProps & Props<FormValues>)
  | ({ component: typeof FormikSwitch } & SwitchProps & Props<FormValues>)
  | ({ component: typeof Select } & SelectProps & Props<FormValues>)


// Magic for strict unions
// https://stackoverflow.com/questions/52771362/typescript-react-union-type-for-props-does-not-display-error-when-providing-exc
/* eslint-disable @typescript-eslint/no-explicit-any */
type UnionKeys<T> = T extends any ? keyof T : never
type StrictUnionHelper<T, TAll> = T extends any ? T & Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> : never
type StrictUnion<T> = StrictUnionHelper<T, T>

const FormikFieldGeneric = <FormValues extends any>() => ({
  name,

  disableGrid = false,
  overrideGrid = { xs: 12, md: 6 },   // md-6: allow up to 2 fields per column

  ...props
}: StrictUnion<KnownProps<FormValues>>) => {
  const field = <Field name={name} {...props} />

  if (disableGrid) {
    return field
  }

  return <Grid item {...overrideGrid}>{field}</Grid>
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default FormikFieldGeneric
