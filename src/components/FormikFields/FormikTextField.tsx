import * as React from "react"
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from "@material-ui/core/TextField"
import { FieldProps, getIn } from "formik"
import { injectIntl, WrappedComponentProps } from "react-intl"
import Grid, { GridSize } from "@material-ui/core/Grid"

import { Breakpoint } from "@material-ui/core/styles/createBreakpoints"

export interface FormikTextFieldProps extends WrappedComponentProps, FieldProps, Omit<MuiTextFieldProps, "error" | "name" | "onChange" | "value"> {
  label: string
  disableGrid?: boolean
  overrideGrid?: Partial<Record<Breakpoint, boolean | GridSize>>
}

function trimStringOrUnknown(stringToTrim: string | unknown) {
  if (typeof stringToTrim !== "string") {
    return stringToTrim
  }

  return stringToTrim.trim()
}

class FormikTextField extends React.Component<FormikTextFieldProps> {
  render() {
    const defaultGrid: FormikTextFieldProps["overrideGrid"] = { xs: 12, md: 6 }
    const {
      children,
      intl,
      field,
      form,
      variant = "standard",
      disabled,
      helperText,

      label,
      disableGrid = false,
      overrideGrid = defaultGrid,
      ...props
    } = this.props

    const { name } = field
    const { touched, errors, isSubmitting } = form

    const fieldError = getIn(errors, name)
    const showError = getIn(touched, name) && !!fieldError

    function trimOnBlur(e: React.FocusEvent<any>) {
      form.setFieldValue(field.name, trimStringOrUnknown(field.value))
      field.onBlur(e)
    }

    const TextFieldElement = (
      <MuiTextField
        error={showError}
        fullWidth
        {...props}
        helperText={showError ? fieldError : helperText}
        disabled={disabled != undefined ? disabled : isSubmitting}
        label={intl.formatMessage({ id: label })}
        {...props}
        {...field}
        value={field.value === undefined || field.value === null ? "" : field.value }
        onBlur={trimOnBlur}
      >
        {children}
      </MuiTextField>
    )

    if (disableGrid) {
      return TextFieldElement
    } else {
      // SetDefaultValues
      return (
        <Grid item {...overrideGrid}>
          {TextFieldElement}
        </Grid>
      )
    }
  }
}

export default injectIntl(FormikTextField)
