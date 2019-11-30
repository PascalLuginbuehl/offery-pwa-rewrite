import { createStyles, Grid, Theme, WithStyles, withStyles,  Typography, Tabs, Tab } from '@material-ui/core'
import * as React from 'react'
import { FormattedDate, FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import { withResource, WithResourceProps } from '../providers/withResource'
import withWidth, { WithWidth, isWidthUp } from '@material-ui/core/withWidth'
import { ILead, ICompressedLead } from '../interfaces/ILead';
import DashboardService from '../services/LeadService'
import IntlTypography from '../components/Intl/IntlTypography';
import Wrapper from '../components/Form/Wrapper';
import TableDashboard from '../components/Dashboard/TableDashboard';
import MobileDashboard from '../components/Dashboard/MobileDashboard';
import { keys, get } from 'idb-keyval';
import CloudOffIcon from '@material-ui/icons/CloudOff'
import ArchiveIcon from '@material-ui/icons/Archive'
import LeadAPI, { ILeadContainer } from './LeadAPI';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2)
      },
    }
  })

interface State {
  leadsAwait: Promise<any> | null
  leads: IOfflineLead[] | null
  onlyShowOffline: boolean

  currentTab: number
  openListActions: number | null
}

interface Props extends WithStyles<typeof styles>, WithResourceProps, InjectedIntlProps, WithWidth {

}
export interface IOfflineLead {
  Lead: ICompressedLead,
  isCached: boolean,
}


class Dashboard extends React.Component<Props, State> {
  public state: State = {
    leadsAwait: null,
    leads: null,
    currentTab: 0,
    openListActions: null,
    onlyShowOffline: false,
  }

  componentDidMount() {
    const leadsAwait = DashboardService.fetchCompanyLeads(this.props.selectedCompany.CompanyId).catch(e => {
      return null;
    })

    const offlineLeadsAwait = this.getOfflineLead()

    const allAwait = Promise.all([leadsAwait, offlineLeadsAwait])

    this.setState({leadsAwait: allAwait})

    allAwait.then(([leads, offlineLead]) => {
      if(leads) {

        this.setState({
          leads: leads.map((lead) => ({
            Lead: lead,
            isCached: offlineLead.findIndex(offline => LeadAPI.isCompleteLead(offline.Lead) ? offline.Lead.LeadId == lead.LeadId : false) !== -1,
          }))
        })
      } else {
        console.log("Couldn't load from online. Error")
        const filteredToCached = offlineLead.filter(offline => LeadAPI.isCompleteLead(offline.Lead)) as Array<{Lead: ILead}>

        this.setState({
          leads: filteredToCached.map(offline => ({
            Lead: offline.Lead,
            isCached: true,
          }))
        })
      }
    })

    allAwait.catch((e) => {
      console.log("Unexpected error with Dashboard leads")
      console.dir(e)
      if(e) {
        this.setState({onlyShowOffline: true})
      }
    })
  }

  handleTabChange = (event: React.ChangeEvent<{}>, value: number) => {
    this.setState({ currentTab: value })
  }

  getOfflineLead(): Promise<ILeadContainer[]> {
    return new Promise(async (resolve, reject) => {
      const offlineKeys = await keys()
      const offlineSaved = await Promise.all(offlineKeys.map(key => LeadAPI.FetchFromOffline(parseInt(key.toString()))))

      // Tyescript compiler fix for undefined elements
      resolve(offlineSaved.filter(e => !!e) as ILeadContainer[])
    })
  }

  leads = () => {
    const { classes, intl, width, selectedCompany } = this.props
    const { leadsAwait, leads, currentTab, openListActions } = this.state

    if(currentTab == 0) {
      if(leads) {
        const tempLeads = leads.sort(({ Lead: { VisitDate } }, { Lead: { VisitDate: VisitDate2 } }) => VisitDate && VisitDate2 ? VisitDate2.getTime() - VisitDate.getTime() : 0)
        return isWidthUp('sm', width) ? <TableDashboard leads={tempLeads} /> : <MobileDashboard leads={tempLeads} />
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
    const { leadsAwait, leads, currentTab, openListActions, onlyShowOffline } = this.state

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

export default withWidth()(injectIntl(withResource(withStyles(styles)(Dashboard))))
