import React from "react"
import { Grid, InputAdornment } from "@material-ui/core"
import IntlTypography from "../../Intl/IntlTypography"
import { Field } from "formik"
import Select from "../Select"
import FormikTextField from "../FormikTextField"
import { IResource } from "../../../interfaces/IResource"
import Switch from "../Switch"

export default ({ prefix }: { prefix: string; }) => {
  return (
    <>
      <Field label="STREET" name={`${prefix}.Street`} component={FormikTextField} />

      <Field label="CITY" name={`${prefix}.City`} component={FormikTextField} />

      <Field label="ZIP_CODE" name={`${prefix}.PLZ`} type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} />
    </>
  )
}
