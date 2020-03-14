import * as React from "react"

import { FieldProps, getIn } from "formik"
import { injectIntl, WrappedComponentProps } from "react-intl"
import Grid, { GridSize } from "@material-ui/core/Grid"
import {  MenuItem, ListItemText, FormControl, Select, InputLabel } from "@material-ui/core"
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints"
import  { FormikTextFieldProps } from "../FormikTextField"
import { SelectProps } from "@material-ui/core/Select"
import { IAddress } from "../../../interfaces/IAddress"
import { IBuilding } from "../../../interfaces/IBuilding"

export interface FormikSelectProps extends FieldProps, SelectProps {
  buildings: IBuilding[]
  label: string
  disableGrid?: boolean
  overrideGrid?: Partial<Record<Breakpoint, boolean | GridSize>>
}

interface AdressObj {
  label: string
  container: IAddress
}

class FormikSimpleSelect extends React.Component<FormikSelectProps & WrappedComponentProps> {
  render() {
    const defaultGrid: FormikTextFieldProps["overrideGrid"] = { xs: 12, md: 6 }
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

    // const { moveOutBuilding, moveInBuilding, cleaningBuilding, disposalBuilding, storageBuilding } = this.props.buildings

    const options: AdressObj[] = [
      // { label: "MOVE_OUT_BUILDING", container: {Address} },
      // { label: "MOVE_IN_BUILDING", container: moveInBuilding as BaseBuilding },
      // { label: "STORAGE_BUILDING", container: storageBuilding as BaseBuilding },
      // { label: "DISPOSAL_BUILDING", container: disposalBuilding as BaseBuilding },
      // { label: "CLEANING_BUILDING", container: cleaningBuilding as {Address: IAddress} },
    ]
    // .filter((value) => {
    //   return value.container !== null && value.container !== undefined
    // })
    // .map(value => ({ label: value.label, container: value.container.Address }))
    // // @ts-ignore
    // .filter((value: {label: string, container: IAddress}) => {
    //   return value.container.hasOwnProperty("AddressId")
    // })



    const { name } = field
    const { touched, errors, isSubmitting } = form

    const fieldError = getIn(errors, name)
    const showError = getIn(touched, name) && !!fieldError

    const selectFieldElement = (
      <FormControl>
        <InputLabel>{intl.formatMessage({ id: label })}</InputLabel>
        <Select
          displayEmpty
          renderValue={(value: unknown) => {
            if (value && typeof value === "number") {
              const foundBuilding = options.find(building => building.container.AddressId === value)

              if (foundBuilding) {
                return intl.formatMessage({ id: foundBuilding.label })
                // return foundBuilding.container.Street + ", " + foundBuilding.container.PLZ + " " + foundBuilding.container.City
              }
            }

            return ""
          }}
          error={showError}
          fullWidth
          {...props}
          disabled={disabled != undefined ? disabled : isSubmitting}
          {...props}
          {...field}
          value={field.value === undefined || field.value === null ? "" : field.value}
        >
          {options.map((building, index) => (
            <MenuItem value={building.container.AddressId} dense key={index}>
              <ListItemText
                primary={building.container.Street + ", " + building.container.PLZ + " " + building.container.City}
                secondary={intl.formatMessage({ id: building.label })}
              />
            </MenuItem>
          ))}
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