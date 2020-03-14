import { createStyles, Theme, ListItemText, ListItem, ListItemIcon } from "@material-ui/core"
import { NavLink } from "react-router-dom"
import * as React from "react"
import { useIntl } from "react-intl"
import { useLocation } from "react-router"
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    nested: {
      paddingLeft: theme.spacing(4),
    },
    doubleNested: {
      paddingLeft: theme.spacing(8),
    },
    noMinWidth: {
      minWidth: "auto"
    },
  })
)

interface Props {
  to: string
  title: string
  nested?: boolean
  doubleNested?: boolean

  icon?: React.ReactElement
}

export default function NavItem(props: Props) {
  const { icon, title, nested, doubleNested, to } = props

  const location = useLocation()
  const classes = useStyles()
  const { formatMessage } = useIntl()

  return (
    <>
      <ListItem component={NavLink} to={to} selected={location.pathname === to} button className={nested ? classes.nested : (doubleNested ? classes.doubleNested : "")}>
        {icon ? <ListItemIcon className={classes.noMinWidth} >{icon}</ListItemIcon> : null}
        <ListItemText primary={formatMessage({ id: title })} />
      </ListItem>
    </>
  )
}
