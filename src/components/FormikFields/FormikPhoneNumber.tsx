import * as React from "react"
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from "@material-ui/core/TextField"
import { FieldProps, getIn } from "formik"
import { injectIntl, WrappedComponentProps } from "react-intl"
import Grid, { GridSize } from "@material-ui/core/Grid"
import { InputAdornment } from "@material-ui/core"
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints"
import MuiPhoneNumber from "material-ui-phone-number"

export interface FormikTextFieldProps extends WrappedComponentProps, FieldProps, Omit<MuiTextFieldProps, "error" | "name" | "onChange" | "value"> {
  label: string
  disableGrid?: boolean
  overrideGrid?: Partial<Record<Breakpoint, boolean | GridSize>>
}

class FormikPhoneNumber extends React.Component<FormikTextFieldProps> {

  handleChange = (value: Date | null) => {
    const { field: { name }, form: { setFieldValue } } = this.props

    setFieldValue(name, value)
  }

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

    console.log(field.value)
    const TextFieldElement = (
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      //@ts-ignore
      <MuiPhoneNumber
        error={showError}
        fullWidth
        {...props}
        helperText={showError ? fieldError : helperText}
        disabled={disabled != undefined ? disabled : isSubmitting}
        label={intl.formatMessage({ id: label })}
        {...props}
        {...field}
        value={field.value === undefined || field.value === null ? "" : field.value}

        defaultCountry={"ch"}
        onChange={this.handleChange}
      >
        {children}

      </MuiPhoneNumber>
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

export default injectIntl(FormikPhoneNumber)


