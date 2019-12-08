import * as React from "react"
import {
  IPostMoveOutBuilding,
  IPostMoveInBuilding,
  IPostCleaningBuilding,
  IPostDisposalOutBuilding,
  IDisposalOutBuilding,
  IMoveInBuilding,
  IMoveOutBuilding,
  IStorageBuilding,
  IPostStorageBuilding,
  ICleaningBuilding,
  BaseBuilding,
} from "../../../interfaces/IBuilding"
import { Field } from "formik"
import FormikSimpleSelect from "../FormikSimpleSelect"
import { injectIntl, InjectedIntlProps } from "react-intl"
import { IAddress, IPostAddress } from "../../../interfaces/IAddress"
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
  onCopy: () => void
}

const BuildingCopy: React.ComponentType<Props> = ({ buildings, intl }) => {

  const [selectedCopy, setCopy] = React.useState<string | null>(null)

  const handleCopy = () => {
  //   IPostMoveOutBuilding
  //   IPostMoveInBuilding
  //   IPostCleaningBuilding
  //   IPostDisposalOutBuilding
  //   IPostStorageBuilding
  }

  // buidlings.type.BuildingTypes.map(e => ({ label: e.NameTextKey, value: e.BuildingTypeId }))

  return (
    <Grid item xs={12} md={6} style={{ display: "flex" }}>
      <FormControl>
        <InputLabel>{intl.formatMessage({ id: "COPY_FROM" })}</InputLabel>
        <Select
          value={selectedCopy ? selectedCopy : ""}
          onChange={e => setCopy(e.target.value as string)}
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
        </Select>
      </FormControl>
      <IconButton onClick={handleCopy}>
        <FileCopyIcon />
      </IconButton>
    </Grid>
  )
}

export default injectIntl(BuildingCopy)
