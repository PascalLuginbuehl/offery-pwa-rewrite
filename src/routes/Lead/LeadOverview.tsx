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
                  <TableCell component="th" scope="row">FIRST_LASTNAME</TableCell>
                  <TableCell>{lead.Customer.Firstname} {lead.Customer.Lastname}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">FROM_TO</TableCell>
                  <TableCell>{lead.FromAddress ? lead.FromAddress.Street : "Not set"} {lead.ToAddress ? lead.ToAddress.Street : "Not set"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">VISITING_DATE</TableCell>
                  <TableCell><FormattedDate value={lead.VisitDate} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">SERVICES</TableCell>
                  <TableCell><ServiceIcons test={1} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">STATUS</TableCell>
                  <TableCell>{lead.Status.NameTextKey}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </FormikGroups>

          <FormikGroups label="LEAD_STATUS" xs={12} md={6}>

          </FormikGroups>

          <FormikGroups label="STATE_HISTORY" xs={12} md={6}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>STATUS</TableCell>
                  <TableCell>DATE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lead.StatusHistories.map(e => (
                  <TableRow key={e.StatusHistoryId}>
                    <TableCell>{e.Status.NameTextKey}</TableCell>
                    <TableCell><FormattedDate value={e.Created} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </FormikGroups>

        </Grid>
      </Grid>
    )
  }
}

export default injectIntl(withStyles(styles)(withResource(LeadOverview)))
