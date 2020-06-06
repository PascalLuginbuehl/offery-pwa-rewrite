import { Drawer, Hidden,      SwipeableDrawer, makeStyles, Theme, } from "@material-ui/core"

import * as React from "react"
import Navigation from "../../components/Navigation"
import { useHistory } from "react-router"

const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
const drawerWidth = 240


const useStyles = makeStyles((theme: Theme) => ({
  drawerPaper: {
    minHeight: "100vh",
    width: drawerWidth,
    [theme.breakpoints.up("md")]: {
      position: "relative",
    },
  },
}))

interface Props {
  children: React.ReactNode
  mobileDrawerOpen: boolean
  setMobileDrawerOpen: (e: boolean) => void
}

export default function CustomDrawer(props: Props) {
  const classes = useStyles()

  const { children, mobileDrawerOpen, setMobileDrawerOpen } = props

  const history = useHistory()
  React.useEffect(() => {
    history.listen(() => {
      setMobileDrawerOpen(false)
    })
  })

  return (
    <>
      <Hidden mdUp>
        <SwipeableDrawer disableBackdropTransition={!iOS} disableDiscovery={iOS}
          variant="temporary"
          anchor="left"
          onOpen={() => setMobileDrawerOpen(true)}
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
        >
          <Navigation>
            {children}
          </Navigation>
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
          <Navigation>
            {children}
          </Navigation>
        </Drawer>
      </Hidden>
    </>
  )
}
