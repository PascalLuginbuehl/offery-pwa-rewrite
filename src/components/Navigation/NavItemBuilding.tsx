import { createStyles, Theme, ListItemText, ListItem } from "@material-ui/core"
import { NavLink } from "react-router-dom"
import * as React from "react"
import {  useLocation } from "react-router"
import { IBuilding } from "../../interfaces/IBuilding"
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles((theme: Theme) =>
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
)


interface Props {
  building: IBuilding
  to: string
  nested?: boolean
}

export default function NavItemBuilding(props: Props) {
  const { nested, building, to, } = props

  const location = useLocation()
  const classes = useStyles()

  return (
    <>
      <NavLink to={to} activeClassName={classes.activeLink} className={classes.noLink}>
        <ListItem selected={location.pathname === to} button className={nested ? classes.nested : ""}>
          <ListItemText primary={building.Address.Street} secondary={`${building.Address.PLZ} ${building.Address.City}`} />
        </ListItem>
      </NavLink>
    </>
  )
}
