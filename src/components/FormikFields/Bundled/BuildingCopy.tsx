import * as React from "react"
import { IPostMoveOutBuilding, IPostMoveInBuilding, IPostCleaningBuilding, IPostDisposalOutBuilding, IDisposalOutBuilding, IMoveInBuilding, IMoveOutBuilding, IStorageBuilding, IPostStorageBuilding, ICleaningBuilding, BaseBuilding } from "../../../interfaces/IBuilding";
import { Field } from "formik";
import FormikSimpleSelect from "../FormikSimpleSelect";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { IAddress, IPostAddress } from "../../../interfaces/IAddress";
import { InputAdornment, IconButton, Grid } from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy"

export interface IBuildingCopy {
  moveOutBuilding: IPostMoveOutBuilding | IMoveOutBuilding | null
  moveInBuilding: IPostMoveInBuilding | IMoveInBuilding | null
  cleaningBuilding: IPostCleaningBuilding | ICleaningBuilding | null
  disposalBuilding: IPostDisposalOutBuilding | IDisposalOutBuilding | null
  storageBuilding: IPostStorageBuilding | IStorageBuilding | null
}

interface Props extends InjectedIntlProps{
  buildings: IBuildingCopy
}

const BuildingCopy: React.ComponentType<Props> = ({buildings, intl}) => {

  const createLabelString = ({moveOutBuilding, moveInBuilding, cleaningBuilding, disposalBuilding, storageBuilding}: IBuildingCopy) => {

    const createString = (buildingTypeName: string, base: {Address: IPostAddress} | null) => {
      if(base) {
        const translatedBuildingTypeName = intl.formatMessage({id: buildingTypeName})
        return `${translatedBuildingTypeName}: ${base.Address.Street}, ${base.Address.City}`
      }
      return null
    }

    const options = [
      {label: createString("MOVE_OUT_BUILDING", moveOutBuilding), value: 1},
      {label: createString("MOVE_IN_BUILDING", moveInBuilding), value: 2},
      {label: createString("STORAGE_BUILDING", disposalBuilding), value: 3},
      {label: createString("CLEANING_BUILDING", storageBuilding), value: 4},
      {label: createString("DISPOSAL_BUILDING", cleaningBuilding), value: 5},
    ]

    return options.filter(string => !!string.label)
  }

  handleCopy = () => {
    IPostMoveOutBuilding
    IPostMoveInBuilding
    IPostCleaningBuilding
    IPostDisposalOutBuilding
    IPostStorageBuilding


  }


  // buidlings.type.BuildingTypes.map(e => ({ label: e.NameTextKey, value: e.BuildingTypeId }))

  return (
    <Grid item xs={12} md={6} style={{display: "flex"}}>
      <Field
        disableGrid
        label="COPY_FROM"
        name="copyFromSelect"
        component={FormikSimpleSelect}
        // options={[{label}]}
        notTranslated
        options={createLabelString(buildings)}
      />
      <IconButton onClick={handleCopy}>
        <FileCopyIcon />
      </IconButton>
    </Grid>
  )
}

export default injectIntl(BuildingCopy)
