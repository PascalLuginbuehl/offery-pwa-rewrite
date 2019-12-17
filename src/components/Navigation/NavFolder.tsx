import { createStyles, Theme, WithStyles, withStyles, ListItemText, ListItem, Collapse, IconButton, ListItemSecondaryAction } from "@material-ui/core"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"
import { NavLink, withRouter } from "react-router-dom"
import * as React from "react"
import { InjectedIntlProps, injectIntl } from "react-intl"
import { RouteComponentProps } from "react-router"

const styles = (theme: Theme) =>
  createStyles({
    activeLink: {
      color: theme.palette.primary.main,
    },

    noLink: {
      textDecoration: "none",
      color: "inherit",
    },

    nested: {
      paddingLeft: theme.spacing(4),
    },
  })

interface State {
  open: boolean
}

interface Props extends WithStyles<typeof styles>, InjectedIntlProps, RouteComponentProps {
  to: string
  title: string
  children: React.ReactNode

  nested?: boolean
}

class NavItem extends React.Component<Props, State> {
  public state = {
    open: false,
  }

  componentDidMount() {
    const { location, to } = this.props
    if (location.pathname.includes(to)) {
      this.setState({ open: true })
    }

    // FIX THIS L8ER
    // if (children && children.findIndex(value => value.props.to === to) === -1)
  }

  componentDidUpdate(prevProps: Props) {
    const { location, to } = this.props
    if (prevProps.location.pathname !== location.pathname) {
      if (location.pathname.includes(to)) {
        this.setState({ open: true })
      } else if (prevProps.location.pathname.includes(to) && this.state.open) {
        this.setState({ open: false })
      }
    }
  }

  public handleClick = (e: React.MouseEvent<HTMLElement>) => {
    this.setState(state => ({
      open: !state.open,
    }))

    e.preventDefault()
  }

  public render() {
    const { classes, to, title, intl, children, nested, location } = this.props
    const { open } = this.state

    return (
      <>
        <NavLink to={to} activeClassName={classes.activeLink} className={classes.noLink}>
          <ListItem selected={location.pathname === to} button className={nested ? classes.nested : ""}>
            <ListItemText primary={intl.formatMessage({ id: title })} />

            <ListItemSecondaryAction>
              <IconButton onClick={this.handleClick}>{open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}</IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </NavLink>

        <Collapse in={open} timeout="auto" unmountOnExit>
          {children}
        </Collapse>
      </>
    )
  }
}

export default withRouter(injectIntl(withStyles(styles)(NavItem)))
