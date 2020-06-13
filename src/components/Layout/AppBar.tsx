import React from "react"
import { AppBar as MuiAppBar, IconButton, Theme, Toolbar, } from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import { Link } from "react-router-dom"
import IntlTypography from "../Intl/IntlTypography"
import UserDisplay from "../Navigation/UserDisplay"
import logo from "./../../logo_white.svg"

import { makeStyles } from "@material-ui/styles"

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) => ({
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

  navIconHide: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}))

interface Props {
  setMobileDrawerOpen: (open: boolean) => void
}


export default function AppBar(props: Props) {
  const classes = useStyles()
  const { setMobileDrawerOpen } = props

  return (
    <MuiAppBar className={classes.appBar}>
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
    </MuiAppBar>
  )
}
