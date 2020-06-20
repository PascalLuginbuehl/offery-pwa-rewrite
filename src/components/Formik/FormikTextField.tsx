import React from "react"


import MuiTextField, { TextFieldProps as MuiTextFieldProps } from "@material-ui/core/TextField"

import { useFormikContext } from "formik"
import useFormikField, { FormikFieldConfig } from "./FormikFieldConfig"

type FormikTextFieldProps<FormValues> =  FormikFieldConfig<FormValues> & Omit<MuiTextFieldProps, "error" | "onChange" | "name" | "value" | "variant">

export default function FormikTextField<FormValues>(props: FormikTextFieldProps<FormValues>) {
  const {
    disabled,
    helperText,

    /* eslint-disable @typescript-eslint/no-unused-vars */
    // removed from otherProps, taken from useFormikField
    validate,
    enableAutoSubmit,
    onChange,
    /* eslint-enable @typescript-eslint/no-unused-vars */

    children,

    // Same as Autocomplete renderInput(), mostly used with fullWidth
    fullWidth = true,

    ...otherProps
  } = props



  const [ field, meta] = useFormikField<string, FormValues>(props)
  const { isSubmitting } = useFormikContext()

  const fieldError = meta.error
  const showError = meta.touched && !!fieldError

  return <MuiTextField
    disabled={disabled != undefined ? disabled : isSubmitting}
    error={showError}
    helperText={showError ? fieldError : helperText}
    fullWidth={fullWidth}

    {...otherProps}
    {...field}
  >
    {children}
  </MuiTextField>
}
