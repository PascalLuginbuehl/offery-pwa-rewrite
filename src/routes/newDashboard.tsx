
import * as React from "react"
import { green } from "@material-ui/core/colors"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"
import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"
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
import LeadTable from "../components/LeadTable"


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
                      options={resource.Statuses.map(e => ({ label: e.NameTextKey, value: e.StatusId }))}
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
            <LeadTable leads={leads} />

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
