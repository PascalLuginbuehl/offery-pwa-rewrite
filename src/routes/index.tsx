import { AppBar, createStyles, Drawer, Hidden, IconButton, Theme, Toolbar, Typography, WithStyles, withStyles, SwipeableDrawer, } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import * as React from 'react'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'
import { Link, Route, Switch } from 'react-router-dom'
import withRoot from '../components/WithRoot'


import { withLanguage, WithLanguageProps } from '../providers/withLanguage'
import Navigation from '../components/Navigation';
import IntlTypography from '../components/Intl/IntlTypography';
import UserDisplay from '../components/Navigation/UserDisplay';
import Lead from './Lead';
import Dashboard from './Dashboard';

// import Lead from './Lead'
// import Dashboard from './Dashboard'
// import UserDisplay from 'components/Navigation/UserDisplay';


const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
const drawerWidth = 240

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexGrow: 1,
      minHeight: '100vh',
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
      zIndex: 1,
    },

    appBar: {
      boxShadow: theme.shadows["1"],
      marginLeft: drawerWidth,
      position: 'absolute',
      [theme.breakpoints.up('md')]: {
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
      [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(3),
      },

      color: "white",
      textDecoration: "none",
    },

    content: {
      backgroundColor: theme.palette.background.default,
      display: 'flex',
      flexFlow: 'column',
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
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },

    drawerPaper: {
      minHeight: "100vh",
      width: drawerWidth,
      [theme.breakpoints.up('md')]: {
        position: 'relative',
      },
    },
  })

interface State {
  mobileOpen: boolean
  navPortal: HTMLDivElement | null
}

interface Props extends WithStyles<typeof styles>, WithLanguageProps {

}

class Index extends React.Component<Props, State> {
  public state = {
    mobileOpen: false,
    navPortal: null
  }

  public handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }))
  }

  public render() {
    const { classes } = this.props
    const { mobileOpen, navPortal } = this.state

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
          <Switch>
            {/* <Route exact={true} path="/:id" component={GanttRoute} /> */}
            {/* <Route path="/login" component={login} /> */}
            {/* <Route path="/shop" component={shop} /> */}
            {/* <Route path="/lead/move-out-building" component={moveOutBuilding} /> */}
            <Route path="/lead/:id" render={(match) => <Lead {...match} portal={navPortal} />} />
            <Route path="/" component={Dashboard} />

            {/* <Route path="/lead/:id" render={(match) => <Lead {...match} portal={navPortal} />} /> */}

            {/* <Route exact path="" component={Lead} /> */}
          </Switch>
        </main>
      </div>
    )
  }
}

export default withRoot(withLanguage(withStyles(styles)(Index)))
