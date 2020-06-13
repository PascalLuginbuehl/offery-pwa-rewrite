import React from "react"

import MuiSwitch, { SwitchProps as MuiSwitchProps } from "@material-ui/core/Switch"
import FormControlLabel from "@material-ui/core/FormControlLabel"

import { useFormikContext } from "formik"
import useFormikField, { FormikFieldConfig } from "./FormikFieldConfig"

export interface FormikSwitchProps<FormValues> extends FormikFieldConfig<FormValues>, Omit<MuiSwitchProps, "form" | "name" | "value" | "defaultChecked" | "onChange"> {
    label: React.ReactNode
}

export default function FormikSwitch<FormValues>(props: FormikSwitchProps<FormValues>) {
    const {
        label,
        disabled,

        /* eslint-disable @typescript-eslint/no-unused-vars */
        // removed from otherProps, taken from useFormikField
        validate,
        enableAutoSubmit,
        onChange,
        /* eslint-enable @typescript-eslint/no-unused-vars */

        ...otherProps
    } = props

    const [field] = useFormikField<boolean, FormValues>(otherProps)
    const { isSubmitting } = useFormikContext()

    return (
        <FormControlLabel
            control={
                <MuiSwitch
                    checked={field.value}
                    disabled={disabled != undefined ? disabled : isSubmitting}

                    {...field}
                    {...otherProps}
                />
            }
            label={label}
        />
    )
}
