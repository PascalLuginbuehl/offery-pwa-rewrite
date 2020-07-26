import * as React from "react"
import { FormattedMessage } from "react-intl"
import { MenuItem, ListItemText, Typography } from "@material-ui/core"
import FormikTextField, { FormikTextFieldProps } from "./FormikTextField"
import { useField } from "formik"

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
            <div>
              <Typography variant="body1" noWrap>
                {option.label}
              </Typography>
              {
                option.secondaryLabel ? (
                  <Typography component="p" variant="caption" noWrap>
                    {option.secondaryLabel}
                  </Typography>
                ) : null
              }
            </div>
          </MenuItem>
        ))
      }
    </FormikTextField>
  )
}
