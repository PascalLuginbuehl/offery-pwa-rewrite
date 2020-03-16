import * as React from "react"
import { Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, ListItemIcon, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core"
import PageHeader from "../../../components/PageHeader"
import HomeIcon from "@material-ui/icons/Home"
import { useRouteMatch } from "react-router"
import { Link } from "react-router-dom"
import { IBuilding } from "../../../interfaces/IBuilding"
import AddCircleIcon from "@material-ui/icons/AddCircle"
import DeleteIcon from "@material-ui/icons/Delete"
import { useIntl } from "react-intl"
import FormikMockSubmit from "../../../components/FormikFields/FormikMockSubmit"
import LeadAPI from "../LeadAPI";

interface Props {
  nextPage: () => void
  buildings: IBuilding[]
  handleChange: (buldings: IBuilding[]) => void
}

export default function BUildingOverview (props: Props) {
  const { buildings, nextPage, handleChange } = props
  const match = useRouteMatch()
  const [dialogOpenBuilding, setDeleteDialog] = React.useState<IBuilding | null>(null)

  const { formatMessage } = useIntl()


  if(!match) {
    throw new Error("Now route match property was given")
  }

  const closeDialog = () => setDeleteDialog(null)

  const deleteBuilding = async (building: IBuilding) => {

    const buildings = await LeadAPI.DeleteBuilding(building)
    handleChange(buildings)

    closeDialog()
  }


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
                  <IconButton edge="end" aria-label="delete" onClick={() => setDeleteDialog(building)}>
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
                primary={formatMessage({id: "CREATE_NEW_BUILDING"})}
              />
            </ListItem>
          </List>
        </Grid>

        <FormikMockSubmit isSubmitting={false} onClick={() => nextPage()} />


        <Dialog
          open={!!dialogOpenBuilding}
          onClose={closeDialog}
        >
          {dialogOpenBuilding ?
            (
              <>
                <DialogTitle>{formatMessage({id: "SURE_DELETE_BUILDING"})}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    {`${dialogOpenBuilding.Address.Street}, ${dialogOpenBuilding.Address.PLZ} ${dialogOpenBuilding.Address.City}`}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={closeDialog} color="primary">
                    {formatMessage({ id: "CANCEL" })}
                  </Button>
                  <Button onClick={() => deleteBuilding(dialogOpenBuilding)} color="primary" autoFocus>
                    {formatMessage({ id: "DELETE" })}
                  </Button>
                </DialogActions>
              </>
            )
            : <div/>}

        </Dialog>
      </Grid>
    </Grid>
  )
}
