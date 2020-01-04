
import * as React from "react"
import { green } from "@material-ui/core/colors"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"
import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye"
import { FormattedDate, FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl"
import ContactsIcon from "@material-ui/icons/Contacts"
import { createStyles, Grid, Theme, WithStyles, withStyles, Table, TableHead, TableCell, TableRow, TableBody, IconButton, Typography, Tabs, Tab, ListItem, List, Avatar, ListItemText, ListItemSecondaryAction, Collapse, TableFooter, TablePagination, Button } from "@material-ui/core"
import OfflinePinIcon from "@material-ui/icons/OfflinePin"
import PlainLink from "../components/PlainLink"
import Wrapper from "../components/Form/Wrapper"
import IntlTypography from "../components/Intl/IntlTypography"
import { WithResourceProps, withResource } from "../providers/withResource"
import DashboardService from "../services/LeadService"
import { ICompressedLead } from "../interfaces/ILead"
import { Formik, Form, Field } from "formik"
import FormikSimpleSelect from "../components/FormikFields/FormikSimpleSelect"
import FormikTextField from "../components/FormikFields/FormikTextField"
import ServicesComponent from "../components/Dashboard/ServiceIcons"


const styles = (theme: Theme) =>
  createStyles({
    positionAddRight: {
      padding: theme.spacing(2),
      textAlign: "right",
    },
    root: {
      padding: theme.spacing(1),
      [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(2),
      },
    },
  })

interface _State {
  leads: ICompressedLead[]
  leadsAwait: Promise<any> | null
}

interface Props extends WithStyles<typeof styles>, WithResourceProps {

}

class TableDashboard extends React.Component<Props, _State> {
  state: _State = {
    leads: [],
    leadsAwait: null,
  }

  async componentDidMount() {
    const leadsAwait = DashboardService.fetchCompanyLeads(this.props.selectedCompany.CompanyId).catch(e => {
      return []
    })

    this.setState({ leadsAwait: leadsAwait })

    this.setState({ leads: await leadsAwait })
  }


  public render() {
    const { classes, selectedCompany, resource } = this.props
    const { leads, leadsAwait } = this.state

    return (
      <Wrapper initialLoading={leadsAwait} >
        <Grid container spacing={2} className={classes.root}>
          <Grid item xs={12}>
            <Typography variant="h5">{selectedCompany.Name}</Typography>
            <IntlTypography variant="caption">COMPANY_LEAD_OVERVIEW</IntlTypography>
          </Grid>

          <Grid item xs={12}>
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
                    <Field
                      label="STATUS"
                      name="status"
                      component={FormikSimpleSelect}
                      overrideGrid={{xs: 3, md: 2}}
                      options={resource.Balconies.map(e => ({ label: e.NameTextKey, value: e.BalconyId }))}
                    />
                    <Field component={FormikTextField} name="search" label="SEARCH" overrideGrid={{xs: 6, md: 8}}/>
                    <Grid item xs={3} md={2}>
                      <Button type="submit" variant="contained" color="primary" fullWidth>
                        SEARCH
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Grid>

          <Grid item xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell variant="head"><FormattedMessage id="STATUS" /></TableCell>
                  <TableCell variant="head"><FormattedMessage id="CUSTOMER" /></TableCell>
                  <TableCell variant="head"><FormattedMessage id="START_DESTINATION_ADDRESSES" /></TableCell>
                  <TableCell variant="head"><FormattedMessage id="VISITING_DATE" /></TableCell>
                  <TableCell variant="head"><FormattedMessage id="SERVICES" /></TableCell>
                  <TableCell variant="head"><FormattedMessage id="PROCESS_OVERVIEW" /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leads.map((lead) =>
                  <TableRow key={lead.LeadId}>
                    <TableCell>
                      <Typography noWrap variant="body2">
                        <FormattedMessage id={lead.Status.NameTextKey} />
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap variant="body2">
                        {lead.Customer.Firstname + " " + lead.Customer.Lastname}
                      </Typography>
                    </TableCell>
                    <TableCell style={{ padding: "6px 16px"}}>
                      <Typography variant="caption" component="span" noWrap>
                        {lead.FromAddress ? `${lead.FromAddress.PLZ} ${lead.FromAddress.City}, ${lead.FromAddress.Street}` : <FormattedMessage id="NO_ADDRESS" />}
                      </Typography>
                      <br />
                      <Typography variant="caption" component="span" noWrap>
                        {lead.ToAddress ? `${lead.ToAddress.PLZ} ${lead.ToAddress.City}, ${lead.ToAddress.Street}` : <FormattedMessage id="NO_ADDRESS" />}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography noWrap variant="body2">
                        {lead.VisitDate ? <FormattedDate year="numeric" month="long" day="2-digit" value={lead.VisitDate} /> : <FormattedMessage id="NOT_DEFINED" />}
                      </Typography>
                    </TableCell>

                    <TableCell style={{ padding: "6px 16px" }}>
                      <ServicesComponent services={lead.Services} />
                    </TableCell>
                    <TableCell>
                      <IconButton>
                        <RemoveRedEyeIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )}

              </TableBody>
            </Table>
            {/* <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={leads.length}
              rowsPerPage={25}
              page={1}
              onChangePage={() => console.log("HI")}
              onChangeRowsPerPage={() => console.log("HI")}
            /> */}

            <div className={classes.positionAddRight}>
              <PlainLink to="/lead/new/building">
                <Fab color="primary" size="small">
                  <AddIcon fontSize="small" />
                </Fab>
              </PlainLink>
            </div>
          </Grid>
        </Grid>
      </Wrapper>
    )
  }
}

export default withResource(withStyles(styles)(TableDashboard))
