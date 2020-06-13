import React from "react"

import { Typography } from "@material-ui/core"

import { useFormikContext } from "formik"

interface Props {
    label: string
}

export default function FormikErrorStatus(props: Props) {
    const {
        label,
    } = props

    const { status } = useFormikContext()

    if (!status) {
        return null
    }

    const statusText = status instanceof Error
        ? status.message
        : status

    return <Typography color="error">{label}: {statusText}</Typography>
}
