import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid, TextField as MuiTextField, Divider, Typography, Button, Table, TableHead, TableRow, TableBody, TableCell } from "@material-ui/core"
import { Formik, FormikProps, withFormik, Field, FieldArray } from "formik"
import { injectIntl, InjectedIntlProps, FormattedDate, FormattedMessage } from "react-intl"
import { withResource, WithResourceProps } from "../../providers/withResource"
import PageHeader from "../../components/PageHeader"
import IntlTypography from "../../components/Intl/IntlTypography"
import { ILead } from "../../interfaces/ILead"
import FormikGroups from "../../components/FormikFields/Bundled/Groups"
import ServiceIcons from "../../components/Dashboard/ServiceIcons"
import IntlTableCell from "../../components/Intl/IntlTableCell"
import animation from "../../components/lottie/433-checked-done.json"
import Lottie from "lottie-react-web"

const styles = (theme: Theme) => createStyles({})

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  lead: ILead
}

class LeadOverview extends React.Component<Props> {
  public render() {
    const { selectedCompany, lead } = this.props

    return (
      <Grid item xs={12}>
        <Grid container spacing={1} style={{ padding: 8 }}>
          <Grid item xs={12}>
            <PageHeader title="LEAD_OVERVIEW" />
          </Grid>

          <FormikGroups label="INFORMATION" xs={12} md={6}>
            <Table size="small" aria-label="a dense table">

              <TableBody>
                <TableRow>
                  <IntlTableCell component="th" scope="row">FIRST_LASTNAME</IntlTableCell>
                  <TableCell>{lead.Customer.Firstname} {lead.Customer.Lastname}</TableCell>
                </TableRow>
                <TableRow>
                  <IntlTableCell component="th" scope="row">FROM_TO</IntlTableCell>
                  <TableCell>{lead.FromAddress ? lead.FromAddress.Street : "Not set"} {lead.ToAddress ? lead.ToAddress.Street : "Not set"}</TableCell>
                </TableRow>
                <TableRow>
                  <IntlTableCell component="th" scope="row">VISITING_DATE</IntlTableCell>
                  <TableCell><FormattedDate value={lead.VisitDate} /></TableCell>
                </TableRow>
                <TableRow>
                  <IntlTableCell component="th" scope="row">SERVICES</IntlTableCell>
                  <TableCell><ServiceIcons services={lead.Services} /></TableCell>
                </TableRow>
                <TableRow>
                  <IntlTableCell component="th" scope="row">STATUS</IntlTableCell>
                  <IntlTableCell>{lead.Status.NameTextKey}</IntlTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </FormikGroups>

          <FormikGroups label="OFFER_STATUS" xs={12} md={6}>
            <Grid item xs={12}>
              <IntlTypography>TEST</IntlTypography>
            </Grid>
          </FormikGroups>

          <FormikGroups label="STATE_HISTORY" xs={12}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <IntlTableCell>STATUS</IntlTableCell>
                  <IntlTableCell>DATE</IntlTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lead.StatusHistories.map(e => (
                  <TableRow key={e.StatusHistoryId}>
                    <IntlTableCell>{e.Status.NameTextKey}</IntlTableCell>
                    <TableCell><FormattedDate value={e.Created} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </FormikGroups>

          <Lottie
            height={128}
            width={128}
            options={{
              animationData: animation,
              loop: false,
            }}
          />

        </Grid>
      </Grid>
    )
  }
}

export default injectIntl(withStyles(styles)(withResource(LeadOverview)))
