import * as React from "react"
import { Divider, Theme, createStyles, WithStyles, List, withStyles } from "@material-ui/core"
import NavItem from "./NavItem"
import { RouteComponentProps, withRouter } from "react-router"

const styles = (theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
  })


interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  children: React.ReactNode
}

class Navigation extends React.Component<Props> {
  public render() {
    // const { classes, value, onClick } = this.props
    const { classes, children } = this.props

    return (
      <div>
        <div className={classes.toolbar} />
        <Divider />
        <List>
          <NavItem to="/" title="DASHBOARD"/>

          <Divider />

          {children}

        </List>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(Navigation))
