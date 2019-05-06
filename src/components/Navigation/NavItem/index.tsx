
import { createStyles, Theme, WithStyles, withStyles, ListItemText, ListItem, Collapse, IconButton, ListItemSecondaryAction } from '@material-ui/core'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { NavLink, withRouter } from 'react-router-dom'
import * as React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { RouteComponentProps } from 'react-router';

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
      paddingLeft: theme.spacing.unit * 4,
    },
  })

interface State {
  open: boolean
}

interface Props extends WithStyles<typeof styles>, InjectedIntlProps, RouteComponentProps {
  to: string,
  title: string,
  children?: NavItem[]
  nested?: boolean
}

class NavItem extends React.Component<Props, State> {
  public state = {
    open: false,
  }

  constructor(props: Props) {
    super(props)

    const { location } = props

    const { to } = props

    let open = false

    if (location.pathname === to)
      open = true

    // FIX THIS L8ER
    // if (children && children.findIndex(value => value.props.to === to) === -1)
    open = true

    this.state.open = open
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
          <ListItem selected={location.pathname === to} button className={nested ? classes.nested : undefined}>
            <ListItemText primary={intl.formatMessage({ id: title })} />
            {!nested ? <ListItemSecondaryAction>
              <IconButton onClick={this.handleClick}>
                {open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              </IconButton>
            </ListItemSecondaryAction> : null}
          </ListItem>
        </NavLink>

        {children ?
          <Collapse in={open} timeout="auto" unmountOnExit>
            {children}
          </Collapse>
          : null}

      </>

    )
  }
}

export default withRouter(injectIntl(withStyles(styles)(NavItem)))
