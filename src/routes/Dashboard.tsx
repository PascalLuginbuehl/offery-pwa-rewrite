import { createStyles, Grid, Theme, WithStyles, withStyles,  Typography, Tabs, Tab } from '@material-ui/core'
import * as React from 'react'
import { FormattedDate, FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { withResource, WithResourceProps } from 'providers/withResource';
import IntlTooltip from 'components/Intl/IntlTooltip';
import withWidth, { WithWidth, isWidthUp } from '@material-ui/core/withWidth';
import { ILead } from 'interfaces/ILead';
import Loading from 'components/Loading'
import ResponsiveContainer from 'components/ResponsiveContainer'
import DashboardService from 'services/DashboardService';
import IntlTypography from 'components/Intl/IntlTypography';


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

  constructor(props: Props) {
    super(props)
    if (props.selectedCompany != null) {
      this.state.leadsAwait = DashboardService.fetchCompanyLeads(props.selectedCompany.CompanyId)
      this.state.leadsAwait.then(leads => this.setState({ leads }))
    } else {

    }
  }

  handleTabChange = (event: React.ChangeEvent<{}>, value: number) => {
    this.setState({ currentTab: value })
  }


  public render() {
    // const { classes, value, onClick } = this.props
    const { classes, selectedCompany, intl, width } = this.props
    const { leadsAwait, leads, currentTab, openListActions } = this.state


    return (
      <ResponsiveContainer>
        <Loading await={leadsAwait} center size={50}>
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
              {
                leads && currentTab === 0 ?
                  "asd"
                  // isWidthUp('sm', width) ? ("asd") : ("asd")
                :
                  <Typography>Error :(</Typography>
              }
            </Grid>

            {currentTab === 1 && "item 1"}
          </Grid>
        </Loading>
      </ResponsiveContainer>
    )
  }
}

export default injectIntl(withResource(withStyles(styles)(withWidth()(Dashboard))))
