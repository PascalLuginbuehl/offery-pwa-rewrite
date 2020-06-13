import React from "react"

import { makeStyles } from "@material-ui/core"
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from "@material-ui/core/TextField"

import { useFormikContext } from "formik"
import useFormikField, { FormikFieldConfig } from "./FormikFieldConfig"

const useStyles = makeStyles({
    formControl: {
        marginTop: 0,
        paddingTop: 21,
        paddingBottom: 1,
        //paddingLeft: 15,
        //paddingRight: 15,

        borderTopColor: "#879baa",
    },
})

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

    const classes = useStyles()


    const [ field, meta] = useFormikField<string, FormValues>(props)
    const { isSubmitting } = useFormikContext()

    const fieldError = meta.error
    const showError = meta.touched && !!fieldError

    return <MuiTextField
        InputProps={{ classes }}

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
