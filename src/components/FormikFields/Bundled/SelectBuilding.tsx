import * as React from "react"

import { FieldProps, getIn } from "formik"
import { injectIntl, WrappedComponentProps, FormattedMessage } from "react-intl"
import Grid, { GridSize } from "@material-ui/core/Grid"
import {  MenuItem, ListItemText, FormControl, Select, InputLabel } from "@material-ui/core"
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints"
import  { FormikTextFieldProps } from "../FormikTextField"
import { SelectProps } from "@material-ui/core/Select"
// import { IAddress } from "../../../interfaces/IAddress"
import { IBuilding } from "../../../interfaces/IBuilding"

export interface FormikSelectProps extends FieldProps, SelectProps {
  buildings: IBuilding[]
  label: string
  disableGrid?: boolean
  overrideGrid?: Partial<Record<Breakpoint, boolean | GridSize>>
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
      required,
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
          renderValue={(value: unknown) => {
            if (value && typeof value === "number") {
              const foundBuilding = buildings.find(building => building.BuildingId === value)

              if (foundBuilding) {
                // return intl.formatMessage({ id: foundBuilding.label })
                return foundBuilding.Address.Street + ", " + foundBuilding.Address.PLZ + " " + foundBuilding.Address.City
              }
            }

            return ""
          }}
          error={showError}
          fullWidth
          required={required}
          {...props}
          disabled={disabled != undefined ? disabled : isSubmitting}
          {...props}
          {...field}
          value={field.value === undefined || field.value === null ? "" : field.value}
        >
          { !required ?
            // @ts-ignore
            <MenuItem value={null} disabled={required}>
              <em><FormattedMessage id={"SELECT_DOT_DOT_DOT"} /></em>
            </MenuItem>
            : null }
          {buildings.map((building, index) => (
            <MenuItem value={building.BuildingId} dense key={index}>
              <ListItemText
                primary={building.Address.Street + ", " + building.Address.PLZ + " " + building.Address.City}
                // secondary={intl.formatMessage({ id: building.label })}
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
