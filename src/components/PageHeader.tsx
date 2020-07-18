import * as React from "react"

import Grid from "@material-ui/core/Grid"
import withWidth, { WithWidthProps } from "@material-ui/core/withWidth"
import IntlTypography from "./Intl/IntlTypography"
import { Breadcrumbs, Typography } from "@material-ui/core"

interface Props extends WithWidthProps {
  title: string
  subtitle?: string
}

class PageHeader extends React.Component<Props> {
  public render() {
    if (this.props.width !== "xs") {
      return (
        <Grid item xs={12}>
          <IntlTypography variant="h5">{this.props.title}</IntlTypography>
        </Grid>
      )
    } else {
      return (
        <Grid item xs={12} style={{padding: "0 4px"}}>
          <Breadcrumbs aria-label="breadcrumb">
            {/* <IntlTypography color="inherit">Lead</IntlTypography>
          <Typography color="inherit">LEADID</Typography> */}
            <IntlTypography color="textPrimary">{this.props.title}</IntlTypography>
          </Breadcrumbs>
        </Grid>
      )
    }
  }
}

interface NewPageHeaderProps {
  title: string
}

export function NewPageHeader(props: NewPageHeaderProps) {
  const { title } = props

  return (
    <Typography variant="h5" gutterBottom>{title}</Typography>
  )
}

export default withWidth()(PageHeader)
