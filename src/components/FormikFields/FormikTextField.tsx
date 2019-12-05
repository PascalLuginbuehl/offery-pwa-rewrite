import * as React from "react"
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from "@material-ui/core/TextField"
import { FieldProps, getIn } from "formik"
import { injectIntl, InjectedIntlProps, InjectedIntl } from "react-intl"
import Grid, { GridSize } from "@material-ui/core/Grid"
import { InputAdornment } from "@material-ui/core"
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints"

export interface FormikTextFieldProps extends InjectedIntlProps, FieldProps, Omit<MuiTextFieldProps, "error" | "name" | "onChange" | "value"> {
  label: string
  disableGrid?: boolean
  overrideGrid?: Partial<Record<Breakpoint, boolean | GridSize>>
}

class FormikTextField extends React.Component<FormikTextFieldProps> {
  // componentWillMount() {
  //   if(this.props.field.value === null) {
  //     this.props.form.setFieldValue(this.props.field.name, "")
  //   }
  // }

  render() {
    const defaultGrid: FormikTextFieldProps['overrideGrid'] = { xs: 12, md: 6 }
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
