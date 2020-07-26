import * as React from "react"
import { FormattedMessage } from "react-intl"
import { MenuItem, ListItemText } from "@material-ui/core"
import FormikTextField, { FormikTextFieldProps } from "./FormikTextField"

export interface FormikSelectSimpleOptions {
  value: string | number
  label: string
  secondaryLabel?: string
}

export interface FormikSelectSimpleProps<FormValues> extends FormikTextFieldProps<FormValues> {
  options: FormikSelectSimpleOptions[]
}

export default function FormikSelectSimple<FormValues>(props: FormikSelectSimpleProps<FormValues>) {
  const { options, required, ...remainingProps } = props

  return (
    <FormikTextField<FormValues>
      select
      required={required}
      {...remainingProps}
    >
      {/*
      //@ts-ignore */}
      <MenuItem value={null} disabled={required}>
        <em><FormattedMessage id={"SELECT_DOT_DOT_DOT"} /></em>
      </MenuItem>

      {
        options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            <ListItemText
              primary={option.label}
              secondary={option.secondaryLabel}
            />
          </MenuItem>
        ))
      }
    </FormikTextField>
  )
}
