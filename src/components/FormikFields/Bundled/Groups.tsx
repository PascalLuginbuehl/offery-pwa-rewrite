import * as React from "react"
import {  Grid } from "@material-ui/core"
import IntlTypography from "../../Intl/IntlTypography"
import FormikDivider from "../FormikDivider"
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints"
import { GridSize, GridProps } from "@material-ui/core/Grid"

interface FormikGroupsProps extends Omit<GridProps, "container"| "item"> {
  label: string
  children: React.ReactNode
}

export default function FormikGroups(props: FormikGroupsProps) {
  const {
    children,
    label,
    ...gridProps
  } = props

  return (
    <Grid item {...gridProps}>
      <Grid container spacing={1}>
        <FormikDivider />
        <Grid item xs={12}>
          <IntlTypography variant="subtitle1" style={{ fontWeight: "bold" }}>
            {label}
          </IntlTypography>
        </Grid>
        {children}
      </Grid>
    </Grid>
  )
}
