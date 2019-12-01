import React from "react"
import { Grid, InputAdornment } from "@material-ui/core"
import IntlTypography from "../../Intl/IntlTypography"
import { Field } from "formik"
import Select from "../Select"
import FormikTextField from "../FormikTextField"
import { IResource } from "../../../interfaces/IResource"
import Switch from "../Switch"
import FormikGroups from "./Groups";

export default ({ prefix }: { prefix: string; }) => {
  return (
    <FormikGroups label="ADDRESS" xs={12} md={6}>
      <Field label="STREET" name={`${prefix}.Street`} component={FormikTextField} overrideGrid={{ xs: 6, md: undefined }} />

      <Field label="CITY" name={`${prefix}.City`} component={FormikTextField} overrideGrid={{ xs: 6, md: undefined }} />

      <Field label="ZIP_CODE" name={`${prefix}.PLZ`} type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} overrideGrid={{ xs: 6, md: undefined }} />
    </FormikGroups>
  )
}
