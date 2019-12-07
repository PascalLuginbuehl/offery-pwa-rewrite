// import * as React from "react"
// import { Field } from "formik"
// import FormikSimpleSelect from "../FormikSimpleSelect"
// import { injectIntl, InjectedIntlProps } from "react-intl"
// import { IAddress, IPostAddress } from "../../../interfaces/IAddress"
// import { InputAdornment, IconButton, Grid } from "@material-ui/core"
// import FileCopyIcon from "@material-ui/icons/FileCopy"
// import { IBuildingCopy } from "./BuildingCopy";
// import { BaseBuilding } from "../../../interfaces/IBuilding";

// interface Props extends InjectedIntlProps {
//   buildings: IBuildingCopy
//   name: string
//   label: string
// }

// const SelectAddress: React.ComponentType<Props> = ({ buildings, intl, ...props }) => {
//   const createLabelString = ({ moveOutBuilding, moveInBuilding, cleaningBuilding, disposalBuilding, storageBuilding }: IBuildingCopy) => {
//     const createString = (address: AdressObj) => {
//       const translatedBuildingTypeName = intl.formatMessage({ id: address.label })
//       return `${translatedBuildingTypeName}: ${address.container.Street}, ${address.container.PLZ} ${address.container.City}`
//     }

//     interface AdressObj {
//       label: string
//       container: IAddress
//     }

//     const options: AdressObj[] = [
//       { label: "MOVE_OUT_BUILDING", container: moveOutBuilding as BaseBuilding },
//       { label: "MOVE_IN_BUILDING", container: moveInBuilding as BaseBuilding },
//       { label: "STORAGE_BUILDING", container: disposalBuilding as BaseBuilding },
//       { label: "CLEANING_BUILDING", container: storageBuilding as BaseBuilding },
//       { label: "DISPOSAL_BUILDING", container: cleaningBuilding as {Address: IAddress} },
//     ]
//       .filter((value) => {
//         return value.container !== null && value.container !== undefined
//       })
//       .map(value => ({ label: value.label, container: value.container.Address }))
//       // @ts-ignore
//       .filter((value: {label: string, container: IAddress}) => {
//         return value.container.hasOwnProperty("AddressId")
//       })

//     return options.map(e => ({ label: createString(e), value: e.container.AddressId }))
//   }

//   return <Field {...props} component={FormikSimpleSelect} notTranslated options={createLabelString(buildings)} />


// }

// export default injectIntl(SelectAddress)

import * as React from "react"
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from "@material-ui/core/TextField"
import { FieldProps, getIn } from "formik"
import { injectIntl, InjectedIntlProps, InjectedIntl, FormattedDate, FormattedMessage } from "react-intl"
import Grid, { GridSize } from "@material-ui/core/Grid"
import { InputAdornment, MenuItem, ListItemText, FormControl, Select, InputLabel } from "@material-ui/core"
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints"
import FormikTextField, { FormikTextFieldProps } from "./../FormikTextField"
import { IBuildingCopy } from "./BuildingCopy";
import { SelectProps } from "@material-ui/core/Select";

export interface FormikSelectProps extends FieldProps, SelectProps {
  buildings: IBuildingCopy
  label: string
  disableGrid?: boolean
  overrideGrid?: Partial<Record<Breakpoint, boolean | GridSize>>
}

class FormikSimpleSelect extends React.Component<FormikSelectProps & InjectedIntlProps> {
  render() {

    const defaultGrid: FormikTextFieldProps['overrideGrid'] = { xs: 12, md: 6 }
    const {
      children,
      intl,
      field,
      form,
      disabled,
      // helperText,

      label,
      disableGrid = false,
      overrideGrid = defaultGrid,
      buildings,
      ...props
    } = this.props

    const { name } = field
    const { touched, errors, isSubmitting } = form

    const fieldError = getIn(errors, name)
    const showError = getIn(touched, name) && !!fieldError

    const selectFieldElement = (
      <FormControl>
        <InputLabel>{intl.formatMessage({ id: label })}</InputLabel>
        <Select
          displayEmpty
          // value={personName}
          // onChange={handleChange}
          renderValue={(value: string) => {

            return ""
          }
          }
          error={showError}
          fullWidth
          {...props}
          // helperText={showError ? fieldError : helperText}
          disabled={disabled != undefined ? disabled : isSubmitting}
          {...props}
          {...field}
          value={field.value === undefined || field.value === null ? "" : field.value}
        >
          {buildings.moveOutBuilding ?
            <MenuItem value={buildings.moveOutBuilding.Address.AddressId} dense>
              <ListItemText primary="Test" secondary={intl.formatMessage({ id: "MOVE_OUT_BUILDING" })} />
            </MenuItem>
            :
            null
          }

          {buildings.moveInBuilding ?
            <MenuItem value={buildings.moveInBuilding.Address.AddressId} dense>
              <ListItemText primary="Test" secondary={intl.formatMessage({ id: "MOVE_IN_BUILDING" })} />
            </MenuItem>
            :
            null
          }
        </Select>
      </FormControl>
    )

    if (disableGrid) {
      return selectFieldElement
    } else {
      // SetDefaultValues
      return (
        <Grid item {...overrideGrid}>
          {selectFieldElement}
        </Grid>
      )
    }
  }
}

export default injectIntl(FormikSimpleSelect)
