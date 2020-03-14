import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid } from "@material-ui/core"

import { injectIntl, WrappedComponentProps } from "react-intl"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import PageHeader from "../../../components/PageHeader"
import IntlTypography from "../../../components/Intl/IntlTypography"
import { ILead } from "../../../interfaces/ILead"

const styles = (theme: Theme) => createStyles({})

interface Props extends WithResourceProps, WithStyles<typeof styles>, WrappedComponentProps {
  lead: ILead
}

class OfferDone extends React.Component<Props> {
  public render() {
    const { selectedCompany } = this.props

    return (
      <Grid item xs={12}>
        <Grid container spacing={1} style={{ padding: 8 }}>
          <Grid item xs={12}>
            <PageHeader title="OFFER_DONE" />
            <IntlTypography>LEAD_FINISHED_TEXT</IntlTypography>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default injectIntl(withStyles(styles)(withResource(OfferDone)))
