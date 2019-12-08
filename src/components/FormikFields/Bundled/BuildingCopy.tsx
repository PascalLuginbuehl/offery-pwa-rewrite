import * as React from "react"
import {
  IDisposalOutBuilding,
  IMoveInBuilding,
  IMoveOutBuilding,
  IStorageBuilding,
  ICleaningBuilding,
} from "../../../interfaces/IBuilding"
import { injectIntl, InjectedIntlProps } from "react-intl"
import { InputAdornment, IconButton, Grid, FormControl, InputLabel, Select, MenuItem, ListItemText } from "@material-ui/core"
import FileCopyIcon from "@material-ui/icons/FileCopy"

export interface IBuildingCopy {
  moveOutBuilding: IMoveOutBuilding | null
  moveInBuilding: IMoveInBuilding | null
  cleaningBuilding: ICleaningBuilding | null
  disposalBuilding: IDisposalOutBuilding | null
  storageBuilding: IStorageBuilding | null
}

interface Props extends InjectedIntlProps {
  buildings: IBuildingCopy
  onCopy: (building: IMoveOutBuilding | IMoveInBuilding | ICleaningBuilding | IDisposalOutBuilding | IStorageBuilding ) => void
}

const BuildingCopy: React.ComponentType<Props> = ({ buildings, intl, onCopy }) => {
  const [selectedCopy, setCopy] = React.useState<keyof IBuildingCopy | null>(null)

  const handleCopy = () => {
    if (selectedCopy) {
      const building = buildings[selectedCopy]
      if (building) {
        onCopy(building)
      }
    }
  }

  return (
    <Grid item xs={12} md={6} style={{ display: "flex" }}>
      <FormControl>
        <InputLabel>{intl.formatMessage({ id: "COPY_FROM" })}</InputLabel>
        <Select
          value={selectedCopy ? selectedCopy : ""}
          onChange={e => setCopy(e.target.value as keyof IBuildingCopy)}
          renderValue={(value: unknown) => {
            if (value) {
              const key = value as keyof IBuildingCopy
              const building = buildings[key]
              if (building) {
                return building.Address.Street + ", " + building.Address.PLZ + " " + building.Address.City
              }
            }

            return ""
          }}
        >
          {buildings.moveOutBuilding ? (
            <MenuItem value="moveOutBuilding" dense>
              <ListItemText
                primary={buildings.moveOutBuilding.Address.Street + ", " + buildings.moveOutBuilding.Address.PLZ + " " + buildings.moveOutBuilding.Address.City}
                secondary={intl.formatMessage({ id: "MOVE_OUT_BUILDING" })}
              />
            </MenuItem>
          ) : null}
          {buildings.moveInBuilding ? (
            <MenuItem value="moveInBuilding" dense>
              <ListItemText
                primary={buildings.moveInBuilding.Address.Street + ", " + buildings.moveInBuilding.Address.PLZ + " " + buildings.moveInBuilding.Address.City}
                secondary={intl.formatMessage({ id: "MOVE_IN_BUILDING" })}
              />
            </MenuItem>
          ) : null}
          {buildings.disposalBuilding ? (
            <MenuItem value="disposalBuilding" dense>
              <ListItemText
                primary={buildings.disposalBuilding.Address.Street + ", " + buildings.disposalBuilding.Address.PLZ + " " + buildings.disposalBuilding.Address.City}
                secondary={intl.formatMessage({ id: "DISPOSAL_BUILDING" })}
              />
            </MenuItem>
          ) : null}
          {buildings.storageBuilding ? (
            <MenuItem value="storageBuilding" dense>
              <ListItemText
                primary={buildings.storageBuilding.Address.Street + ", " + buildings.storageBuilding.Address.PLZ + " " + buildings.storageBuilding.Address.City}
                secondary={intl.formatMessage({ id: "STORAGE_BUILDING" })}
              />
            </MenuItem>
          ) : null}
          {buildings.cleaningBuilding ? (
            <MenuItem value="cleaningBuilding" dense>
              <ListItemText
                primary={buildings.cleaningBuilding.Address.Street + ", " + buildings.cleaningBuilding.Address.PLZ + " " + buildings.cleaningBuilding.Address.City}
                secondary={intl.formatMessage({ id: "CLEANING_BUILDING" })}
              />
            </MenuItem>
          ) : null}
        </Select>
      </FormControl>
      <IconButton onClick={handleCopy}>
        <FileCopyIcon />
      </IconButton>
    </Grid>
  )
}

export default injectIntl(BuildingCopy)
