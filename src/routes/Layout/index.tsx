import { Theme } from "@material-ui/core"
import AppBar from "../../components/Layout/AppBar"
import * as React from "react"
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

  toolbar: {
    ...theme.mixins.toolbar,
    paddingLeft: 0,
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
      <AppBar setMobileDrawerOpen={setMobileDrawerOpen} />

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
