import {  createStyles,    Theme, Toolbar,  WithStyles, withStyles,  Snackbar, } from "@material-ui/core"
import * as React from "react"
import { FormattedMessage } from "react-intl"
import {  Route, Switch } from "react-router-dom"
import { withLanguage, WithLanguageProps } from "../providers/withLanguage"

import IntlTypography from "../components/Intl/IntlTypography"

import Lead from "./Lead"
import Dashboard from "./Dashboard"



import Layout from "./Layout"

const drawerWidth = 240

function timeout(ms: number, promise: Promise<any>) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error("timeout"))
    }, ms)
    promise.then(resolve, reject)
  })
}

const styles = (theme: Theme) =>
  createStyles({
    // For mobile move button more to top
    snackbar: {
      [theme.breakpoints.down("xs")]: {
        bottom: 90,
      },
    },
  })

interface State {
  navPortal: HTMLDivElement | null
  offline: boolean
  offlineSnackbarOpen: boolean
}

interface Props extends WithStyles<typeof styles>, WithLanguageProps {

}

class Index extends React.Component<Props, State> {
  public state: State = {
    navPortal: null,
    offline: false,
    offlineSnackbarOpen: false,
  }

  handleOfflineChange = (offline: boolean) => {
    if (offline) {
      if (!this.state.offline) {
        this.setState({ offline: true })
        this.setState({ offlineSnackbarOpen: true })
      }
    } else {
      if (this.state.offline) {
        this.setState({ offline: false })
      }
    }
  }

  componentDidMount() {
    this.heartbeat()
  }

  closeSnackbar = () => {
    this.setState({offlineSnackbarOpen: false})
  }

  heartbeat = () => {
    const timeoutAfter = 5000
    const requestEvery = 6000

    timeout(timeoutAfter, fetch("/favicon.ico?t=" + Math.random()))
      .then(() => {

        this.handleOfflineChange(false)
        setTimeout(this.heartbeat, requestEvery)
      })
      .catch(e => {
        this.handleOfflineChange(true)

        console.log("Timeout/Server down", e)
        setTimeout(this.heartbeat, requestEvery)
      })
  }

  setNavigationElementPortal = (element: HTMLDivElement | null) => {
    if (element) {
      this.setState({ navPortal: element})
    }
  }

  public render() {
    const { classes } = this.props
    const { navPortal, offline, offlineSnackbarOpen } = this.state

    return (
      <Layout
        drawerContent={
          <div ref={this.setNavigationElementPortal} />
        }
      >
        {
          offline ?
            <Toolbar variant="dense">
              <IntlTypography variant="caption">EDITING_OFFLINE</IntlTypography>
            </Toolbar>
            : null
        }

        <Switch>
          <Route path="/lead/:id" render={(match) => <Lead offline={offline} onOfflineChange={this.handleOfflineChange} {...match} portal={navPortal} />} />
          {/* <Route path="/new" component={newDashboard} /> */}
          <Route path="/" component={Dashboard} />
        </Switch>

        <Snackbar
          open={offlineSnackbarOpen}
          onClose={this.closeSnackbar}
          autoHideDuration={4000}
          message={offline ? <FormattedMessage id="WEAK_CONNECTION_DETECTED" /> : <FormattedMessage id="BACK_ONLINE" />}
          className={classes.snackbar}
        />
      </Layout>
    )
  }
}

export default withLanguage(withStyles(styles)(Index))
