import * as React from "react"
import {
  IDisposalOutBuilding,
  IMoveInBuilding,
  IMoveOutBuilding,
  IStorageBuilding,
  ICleaningBuilding,
  emptyCleaningBuilding,
  IPostCleaningBuilding,
  IPostMoveOutBuilding,
  IPostDisposalOutBuilding,
  IPostStorageBuilding,
  IPostMoveInBuilding,
} from "../../../interfaces/IBuilding"
import { injectIntl, InjectedIntlProps } from "react-intl"
import { InputAdornment, IconButton, Grid, FormControl, InputLabel, Select, MenuItem, ListItemText } from "@material-ui/core"
import FileCopyIcon from "@material-ui/icons/FileCopy"
import { useFormikContext } from "formik";

export interface IBuildingCopy {
  moveOutBuilding: IMoveOutBuilding | null
  moveInBuilding: IMoveInBuilding | null
  cleaningBuilding: ICleaningBuilding | null
  disposalBuilding: IDisposalOutBuilding | null
  storageBuilding: IStorageBuilding | null
}

export type CombinedBuildings = IPostMoveOutBuilding | IPostMoveInBuilding | IPostCleaningBuilding | IPostDisposalOutBuilding | IPostStorageBuilding

interface Props extends InjectedIntlProps {
  buildings: IBuildingCopy
  prefix: string
  getKeysFromBuilding: CombinedBuildings
}

const nameMap = {
  moveOutBuilding: "MOVE_OUT_BUILDING",
  moveInBuilding: "MOVE_IN_BUILDING",
  disposalBuilding: "DISPOSAL_BUILDING",
  storageBuilding: "STORAGE_BUILDING",
  cleaningBuilding: "CLEANING_BUILDING",
}

const BuildingCopy: React.ComponentType<Props> = ({ buildings, intl, prefix, getKeysFromBuilding }) => {
  const [selectedCopy, setCopy] = React.useState<keyof IBuildingCopy | undefined>(undefined)
  const {setFieldValue, values} = useFormikContext<{[key: string]: any}>()

  const handleCopy = () => {
    const keys = Object.keys(getKeysFromBuilding) as Array<keyof CombinedBuildings>

    if(values.hasOwnProperty(prefix)) {
      // @ts-ignore
      const foundSomething = keys.find(key => values[prefix][key] !== getKeysFromBuilding[key])

      if (foundSomething) {
        const result = window.confirm(intl.formatMessage({id: "BUILDING_IS_ALREADY_FILLED_OVERRIDE"}))
        // Cancel if already values got put into thign
        if(!result) {
          return
        }
      }
    }

    if (selectedCopy) {
      const building = buildings[selectedCopy]

      if (building) {

        keys.map(key => {
          if (building.hasOwnProperty(key)) {
            // @ts-ignore
            const value = building[key]
            //@ts-ignore
            setFieldValue(prefix + "." + key, value)
          }
        })
      }
    }

    setCopy(undefined)
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
              const key = value as keyof typeof nameMap
              const buildingName = nameMap[key]
              if (buildingName) {
                return intl.formatMessage({ id: buildingName })
              }
            }

            return ""
          }}
        >
          <MenuItem value={undefined} dense>
            <ListItemText
              primary={intl.formatMessage({id: "SELECT"})}
            />
          </MenuItem>

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
      <IconButton onClick={handleCopy} disabled={!selectedCopy}>
        <FileCopyIcon />
      </IconButton>
    </Grid>
  )
}

export default injectIntl(BuildingCopy)
