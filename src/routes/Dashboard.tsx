import { createStyles, Grid, Theme, WithStyles, withStyles,  Typography, Tabs, Tab } from '@material-ui/core'
import * as React from 'react'
import { FormattedDate, FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import { withResource, WithResourceProps } from '../providers/withResource'
import withWidth, { WithWidth, isWidthUp } from '@material-ui/core/withWidth'
import { ILead } from '../interfaces/ILead';
import DashboardService from '../services/LeadService'
import IntlTypography from '../components/Intl/IntlTypography';
import Wrapper from '../components/Form/Wrapper';
import TableDashboard from '../components/Dashboard/TableDashboard';
import MobileDashboard from '../components/Dashboard/MobileDashboard';
import { keys, get } from 'idb-keyval';
import CloudOffIcon from '@material-ui/icons/CloudOff'
import ArchiveIcon from '@material-ui/icons/Archive'

const styles = (theme: Theme) =>
  createStyles({
    noLink: {
      textDecoration: "none",
      color: "inherit",
    },
    root: {
      padding: theme.spacing(2)
    },
    nested: {
      paddingTop: 0,
      paddingBottom: 0,
    },
  })

interface State {
  leadsAwait: Promise<ILead[]> | null
  leads: ILead[] | null
  currentTab: number
  openListActions: number | null
}

interface Props extends WithStyles<typeof styles>, WithResourceProps, InjectedIntlProps, WithWidth {

}

class Dashboard extends React.Component<Props, State> {
  public state: State = {
    leadsAwait: null,
    leads: null,
    currentTab: 0,
    openListActions: null,
  }

  componentDidMount() {
    // if (props.selectedCompany != null) {
    const leadsAwait = DashboardService.fetchCompanyLeads(1)
    leadsAwait.then(leads => this.setState({ leads }))

    this.setState({leadsAwait})

    this.getOfflineLead()
    // } else {

    // }
  }

  handleTabChange = (event: React.ChangeEvent<{}>, value: number) => {
    this.setState({ currentTab: value })
  }

  async getOfflineLead() {
    const offlineKeys = await keys()
    const offlineSaved = await Promise.all(offlineKeys.map(key => get(key)))

    console.log(offlineSaved)
  }


  leads = () => {
    const { classes, intl, width, selectedCompany } = this.props
    const { leadsAwait, leads, currentTab, openListActions } = this.state


    if(currentTab == 0) {
      if(leads) {
        return isWidthUp('sm', width) ? <TableDashboard leads={leads} /> : <MobileDashboard leads={leads} />
      } else {
        return <Typography color="textSecondary" variant="h4" >Error, no leads found</Typography>
      }
    } else if(currentTab == 1) {
      return <Typography color="textSecondary" variant="h4"><ArchiveIcon /> Noting Archived yet</Typography>
    }
  }

  public render() {
    // const { classes, value, onClick } = this.props
    const { classes, intl, width, selectedCompany } = this.props
    const { leadsAwait, leads, currentTab, openListActions } = this.state

    return (
      <Wrapper initialLoading={leadsAwait}>
        <Grid container spacing={2} className={classes.root}>
          <Grid item xs={12}>
            <Typography variant="h5">{selectedCompany.Name}</Typography>
            <IntlTypography variant="caption">COMPANY_LEAD_OVERVIEW</IntlTypography>
          </Grid>

          <Grid item xs={12}>
            <Tabs value={currentTab} variant="fullWidth" indicatorColor="primary" onChange={this.handleTabChange}>
              <Tab label={intl.formatMessage({ id: "VISITS" })} />
              <Tab label={intl.formatMessage({ id: "ARCHIVED" })} />
            </Tabs>
          </Grid>

          <Grid item xs={12}>
            {this.leads()}
          </Grid>
          {/* <CloudOffIcon /> */}

        </Grid>
      </Wrapper>
    )
  }
}

export default injectIntl(withResource(withStyles(styles)(withWidth()(Dashboard))))
