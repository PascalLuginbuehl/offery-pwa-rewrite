import { createStyles, Theme, WithStyles, withStyles, ListItemText, ListItem, Collapse, IconButton, ListItemSecondaryAction } from "@material-ui/core"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"
import { NavLink, withRouter } from "react-router-dom"
import * as React from "react"
import { WrappedComponentProps, injectIntl } from "react-intl"
import { RouteComponentProps } from "react-router"

const styles = (theme: Theme) =>
  createStyles({
    activeLink: {
      color: theme.palette.primary.main
    },

    noLink: {
      textDecoration: "none",
      color: "inherit",
    },

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
        <NavLink to={to} activeClassName={classes.activeLink} className={classes.noLink}>
          <ListItem selected={location.pathname === to} button className={nested ? classes.nested : (doubleNested ? classes.doubleNested : "")}>
            <ListItemText primary={intl.formatMessage({ id: title })} />
          </ListItem>
        </NavLink>
      </>

    )
  }
}

export default withRouter(injectIntl(withStyles(styles)(NavItem)))
