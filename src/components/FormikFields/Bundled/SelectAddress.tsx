import * as React from "react"
import { Field } from "formik"
import FormikSimpleSelect from "../FormikSimpleSelect"
import { injectIntl, InjectedIntlProps } from "react-intl"
import { IAddress, IPostAddress } from "../../../interfaces/IAddress"
import { InputAdornment, IconButton, Grid } from "@material-ui/core"
import FileCopyIcon from "@material-ui/icons/FileCopy"
import { IBuildingCopy } from "./BuildingCopy"
import { FormikTextFieldProps } from "../FormikTextField"

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
      { label: "MOVE_OUT_BUILDING", container: moveOutBuilding },
      { label: "MOVE_IN_BUILDING", container: moveInBuilding },
      { label: "STORAGE_BUILDING", container: disposalBuilding },
      { label: "CLEANING_BUILDING", container: storageBuilding },
      { label: "DISPOSAL_BUILDING", container: cleaningBuilding },
    ]
      .filter(value => {
        return value.container !== null && value.container !== undefined
      })
      .filter(value => {
        // @ts-ignore
        return value.container.Address.hasOwnProperty("AddressId")
      })
      // @ts-ignore
      .map((e): IAddressObj => ({ label: e.label, container: e.container.Address }))

    return options.map(e => ({ label: createString(e), value: e.container.AddressId }))
  }

  return <Field {...props} component={FormikSimpleSelect} notTranslated options={createLabelString(buildings)} />
}

export default injectIntl(SelectAddress)
