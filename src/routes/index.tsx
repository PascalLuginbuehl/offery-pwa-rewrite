import { AppBar, createStyles, Drawer, Hidden, IconButton, Theme, Toolbar, Typography, WithStyles, withStyles, SwipeableDrawer, Snackbar, Button, } from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import * as React from "react"
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl"
import { Link, Route, Switch } from "react-router-dom"
import withRoot from "../components/WithRoot"

import { withLanguage, WithLanguageProps } from "../providers/withLanguage"
import Navigation from "../components/Navigation"
import IntlTypography from "../components/Intl/IntlTypography"
import UserDisplay from "../components/Navigation/UserDisplay"
import Lead from "./Lead"
import Dashboard from "./Dashboard"
import logo from "./../logo_white.svg"

const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
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
    root: {
      display: "flex",
      flexGrow: 1,
      minHeight: "100vh",
      overflow: "hidden",
      position: "relative",
      width: "100%",
      zIndex: 1,
    },

    appBar: {
      boxShadow: theme.shadows["1"],
      marginLeft: drawerWidth,
      position: "absolute",
      [theme.breakpoints.up("md")]: {
        width: `calc(100% - ${drawerWidth}px)`,
      },
    },

    toolbar: {
      ...theme.mixins.toolbar,
      paddingLeft: 0,

    },

    toolbarTitle: {
      // flexGrow: 1,
      padding: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        paddingLeft: theme.spacing(3),
      },

      color: "white",
      display: "flex",
      textDecoration: "none",
    },

    content: {
      backgroundColor: theme.palette.background.default,
      display: "flex",
      flexFlow: "column",
      flexGrow: 1,
      // padding: theme.spacing.unit * 2,
      [theme.breakpoints.down("sm")]: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
      },
      [theme.breakpoints.down("xs")]: {
        // paddingLeft: theme.spacing.unit / 2,
        // paddingRight: theme.spacing.unit / 2,
        paddingLeft: 0,
        paddingRight: 0,
      }
    },

    navIconHide: {
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },

    drawerPaper: {
      minHeight: "100vh",
      width: drawerWidth,
      [theme.breakpoints.up("md")]: {
        position: "relative",
      },
    },

    // For mobile move button more to top
    snackbar: {
      [theme.breakpoints.down("xs")]: {
        bottom: 90,
      },
    },
  })

interface State {
  mobileOpen: boolean
  navPortal: HTMLDivElement | null
  offline: boolean
  offlineSnackbarOpen: boolean
  updateServiceWorkerFunction: (() => void) | null
}

interface Props extends WithStyles<typeof styles>, WithLanguageProps {
  swUpdateEventGenerator: Promise<ServiceWorkerRegistration>
}

class Index extends React.Component<Props, State> {
  public state = {
    mobileOpen: false,
    navPortal: null,
    offline: false,
    offlineSnackbarOpen: false,
    updateServiceWorkerFunction: null
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

  public handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }))
  }

  componentDidMount() {
    this.heartbeat()

    this.props.swUpdateEventGenerator.then((serviceWorkerRegistration) => {
      console.log("Update available", serviceWorkerRegistration)


      const updateServiceWorker = () => {
        const registrationWaiting = serviceWorkerRegistration.waiting

        if (registrationWaiting) {
          registrationWaiting.postMessage({ type: "SKIP_WAITING" })

          registrationWaiting.addEventListener("statechange", e => {
            // @ts-ignore
            if (e.target.state === "activated") {
              window.location.reload()
            }
          })
        }
      }

      this.setState({ updateServiceWorkerFunction: updateServiceWorker})
    })
  }

  closeNavigation = () => {
    this.setState(state => ({ mobileOpen: false }))
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


  public render() {
    const { classes } = this.props
    const { mobileOpen, navPortal, offline, offlineSnackbarOpen } = this.state


    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>

            <Link to="/" className={classes.toolbarTitle}>
              <img src={logo} alt="Logo" height="32" />
              &nbsp;
              <IntlTypography variant="h6" noWrap={true} color="inherit">
                APP_NAME
              </IntlTypography>
            </Link>

            <UserDisplay />
          </Toolbar>
        </AppBar>
        <Hidden mdUp>
          <SwipeableDrawer disableBackdropTransition={!iOS} disableDiscovery={iOS}
            variant="temporary"
            anchor="left"
            onOpen={this.handleDrawerToggle}
            open={mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <Navigation onDrawerRender={element => this.setState({ navPortal: element })} />
          </SwipeableDrawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <Navigation onDrawerRender={element => this.setState({ navPortal: element })} />
          </Drawer>
        </Hidden>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {
            offline ?
              <Toolbar variant="dense">
                <IntlTypography variant="caption">EDITING_OFFLINE</IntlTypography>
              </Toolbar>
              : null
          }

          <Switch>
            <Route path="/lead/:id" render={(match) => <Lead offline={offline} onOfflineChange={this.handleOfflineChange} {...match} portal={navPortal} closeNavigation={this.closeNavigation} />} />
            {/* <Route path="/new" component={newDashboard} /> */}
            <Route path="/" component={Dashboard} />
          </Switch>


          <Snackbar
            open={offlineSnackbarOpen}
            onClose={this.closeSnackbar}
            autoHideDuration={4000}
            message={offline ? <FormattedMessage id="WEAK_CONNECTION_DETECTED" /> : <FormattedMessage id="BACK_ONLINE" /> }
            className={classes.snackbar}
          />

          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={!!this.state.updateServiceWorkerFunction}
            autoHideDuration={6000}
            // onClose={handleClose}
            message="Note archived"
            action={
              <React.Fragment>
                <Button color="secondary" size="small" onClick={() => this.state.updateServiceWorkerFunction}>
                  Update
                </Button>
              </React.Fragment>
            }
          />
          <Snackbar
            open={offlineSnackbarOpen}
            onClose={this.closeSnackbar}
            autoHideDuration={4000}
            message={offline ? <FormattedMessage id="WEAK_CONNECTION_DETECTED" /> : <FormattedMessage id="BACK_ONLINE" />}
            className={classes.snackbar}
          />

        </main>
      </div>
    )
  }
}

export default withRoot(withLanguage(withStyles(styles)(Index)))
