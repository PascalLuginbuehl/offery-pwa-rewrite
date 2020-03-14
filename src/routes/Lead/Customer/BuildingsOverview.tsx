import * as React from "react"
import { Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, ListItemIcon } from "@material-ui/core"
import PageHeader from "../../../components/PageHeader"
import HomeIcon from "@material-ui/icons/Home"
import { useRouteMatch } from "react-router"
import { Link } from "react-router-dom"
import { IBuilding } from "../../../interfaces/IBuilding"
import AddCircleIcon from "@material-ui/icons/AddCircle"
import DeleteIcon from "@material-ui/icons/Delete"
import { useIntl } from "react-intl"

interface Props {
  nextPage: () => void
  buildings: IBuilding[]
}

export default function BUildingOverview (props: Props) {
  const { buildings } = props
  const match = useRouteMatch()



  if(!match) {
    throw new Error("Now route match property was given")
  }

  const {} = useIntl()


  return (
    <Grid item xs={12}>
      <Grid container spacing={1} style={{ padding: 8 }}>
        <PageHeader title="BUILDING" />

        <Grid item xs={12}>
          <List>
            {buildings.map(building => (
              <ListItem key={building.BuildingId} button component={Link} to={match.url + "/" + building.BuildingId}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`${building.Address.Street}, ${building.Address.PLZ} ${building.Address.City}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}

            {/* {building.lenght < 0 ?  : null} */}

            <ListItem button component={Link} to={match.url + "/new"}>
              <ListItemIcon>
                <AddCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={"CREATE_NEW_BUILDING"}
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Grid>
  )
}
