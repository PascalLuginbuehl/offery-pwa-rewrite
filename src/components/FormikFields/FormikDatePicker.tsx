import * as React from "react"
import MuiTextField, {
  TextFieldProps as MuiTextFieldProps,
} from "@material-ui/core/TextField"
import { FieldProps, getIn } from "formik"
import { injectIntl, WrappedComponentProps } from "react-intl"
import Grid, { GridSize } from "@material-ui/core/Grid"
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints"
import { DatePicker as DatePickerOriginal, DatePickerProps as MuiDatePickerProps } from "@material-ui/pickers"
import CloseIcon from "@material-ui/icons/Close"
import { InputAdornment, IconButton } from "@material-ui/core"

export interface FormikDatePickerProps extends WrappedComponentProps, FieldProps, Omit<MuiDatePickerProps, "form" | "error" | "name" | "onChange" | "value" | "defaultChecked"> {
  label: string
  disableGrid?: boolean
  overrideGrid?: Partial<Record<Breakpoint, boolean | GridSize>>
}


class FormikDatePicker extends React.Component<FormikDatePickerProps> {
  handleChange = (value: Date | null) => {
    const {field: {name}, form: {setFieldValue}} = this.props

    setFieldValue(name, value)
  }

  render() {
    const { children, intl, field,
      form,
      variant = "standard",
      disabled,
      helperText,

      label,
      disableGrid = false,
      overrideGrid = {},
      required = false,
      ...props
    } = this.props


    const { name, value } = field
    const { touched, errors, isSubmitting } = form

    const fieldError = getIn(errors, name)
    const showError = getIn(touched, name) && !!fieldError

    const DatePickerElement = (<DatePickerOriginal

      okLabel={intl.formatMessage({ id: "OK" })}
      cancelLabel={intl.formatMessage({ id: "CANCEL" })}

      views={["year", "month", "date"]}
      format={"dd.MM.yyyy"}

      fullWidth
      required={required}
      helperText={showError ? fieldError : helperText}
      disabled={disabled != undefined ? disabled : isSubmitting}
      error={showError}
      label={intl.formatMessage({ id: label })}

      InputProps = { value && !required ? {
        required,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => { this.handleChange(null) }}
            >
              <CloseIcon />
            </IconButton>
          </InputAdornment>
        ),
      } : { required }}

      {...props}
      {...field}
      // This comes l8ter to override onChange from Field
      onChange={this.handleChange}
    />)


    if (disableGrid) {
      return DatePickerElement
    } else {
      const defaultGrid: FormikDatePickerProps["overrideGrid"] = { xs: 6, md: 3 }
      // SetDefaultValues
      const newGrid = { ...defaultGrid, ...overrideGrid }
      return (
        <Grid item xs={newGrid.xs} md={newGrid.md}>
          {DatePickerElement}
        </Grid>
      )

    }


  }
}


export default injectIntl(FormikDatePicker)
