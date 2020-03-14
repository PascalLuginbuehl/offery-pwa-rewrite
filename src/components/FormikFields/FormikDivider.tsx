import * as React from "react"
import { Divider, Grid } from "@material-ui/core"
import { DividerProps } from "@material-ui/core/Divider"


const FormikDivider: React.ComponentType<DividerProps> = (props) => (
  <Grid item xs={12}>
    <Divider {...props} />
  </Grid>
)

export default FormikDivider
