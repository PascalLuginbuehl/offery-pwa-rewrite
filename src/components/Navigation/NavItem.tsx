import { createStyles, Theme, WithStyles, withStyles, ListItemText, ListItem } from "@material-ui/core"
import { NavLink, withRouter } from "react-router-dom"
import * as React from "react"
import { WrappedComponentProps, injectIntl } from "react-intl"
import { RouteComponentProps } from "react-router"

const styles = (theme: Theme) =>
  createStyles({
    nested: {
      paddingLeft: theme.spacing(4),
    },
    doubleNested: {
      paddingLeft: theme.spacing(8),
    }
  })


interface Props extends WithStyles<typeof styles>, WrappedComponentProps, RouteComponentProps {
  to: string
  title: string
  nested?: boolean
  doubleNested?: boolean
}

class NavItem extends React.Component<Props> {

  public render() {
    const { classes, to, title, intl, children, nested, doubleNested, location } = this.props

    return (
      <>
        <ListItem component={NavLink} to={to} selected={location.pathname === to} button className={nested ? classes.nested : (doubleNested ? classes.doubleNested : "")}>
          <ListItemText primary={intl.formatMessage({ id: title })} />
        </ListItem>
      </>

    )
  }
}

export default withRouter(injectIntl(withStyles(styles)(NavItem)))
