import * as React from "react"
import { FormattedMessage } from "react-intl"
import { MenuItem } from "@material-ui/core"
import FormikTextField, { FormikTextFieldProps } from "./FormikTextField"

export interface FormikSelectProps extends FormikTextFieldProps {
  options: Array<{
    value: string
    label: string
  }>
  notTranslated?: boolean
}

class FormikSimpleSelect extends React.Component<FormikSelectProps> {
  render() {
    const { intl, options, notTranslated = false, required, ...props } = this.props

    return (
      <FormikTextField
        select
        required={required}
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        ref={props.ref}
        {...props}
      >
        {/*
          // @ts-ignore */}
        <MenuItem value={null} disabled={required}>
          <em><FormattedMessage id={"SELECT_DOT_DOT_DOT"} /></em>
        </MenuItem>
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
