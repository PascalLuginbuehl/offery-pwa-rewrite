import { AppBar,  IconButton, Theme, Toolbar, } from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import * as React from "react"
import { Link } from "react-router-dom"
import IntlTypography from "../../components/Intl/IntlTypography"
import UserDisplay from "../../components/Navigation/UserDisplay"
import logo from "./../../logo_white.svg"
import CustomDrawer from "./CustomDrawer"
import { makeStyles } from "@material-ui/styles"


const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) => ({
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
    maxWidth: "100%",
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
}))



interface Props {
  drawerContent: React.ReactNode
  children: React.ReactNode
}


export default function Layout(props: Props) {
  const classes = useStyles()
  const { children, drawerContent } = props
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState<boolean>(false)

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={() => setMobileDrawerOpen(true)}
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

      <CustomDrawer mobileDrawerOpen={mobileDrawerOpen} setMobileDrawerOpen={setMobileDrawerOpen}>
        {drawerContent}
      </CustomDrawer>

      <main className={classes.content}>
        <div className={classes.toolbar} />

        {children}

      </main>
    </div>
  )
}
