import * as React from "react"
import { Field } from "formik"
import FormikSimpleSelect from "../FormikSimpleSelect"
import { injectIntl, InjectedIntlProps } from "react-intl"
import { IAddress, IPostAddress } from "../../../interfaces/IAddress"
import { InputAdornment, IconButton, Grid } from "@material-ui/core"
import FileCopyIcon from "@material-ui/icons/FileCopy"
import { IBuildingCopy } from "./BuildingCopy";
import { FormikTextFieldProps } from "../FormikTextField";
import { BaseBuilding } from "../../../interfaces/IBuilding";

interface Props extends InjectedIntlProps {
  buildings: IBuildingCopy
  name: string
  label: string
}

const SelectAddress: React.ComponentType<Props> = ({ buildings, intl, ...props }) => {
  const createLabelString = ({ moveOutBuilding, moveInBuilding, cleaningBuilding, disposalBuilding, storageBuilding }: IBuildingCopy) => {
    const createString = (address: AdressObj) => {
      const translatedBuildingTypeName = intl.formatMessage({ id: address.label })
      return `${translatedBuildingTypeName}: ${address.container.Street}, ${address.container.PLZ} ${address.container.City}`
    }

    interface AdressObj {
      label: string
      container: IAddress
    }

    const options: AdressObj[] = [
      { label: "MOVE_OUT_BUILDING", container: moveOutBuilding as BaseBuilding },
      { label: "MOVE_IN_BUILDING", container: moveInBuilding as BaseBuilding },
      { label: "STORAGE_BUILDING", container: disposalBuilding as BaseBuilding },
      { label: "CLEANING_BUILDING", container: storageBuilding as BaseBuilding },
      { label: "DISPOSAL_BUILDING", container: cleaningBuilding as {Address: IAddress} },
    ]
      .filter((value) => {
        return value.container !== null && value.container !== undefined
      })
      .map(value => ({ label: value.label, container: value.container.Address }))
      // @ts-ignore
      .filter((value: {label: string, container: IAddress}) => {
        return value.container.hasOwnProperty("AddressId")
      })

    return options.map(e => ({ label: createString(e), value: e.container.AddressId }))
  }

  return <Field {...props} component={FormikSimpleSelect} notTranslated options={createLabelString(buildings)} />
}

export default injectIntl(SelectAddress)
