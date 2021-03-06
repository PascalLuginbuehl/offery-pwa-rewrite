import React from "react"


import { Field } from "formik"

import FormikTextField from "../FormikTextField"


import FormikGroups from "./Groups"

export default function Address({ prefix }: { prefix: string }) {
  return (
    <FormikGroups label="ADDRESS" xs={12}>
      <Field label="STREET" name={`${prefix}.Street`} component={FormikTextField} overrideGrid={{ xs: 12, sm: 5, md: undefined }} />

      <Field label="ZIP_CODE" name={`${prefix}.PLZ`} type="number" component={FormikTextField} inputProps={{ step: 1, min: 0 }} overrideGrid={{ xs: 4, sm: 2, md: undefined }} />

      <Field label="CITY" name={`${prefix}.City`} component={FormikTextField} overrideGrid={{ xs: 8, sm: 5, md: undefined }} />
    </FormikGroups>
  )
}
