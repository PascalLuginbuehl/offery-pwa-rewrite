import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid, TextField as MuiTextField, Divider, Typography, Button } from "@material-ui/core"
import { Formik, FormikProps, withFormik, Field, FieldArray } from "formik"
import { injectIntl, InjectedIntlProps, FormattedDate, FormattedMessage } from "react-intl"
import { withResource, WithResourceProps } from "../../providers/withResource"
import PageHeader from "../../components/PageHeader"
import IntlTypography from "../../components/Intl/IntlTypography"
import { ILead } from "../../interfaces/ILead";


const styles = (theme: Theme) => createStyles({})

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  lead: ILead
}

class OfferDone extends React.Component<Props> {
  public render() {
    const { selectedCompany } = this.props

    return (
      <Grid item xs={12}>
        <PageHeader title="DONE" />
        <Grid item xs={12}>
          <IntlTypography>LEAD_FINISHED_TEXT</IntlTypography>
        </Grid>
      </Grid>
    )
  }
}

export default injectIntl(
  withStyles(styles)(
    withResource(
      OfferDone
    )
  )
)
