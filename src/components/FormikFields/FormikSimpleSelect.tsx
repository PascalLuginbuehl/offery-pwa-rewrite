import * as React from "react"
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from "@material-ui/core/TextField"
import { FieldProps, getIn } from "formik"
import { injectIntl, InjectedIntlProps, InjectedIntl, FormattedDate, FormattedMessage } from "react-intl"
import Grid, { GridSize } from "@material-ui/core/Grid"
import { InputAdornment, MenuItem } from "@material-ui/core"
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints"
import FormikTextField, { FormikTextFieldProps } from "./FormikTextField"
import TextField from "../TextField";

export interface FormikSelectProps extends FormikTextFieldProps {
  options: Array<{
    value: string
    label: string
  }>
  notTranslated?: boolean
}

class FormikSimpleSelect extends React.Component<FormikSelectProps> {
  render() {
    const { intl, options, notTranslated = false, ...props } = this.props

    return (
      <FormikTextField
        select
        // @ts-ignore
        ref={props.ref}
        {...props}
      >
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {notTranslated ? option.label : <FormattedMessage id={option.label} />}
          </MenuItem>
        ))}
      </FormikTextField>
    )
  }
}

export default FormikSimpleSelect
