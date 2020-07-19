import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid } from "@material-ui/core"

import { injectIntl, WrappedComponentProps } from "react-intl"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import PageHeader from "../../../components/PageHeader"
import IntlTypography from "../../../components/Intl/IntlTypography"
import { ILead } from "../../../interfaces/ILead"
import animation from "../../../components/lottie/12824-mail.json"
import Lottie from "lottie-react-web"

const styles = (theme: Theme) => createStyles({})

interface Props extends WithResourceProps, WithStyles<typeof styles>, WrappedComponentProps {
  lead: ILead
}

class EmailSent extends React.Component<Props> {
  public render() {
    const { selectedCompany } = this.props

    return (
      <Grid item xs={12}>
        <Grid container spacing={1} style={{ padding: 8 }}>
          <Grid item xs={12}>
            <PageHeader title="EMAIL_SENT" />
            <IntlTypography>EMAIL_HAS_BEEN_SENT</IntlTypography>

            <Lottie
              height={256}
              width={256}
              options={{
                animationData: animation,
                loop: false,
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default injectIntl(withStyles(styles)(withResource(EmailSent)))
