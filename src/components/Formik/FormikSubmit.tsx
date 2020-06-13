import React from "react"

import { Button, ButtonProps } from "@material-ui/core"

import { useFormikContext } from "formik"

export interface FormikSubmitProps extends Omit<ButtonProps, "type" | "disabled"> {
    label: React.ReactNode
}

export default function FormikSubmit(props: FormikSubmitProps) {
    const {
        label,
        color = "primary",
        variant = "contained",

        ...buttonProps
    } = props

    const { isSubmitting } = useFormikContext()

    return (
        <Button
            variant={variant}
            color={color}
            type="submit"
            disabled={isSubmitting}
            {...buttonProps}
        >
            {label}
        </Button>
    )
}
