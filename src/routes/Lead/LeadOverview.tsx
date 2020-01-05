import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid, TextField as MuiTextField, Divider, Typography, Button, Table, TableHead, TableRow, TableBody, TableCell } from "@material-ui/core"
import { Formik, FormikProps, withFormik, Field, FieldArray, Form } from "formik"
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
import FormikSimpleSelect from "../../components/FormikFields/FormikSimpleSelect"

const styles = (theme: Theme) => createStyles({})

function desc<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

interface _Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  lead: ILead
}

class LeadOverview extends React.Component<_Props> {
  public render() {
    const { selectedCompany, lead, intl } = this.props

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
                  <IntlTableCell component="th" scope="row">FULL_NAME</IntlTableCell>
                  <TableCell>{lead.Customer.Firstname} {lead.Customer.Lastname}</TableCell>
                </TableRow>

                <TableRow>
                  <IntlTableCell component="th" scope="row">FROM</IntlTableCell>
                  <TableCell>
                    {lead.FromAddress ? `${lead.FromAddress.PLZ} ${lead.FromAddress.City}, ${lead.FromAddress.Street}` : <FormattedMessage id="NO_ADDRESS" />}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <IntlTableCell component="th" scope="row">TO</IntlTableCell>
                  <TableCell>
                    {lead.ToAddress ? `${lead.ToAddress.PLZ} ${lead.ToAddress.City}, ${lead.ToAddress.Street}` : <FormattedMessage id="NO_ADDRESS" />}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <IntlTableCell component="th" scope="row">VISITING_DATE</IntlTableCell>
                  <TableCell><FormattedDate value={lead.VisitDate} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
                </TableRow>
                <TableRow>
                  <IntlTableCell component="th" scope="row">CREATED</IntlTableCell>
                  <TableCell><FormattedDate value={lead.Created} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric" /></TableCell>
                </TableRow>
                <TableRow>
                  <IntlTableCell component="th" scope="row">SERVICES</IntlTableCell>
                  <TableCell><ServiceIcons lead={lead} services={lead.Services} /></TableCell>
                </TableRow>
                <TableRow>
                  <IntlTableCell component="th" scope="row">STATUS</IntlTableCell>
                  <IntlTableCell>{lead.Status.NameTextKey}</IntlTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </FormikGroups>

          <FormikGroups label="OFFER_STATUS" xs={12} md={6}>
            {
              lead.Offers.length > 0 ? (
                <Formik
                  initialValues={() => ({
                    search: "",
                    status: ""
                  })}
                  onSubmit={() => {

                  }}
                >
                  {() => (
                    <Form>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          <IntlTypography>OFFER_SENT_EMAIL</IntlTypography>
                        </Grid>
                        <FormikGroups label="MANUAL_OVERRIDE" xs={12}>
                          <Field
                            label="OFFER"
                            name="selectedOfferId"
                            component={FormikSimpleSelect}
                            notTranslated
                            options={lead.Offers.sort((offer1, offer2) => new Date(offer2.Created).getTime() - new Date(offer1.Created).getTime()).map(offer => ({
                              label: offer.FromTemplate + ", " + intl.formatDate(offer.Created, { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" }),
                              value: offer.OfferId,
                            }))}
                          />
                        </FormikGroups>
                      </Grid>
                    </Form>
                  )}
                </Formik>
              ) : (
                <Grid item xs={12}>
                  <IntlTypography>OFFER_NOT_SENT</IntlTypography>
                </Grid>
              )
            }



          </FormikGroups>

          <FormikGroups label="STATUS_HISTORY" xs={12}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <IntlTableCell>STATUS</IntlTableCell>
                  <IntlTableCell>DATE</IntlTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lead.StatusHistories.sort((a, b) => desc(a, b, "Created")).map(e => (
                  <TableRow key={e.StatusHistoryId}>
                    <IntlTableCell>{e.Status.NameTextKey}</IntlTableCell>
                    <TableCell><FormattedDate value={e.Created} month="numeric" day="numeric" year="numeric" hour="numeric" minute="numeric"/></TableCell>
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
